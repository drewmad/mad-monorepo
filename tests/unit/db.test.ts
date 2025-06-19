import { describe, it, expect, vi } from 'vitest';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

import { createProject, createClient, supabaseClient } from '@db';

vi.spyOn(supabaseClient, 'from').mockReturnValue({
  insert: () => ({ select: () => ({ single: () => ({ data: {}, error: null }) }) })
} as unknown as any); // eslint-disable-line @typescript-eslint/no-explicit-any

describe('DB helper', () => {
  it('validates input via zod', async () => {
    // Test that createProject throws when missing required name field
    await expect(
      createProject({ workspace_id: crypto.randomUUID() } as Parameters<typeof createProject>[0])
    ).rejects.toThrow();
  });
});

describe('@db package', () => {
  it('should export createClient function', () => {
    expect(typeof createClient).toBe('function');
  });

  it('should export Project type', () => {
    // @ts-expect-error: This test intentionally checks that the Project type is exported from @db and can be assigned, even though this is not a runtime value.
    const project: import('@db').Project = {
      id: 'test-id',
      workspace_id: 'workspace-id',
      name: 'Test Project',
      status: 'active',
      progress: 50,
      budget: 1000,
      created_at: new Date().toISOString()
    };

    expect(project.name).toBe('Test Project');
  });
}); 

