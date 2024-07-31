import { Request, Response, Router } from "express";
import { createMealPlan, getMealPlan, deleteMealPlan, getUserMealPlans } from "../controllers";
import { supabase } from "../util/supabase";

const mealPlansRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("meal plans"));
    

    router.post("/", async (req: Request, res: Response) => {
        const { plan_id }: { plan_id:number } = req.body;

        // gets token to get user
        const token:string|undefined = req.get("x-access-token");

        const{data:{ user }} = await supabase.auth.getUser(token);
        if (!user) {
            return res.status(401).send("not authenticated")
        }
        const user_id:string = user.id;
        return res.send(await createMealPlan(user_id, plan_id));

    });

    router.get("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        // check if id is number
        if (isNaN(id)) {
          return res.status(400).send('invalid meal plan ID');
        };

        return res.send(await getMealPlan(id));
    });
    
    router.delete("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        if (isNaN(id)) {
          return res.status(400).send('invalid meal plan ID');
        };

        return res.send(await deleteMealPlan(id));
    });

    router.get("/user/:user_id", async (req: Request, res: Response) => {
        const token:string|undefined = req.get("x-access-token");
        const{data:{ user }} = await supabase.auth.getUser(token);
        if (!user) {
            return res.status(401).send("not authenticated")
        }
        const user_id:string = user.id;

        return res.send(await getUserMealPlans(user_id));
    });

    return router;
};

export default mealPlansRouter;