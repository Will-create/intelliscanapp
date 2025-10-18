import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the request body
    const { action, vehicleId, planData } = await req.json();

    if (!action) {
      throw new Error('Action is required');
    }

    let result;

    switch (action) {
      case 'create_plan':
        // Create a new maintenance plan
        const { data: newPlan, error: planError } = await supabase
          .from('maintenance_plans')
          .insert([
            {
              vehicle_id: vehicleId,
              plan_name: planData.plan_name,
              service_type: planData.service_type,
              frequency_type: planData.frequency_type,
              frequency_value: planData.frequency_value,
              start_date: planData.start_date,
              end_date: planData.end_date,
              active: planData.active !== undefined ? planData.active : true,
              notes: planData.notes,
              created_by: planData.created_by,
            }
          ])
          .select()
          .single();

        if (planError) throw planError;
        result = newPlan;
        break;

      case 'get_plans':
        // Get all plans for a vehicle
        const { data: plans, error: plansError } = await supabase
          .from('maintenance_plans')
          .select(`
            id,
            created_at,
            plan_name,
            service_type,
            frequency_type,
            frequency_value,
            start_date,
            end_date,
            active,
            notes,
            created_by,
            vehicles:vehicles!vehicle_id (
              id,
              make,
              model,
              year,
              nickname
            )
          `)
          .eq('vehicle_id', vehicleId)
          .order('created_at', { ascending: false });

        if (plansError) throw plansError;
        result = plans;
        break;

      case 'update_plan':
        // Update an existing maintenance plan
        const { data: updatedPlan, error: updateError } = await supabase
          .from('maintenance_plans')
          .update({
            plan_name: planData.plan_name,
            service_type: planData.service_type,
            frequency_type: planData.frequency_type,
            frequency_value: planData.frequency_value,
            start_date: planData.start_date,
            end_date: planData.end_date,
            active: planData.active,
            notes: planData.notes,
          })
          .eq('id', planData.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updatedPlan;
        break;

      case 'delete_plan':
        // Delete a maintenance plan
        const { error: deleteError } = await supabase
          .from('maintenance_plans')
          .delete()
          .eq('id', planData.id);

        if (deleteError) throw deleteError;
        result = { message: 'Maintenance plan deleted successfully' };
        break;

      case 'get_active_plans':
        // Get all active plans for a vehicle
        const { data: activePlans, error: activePlansError } = await supabase
          .from('maintenance_plans')
          .select(`
            id,
            created_at,
            plan_name,
            service_type,
            frequency_type,
            frequency_value,
            start_date,
            end_date,
            active,
            notes,
            vehicles:vehicles!vehicle_id (
              id,
              make,
              model,
              year,
              nickname
            )
          `)
          .eq('vehicle_id', vehicleId)
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (activePlansError) throw activePlansError;
        result = activePlans;
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});