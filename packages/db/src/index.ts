export * from './client';
import { supabaseClient } from './client';
export const createClient = () => supabaseClient;
export * from './project';
export * from './time';
export type { Database } from '../types';
