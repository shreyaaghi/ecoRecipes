import { supabase } from "../util/supabase";

const createIncludedPlan = async (meal_plan_id: number, recipe_plan_id: number) => {
    const {data, error} = await supabase.from("included_plans").insert({
        meal_plan_id: meal_plan_id,
        recipe_plan_id: recipe_plan_id
    }).select();
    
    if (error) {
        console.log("createIncludedPlan error:", error);
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

const getIncludedPlan = async (id: number) => {
    const { data, error } = await supabase
        .from('included_plans').select('*').eq('id', id); 
    
    if (error) {
        return {
            status: 500,
            error: error.message,
        };
    }
    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'included plan not found',
        };
    }
    return {
        status: 200,
        data: data,
    };
};

const updateIncludedPlan = async (id: number, meal_plan_id: number, recipe_plan_id: number) => {
    const {data, error} = await supabase.from("included_plans").update({
        meal_plan_id: meal_plan_id,
        recipe_plan_id: recipe_plan_id,
    }).eq('id', id)
    .select();
    
    if (error) {
        return {
            status: 500,
            error: error.message
        }
    }
    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'included plan not found', 
        };
    }
    return {
        status: 200,
        data: data
    }
};

const deleteIncludedPlan = async (id: number) => {
    const {data, error} = await supabase.from("included_plans").delete().eq('id', id).select();
    
    if (error) {
        return {
            status: 500,
            error: error.message,
        };
    }
    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'included plan not found', 
        };
    }
    return {
        status: 200,
        message: 'included plan deleted', 
    }
};

export { createIncludedPlan, getIncludedPlan, updateIncludedPlan, deleteIncludedPlan };