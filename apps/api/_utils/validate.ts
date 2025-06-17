import { z } from 'zod';
import type { NextResponse } from 'next/server';

export function validate<Schema extends z.ZodTypeAny>(
  schema: Schema,
  data: unknown
): { success: true; data: z.infer<Schema> } | { success: false; error: NextResponse } {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: new Response(
        JSON.stringify({ message: 'Validation error', issues: parsed.error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ) as unknown as NextResponse
    };
  }
  return { success: true, data: parsed.data };
} 