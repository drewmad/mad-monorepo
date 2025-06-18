import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateProjectData } from '@/lib/_utils/validate';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createProjectSchema = z.object({
    workspace_id: z.string().uuid(),
    name: z.string().min(1),
    status: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
    budget: z.number().min(0).optional()
});

export async function GET() {
    try {
        const { data: projects, error } = await supabaseAdmin
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ projects });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the request body
        const validation = validateProjectData(body);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Parse with Zod for additional validation
        const parsed = createProjectSchema.parse(body);

        const { data: project, error } = await supabaseAdmin
            .from('projects')
            .insert(parsed)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 