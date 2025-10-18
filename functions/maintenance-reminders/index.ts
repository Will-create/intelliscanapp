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

    // 1. Fetch vehicles with owner email + their maintenance data
    const { data: vehicles, error } = await supabase.from('vehicles').select(`
        id,
        nickname,
        mileage,
        profiles:profiles!vehicles_profile_id_fkey (
          id,
          email
        ),
        maintenance_records:maintenance_records!vehicles_id_fkey (
          service_date,
          service_type,
          mileage_at_service
        ),
        maintenance_schedules:maintenance_schedules!vehicle_id (
          scheduled_date,
          service_type,
          status
        ),
        maintenance_plans:maintenance_plans!vehicle_id (
          plan_name,
          service_type,
          frequency_type,
          frequency_value,
          start_date
        )
      `);

    if (error) throw error;
    if (!vehicles || vehicles.length === 0) {
      return new Response(JSON.stringify({ reminders: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const remindersToSend: any[] = [];
    const currentDate = new Date();

    for (const vehicle of vehicles) {
      // Check for upcoming scheduled maintenance
      const upcomingSchedules = vehicle.maintenance_schedules?.filter(
        (s) => s.status === 'scheduled' && new Date(s.scheduled_date) <= new Date(currentDate.setDate(currentDate.getDate() + 7))
      );

      if (upcomingSchedules && upcomingSchedules.length > 0) {
        for (const schedule of upcomingSchedules) {
          remindersToSend.push({
            vehicle_id: vehicle.id,
            vehicle_nickname: vehicle.nickname,
            owner_email: vehicle.profiles?.email ?? null,
            reminder_type: 'upcoming_schedule',
            service_type: schedule.service_type,
            scheduled_date: schedule.scheduled_date,
            message: `Your ${vehicle.nickname} has upcoming ${schedule.service_type} scheduled for ${schedule.scheduled_date}.`,
          });
        }
      }

      // Check for overdue maintenance
      const overdueSchedules = vehicle.maintenance_schedules?.filter(
        (s) => s.status === 'scheduled' && new Date(s.scheduled_date) < new Date()
      );

      if (overdueSchedules && overdueSchedules.length > 0) {
        for (const schedule of overdueSchedules) {
          remindersToSend.push({
            vehicle_id: vehicle.id,
            vehicle_nickname: vehicle.nickname,
            owner_email: vehicle.profiles?.email ?? null,
            reminder_type: 'overdue_schedule',
            service_type: schedule.service_type,
            scheduled_date: schedule.scheduled_date,
            message: `Your ${vehicle.nickname} is overdue for ${schedule.service_type} scheduled for ${schedule.scheduled_date}.`,
          });
        }
      }

      // Check for maintenance plan reminders
      const activePlans = vehicle.maintenance_plans?.filter(
        (p) => p.active === true
      );

      if (activePlans && activePlans.length > 0) {
        for (const plan of activePlans) {
          // Check if this plan should trigger a reminder based on frequency
          const lastRecord = vehicle.maintenance_records?.find(
            (r) => r.service_type === plan.service_type
          );

          if (!lastRecord) {
            // First time for this service type
            remindersToSend.push({
              vehicle_id: vehicle.id,
              vehicle_nickname: vehicle.nickname,
              owner_email: vehicle.profiles?.email ?? null,
              reminder_type: 'plan_first_service',
              plan_name: plan.plan_name,
              service_type: plan.service_type,
              message: `Your ${vehicle.nickname} has a maintenance plan "${plan.plan_name}" for ${plan.service_type}. Consider scheduling it now.`,
            });
          } else {
            // Check if it's time for the next service based on plan frequency
            const lastServiceDate = new Date(lastRecord.service_date);
            const now = new Date();
            let shouldRemind = false;
            let reminderMessage = '';

            if (plan.frequency_type === 'days') {
              const daysSinceLast = Math.floor((now.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24));
              shouldRemind = daysSinceLast >= plan.frequency_value;
              if (shouldRemind) {
                reminderMessage = `Your ${vehicle.nickname} is due for ${plan.service_type} based on plan "${plan.plan_name}". Last service was ${lastServiceDate.toDateString()}.`;
              }
            } else if (plan.frequency_type === 'months') {
              const monthsSinceLast = (now.getFullYear() - lastServiceDate.getFullYear()) * 12 + 
                (now.getMonth() - lastServiceDate.getMonth());
              shouldRemind = monthsSinceLast >= plan.frequency_value;
              if (shouldRemind) {
                reminderMessage = `Your ${vehicle.nickname} is due for ${plan.service_type} based on plan "${plan.plan_name}". Last service was ${lastServiceDate.toDateString()}.`;
              }
            } else if (plan.frequency_type === 'mileage') {
              const mileageSinceLast = vehicle.mileage - lastRecord.mileage_at_service;
              shouldRemind = mileageSinceLast >= plan.frequency_value;
              if (shouldRemind) {
                reminderMessage = `Your ${vehicle.nickname} is due for ${plan.service_type} based on plan "${plan.plan_name}". Last service was at ${lastRecord.mileage_at_service} miles.`;
              }
            }

            if (shouldRemind) {
              remindersToSend.push({
                vehicle_id: vehicle.id,
                vehicle_nickname: vehicle.nickname,
                owner_email: vehicle.profiles?.email ?? null,
                reminder_type: 'plan_reminder',
                plan_name: plan.plan_name,
                service_type: plan.service_type,
                message: reminderMessage,
              });
            }
          }
        }
      }
    }

    // TODO: Replace this with actual email/push notifications
    // e.g. call Supabase function / external email service

    return new Response(JSON.stringify({ reminders: remindersToSend }), {
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
