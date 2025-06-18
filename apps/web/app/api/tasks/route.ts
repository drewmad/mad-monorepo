import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateTaskData } from '@/lib/_utils/validate';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createTaskSchema = z.object({
    project_id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    status: z.enum(['Todo', 'In progress', 'Completed']).optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    assignee: z.string().nullable().optional(),
    due_date: z.string().nullable().optional(),
    time_tracked: z.number().min(0).optional()
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('project_id');

        let query = supabaseAdmin.from('tasks').select('*');

        if (projectId) {
            query = query.eq('project_id', projectId);
        }

        const { data: tasks, error } = await query.order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ tasks });
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
        const validation = validateTaskData(body);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Parse with Zod for additional validation
        const parsed = createTaskSchema.parse(body);

        const { data: task, error } = await supabaseAdmin
            .from('tasks')
            .insert(parsed)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ task }, { status: 201 });
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