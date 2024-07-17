import { Request, Response, Router } from "express";

const recipesRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("recipes"));

    return router;
}

export default recipesRouter;