import { createProject } from '@db/project';

vi.mock('@db/src/client', () => ({
  supabaseClient: {
    from: () => ({
      insert: () => ({ select: () => ({ single: () => ({ data: {}, error: null }) }) })
    })
  }
}));

describe('DB helper', () => {
  it('validates input via zod', async () => {
    // missing name should throw
    // @ts-expect-error
    await expect(createProject({ workspace_id: crypto.randomUUID() })).rejects.toThrow();
  });
}); 