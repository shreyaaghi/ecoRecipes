import { Request, Response, Router } from "express";
import { createIncludedPlan, getIncludedPlan, updateIncludedPlan, deleteIncludedPlan } from "../controllers";

const includedPlansRouter = () => {
    const router = Router();
    
    router.get("/", (req: Request, res: Response) => res.send("included plans"));
    
    router.post("/", async (req: Request, res: Response) => {
        const { meal_plan_id, recipe_plan_id }: { meal_plan_id: number, recipe_plan_id: number } = req.body;
        const result = await createIncludedPlan(meal_plan_id, recipe_plan_id);
        return res.status(result.status).json(result);
    });
    
    router.get("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).send('invalid included plan ID');
        }
        const result = await getIncludedPlan(id);
        return res.status(result.status).json(result);
    });
    
    router.put("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).send('invalid included plan ID');
        }
        const { meal_plan_id, recipe_plan_id }: { meal_plan_id: number, recipe_plan_id: number } = req.body;
        const result = await updateIncludedPlan(id, meal_plan_id, recipe_plan_id);
        return res.status(result.status).json(result);
    });
    
    router.delete("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).send('invalid included plan ID');
        }
        const result = await deleteIncludedPlan(id);
        return res.status(result.status).json(result);
    });
    
    return router;
};

export default includedPlansRouter;