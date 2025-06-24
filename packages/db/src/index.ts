export * from './client';
import { supabaseClient } from './client';
export const createClient = () => supabaseClient;
export * from './project';
export type { Database } from '../types';
