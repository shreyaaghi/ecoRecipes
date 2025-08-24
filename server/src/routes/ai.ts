import { Request, Response, Router } from "express";
import { sendAiRequest, findRecipes, processRecipeIngredients, findRecipesWithIngredients } from "../controllers";
import { createRecipe } from "../controllers";
import { supabase } from "../util";

// handles requests for authentication
const aiRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("ai"));
    router.post("/", async (req: Request, res: Response) => {
        const token:string|undefined = req.get("x-access-token");
        const{data:{ user }} = await supabase.auth.getUser(token);
        if (!user) {
            return res.status(401).send("not authenticated")
        }
        const { message }: { message: string } = req.body;
        res.send(await sendAiRequest(message));
    });
    router.get("/find", async (req: Request, res:Response) => {
        res.send(await findRecipes());
    });
    
    router.post("/create", async (req: Request, res: Response) => {
        const aiRecipeResult = await findRecipes();

        const recipeData = aiRecipeResult.data;
        

        const createResult = await createRecipe(recipeData.title, recipeData.author, recipeData.description, recipeData.steps, recipeData.category, recipeData.sustainability_info, recipeData.recipe_photo, recipeData.mime_type, recipeData.user_generated, recipeData.generateSustainabilityAI, recipeData.ingredients);

        const recipeId = createResult.data[0].id;
            
        const ingredientResult = await processRecipeIngredients(recipeId, recipeData.ingredients);

        return res.status(200).json({
            message: "AI recipe created successfully",
            recipe: createResult.data[0],
            ingredients: ingredientResult
        });

    });

    router.post("/create-with-ingredients", async (req: Request, res: Response) => {
        const { ingredients }: { ingredients: string } = req.body;
        const aiRecipeResult = await findRecipesWithIngredients(ingredients);

        const recipeData = aiRecipeResult.data;

        const createResult = await createRecipe(recipeData.title, recipeData.author, recipeData.description, recipeData.steps, recipeData.category, recipeData.sustainability_info, recipeData.recipe_photo, recipeData.mime_type, recipeData.user_generated, recipeData.generateSustainabilityAI, recipeData.ingredients);

        const recipeId = createResult.data[0].id;
            
        const ingredientResult = await processRecipeIngredients(recipeId, recipeData.ingredients);

        return res.status(200).json({
            message: "AI recipe with ingredients created successfully",
            recipe: createResult.data[0],
            ingredients: ingredientResult,
            url: recipeData.url
        });

    });
    
    return router;
}

export default aiRouter;