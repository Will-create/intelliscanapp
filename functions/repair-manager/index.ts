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
    const { action, vehicleId, repairData } = await req.json();

    if (!action) {
      throw new Error('Action is required');
    }

    let result;

    switch (action) {
      case 'create_repair':
        // Create a new repair record
        const { data: newRepair, error: repairError } = await supabase
          .from('repair_records')
          .insert([
            {
              vehicle_id: vehicleId,
              repair_type: repairData.repair_type,
              repair_date: repairData.repair_date,
              cost: repairData.cost,
              notes: repairData.notes,
              garage_id: repairData.garage_id,
              service_provider: repairData.service_provider,
              mileage_at_repair: repairData.mileage_at_repair,
              status: repairData.status || 'completed',
            }
          ])
          .select()
          .single();

        if (repairError) throw repairError;
        result = newRepair;
        break;

      case 'get_repairs':
        // Get all repairs for a vehicle
        const { data: repairs, error: repairsError } = await supabase
          .from('repair_records')
          .select(`
            id,
            created_at,
            repair_type,
            repair_date,
            cost,
            notes,
            garage_id,
            service_provider,
            mileage_at_repair,
            status,
            vehicles:vehicles!vehicle_id (
              id,
              make,
              model,
              year,
              nickname
            ),
            garages:garages!garage_id (
              id,
              name,
              address
            )
          `)
          .eq('vehicle_id', vehicleId)
          .order('repair_date', { ascending: false });

        if (repairsError) throw repairsError;
        result = repairs;
        break;

      case 'update_repair':
        // Update an existing repair record
        const { data: updatedRepair, error: updateError } = await supabase
          .from('repair_records')
          .update({
            repair_type: repairData.repair_type,
            repair_date: repairData.repair_date,
            cost: repairData.cost,
            notes: repairData.notes,
            garage_id: repairData.garage_id,
            service_provider: repairData.service_provider,
            mileage_at_repair: repairData.mileage_at_repair,
            status: repairData.status,
          })
          .eq('id', repairData.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updatedRepair;
        break;

      case 'delete_repair':
        // Delete a repair record
        const { error: deleteError } = await supabase
          .from('repair_records')
          .delete()
          .eq('id', repairData.id);

        if (deleteError) throw deleteError;
        result = { message: 'Repair record deleted successfully' };
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