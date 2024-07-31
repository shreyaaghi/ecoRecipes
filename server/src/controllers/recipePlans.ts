import { supabase } from "../util/supabase";
const createRecipePlan = async (recipe_id:number, plan_id:number) => {
    const {data, error} = await supabase.from("recipe_plans").insert([{
        recipe_id: recipe_id,
        plan_id: plan_id
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

const getRecipePlan = async (id:number) => {
    const { data, error } = await supabase
    .from('recipe_plans').select('*').eq('id', id)

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

const deleteRecipePlan = async (id:number) => {
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

const getRecipeIdByPlanId = async (plan_id:number) => {
    const {data, error} = await supabase.from("recipe_plans").select('recipe_id').eq('plan_id', plan_id);
    if (error) {
        return {
          status: 500,
          error: error.message,
        };
      }
      
      if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'plan id does not exist',
        };
      }
      return {
        status: 200,
        data: data
      }
};


export { createRecipePlan, getRecipePlan, deleteRecipePlan, getRecipeIdByPlanId };