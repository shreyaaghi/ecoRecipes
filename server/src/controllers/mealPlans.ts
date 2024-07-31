import { supabase } from "../util/supabase";

const createMealPlan = async (user_id:string, plan_id:number) => {
    const {data, error} = await supabase.from("meal_plans").insert([{
        user_id: user_id,
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

const getMealPlan = async (id:number) => {
    const { data, error } = await supabase
    .from('meal_plans').select('*').eq('id', id)

    if (error) {
        return {
          status: 500,
          error: error.message,
        };
    }
      
    if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'meal plan not found',
        };
    }
    
    return {
        status: 200,
        data: data,
    };
};

const deleteMealPlan = async (id:number) => {
    const {data, error} = await supabase.from("meal_plans").delete().eq('id', id).select();
    if (error) {
        return {
          status: 500,
          error: error.message,
        };
      }
      
      if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'meal plan not found',
        };
      }
      return {
        status: 200,
        message: 'meal plan deleted',
      }
};

const getUserMealPlans = async (user_id:string) => {
    const {data, error} = await supabase.from("meal_plans").select('*').eq('user_id', user_id);
    if (error) {
        return {
          status: 500,
          error: error.message,
        };
      }
      
      if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'no meal plans found under user',
        };
      }
      return {
        status: 200,
        data: data
      }
};


export { createMealPlan, getMealPlan, deleteMealPlan, getUserMealPlans };