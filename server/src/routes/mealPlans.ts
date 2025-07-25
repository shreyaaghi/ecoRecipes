import { Request, Response, Router } from "express";
import { createMealPlan, getMealPlan, deleteMealPlan, getUserMealPlans, getMealPlanWithRecipes, createCompleteMealPlan, updateMealPlan } from "../controllers";
import { supabase } from "../util/supabase";

const mealPlansRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("meal plans"));
    router.get("/user", async (req: Request, res: Response) => {
        const token = req.get("x-access-token");

        try {
            const { data: { user } } = await supabase.auth.getUser(token);

            if (!user) {
                return res.status(401).send("not authenticated");
            }

            const user_id = user.id;

            const result = await getUserMealPlans(user_id);

            return res.status(result.status).json(result);

        } catch (error) {
            console.error("Error in /user route:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    router.post("/", async (req: Request, res: Response) => {
        const { name, days } = req.body;
        const token = req.get("x-access-token");
        const { data: { user } } = await supabase.auth.getUser(token);

        if (!user) {
            return res.status(401).send("not authenticated");
        }

        const user_id = user.id;
        const result = await createCompleteMealPlan(user_id, name, days);

        if (result.status === 200) {
            return res.status(200).json(result);
        } else {
            return res.status(result.status).json(result);
        }
    });

    router.put("/:id", async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid meal plan ID' });
        }

        const { name, days } = req.body;
        const token = req.get("x-access-token");

        const { data: { user } } = await supabase.auth.getUser(token);

        if (!user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const user_id = user.id;

        if (!name || !days) {
            return res.status(400).json({ error: 'Name and days are required' });
        }

        const result = await updateMealPlan(id, user_id, name, days);

        if (result.status === 200) {
            return res.status(200).json(result)
        } else {
            return res.status(result.status).json(result);
        }


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
        const token: string | undefined = req.get("x-access-token");
        const { data: { user } } = await supabase.auth.getUser(token);
        if (!user) {
            return res.status(401).send("not authenticated")
        }
        const user_id: string = user.id;

        return res.send(await getUserMealPlans(user_id));
    });


    router.get("/:id/recipes", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'invalid meal plan ID' });
        }

        const result = await getMealPlanWithRecipes(id);
        return res.status(result.status).json(result);
    });

    return router;
};

export default mealPlansRouter;