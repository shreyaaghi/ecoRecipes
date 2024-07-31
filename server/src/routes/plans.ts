import { Request, Response, Router } from "express";
import { createPlan, getPlan, updatePlan, deletePlan } from "../controllers";
const plansRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("plans"));

    router.post("/", async (req: Request, res: Response) => {
        const { days, times }: {days:string, times:string} = req.body;
        return res.send(await createPlan(days, times));

    });

    router.get("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        // check if id is number
        if (isNaN(id)) {
          return res.status(400).send('invalid plan ID');
        }

        return res.send(await getPlan(id));
    });

    router.put("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        // check if id is number
        if (isNaN(id)) {
          return res.status(400).send('invalid plan ID');
        }

        const { days, times }: {days:string, times:string} = req.body;
        
        return res.send(await updatePlan(id, days, times));
    });

    router.delete("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        if (isNaN(id)) {
          return res.status(400).send('invalid plan ID');
        }

        return res.send(await deletePlan(id));
    });
    
    return router;
};

export default plansRouter;