import { Request, Response, Router } from "express";
import { createRecipePlan, getRecipePlan, deleteRecipePlan, getRecipeIdByPlanId } from "../controllers";

const recipePlansRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("recipe plans"));
    

    router.post("/", async (req: Request, res: Response) => {
        const { recipe_id, plan_id }: { recipe_id:number, plan_id:number } = req.body;

        return res.send(await createRecipePlan(recipe_id, plan_id));
    });

    router.get("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        // check if id is number
        if (isNaN(id)) {
          return res.status(400).send('invalid recipe plan ID');
        };

        return res.send(await getRecipePlan(id));
    });
    
    router.delete("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        if (isNaN(id)) {
          return res.status(400).send('invalid recipe plan ID');
        };

        return res.send(await deleteRecipePlan(id));
    });

    router.get("/plan/:plan_id", async (req: Request, res: Response) => {
        const plan_id: number = parseInt(req.params.plan_id);

        if (isNaN(plan_id)) {
          return res.status(400).send('invalid plan ID');
        };

        return res.send(await getRecipeIdByPlanId(plan_id));
    });

    return router;
};

export default recipePlansRouter;