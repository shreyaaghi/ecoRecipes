import { Request, Response, Router } from "express";
import { signup } from "../controllers/auth";
// handles requests for authentication
const authRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("hi"));
    router.post("/signup", async (req: Request, res: Response) => {
        const { email, password, username }: { email: string, password: string, username: string } = req.body;
        res.send(signup(email, password, username));
    });
    router.get("/login", async (req: Request, res: Response) => {
        res.send("also tbd");
    })
    return router;
}

export default authRouter;