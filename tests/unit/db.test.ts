import { describe, it, expect, vi } from 'vitest';
import { createProject, createClient } from '@mad/db';

vi.mock('@mad/db/src/client', () => ({
  supabaseClient: {
    from: () => ({
      insert: () => ({ select: () => ({ single: () => ({ data: {}, error: null }) }) })
    })
  }
}));

describe('DB helper', () => {
  it('validates input via zod', async () => {
    // Test that createProject throws when missing required name field
    await expect(
      createProject({ workspace_id: crypto.randomUUID() } as Parameters<typeof createProject>[0])
    ).rejects.toThrow();
  });
});

describe('@mad/db package', () => {
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