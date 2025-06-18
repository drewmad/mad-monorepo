import { z } from 'zod';
import { NextRequest } from 'next/server';

// Zod-based validation function
export function validateWithZod<Schema extends z.ZodTypeAny>(
    data: unknown,
    schema: Schema
): { success: true; data: z.infer<Schema> } | { success: false; error: string } {
    try {
        const parsed = schema.parse(data);
        return { success: true, data: parsed };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0]?.message || 'Validation failed' };
        }
        return { success: false, error: 'Unknown validation error' };
    }
}

// Basic request validation function
export function validateRequest(request: NextRequest) {
    const contentType = request.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
        return {
            isValid: false,
            error: 'Content-Type must be application/json'
        };
    }

    return {
        isValid: true,
        error: null
    };
}

export function validateProjectData(data: Record<string, unknown>) {
    if (!data.name || typeof data.name !== 'string') {
        return {
            isValid: false,
            error: 'Project name is required and must be a string'
        };
    }

    return {
        isValid: true,
        error: null
    };
}

export function validateTaskData(data: Record<string, unknown>) {
    if (!data.title || typeof data.title !== 'string') {
        return {
            isValid: false,
            error: 'Task title is required and must be a string'
        };
    }

    if (!data.project_id || typeof data.project_id !== 'string') {
        return {
            isValid: false,
            error: 'Project ID is required and must be a string'
        };
    }

    return {
        isValid: true,
        error: null
    };
}

// Alias for backward compatibility
export const validate = validateRequest; 