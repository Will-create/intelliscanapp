import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Define the structure of the expected request body
interface VinPayload {
  vin: string;
}

// Define the structure of the NHTSA API response we care about
interface NhtsaVariable {
  Variable: string;
  Value: string | null;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Ensure the user is authenticated
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { vin }: VinPayload = await req.json();
    if (!vin || vin.length < 11) {
      // Basic VIN validation
      throw new Error('A valid VIN is required.');
    }

    // Call the NHTSA API for VIN decoding
    const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;
    const response = await fetch(nhtsaUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch data from NHTSA API.');
    }

    const data = await response.json();
    const results = data.Results as NhtsaVariable[];

    // Helper to find a specific value from the results array
    const findValue = (variableName: string) => {
      const item = results.find((v) => v.Variable === variableName);
      return item ? item.Value : null;
    };

    const decodedVin = {
      make: findValue('Make'),
      model: findValue('Model'),
      year: findValue('Model Year'),
    };

    return new Response(JSON.stringify(decodedVin), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
