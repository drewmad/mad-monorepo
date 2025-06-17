import { supabaseAdmin } from './lib/supabase-admin';
import { validate } from './_utils/validate';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const createSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.enum(['Todo', 'In progress', 'Completed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  assignee: z.string().uuid().nullable().optional(),
  due_date: z.string().datetime().nullable().optional(),
  time_tracked: z.number().min(0).optional()
});

export const config = { runtime: 'edge' };

export default async function handler(req: NextRequest) {
  const supabase = supabaseAdmin();

  switch (req.method) {
    case 'GET': {
      const { searchParams } = new URL(req.url);
      const projectId = searchParams.get('project_id');
      if (!projectId) {
        return NextResponse.json(
          { message: 'project_id query param required' },
          { status: 400 }
        );
      }
      const { data, error } = await supabase.from('tasks').select('*').eq('project_id', projectId);
      if (error) return NextResponse.json({ message: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    case 'POST': {
      const body = await req.json();
      const res = validate(createSchema, body);
      if (!res.success) return res.error;

      const { data, error } = await supabase.from('tasks').insert(res.data).select().single();
      if (error) return NextResponse.json({ message: error.message }, { status: 500 });
      return NextResponse.json(data, { status: 201 });
    }

    default:
      return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
} 