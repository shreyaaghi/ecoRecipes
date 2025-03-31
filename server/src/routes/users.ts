import { Request, Response, Router } from "express";
import { getUser } from "../controllers/users";
import { supabase } from "../util";

const usersRouter = () => {
    const router = Router();

    router.get("/", async (req: Request, res: Response) => {
        const token:string|undefined = req.get("x-access-token");
        const{data:{ user }} = await supabase.auth.getUser(token);
        if (!user) {
            return res.status(401).send("not authenticated")
        }
        const userId:string = user.id;
        return res.send(await getUser(userId));
    })

    router.get("/:id", async (req: Request, res: Response) => {
        const id = req.params.id;
        return res.send(await getUser(id));
    })
    return router;
}

export default usersRouter;