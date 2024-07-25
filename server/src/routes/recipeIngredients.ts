import { Request, Response, Router } from "express";
import { supabase } from "../util";

const recipeIngredientsRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("recipes"));

    router.post("/", async (req: Request, res: Response) => {
        return res.send("creating pair")
    });

    router.get("/recipes/:recipeId", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.recipeId);

        // check if id is number
        if (isNaN(id)) {
          return res.status(400).send('invalid recipe ID');
        }

        return res.send("get ingredients for x recipe");
    });
    router.get("/ingredients/:name", async (req: Request, res: Response) => {
        return res.send("get recipes with x ingredient");
    });

    return router;
};

export default recipeIngredientsRouter;