import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/workspace-selection';

    if (code) {
        const supabase = createClient();

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('Error exchanging code for session:', error);
                return NextResponse.redirect(new URL('/sign-in?error=verification_failed', request.url));
            }

            // Successful verification - redirect to workspace selection or specified next page
            return NextResponse.redirect(new URL(next, request.url));
        } catch (error) {
            console.error('Unexpected error during code exchange:', error);
            return NextResponse.redirect(new URL('/sign-in?error=verification_failed', request.url));
        }
    }

    // No code provided - redirect to sign in
    return NextResponse.redirect(new URL('/sign-in?error=no_code', request.url));
} 