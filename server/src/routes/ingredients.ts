import { Request, Response, Router } from "express";
import { createIngredient, getIngredientByName, filterIngredientsByName } from "../controllers/ingredients";

const ingredientsRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("ingredients"));

    router.post("/", async(req: Request, res:Response) => {
        const { name }: { name: string } = req.body;
        res.send(await createIngredient(name));
    });

    router.get("/:name", async(req: Request, res:Response) => {
        const name: string = req.params.name;
        res.send(await getIngredientByName(name));
      
    });

    router.get("/filter/:name", async(req: Request, res:Response) => {
        const name: string = req.params.name;
        res.send(await filterIngredientsByName(name));
    });

    return router;
};

export default ingredientsRouter;