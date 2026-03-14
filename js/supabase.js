/* ================================================
   FoodBridge – Supabase Configuration
   ================================================ */

// Initialize the Supabase client
// Note: 'supabase' in the first line below refers to the global object from the CDN
const supabase = window.supabase ? window.supabase.createClient(FBConfig.SUPABASE_URL, FBConfig.SUPABASE_KEY) : null;

console.log("Supabase Client Initialized:", !!supabase);
