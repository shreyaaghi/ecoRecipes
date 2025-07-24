import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
// import formidable from 'express-formidable';

import express, { Express, Request, Response } from "express";
import authRouter from "./routes/auth"
import recipesRouter from "./routes/recipes"
import ingredientsRouter from "./routes/ingredients"
import recipeIngredientsRouter from "./routes/recipeIngredients"
import includedPlansRouter from "./routes/plans"
import mealPlansRouter from "./routes/mealPlans"
import recipePlansRouter from "./routes/recipePlans"
import usersRouter from "./routes/users"
import aiRouter from "./routes/ai"

const app:Express = express();
const port:number = parseInt(process.env.PORT) || 8000;
// app.use(formidable());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
}));

app.use("/auth", authRouter());
app.use("/recipes", recipesRouter());
app.use("/ingredients", ingredientsRouter());
app.use("/recipe-ingredients", recipeIngredientsRouter());
app.use("/plans", includedPlansRouter());
app.use("/mealplans", mealPlansRouter());
app.use("/recipe-plans", recipePlansRouter());
app.use("/users", usersRouter());
app.use("/ai", aiRouter());

app.get("/", (req:Request, res:Response) => res.send("hello"));

app.listen(port, ()=> console.info(`listening on port ${port}`));