import  { supabase } from "../util/supabase";
const signup = async (email:string, password:string, username:string) => {
    const {data, error} = await supabase.auth.signUp({
        email, password
    });
    if (error) {
        return {
            status:500,
            error:error.message
        }
    }
    const {error:userError} = await supabase.from("users").insert([{
        id:data.user.id,
        email,
        username
    }]).select();
    if (userError) {
        return {
            status:500,
            error:error.message
        }
    }
    return {
        status:200,
        data:data.session?.access_token
    }
}

const login = async (email:string, password:string) => {
    // supabase.auth.signInWithPassword
}

export { signup };
