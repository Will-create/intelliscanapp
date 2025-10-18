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
    const { action, vehicleId, reportData, userId } = await req.json();

    if (!action) {
      throw new Error('Action is required');
    }

    let result;

    switch (action) {
      case 'save_diagnostic_report':
        // Save diagnostic report to database
        const { data: newReport, error: reportError } = await supabase
          .from('diagnostic_reports')
          .insert([
            {
              vehicle_id: vehicleId,
              user_id: userId,
              report_date: new Date().toISOString(),
              status: reportData.healthScore >= 80 ? 'Good' : reportData.healthScore >= 60 ? 'Warning' : 'Critical',
              report_data: reportData,
              notes: 'Diagnostic scan completed',
            }
          ])
          .select()
          .single();

        if (reportError) throw reportError;
        result = newReport;
        break;

      case 'get_recent_reports':
        // Get recent diagnostic reports for vehicle
        const { data: reportsData, error: reportsError } = await supabase
          .from('diagnostic_reports')
          .select(`
            id,
            created_at,
            report_date,
            status,
            report_data,
            notes
          `)
          .eq('vehicle_id', vehicleId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (reportsError) throw reportsError;
        result = reportsData;
        break;

      case 'get_report_details':
        // Get specific diagnostic report
        const { data: reportDetails, error: detailsError } = await supabase
          .from('diagnostic_reports')
          .select(`
            id,
            created_at,
            report_date,
            status,
            report_data,
            notes
          `)
          .eq('id', reportData.reportId)
          .single();

        if (detailsError) throw detailsError;
        result = reportDetails;
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