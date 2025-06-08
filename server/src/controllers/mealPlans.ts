import { supabase } from "../util/supabase";
import { createIncludedPlan } from "./plans";
import { createRecipePlan } from "./recipePlans"

const createMealPlan = async (user_id: string, name: string) => {
  const { data, error } = await supabase.from("meal_plans").insert({
    user_id: user_id,
    name: name
  }).select();

  if (error) {
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

const getMealPlan = async (id: number) => {
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

const deleteMealPlan = async (id: number) => {
  const { data, error } = await supabase.from("meal_plans").delete().eq('id', id).select();
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

const getUserMealPlans = async (user_id: string) => {
  const { data, error } = await supabase.from("meal_plans").select('*').eq('user_id', user_id);
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

const createCompleteMealPlan = async (user_id: string, name: string, days: any[]) => {
  try {
    const recipePlanIds = [];

    for (const day of days) {
      for (const recipe of day.recipes) {
        if (recipe.recipeId && recipe.time) {

          const recipePlanResult = await createRecipePlan(
            parseInt(recipe.recipeId),
            day.dayName,
            recipe.time
          );

          if (recipePlanResult.status !== 200) {
            return { status: 500, error: "Failed to create recipe plan" };
          }

          recipePlanIds.push(recipePlanResult.data[0].id);
        }
      }
    }

    const mealPlanResult = await createMealPlan(user_id, name); 

    if (mealPlanResult.status !== 200) {
      return { status: 500, error: "failed to create meal plan" };
    }

    const meal_plan_id = mealPlanResult.data[0].id;

    for (const recipePlanId of recipePlanIds) {
      const includedPlanResult = await createIncludedPlan(meal_plan_id, recipePlanId);
      if (includedPlanResult.status !== 200) {
        return { status: 500, error: "failed to create included plan" };
      }
    }

    return {
      status: 200,
      data: mealPlanResult.data
    };

  } catch (error) {
    console.error("Error in createCompleteMealPlan:", error);
    return { status: 500, error: error.message };
  }
};


export { createMealPlan, getMealPlan, deleteMealPlan, getUserMealPlans, getMealPlanWithRecipes, createCompleteMealPlan };