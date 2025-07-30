import { supabase } from "../util/supabase";
import { createIncludedPlan } from "./plans";
import { createRecipePlan } from "./recipePlans"

interface RecipePlan {
  id: number;
  day: string;
  time: string;
  recipe_id: number;
  recipes: {
    id: number;
    title: string;
  };
}

interface IncludedPlan {
  recipe_plan_id: number;
}

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

  return {
    status: 200,
    data: data || []
  };
};

const getMealPlanWithRecipes = async (id: number) => {
  try {
    const { data: mealPlan, error: mealPlanError } = await supabase
      .from('meal_plans')
      .select('id, name, user_id')
      .eq('id', id)
      .single();

    if (mealPlanError || !mealPlan) {
      return {
        status: 404,
        error: 'meal plan not found',
      };
    }

    const { data: includedPlans, error: includedPlansError } = await supabase
      .from('included_plans')
      .select('*')
      .eq('meal_plan_id', id);

    if (includedPlansError) {
      return {
        status: 500,
        error: includedPlansError.message,
      };
    }

    const days: { [key: string]: any[] } = {};

    if (includedPlans && includedPlans.length > 0) {
      for (const includedPlan of includedPlans) {
        const { data: recipePlan, error: recipePlanError } = await supabase
          .from('recipe_plans')
          .select('*')
          .eq('id', includedPlan.recipe_plan_id)
          .single();

        if (!recipePlanError && recipePlan) {
          const { data: recipe, error: recipeError } = await supabase
            .from('recipes')
            .select('id, title')
            .eq('id', recipePlan.recipe_id)
            .single();

          if (!recipeError && recipe) {
            const day = recipePlan.day;

            if (!days[day]) {
              days[day] = [];
            }

            days[day].push({
              id: recipe.id,
              title: recipe.title,
              time: recipePlan.time
            });
          }
        }
      }
    }

    const daysArray = Object.keys(days).map(dayName => ({
      dayName,
      recipes: days[dayName]
    }));

    return {
      status: 200,
      data: {
        id: mealPlan.id,
        name: mealPlan.name,
        days: daysArray
      }
    };

  } catch (error) {
    console.error("error in getMealPlanWithRecipes:", error);
    return {
      status: 500,
      error: "Internal server error"
    };
  }
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

const updateMealPlan = async (mealPlanId: number, user_id: string, name: string,  days: any[]) => {
  try {
    // update meal plan name
      const { data: updatedMealPlan, error: mealPlanError } = await supabase
          .from('meal_plans')
          .update({ name: name })
          .eq('id', mealPlanId)
          .eq('user_id', user_id)
          .select();
          
      if (mealPlanError || !updatedMealPlan || updatedMealPlan.length === 0) {
          return {
              status: 404,
              error: 'Meal plan not found or unauthorized'
          };
      }
      // get all the existing recipes for this meal plan
      const { data: existingIncludedPlans, error: includedError } = await supabase
          .from('included_plans')
          .select(`
              id,
              recipe_plan_id,
              recipe_plans (
                  id,
                  recipe_id,
                  day,
                  time
              )
          `)
          .eq('meal_plan_id', mealPlanId);
          
      if (includedError) {
          return {
              status: 500,
              error: 'Failed to fetch existing data'
          };
      }
      
      // process new recipe data
      const newRecipes = [];
      for (const day of days) {
          for (const recipe of day.recipes) {
              if (recipe.recipeId && recipe.time) {
                  newRecipes.push({
                      recipe_id: parseInt(recipe.recipeId),
                      day: day.dayName,
                      time: recipe.time
                  });
              }
          }
      }
    
      // update existing recipes
      const existingRecipePlans = existingIncludedPlans?.map((ip: any) => ip.recipe_plans).filter(Boolean) || [];
      const updatedRecipePlanIds = [];
      
      for (let i = 0; i < newRecipes.length && i < existingRecipePlans.length; i++) {
          const newRecipe = newRecipes[i];
          const existingRecipePlan = existingRecipePlans[i];
          
          if (existingRecipePlan && existingRecipePlan.id) {
              const { data: updatedRecipePlan, error: updateError } = await supabase
                  .from('recipe_plans')
                  .update({
                      recipe_id: newRecipe.recipe_id,
                      day: newRecipe.day,
                      time: newRecipe.time
                  })
                  .eq('id', existingRecipePlan.id)
                  .select();
                  
              if (!updateError && updatedRecipePlan) {
                  updatedRecipePlanIds.push(existingRecipePlan.id);
              }
          }
      }
      
      // create new recipe_plans for the extras
      if (newRecipes.length > existingRecipePlans.length) {
          for (let i = existingRecipePlans.length; i < newRecipes.length; i++) {
              const newRecipe = newRecipes[i];
              
              const recipePlanResult = await createRecipePlan(
                  newRecipe.recipe_id,
                  newRecipe.day,
                  newRecipe.time
              );
              
              if (recipePlanResult.status === 200) {
                  const newRecipePlanId = recipePlanResult.data[0].id;
                  updatedRecipePlanIds.push(newRecipePlanId);
                  
                  // create new included_plan for this new recipe_plan
                  await createIncludedPlan(mealPlanId, newRecipePlanId);
              }
          }
      }
      
      // remove extra recipe_plans 
      if (newRecipes.length < existingRecipePlans.length) {
          for (let i = newRecipes.length; i < existingRecipePlans.length; i++) {
              const extraRecipePlan = existingRecipePlans[i];
              
              if (extraRecipePlan && extraRecipePlan.id) {
                  // delete included plan first bc fk
                  const extraIncludedPlan = existingIncludedPlans?.find((ip: any) => ip.recipe_plan_id === extraRecipePlan.id);
                  if (extraIncludedPlan) {
                      await supabase.from('included_plans').delete().eq('id', extraIncludedPlan.id);
                  }
                  
                  // delete recipe_plan
                  await supabase.from('recipe_plans').delete().eq('id', extraRecipePlan.id);
              }
          }
      }
      
      return {
          status: 200,
          data: updatedMealPlan[0],
          message: "Meal plan updated successfully"
      };
      
  } catch (error) {
      console.error("Error in updateMealPlan:", error);
      return {
          status: 500,
          error: "Internal server error"
      };
  }
};

export { createMealPlan, getMealPlan, deleteMealPlan, getUserMealPlans, getMealPlanWithRecipes, createCompleteMealPlan, updateMealPlan };