import { supabaseAdmin } from '@/lib/supabase-admin';
import { validate } from '@/lib/_utils/validate';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const createSchema = z.object({
    workspace_id: z.string().uuid(),
    name: z.string().min(1),
    status: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
    budget: z.number().min(0).optional()
});

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const supabase = supabaseAdmin();
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspace_id');

    if (!workspaceId) {
        return NextResponse.json(
            { message: 'workspace_id query param required' },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('workspace_id', workspaceId);

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const supabase = supabaseAdmin();
    const body = await req.json();
    const res = validate(createSchema, body);

    if (!res.success) {
        return res.error;
    }

    const { data, error } = await supabase
        .from('projects')
        .insert(res.data)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
} 