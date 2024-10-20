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

    let ingredients: any[] = [];
    for (let ingredient of data) {
      const ingredient_id = ingredient.ingredient_id;
      const {data:ingredient_data} = await supabase.from("ingredients_library").select().eq("id", ingredient_id).single();
      let name = ingredient_data.name;
      ingredients.push({
        name, 
        ...ingredient
      })
    }
  
    return {
      status: 200,
      data: ingredients
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