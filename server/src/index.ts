import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from "express";
import authRouter from "./routes/auth";
import recipesRouter from "./routes/recipes"
const app:Express = express();
const port:number = parseInt(process.env.PORT) || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter());
app.use("/recipes", recipesRouter());

app.get("/", (req:Request, res:Response) => res.send("hello"));

app.listen(port, ()=> console.info(`listening on port ${port}`));