import  { supabase } from "../util/supabase";
const signup = async (email:string, password:string, username:string) => {
    // console.info(email, password, username);
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
        email: email,
        username: username
    }]).select();
    if (userError) {
        return {
            status:500,
            error:userError.message
        }
    }
    return {
        status:200,
        data:data.session?.access_token
    }
}

const login = async (email:string, password:string) => {
    const {data, error} = await supabase.auth.signInWithPassword({
        email, password
    });
    if (error) {
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

export { signup, login };
