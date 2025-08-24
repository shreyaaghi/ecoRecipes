import Anthropic from "@anthropic-ai/sdk";
import { createIngredient, getIngredientByName } from "./ingredients";
import { createPair } from "./recipeIngredients";

const sendAiRequest = async (message: string) => {
    if (message.length == 0) {
        return {
            status: 400,
            error: "No message"
        }
    }
    const anthropic = new Anthropic();
    const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        temperature: 0.5,
        system: "speak in rhymes",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: message
                    }
                ]
            },
        ],
    });
    return {
        status: 200,
        data: msg
    }
};

interface SustainabilityAnalysis {
    sustainabilityScore: number;
    sustainableAspects: string[];
    improvementSuggestions: string[];
    reasoning: string;
}

const analyzeSustainability = async (recipeData: {
    title: string;
    description: string;
    ingredients: string[];
    steps: string;
    category: string;
}): Promise<{ status: number; data?: SustainabilityAnalysis; error?: string }> => {
    try {
        const anthropic = new Anthropic();

        const systemPrompt = `You are a sustainability expert analyzing recipes for their environmental impact. Analyze the provided recipe and return ONLY a valid JSON object with the following structure:
        {
            "sustainabilityScore": number (1-100),
            "sustainableAspects": ["aspect1", "aspect2", ...],
            "improvementSuggestions": ["suggestion1", "suggestion2", ...],
            "reasoning": "brief explanation of the score"
        }

        Consider these factors in your analysis:
            - Ingredient sourcing (local/seasonal vs imported/out-of-season)
            - Environmental impact (plant-based vs animal products, carbon footprint)
            - Food miles (distance ingredients typically travel)
            - Seasonality (are ingredients currently in season?)
            - Processing level (whole foods vs highly processed)
            - Waste reduction potential (uses scraps, leftovers, etc.)
            - Cooking energy efficiency
            - Packaging considerations
            - Water usage in production

        Provide 3-5 sustainable aspects and 2-4 improvement suggestions. Keep each point concise but informative.`;

        const userMessage = `Recipe Title: ${recipeData.title}
        Description: ${recipeData.description}
        Category: ${recipeData.category}
        Ingredients: ${recipeData.ingredients.join(', ')}
        Cooking Steps: ${recipeData.steps}

        Please analyze this recipe for sustainability and return the JSON response.`;

        const msg = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            temperature: 0.3,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: userMessage
                        }
                    ]
                },
            ],
        });

        let responseText = '';
        if (msg.content && msg.content.length > 0) {
            const textBlock = msg.content.find(block => block.type === 'text');
            if (textBlock && 'text' in textBlock) {
                responseText = textBlock.text;
            }
        }

        if (!responseText) {
            return {
                status: 400,
                error: 'No text response from Claude'
            }
        }

        // parse
        let analysisData: SustainabilityAnalysis;
        try {
            // clean extra text
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;

            if (jsonStart === -1 || jsonEnd === 0) {
                return {
                    status: 400,
                    error: 'No json found in response'
                }
            }

            const jsonString = responseText.slice(jsonStart, jsonEnd);
            analysisData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse Claude response as JSON:', responseText);
            return {
                status: 400,
                error: 'invalid json response from AI'
            }
        }

        // validate res structure
        if (
            typeof analysisData.sustainabilityScore !== 'number' ||
            !Array.isArray(analysisData.sustainableAspects) ||
            !Array.isArray(analysisData.improvementSuggestions) ||
            typeof analysisData.reasoning !== 'string'
        ) {
            return {
                status: 400,
                error: 'invalid AI response structure'
            }
        }

        // check score
        analysisData.sustainabilityScore = Math.max(1, Math.min(100, analysisData.sustainabilityScore));

        return {
            status: 200,
            data: analysisData
        };

    } catch (error) {
        console.error('Error in sustainability analysis:', error);
        return {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error in AI analysis'
        };
    }
};

