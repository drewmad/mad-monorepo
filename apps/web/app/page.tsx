import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export default async function RootPage() {
    const supabase = createClient();

    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            // User is not authenticated, redirect to sign-in
            redirect('/sign-in');
        } else {
            // User is authenticated, redirect to workspace dashboard
            redirect('/dashboards/workspace');
        }
    } catch (error) {
        // If there's any error, redirect to sign-in as fallback
        redirect('/sign-in');
    }
} 