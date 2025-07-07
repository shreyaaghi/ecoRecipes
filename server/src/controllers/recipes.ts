import { supabase } from "../util/supabase";
import { get_file_ext } from "../util";
import { decode } from 'base64-arraybuffer';
import { getUser } from './users';

const createRecipe = async (title: string, author: string, description: string, steps: string, category: string, sustainability_info: string, recipe_photo: any, photo_type: string, user_generated?: boolean) => {
    const { data, error } = await supabase.from("recipes").insert([{
        title: title,
        author: author,
        description: description,
        steps: steps,
        category: category,
        sustainability_info: sustainability_info,
        // recipe_photo: ,
        user_generated: user_generated ?? true
    }]).select();
    if (error) {
        return {
            status: 500,
            error: `body error: ${error.message}`
        }
    }
    const recipeId: number = data[0].id;
    // const photo = decode(recipe_photo);

    if (recipe_photo) {
        const photo = decode(recipe_photo?.toString('base64'));

        const ext = get_file_ext(photo_type);
        const { error: upload_error } = await supabase.storage.from("recipe-images").upload(`${recipeId}.${ext}`, photo, { contentType: photo_type });
        if (upload_error) {
            return {
                status: 500,
                error: `Photo error: ${upload_error.message}`
            }
        }
        const { data: photo_data } = await supabase.storage.from("recipe-images").getPublicUrl(`${recipeId}.${ext}`);
        const { data: updated_data } = await supabase.from("recipes").update({ "recipe_photo": photo_data.publicUrl }).eq("id", recipeId).select();
        return {
            status: 200,
            data: updated_data
        }

    }
    return {
        status: 200,
        data: data
    }
};

const getRecipe = async (id: number) => {
    const { data, error } = await supabase
        .from('recipes').select('*').eq('id', id)

    if (error) {
        return {
            status: 500,
            error: error.message,
        };
    }

    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'recipe not found',
        };
    }

    let userId = data[0].author;
    const user = await supabase.from("users").select().eq("id", userId).single();
    let username = user.data.username;

    data[0].author = username;

    return {
        status: 200,
        data: data,
    };
};

// TO DO: change recipe_photo from body
const updateRecipe = async (id: number, title: string, author: string, description: string, steps: string, category: string, sustainability_info: string, recipe_photo: any, photo_type: string, user_generated?: boolean) => {
    const { data: recipe_data } = await supabase.from('recipes').select('recipe_photo').eq('id', id);
    if (recipe_data) {
        const { error: delete_error } = await supabase.storage.from('recipe-images').remove([recipe_data[0].recipe_photo.split("/").slice(-1)])
        if (delete_error) {
            return {
                status: 500,
                error: 'could not remove image'
            }
        }
    };
    const photo = decode(recipe_photo.toString('base64'));
    const ext = get_file_ext(photo_type);
    const { error: upload_error } = await supabase.storage.from("recipe-images").upload(`${id}.${ext}`, photo, { contentType: photo_type });
    if (upload_error) {
        return {
            status: 500,
            error: upload_error.message
        }
    }
    const { data: photo_data } = await supabase.storage.from("recipe-images").getPublicUrl(`${id}.${ext}`);


    const { data, error } = await supabase.from("recipes").update([{
        title: title,
        author: author,
        description: description,
        steps: steps,
        category: category,
        sustainability_info: sustainability_info,
        recipe_photo: photo_data.publicUrl,
        user_generated: user_generated ?? true
    }]).eq('id', id)
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
            error: 'recipe not found',
        };
    }
    return {
        status: 200,
        data: data
    }
};

const deleteRecipe = async (id: number) => {
    const { data, error } = await supabase.from("recipes").delete().eq('id', id).select();
    if (error) {
        return {
            status: 500,
            error: error.message,
        };
    }

    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'recipe not found',
        };
    }
    return {
        status: 200,
        message: 'recipe deleted',
    }
};

const getAllRecipes = async (size: number, pageNumber: number) => {
    // paginating - showing 10 of 50 results, not pulling everything at once
    const { data, error } = await supabase
        .from('recipes').select('*').range(((pageNumber - 1) * size), ((pageNumber * size) - 1))

    if (error) {
        return {
            status: 500,
            error: error.message,
        };
    }

    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'no recipes found',
        };
    }

    const parsed = [];
    for (let recipe of data) {
        let pRecipe: Record<string, string> = {};
        pRecipe.id = recipe.id;
        pRecipe.title = recipe.title;
        pRecipe.recipe_photo = recipe.recipe_photo;

        parsed.push(pRecipe);
    }

    return {
        status: 200,
        data: parsed,
    };
};

const searchRecipes = async (title: string, size: number, pageNumber: number) => {
    // paginating - showing 10 of 50 results, not pulling everything at once
    const { data, error } = await supabase
        .from('recipes').select('*').ilike("title", `%${title}%`).range(((pageNumber - 1) * size), ((pageNumber * size) - 1))

    if (error) {
        return {
            status: 500,
            error: error.message,
        };
    }

    if (!data || data.length == 0) {
        return {
            status: 404,
            error: 'no recipes found',
        };
    }

    const parsed = [];
    for (let recipe of data) {
        let pRecipe: Record<string, string> = {};
        pRecipe.id = recipe.id;
        pRecipe.title = recipe.title;
        pRecipe.recipe_photo = recipe.recipe_photo;

        parsed.push(pRecipe);
    }

    return {
        status: 200,
        data: parsed,
    };
};

export { createRecipe, getRecipe, getAllRecipes, updateRecipe, deleteRecipe, searchRecipes };