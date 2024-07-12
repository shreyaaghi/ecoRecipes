import express, { Express, Request, Response } from "express";
import authRouter from "./routes/auth";
const app:Express = express();
const port:number = parseInt(process.env.PORT) || 8000;
app.use(express.json());
app.use("/auth", authRouter());

app.get("/", (req:Request, res:Response) => res.send("hello"));

app.listen(port, ()=> console.info(`listening on port ${port}`));