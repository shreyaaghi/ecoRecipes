import { Request, Response, Router } from "express";
import { createRecipe, getRecipe, updateRecipe, deleteRecipe, getAllRecipes } from "../controllers";
import { supabase } from "../util";

const recipesRouter = () => {
    const router = Router();
    router.get("/", (req: Request, res: Response) => res.send("recipes"));

    router.post("/", async (req: Request, res: Response) => {
        const { title, description, steps, category, sustainability_info, recipe_photo, user_generated }: {title:string, description:string, steps:string, category:string, sustainability_info:string, recipe_photo: any, user_generated?:string} = req.body;
        // gets token to get user
        const token:string|undefined = req.get("x-access-token");
        const{data:{ user }} = await supabase.auth.getUser(token);
        if (!user) {
            return res.status(401).send("not authenticated")
        }
        const userId:string = user.id;
        return res.send(await createRecipe(title, userId, description, steps, category, sustainability_info, recipe_photo, user_generated==="true" || user_generated==="false"))
    });
    
        router.get("/recipes/", async (req: Request, res: Response) => {
          const pageNumber = parseInt(req.query.pageNumber as string) || 1;
          const pageSize = parseInt(req.query.pageSize as string) || 10;
    
          const result = await getAllRecipes(pageSize, pageNumber);
          if (result.status === 500) {
              return res.status(500).send('error');
          }
          return res.send(result);
          
        })
    
    router.get("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        // check if id is number
        if (isNaN(id)) {
          return res.status(400).send('invalid recipe ID');
        }

        return res.send(await getRecipe(id));
    });

    router.put("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        // check if id is number
        if (isNaN(id)) {
          return res.status(400).send('invalid recipe ID');
        }

        const { title, description, steps, category, sustainability_info, recipe_photo, user_generated }: {title:string, description:string, steps:string, category:string, sustainability_info:string, recipe_photo:any, user_generated?:string} = req.body;
        
        return res.send(await updateRecipe(id, title, description, steps, category, sustainability_info, recipe_photo, user_generated));
    });

    router.delete("/:id", async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        if (isNaN(id)) {
          return res.status(400).send('invalid recipe ID');
        }

        return res.send(await deleteRecipe(id));
    });
    
    return router;
};

export default recipesRouter;