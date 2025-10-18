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

    // Parse request body
    const { action, vehicleId, data } = await req.json();

    if (!action) {
      throw new Error('Action is required');
    }

    let result;

    switch (action) {
      // Vehicle management actions
      case 'get_vehicle_details':
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select(`
            id,
            make,
            model,
            year,
            nickname,
            mileage,
            vin,
            engine_size,
            fuel_type,
            transmission,
            color,
            license_plate,
            purchase_date,
            purchase_price,
            notes,
            image
          `)
          .eq('id', vehicleId)
          .single();

        if (vehicleError) throw vehicleError;
        result = vehicleData;
        break;

      case 'get_vehicle_maintenance':
        // Get maintenance records for vehicle
        const { data: maintenanceData, error: maintenanceError } = await supabase
          .from('maintenance_records')
          .select(`
            id,
            service_type,
            service_date,
            cost,
            notes,
            garage_id,
            service_provider,
            mileage_at_service
          `)
          .eq('vehicle_id', vehicleId)
          .order('service_date', { ascending: false });

        if (maintenanceError) throw maintenanceError;
        result = maintenanceData;
        break;

      case 'get_vehicle_repairs':
        // Get repair records for vehicle
        const { data: repairData, error: repairError } = await supabase
          .from('repair_records')
          .select(`
            id,
            repair_type,
            repair_date,
            cost,
            notes,
            garage_id,
            service_provider,
            mileage_at_repair,
            status
          `)
          .eq('vehicle_id', vehicleId)
          .order('repair_date', { ascending: false });

        if (repairError) throw repairError;
        result = repairData;
        break;

      case 'get_maintenance_plans':
        // Get maintenance plans for vehicle
        const { data: plansData, error: plansError } = await supabase
          .from('maintenance_plans')
          .select(`
            id,
            plan_name,
            service_type,
            frequency_type,
            frequency_value,
            start_date,
            end_date,
            active,
            notes
          `)
          .eq('vehicle_id', vehicleId)
          .order('created_at', { ascending: false });

        if (plansError) throw plansError;
        result = plansData;
        break;

      case 'get_upcoming_schedules':
        // Get upcoming maintenance schedules
        const { data: schedulesData, error: schedulesError } = await supabase
          .from('maintenance_schedules')
          .select(`
            id,
            scheduled_date,
            service_type,
            status,
            notes,
            garage_id,
            service_provider,
            mileage_at_schedule
          `)
          .eq('vehicle_id', vehicleId)
          .eq('status', 'scheduled')
          .gte('scheduled_date', new Date().toISOString().split('T')[0])
          .order('scheduled_date', { ascending: true });

        if (schedulesError) throw schedulesError;
        result = schedulesData;
        break;

      case 'create_maintenance_plan':
        // Create new maintenance plan
        const { data: newPlan, error: planError } = await supabase
          .from('maintenance_plans')
          .insert([
            {
              vehicle_id: vehicleId,
              plan_name: data.plan_name,
              service_type: data.service_type,
              frequency_type: data.frequency_type,
              frequency_value: data.frequency_value,
              start_date: data.start_date,
              end_date: data.end_date,
              active: data.active !== undefined ? data.active : true,
              notes: data.notes,
            }
          ])
          .select()
          .single();

        if (planError) throw planError;
        result = newPlan;
        break;

      case 'create_repair_record':
        // Create new repair record
        const { data: newRepair, error: repairError } = await supabase
          .from('repair_records')
          .insert([
            {
              vehicle_id: vehicleId,
              repair_type: data.repair_type,
              repair_date: data.repair_date,
              cost: data.cost,
              notes: data.notes,
              garage_id: data.garage_id,
              service_provider: data.service_provider,
              mileage_at_repair: data.mileage_at_repair,
              status: data.status || 'completed',
            }
          ])
          .select()
          .single();

        if (repairError) throw repairError;
        result = newRepair;
        break;

      case 'create_maintenance_schedule':
        // Create new maintenance schedule
        const { data: newSchedule, error: scheduleError } = await supabase
          .from('maintenance_schedules')
          .insert([
            {
              vehicle_id: vehicleId,
              scheduled_date: data.scheduled_date,
              service_type: data.service_type,
              status: data.status || 'scheduled',
              notes: data.notes,
              garage_id: data.garage_id,
              service_provider: data.service_provider,
              mileage_at_schedule: data.mileage_at_schedule,
            }
          ])
          .select()
          .single();

        if (scheduleError) throw scheduleError;
        result = newSchedule;
        break;

      case 'update_vehicle':
        // Update vehicle details
        const { data: updatedVehicle, error: updateError } = await supabase
          .from('vehicles')
          .update(data)
          .eq('id', vehicleId)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updatedVehicle;
        break;

      case 'delete_vehicle':
        // Delete vehicle
        const { error: deleteError } = await supabase
          .from('vehicles')
          .delete()
          .eq('id', vehicleId);

        if (deleteError) throw deleteError;
        result = { message: 'Vehicle deleted successfully' };
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