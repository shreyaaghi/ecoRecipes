import { supabase } from "../util/supabase";

const createRecipePlan = async (recipe_id: number, day: string, time: string) => {
    const {data, error} = await supabase.from("recipe_plans").insert({
        recipe_id: recipe_id,
        day: day,
        time: time
    }).select();
    
    if (error) {
        console.error("createRecipePlan error:", error);
        return {
            status: 500,
            error: error.message
        }
    }
    return {
        status: 200,
        data: data
    }
};

const getRecipePlan = async (id: number) => {
    const { data, error } = await supabase
        .from('recipe_plans').select('*').eq('id', id);
    
    if (error) {
        return {
            status: 500,
            error: error.message,
        };
    }
    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'recipe plan not found',
        };
    }
    return {
        status: 200,
        data: data,
    };
};

const deleteRecipePlan = async (id: number) => {
    const {data, error} = await supabase.from("recipe_plans").delete().eq('id', id).select();
    
    if (error) {
        return {
            status: 500,
            error: error.message,
        };
    }
    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'recipe plan not found',
        };
    }
    return {
        status: 200,
        message: 'recipe plan deleted',
    }
};

const getRecipesByDay = async (day: string) => {
    const {data, error} = await supabase.from("recipe_plans").select('recipe_id').eq('day', day);
    
    if (error) {
        return {
            status: 500,
            error: error.message,
        };
    }
    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'no recipes found for this day',
        };
    }
    return {
        status: 200,
        data: data
    }
};

export { createRecipePlan, getRecipePlan, deleteRecipePlan, getRecipesByDay };