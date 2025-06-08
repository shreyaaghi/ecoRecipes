import { Request, Response, Router } from "express";
import { createRecipePlan, getRecipePlan, deleteRecipePlan, getRecipesByDay } from "../controllers";

const recipePlansRouter = () => {
    const router = Router();
    
    router.get("/", (req: Request, res: Response) => res.send("recipe plans"));
    
    router.post("/", async (req: Request, res: Response) => {
        const { recipe_id, day, time }: { recipe_id: number, day: string, time: string } = req.body;
        const result = await createRecipePlan(recipe_id, day, time);
        return res.status(result.status).json(result);
    });
    
    router.get("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).send('invalid recipe plan ID');
        }
        const result = await getRecipePlan(id);
        return res.status(result.status).json(result);
    });
    
    router.delete("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).send('invalid recipe plan ID');
        }
        const result = await deleteRecipePlan(id);
        return res.status(result.status).json(result);
    });
    
    router.get("/day/:day", async (req: Request, res: Response) => {
        const day: string = req.params.day;
        if (!day) {
            return res.status(400).send('day parameter is required');
        }
        const result = await getRecipesByDay(day);
        return res.status(result.status).json(result);
    });
    
    return router;
};

export default recipePlansRouter;