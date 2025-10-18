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
    const { action, vehicleId, scheduleData } = await req.json();

    if (!action) {
      throw new Error('Action is required');
    }

    let result;

    switch (action) {
      case 'create_schedule':
        // Create a new maintenance schedule
        const { data: newSchedule, error: scheduleError } = await supabase
          .from('maintenance_schedules')
          .insert([
            {
              vehicle_id: vehicleId,
              scheduled_date: scheduleData.scheduled_date,
              service_type: scheduleData.service_type,
              status: scheduleData.status || 'scheduled',
              notes: scheduleData.notes,
              garage_id: scheduleData.garage_id,
              service_provider: scheduleData.service_provider,
              mileage_at_schedule: scheduleData.mileage_at_schedule,
            }
          ])
          .select()
          .single();

        if (scheduleError) throw scheduleError;
        result = newSchedule;
        break;

      case 'get_schedules':
        // Get all schedules for a vehicle
        const { data: schedules, error: schedulesError } = await supabase
          .from('maintenance_schedules')
          .select(`
            id,
            created_at,
            scheduled_date,
            service_type,
            status,
            notes,
            garage_id,
            service_provider,
            mileage_at_schedule,
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
          .order('scheduled_date', { ascending: true });

        if (schedulesError) throw schedulesError;
        result = schedules;
        break;

      case 'update_schedule':
        // Update an existing schedule
        const { data: updatedSchedule, error: updateError } = await supabase
          .from('maintenance_schedules')
          .update({
            scheduled_date: scheduleData.scheduled_date,
            service_type: scheduleData.service_type,
            status: scheduleData.status,
            notes: scheduleData.notes,
            garage_id: scheduleData.garage_id,
            service_provider: scheduleData.service_provider,
            mileage_at_schedule: scheduleData.mileage_at_schedule,
          })
          .eq('id', scheduleData.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updatedSchedule;
        break;

      case 'delete_schedule':
        // Delete a schedule
        const { error: deleteError } = await supabase
          .from('maintenance_schedules')
          .delete()
          .eq('id', scheduleData.id);

        if (deleteError) throw deleteError;
        result = { message: 'Schedule deleted successfully' };
        break;

      case 'get_upcoming_schedules':
        // Get upcoming schedules for a user
        const { data: upcomingSchedules, error: upcomingError } = await supabase
          .from('maintenance_schedules')
          .select(`
            id,
            created_at,
            scheduled_date,
            service_type,
            status,
            notes,
            garage_id,
            service_provider,
            mileage_at_schedule,
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
          .eq('status', 'scheduled')
          .gte('scheduled_date', new Date().toISOString().split('T')[0])
          .order('scheduled_date', { ascending: true });

        if (upcomingError) throw upcomingError;
        result = upcomingSchedules;
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