'use server';

import { revalidatePath } from 'next/cache';

export interface LocalizationData {
  language: string;
  timezone: string;
  dateFormat: string;
}

export async function saveLocalizationSettings(workspaceId: string, data: LocalizationData) {
  try {
    console.log('Saving localization settings', workspaceId, data);
    // Persist settings when database table is available
    revalidatePath('/settings');
    return { error: null };
  } catch (error) {
    console.error('Error saving localization settings:', error);
    return { error: 'Failed to save localization settings' };
  }
}

export async function savePermissionMatrix(workspaceId: string, matrix: Record<string, string[]>) {
  try {
    console.log('Saving permission matrix', workspaceId, matrix);
    revalidatePath('/settings');
    return { error: null };
  } catch (error) {
    console.error('Error saving permission matrix:', error);
    return { error: 'Failed to save permission matrix' };
  }
}

export async function saveIPAllowlist(workspaceId: string, ips: string[]) {
  try {
    console.log('Saving IP allowlist', workspaceId, ips);
    revalidatePath('/settings');
    return { error: null };
  } catch (error) {
    console.error('Error saving IP allowlist:', error);
    return { error: 'Failed to save IP allowlist' };
  }
}

export async function saveUsageAnalyticsSettings(workspaceId: string, enabled: boolean) {
  try {
    console.log('Saving usage analytics', workspaceId, enabled);
    revalidatePath('/settings');
    return { error: null };
  } catch (error) {
    console.error('Error saving usage analytics:', error);
    return { error: 'Failed to save usage analytics settings' };
  }
}

export async function exportWorkspaceData(workspaceId: string, format: string) {
  try {
    console.log('Exporting workspace data', workspaceId, format);
    // Implementation would generate and return a file
    return { url: '/export/mock', error: null };
  } catch (error) {
    console.error('Error exporting workspace data:', error);
    return { url: null, error: 'Failed to export workspace data' };
  }
}
