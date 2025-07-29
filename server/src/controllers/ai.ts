import Anthropic from "@anthropic-ai/sdk";

const sendAiRequest = async (message:string) => {
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
            throw new Error('No text response from Claude');
        }

        // parse
        let analysisData: SustainabilityAnalysis;
        try {
            // clean extra text
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            
            if (jsonStart === -1 || jsonEnd === 0) {
                throw new Error('No JSON found in response');
            }
            
            const jsonString = responseText.slice(jsonStart, jsonEnd);
            analysisData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse Claude response as JSON:', responseText);
            throw new Error('Invalid JSON response from AI');
        }

        // validate res structure
        if (
            typeof analysisData.sustainabilityScore !== 'number' ||
            !Array.isArray(analysisData.sustainableAspects) ||
            !Array.isArray(analysisData.improvementSuggestions) ||
            typeof analysisData.reasoning !== 'string'
        ) {
            throw new Error('Invalid response structure from AI');
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


export { sendAiRequest, analyzeSustainability };