import { Request, Response, Router } from "express";
import { createPair, getIngredientsByRecipe, getRecipesByIngredient } from "../controllers/recipeIngredients";

const recipeIngredientsRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("recipes"));

    router.post("/", async (req: Request, res: Response) => {
        const { recipeId, ingredientId, amount }: {recipeId: number, ingredientId: number, amount: string} = req.body;

        res.send(await createPair(recipeId, ingredientId, amount));

    });

    router.get("/recipes/:recipeId", async (req: Request, res: Response) => {
        const recipeId: number = parseInt(req.params.recipeId);

        // check if id is number
        if (isNaN(recipeId)) {
          return res.status(400).send('invalid recipe ID');
        }

        return res.send(await getIngredientsByRecipe(recipeId));
    });
    router.get("/ingredients/:ingredientId", async (req: Request, res: Response) => {
        const ingredientId: number = parseInt(req.params.ingredientId);

        // check if id is number
        if (isNaN(ingredientId)) {
          return res.status(400).send('invalid ingredient ID');
        }

        return res.send(await getRecipesByIngredient(ingredientId));
    });

    return router;
};

export default recipeIngredientsRouter;