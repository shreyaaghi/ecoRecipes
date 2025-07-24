import { Request, Response, Router } from "express";
import { sendAiRequest } from "../controllers";
import { supabase } from "../util";

// handles requests for authentication
const aiRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("ai"));
    router.post("/", async (req: Request, res: Response) => {
        const token:string|undefined = req.get("x-access-token");
        const{data:{ user }} = await supabase.auth.getUser(token);
        if (!user) {
            return res.status(401).send("not authenticated")
        }
        const { message }: { message: string } = req.body;
        res.send(await sendAiRequest(message));
    })
    return router;
}

export default aiRouter;