import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
// import formidable from 'express-formidable';

import express, { Express, Request, Response } from "express";
import authRouter from "./routes/auth"
import recipesRouter from "./routes/recipes"
import ingredientsRouter from "./routes/ingredients"
import recipeIngredientsRouter from "./routes/recipeIngredients"
import plansRouter from "./routes/plans"
import mealPlansRouter from "./routes/mealPlans"
import recipePlansRouter from "./routes/recipePlans"

const app:Express = express();
const port:number = parseInt(process.env.PORT) || 8000;
// app.use(formidable());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
}));
app.use("/auth", authRouter());
app.use("/recipes", recipesRouter());
app.use("/ingredients", ingredientsRouter());
app.use("/recipe-ingredients", recipeIngredientsRouter());
app.use("/plans", plansRouter());
app.use("/meal-plans", mealPlansRouter());
app.use("/recipe-plans", recipePlansRouter());

app.get("/", (req:Request, res:Response) => res.send("hello"));

app.listen(port, ()=> console.info(`listening on port ${port}`));