const processRecipeIngredients = async (recipeId: number, ingredients: Array<{ name: string, amount: string, comments: string }>) => {
    const errors = [];
    const successfulPairs = [];

    for (const ingredient of ingredients) {
        try {
            let ingredientResult = await getIngredientByName(ingredient.name);
            let ingredientId;

            if (ingredientResult.status === 404) {
                // create new ingredient otherwise
                const createResult = await createIngredient(ingredient.name);
                if (createResult.status === 200) {
                    ingredientId = createResult.data[0].id;
                } else {
                    errors.push(`failed to create ingredient "${ingredient.name}": ${createResult.error}`);
                    continue;
                }
            } else if (ingredientResult.status === 200) {
                ingredientId = ingredientResult.data[0].id;
            } else {
                errors.push(`couldn't check ingredient "${ingredient.name}": ${ingredientResult.error}`);
                continue;
            }

            // create pair
            const pairResult = await createPair(recipeId, ingredientId, ingredient.amount, ingredient.comments);
            if (pairResult.status === 200) {
                successfulPairs.push(ingredient);
            } else {
                errors.push(`failed to link ingredient "${ingredient.name}" to recipe: ${pairResult.error}`);
            }

        } catch (error) {
            errors.push(`couldn't process ingredient "${ingredient.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    return { successfulPairs, errors };
};

const findRecipes = async (): Promise<any> => {
    try {
        const anthropic = new Anthropic();

        const systemPrompt = `You are a Sustainable Recipe Discovery Assistant that finds eco-friendly recipes from the internet and formats them to match a specific database structure. You do not make up anything - everything should be quoted from the source,including ingredients, description, steps, or anything of that matter. All the information you pull from the internet is REAL. Make note of the url where the recipe came from. Your goal is to locate recipes that prioritize sustainability and format them for seamless integration into an existing recipe management system. ### Core Responsibilities: 1. **Find Sustainable Recipes**: Search for recipes that demonstrate sustainability through:
            - Seasonal ingredients and local sourcing potential
            - Plant-based or reduced-meat content
            - Minimal food waste approaches
            - Environmentally conscious cooking methods
            - Organic or naturally-grown ingredients when possible

        while these are your core responsiblities, ensure some balance with the recipe actually being appetizing. like it should be something that someone would actually eat, not just vegetable stock or something.
        2. **Format for Database**: Structure the recipe data in this exact JSON format:
        json {
            "title": "Recipe title (string, concise and appealing)",
            "author": null,
            "description": "Brief description highlighting what makes this recipe special and sustainable (string, 150-300 chars)",
            "steps": "Complete cooking instructions as a single formatted string with numbered steps separated by newlines",
            "category": "breakfast|lunch|dinner|snack|dessert|appetizer",
            "sustainability_info": "",
            "ingredients": [
                {
                    "name": "organic quinoa",
                    "amount": "2 cups",
                    "comments": ""
                },
                {
                    "name": "seasonal zucchini", 
                    "amount": "1 large",
                    "comments": "diced"
                }
            ],
            "recipe_photo": null,
            "photo_type": "",
            "user_generated": false,
            "generateSustainabilityAI": true
        }
        
        IMPORTANT: Parse ingredients into objects with name, amount, and comments fields. Extract the ingredient name cleanly (remove amounts and preparation notes).`;

        const msg = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Find a sustainable recipe. Do NOT hallucinate or make things up, I want the recipe and its ingredients to be real."
                        }
                    ]
                },
            ],
        });

        let responseText = '';
        if (msg.content && msg.content.length > 0) {
            const textBlock = msg.content.find(block => block.type === 'text');
            if (textBlock && 'text' in textBlock) {
                responseText = textBlock.text;
            }
        }

        if (!responseText) {
            return {
                status: 400,
                error: 'No text response from Claude'
            }
        }

        try {
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;

            if (jsonStart === -1 || jsonEnd === 0) {
                return {
                    status: 400,
                    error: 'no json found in response'
                }
            }

            const jsonString = responseText.slice(jsonStart, jsonEnd);
            const recipeData = JSON.parse(jsonString);

            // check that all the fields are there
            if (!recipeData.title || !recipeData.description || !recipeData.steps ||
                !recipeData.category || !Array.isArray(recipeData.ingredients)) {
                return {
                    status: 400,
                    error: 'missing required recipe fields'
                }
            }

            for (const ingredient of recipeData.ingredients) {
                if (!ingredient.name || !ingredient.amount) {
                    return {
                        status: 400,
                        error: 'invalid ingredient structure - name and amount needed'
                    }
                }
            }

            const validCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Drinks'];
            if (!validCategories.includes(recipeData.category.toLowerCase())) {
                recipeData.category = 'Dinner'; // default
            }

            const formattedData = {
                title: recipeData.title,
                author: 'a6cfb7c3-5651-41db-a988-e26b83216811',
                description: recipeData.description,
                steps: recipeData.steps,
                category: recipeData.category.toLowerCase(),
                sustainability_info: recipeData.sustainability_info || '',
                recipe_photo: "",
                photo_type: '',
                user_generated: false,
                generateSustainabilityAI: true,
                ingredients: recipeData.ingredients
            };

            return {
                status: 200,
                data: formattedData
            };

        } catch (parseError) {
            return {
                status: 400,
                error: 'invalid JSON response from AI'
            };
        }

    } catch (error) {
        return {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error in AI analysis'
        };
    }
};

const findRecipesWithIngredients = async (ingredients: string): Promise<any> => {
    // ingredients: 
    if (ingredients.length == 0) {
        return {
            status: 400,
            error: "No ingredients inputted"
        }
    }

    try {
        const anthropic = new Anthropic();

        const systemPrompt = `You are a Sustainable Recipe Discovery Assistant that finds eco-friendly recipes from the internet and formats them to match a specific database structure. You do not make up anything – everything should be quoted from the source, including ingredients, description, steps, or anything of that matter. All the information you pull from the internet is REAL. Make note of the url where the recipe came from. Your goal is to locate recipes that prioritize sustainability and format them for seamless integration into an existing recipe management system. 

    ### Core Responsibilities:

    1. **Find Sustainable Recipes**: Search for recipes that demonstrate sustainability through:
        - Seasonal ingredients and local sourcing potential
        - Plant-based or reduced-meat content
        - Minimal food waste approaches
        - Environmentally conscious cooking methods
        - Organic or naturally-grown ingredients when possible

    While these are your core responsibilities, ensure some balance with the recipe actually being appetizing. It should be something someone would genuinely want to eat—not just vegetable stock or basic scraps.

    2. **Ingredient Matching Requirement**: The user will input a list of ingredients or leftovers they have on hand. Your task is to find a sustainable recipe that incorporates **at least 80% of the valid, edible, and reasonable ingredients** from that list. This means:
        - Discard inputs that are not objectively ingredients (e.g., plastic, packaging) or are hard-to-use food scraps (e.g., banana peels, eggshells) **unless** they are the only ingredients provided.
        - If a user provides clearly unsafe, rotten, or incompatible combinations (e.g., raw meat + orange peels + expired juice), **prioritize realistic combinations** that make sense together from within the list and ignore the rest.
        - Do not force a match if the provided ingredients would lead to a recipe that is unappetizing, unsafe, or unsustainable.

        3. **Format for Database**: Structure the recipe data in this exact JSON format:
            json {
                "title": "Recipe title (string, concise and appealing)",
                "author": null,
                "description": "Brief description highlighting what makes this recipe special and sustainable (string, 150-300 chars)",
                "steps": "Complete cooking instructions as a single formatted string with numbered steps separated by newlines",
                "category": "breakfast|lunch|dinner|snack|dessert|appetizer",
                "sustainability_info": "",
                "ingredients": [
                {
            "name": "organic quinoa",
            "amount": "2 cups",
            "comments": ""
        },
        {
            "name": "seasonal zucchini", 
            "amount": "1 large",
            "comments": "diced"
        }
    ],
    "recipe_photo": null,
    "photo_type": "",
    "user_generated": false,
    "generateSustainabilityAI": true
    "url": The WORKING url of the recipe from the web. Should not go to a non-existent page. Recipe should be verbatim from the original web page. 
    }   

    IMPORTANT: Parse ingredients into objects with name, amount, and comments fields. Extract the ingredient name cleanly (remove amounts and preparation notes).`;


        const msg = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Using these ingredients (${ingredients}), find a sustainable recipe that incoporates at least 80% of these ingredients. Do NOT hallucinate or make things up, I want the recipe and its ingredients to be real.`
                        }
                    ]
                },
            ],
        });

        let responseText = '';
        if (msg.content && msg.content.length > 0) {
            const textBlock = msg.content.find(block => block.type === 'text');
            if (textBlock && 'text' in textBlock) {
                responseText = textBlock.text;
            }
        }

        if (!responseText) {
            return {
                status: 400,
                error: 'No text response from Claude'
            }
        }

        try {
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;

            if (jsonStart === -1 || jsonEnd === 0) {
                return {
                    status: 400,
                    error: 'no json found in response'
                }
            }

            const jsonString = responseText.slice(jsonStart, jsonEnd);
            const recipeData = JSON.parse(jsonString);

            // check that all the fields are there
            if (!recipeData.title || !recipeData.description || !recipeData.steps ||
                !recipeData.category || !Array.isArray(recipeData.ingredients)) {
                return {
                    status: 400,
                    error: 'missing required recipe fields'
                }
            }

            for (const ingredient of recipeData.ingredients) {
                if (!ingredient.name || !ingredient.amount) {
                    return {
                        status: 400,
                        error: 'invalid ingredient structure - name and amount needed'
                    }
                }
            }

            const validCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Drinks'];
            if (!validCategories.includes(recipeData.category.toLowerCase())) {
                recipeData.category = 'Dinner'; // default
            }

            const formattedData = {
                title: recipeData.title,
                author: 'a6cfb7c3-5651-41db-a988-e26b83216811',
                description: recipeData.description,
                steps: recipeData.steps,
                category: recipeData.category.toLowerCase(),
                sustainability_info: recipeData.sustainability_info || '',
                recipe_photo: "",
                photo_type: '',
                user_generated: false,
                generateSustainabilityAI: true,
                ingredients: recipeData.ingredients,
                url: recipeData.url
            };

            return {
                status: 200,
                data: formattedData
            };

        } catch (parseError) {
            return {
                status: 400,
                error: 'invalid JSON response from AI'
            };
        }

    } catch (error) {
        return {
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error in AI analysis'
        };
    }
};

export { sendAiRequest, analyzeSustainability, processRecipeIngredients, findRecipes, findRecipesWithIngredients };