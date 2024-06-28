import express, { Express, Request, Response } from "express";
const app:Express = express();
const port:number = parseInt(process.env.PORT) || 8000;
app.use(express.json());


app.get("/", (req:Request, res:Response) => res.send("hello"));

app.listen(port, ()=> console.info(`listening on port ${port}`))