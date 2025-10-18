import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }
  try {
    // Ensure the user is authenticated
    const authHeader = req.headers.get('Authorization');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      },
    );
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    const { code, lang } = await req.json();
    if (!code) {
      throw new Error('Diagnostic code is required.');
    }
    // Fetch explanation from OpenAI
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    const response = await fetch(
      'https://api.deepinfra.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert mechanic. Explain the following automotive diagnostic trouble code to a car owner in simple, clear, and concise terms. Provide a brief explanation of the problem, common causes, and general advice on whether it is critical to fix immediately.',
            },
            {
              role: 'user',
              content: `Explain the code: ${code}. Answer in ${lang || 'en'}`,
            },
          ],
          max_tokens: 200,
        }),
      },
    );
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API request failed: ${errorBody}`);
    }
    const openAIResult = await response.json();
    const explanation = openAIResult.choices[0].message.content.trim();
    return new Response(
      JSON.stringify({
        explanation,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    );
  }
});
