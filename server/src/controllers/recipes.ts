import  { supabase } from "../util/supabase";

const createRecipe = async (title:string, author:string, description:string, steps:string, category:string, sustainability_info:string, user_generated?:boolean) => {
    const {data, error} = await supabase.from("recipes").insert([{
        title: title,
        author: author,
        description: description,
        steps: steps,
        category: category,
        sustainability_info: sustainability_info,
        user_generated: user_generated??true
    }]).select();
    if (error) {
        return {
            status:500,
            error:error.message
        }
    }
    return {
        status:200,
        data:data
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

const updateRecipe = async (id:number, title:string, author:string, description:string, steps:string, category:string, sustainability_info:string, user_generated?:boolean) => {
    const {data, error} = await supabase.from("recipes").update([{
        title: title,
        author: author,
        description: description,
        steps: steps,
        category: category,
        sustainability_info: sustainability_info,
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

export { createRecipe, getRecipe, updateRecipe, deleteRecipe };