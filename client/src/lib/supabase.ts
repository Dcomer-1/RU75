import { createClient } from "@supabase/supabase-js";


const supaBaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supaBaseKey = import.meta.env.VITE_SUPABASE_API;

export const supabase = createClient(
    supaBaseUrl,supaBaseKey);

export async function syncUser(user: any){
    if(!user?.id){
	console.error("No userID Exists");
	return null;
    }

    const {data: existingUser , error: fetchError } = await supabase
    .from("Users")
    .select("*")
    .eq('clerk_id', user?.id)
    .single();

    if (fetchError && fetchError.code !== "PGRST116"){
	console.error("Failed Retrieving UserID:", fetchError)
	return null
    }
    
    if (existingUser){
	return existingUser;
    }

    const {data: newUser, error: insertError } = await supabase
    .from('Users')
    .insert([
	{
	clerk_id: user.id,
	email: user.emailAddresses?.[0]?.emailAddress ?? null,
	first_name: user.firstName ?? null,
	last_name: user.lastName ?? null,
	created: user.createdAt 
	    ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
	},
    ])
    .select()
    .single();
    
    if (insertError){
	console.error('Failed To Insert UserID:', insertError)
	return null;
    }
    return newUser;
}


