import { supabase } from "../util/supabase";

const createPair = async (recipeId: number, ingredientId: number, amount: string, comments:string) => {
    const { data, error } = await supabase
      .from('recipe_ingredients')
      .insert([{ 
        recipe_id: recipeId,
        ingredient_id: ingredientId,
        amount: amount,
        comments: comments
     }]).select();
  
    if (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  
    return {
      status: 200,
      data: data,
    };
  };

const getIngredientsByRecipe = async (recipeId: number) => {
    const { data, error } = await supabase
    .from('recipe_ingredients').select('*').eq('recipe_id', recipeId);
  
    if (error) {
      return {
        status: 500,
        error: error.message
      };
    };

    if (!data || data.length == 0) {
        return {
            status: 404,
            error: "recipe id not found"
        };
    };
  
    return {
      status: 200,
      data: data
    };
  };

  const getRecipesByIngredient = async (ingredientId: number) => {
    const { data, error } = await supabase
    .from('recipe_ingredients').select('*').eq('ingredient_id', ingredientId);
  
    if (error) {
      return {
        status: 500,
        error: error.message
      };
    };

    if (!data || data.length == 0) {
        return {
            status: 404,
            error: "ingredient id not found"
        };
    };
  
    return {
      status: 200,
      data: data
    };
  };

export { createPair, getIngredientsByRecipe, getRecipesByIngredient };