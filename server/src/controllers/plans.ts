import { supabase } from "../util/supabase";

const createPlan = async (days:string, times:string) => {
    const {data, error} = await supabase.from("plans").insert([{
        days: days,
        times: times
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

const getPlan = async (id:number) => {
    const { data, error } = await supabase
    .from('plans').select('*').eq('id', id)

    if (error) {
        return {
          status: 500,
          error: error.message,
        };
    }
      
    if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'plan not found',
        };
    }
    
    return {
        status: 200,
        data: data,
    };
};

const updatePlan = async (id:number, days:string, times:string) => {
    const {data, error} = await supabase.from("plans").update([{
        days: days,
        times: times,
    }]).eq('id', id)
    .select();

    if (error) {
        return {
            status:500,
            error:error.message
        }
    }
    if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'plan not found',
        };
    }
    return {
        status:200,
        data:data
    }
};

const deletePlan = async (id:number) => {
    const {data, error} = await supabase.from("plans").delete().eq('id', id).select();
    if (error) {
        return {
          status: 500,
          error: error.message,
        };
      }
      
      if (!data || data.length == 0) {
        return {
          status: 404,
          error: 'plan not found',
        };
      }
      return {
        status: 200,
        message: 'plan deleted',
      }
};

export { createPlan, getPlan, updatePlan, deletePlan };