import { supabase } from "../util/supabase";
import { createPlan } from "./plans";
import { createRecipePlan } from "./recipePlans"

const createMealPlan = async (user_id:string, plan_id:number) => {
    const {data, error} = await supabase.from("meal_plans").insert([{
        user_id: user_id,
        plan: plan_id
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
        data: data[0],
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

const getMealPlanWithRecipes = async (id: number) => {
  const { data, error } = await supabase
    .from('meal_plans')
    .select(`*, plans:plan(*, recipe_plans(*, recipes(*)))`)
    .eq('id', id);
  
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
    data: data[0],
  };
};

const createFullMealPlan = async (user_id: string, name: string, days: any[]) => {
  // create plan with days and times
  const daysString = days.map(day => day.dayName).join(',');
  const timesString = days.map(day => day.recipes.map((recipe: any) => recipe.time).join(';')).join(',');

  const planResult = await createPlan(daysString, timesString);

  const plan_id = planResult.data[0].id;
  
  const mealPlanResult = await createMealPlan(user_id, plan_id);

  const recipePlanPromises = [];
        
        for (const day of days) {
            for (const recipe of day.recipes) {
                if (recipe.recipeId) {
                    recipePlanPromises.push(
                        createRecipePlan(parseInt(recipe.recipeId), plan_id)
                    );
                }
            }
        }
        
  const recipePlanResults = await Promise.all(recipePlanPromises);

  return {
    success: true,
    message: "meal plan created",
    data: {
        meal_plan_id: mealPlanResult.data[0].id,
        plan_id: plan_id,
        name: name,
        total_recipes: recipePlanPromises.length
    }
  }


}

export { createMealPlan, getMealPlan, deleteMealPlan, getUserMealPlans, getMealPlanWithRecipes, createFullMealPlan };