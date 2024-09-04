import { Request, Response, Router } from "express";
import { signup, login } from "../controllers/auth";
// handles requests for authentication
const authRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("hi"));

    router.post("/signup", async (req: Request, res: Response) => {
        const { email, password, username }: { email: string, password: string, username: string } = req.body;
        res.send(await signup(email, password, username));
    });

    router.post("/login", async (req: Request, res: Response) => {
        const { email, password }: {email: string, password: string} = req.body;
        console.info("Login hit");
        res.send(await login(email, password));
    })

    return router;
}

export default authRouter;