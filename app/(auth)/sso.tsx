import { Redirect } from 'expo-router';
import { exchangeCodeForSession } from '@/utils/supabase';
import { useLocalSearchParams } from 'expo-router';

const SSOCallback = () => {
  const { code } = useLocalSearchParams();

  if (code) {
    exchangeCodeForSession(code as string);
  }

  return <Redirect href="/(tabs)" />;
};

export default SSOCallback;
