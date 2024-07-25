import { supabase } from "../util/supabase";

const createIngredient = async (name: string) => {
    const { data, error } = await supabase
      .from('ingredients_library')
      .insert([{ name }])
      .select();
  
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

const getIngredientByName = async (name: string) => {
    const { data, error } = await supabase
      .from('ingredients_library')
      .select('*')
      .eq('name', name);
  
    if (error) {
      return {
        status: 500,
        error: error.message,
      };
    }
  
    if (!data || data.length == 0) {
      return {
        status: 404,
        error: 'ingredient not found',
      };
    }
  
    return {
      status: 200,
      data: data,
    };
  };
  
  const filterIngredientsByName = async (name: string) => {
    const { data, error } = await supabase
      .from('ingredients_library')
      .select('*')
      .ilike('name', `%${name}%`);
  
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

export { createIngredient, getIngredientByName, filterIngredientsByName };