import  { supabase } from "../util/supabase";

const createRecipe = async (title:string, author:string, description:string, steps:string, category:string, sustainability_info:string, recipe_photo:any, user_generated?:boolean) => {
    const {data, error} = await supabase.from("recipes").insert([{
        title: title,
        author: author,
        description: description,
        steps: steps,
        category: category,
        sustainability_info: sustainability_info,
        // recipe_photo: ,
        user_generated: user_generated??true
    }]).select();
    if (error) {
        return {
            status:500,
            error:error.message
        }
    }
    const recipeId:number = data[0].id;

    const { error:upload_error } = await supabase.storage.from("recipe-images").upload( `${recipeId}.png`, recipe_photo );
    if (upload_error) {
        return {
            status: 500,
            error: upload_error.message
        }
    }
    const {data:photo_data} = await supabase.storage.from("recipe-images").getPublicUrl(`${recipeId}.png`);
    const {data:updated_data} = await supabase.from("recipes").update({"recipe_photo": photo_data.publicUrl}).eq("id", recipeId).select();
    
    return {
        status:200,
        data:updated_data
    }
};

const getRecipe = async (id:number) => {
    const { data, error } = await supabase
    .from('recipes').select('*').eq('id', id)

    if (error) {
        return {
          status: 500,
          error: error.message,
        };
    }
      
    if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'recipe not found',
        };
    }
    
    return {
        status: 200,
        data: data,
    };
};

const updateRecipe = async (id:number, title:string, author:string, description:string, steps:string, category:string, sustainability_info:string, recipe_photo:any, user_generated?:boolean) => {
    const {data, error} = await supabase.from("recipes").update([{
        title: title,
        author: author,
        description: description,
        steps: steps,
        category: category,
        sustainability_info: sustainability_info,
        recipe_photo,
        user_generated: user_generated??true
    }]).eq('id', id)
    .select();

    if (error) {
        return {
            status:500,
            error:error.message
        }
    }
    if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'recipe not found',
        };
    }
    return {
        status:200,
        data:data
    }
};

const deleteRecipe = async (id:number) => {
    const {data, error} = await supabase.from("recipes").delete().eq('id', id).select();
    if (error) {
        return {
          status: 500,
          error: error.message,
        };
      }
      
      if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'recipe not found',
        };
      }
      return {
        status: 200,
        message: 'recipe deleted',
      }
};

const getAllRecipes = async (size:number, pageNumber:number) => {
    // paginating - showing 10 of 50 results, not pulling everything at once
    const { data, error } = await supabase
    .from('recipes').select('*').range(((pageNumber - 1) * size), ((pageNumber * size) - 1))

    if (error) {
        return {
          status: 500,
          error: error.message,
        };
    }
      
    if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'no recipes found',
        };
    }
    
    return {
        status: 200,
        data: data,
    };
};

export { createRecipe, getRecipe, getAllRecipes, updateRecipe, deleteRecipe };