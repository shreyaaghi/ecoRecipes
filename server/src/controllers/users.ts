import  { supabase } from "../util/supabase";

const getUser = async  (userId : string) => {
    const {data, error} = await supabase.from("users").select().eq("id", userId).single();

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

export { getUser };