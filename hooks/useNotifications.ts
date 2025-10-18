import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (error && error.code === 'PGRST116') {
            // No notification preferences found, create default ones
            const { data: newNotification, error: insertError } = await supabase
              .from('notifications')
              .insert({
                user_id: session.user.id,
                email_notifications: true,
                push_notifications: true,
                maintenance_reminders: true,
                diagnostic_alerts: true
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('Error creating notification preferences:', insertError);
            } else {
              setNotifications(newNotification);
            }
          } else if (error) {
            console.error('Error fetching notification preferences:', error);
          } else {
            setNotifications(data);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const updateNotificationPreference = async (preference: string, value: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('notifications')
          .update({ [preference]: value })
          .eq('user_id', session.user.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating notification preference:', error);
          return false;
        } else {
          setNotifications(data);
          return true;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return { notifications, loading, updateNotificationPreference };
};