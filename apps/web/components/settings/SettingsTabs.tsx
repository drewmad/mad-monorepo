'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, Button, Input, Select, Toggle, Badge, Modal, Toast, SubNav } from '@ui';
import { usePathname, useSearchParams } from 'next/navigation';
import { Shield, CreditCard, AlertTriangle, Settings, Users, Key, Clock, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteWorkspace } from '@/actions/workspace';
import {
  exportWorkspaceData,
  saveIPAllowlist,
  saveLocalizationSettings,
  savePermissionMatrix,
  saveUsageAnalyticsSettings,
} from '@/actions/settings';
import { useWorkspaces } from '@/contexts/AppContext';

export function SettingsTabs() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { currentWorkspace } = useWorkspaces();

  const [settings, setSettings] = useState({
    workspaceName: 'My Workspace',
    workspaceDescription: 'A productive workspace for our team',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/dd/yyyy',
    ipAllowlist: '',
    analyticsEnabled: true,
    exportFormat: 'json',
    permissionMatrix: {} as Record<string, string[]>,
    notifications: {
      email: true,
      push: true,
      mentions: true,
      tasks: false,
    },
    security: {
      twoFactor: false,
      sso: false,
      sessionTimeout: '24',
    },
  });

  const [showDeleteWorkspace, setShowDeleteWorkspace] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') ?? 'general') as
    | 'general'
    | 'roles'
    | 'security'
    | 'billing'
    | 'danger';

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving general settings:', settings);

      // In a real app, this would be an API call to save settings
      // await saveWorkspaceSettings(settings);

      showNotification('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Failed to save settings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (sectionName: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log(`Saving ${sectionName} settings:`, settings);
      showNotification(`${sectionName} settings saved successfully!`);
    } catch (error) {
      console.error(`Failed to save ${sectionName} settings:`, error);
      showNotification(`Failed to save ${sectionName} settings. Please try again.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocalization = async () => {
    if (!currentWorkspace) return;
    setLoading(true);
    try {
      const { error } = await saveLocalizationSettings(currentWorkspace.id, {
        language: settings.language,
        timezone: settings.timezone,
        dateFormat: settings.dateFormat,
      });
      if (error) {
        showNotification(error, 'error');
      } else {
        showNotification('Localization settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save localization settings:', error);
      showNotification('Failed to save localization settings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePermissionMatrix = async (matrix: Record<string, string[]>) => {
    if (!currentWorkspace) return;
    setLoading(true);
    try {
      const { error } = await savePermissionMatrix(currentWorkspace.id, matrix);
      if (error) {
        showNotification(error, 'error');
      } else {
        showNotification('Permission matrix saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save permission matrix:', error);
      showNotification('Failed to save permission matrix. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIPAllowlist = async () => {
    if (!currentWorkspace) return;
    setLoading(true);
    try {
      const ips = settings.ipAllowlist
        .split(',')
        .map(ip => ip.trim())
        .filter(Boolean);
      const { error } = await saveIPAllowlist(currentWorkspace.id, ips);
      if (error) {
        showNotification(error, 'error');
      } else {
        showNotification('IP allowlist saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save IP allowlist:', error);
      showNotification('Failed to save IP allowlist. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnalytics = async () => {
    if (!currentWorkspace) return;
    setLoading(true);
    try {
      const { error } = await saveUsageAnalyticsSettings(
        currentWorkspace.id,
        settings.analyticsEnabled,
      );
      if (error) {
        showNotification(error, 'error');
      } else {
        showNotification('Analytics settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save analytics settings:', error);
      showNotification('Failed to save analytics settings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!currentWorkspace) return;
    setLoading(true);
    try {
      const { url, error } = await exportWorkspaceData(currentWorkspace.id, settings.exportFormat);
      if (error) {
        showNotification(error, 'error');
      } else {
        showNotification('Export started');
        if (url) window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      showNotification('Failed to export data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (deleteConfirmation === 'DELETE' && currentWorkspace) {
      setLoading(true);
      try {
        const { error } = await deleteWorkspace(currentWorkspace.id);

        if (error) {
          showNotification(error, 'error');
        } else {
          showNotification('Workspace deleted successfully!');
          setShowDeleteWorkspace(false);
          setDeleteConfirmation('');
          router.push('/workspace-selection');
        }
      } catch (error) {
        console.error('Failed to delete workspace:', error);
        showNotification('Failed to delete workspace. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const roles = [
    { id: '1', name: 'Owner', permissions: ['all'], members: 1, isDefault: false },
    {
      id: '2',
      name: 'Admin',
      permissions: ['manage_members', 'manage_projects', 'view_analytics'],
      members: 2,
      isDefault: false,
    },
    {
      id: '3',
      name: 'Member',
      permissions: ['create_projects', 'manage_tasks'],
      members: 8,
      isDefault: true,
    },
    { id: '4', name: 'Guest', permissions: ['view_projects'], members: 3, isDefault: false },
  ];

  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workspace Information</h3>
            <div className="space-y-4">
              <Input
                label="Workspace Name"
                value={settings.workspaceName}
                onChange={e => setSettings({ ...settings, workspaceName: e.target.value })}
                placeholder="Enter workspace name"
              />
              <Input
                label="Description"
                value={settings.workspaceDescription}
                onChange={e => setSettings({ ...settings, workspaceDescription: e.target.value })}
                placeholder="Describe your workspace"
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveGeneral} variant="primary" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Localization</h3>
            <div className="space-y-4">
              <Select
                label="Language"
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                ]}
                value={settings.language}
                onChange={e => setSettings({ ...settings, language: e.target.value })}
              />
              <Select
                label="Timezone"
                options={[
                  { value: 'America/New_York', label: 'Eastern Time (ET)' },
                  { value: 'America/Chicago', label: 'Central Time (CT)' },
                  { value: 'America/Denver', label: 'Mountain Time (MT)' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                  { value: 'UTC', label: 'UTC' },
                ]}
                value={settings.timezone}
                onChange={e => setSettings({ ...settings, timezone: e.target.value })}
              />
              <Select
                label="Date Format"
                options={[
                  { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy (US)' },
                  { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy (EU)' },
                  { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd (ISO)' },
                ]}
                value={settings.dateFormat}
                onChange={e => setSettings({ ...settings, dateFormat: e.target.value })}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveLocalization} variant="primary" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Localization'
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
            <div className="space-y-4">
              <Select
                label="Theme"
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'glass', label: 'Glass' },
                  { value: 'system', label: 'System Default' },
                ]}
                value={theme || 'system'}
                onChange={e => {
                  setTheme(e.target.value);
                  showNotification(
                    `Theme changed to ${e.target.value === 'system' ? 'system default' : e.target.value}!`,
                  );
                }}
              />
              <p className="text-sm text-gray-500">
                Choose your preferred theme. Glass theme provides a modern translucent experience.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Bell className="h-5 w-5 inline mr-2" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Toggle
                  enabled={settings.notifications.email}
                  onChange={enabled =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: enabled },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                </div>
                <Toggle
                  enabled={settings.notifications.push}
                  onChange={enabled =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: enabled },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Mentions</h4>
                  <p className="text-sm text-gray-500">Get notified when someone mentions you</p>
                </div>
                <Toggle
                  enabled={settings.notifications.mentions}
                  onChange={enabled =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, mentions: enabled },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Task Updates</h4>
                  <p className="text-sm text-gray-500">
                    Get notified about task assignments and updates
                  </p>
                </div>
                <Toggle
                  enabled={settings.notifications.tasks}
                  onChange={enabled =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, tasks: enabled },
                    })
                  }
                />
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'roles',
      label: 'Roles & Permissions',
      icon: <Users className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Workspace Roles</h3>
              <p className="text-gray-600">Manage roles and permissions for your workspace</p>
            </div>
            <Button variant="primary">Create Role</Button>
          </div>

          <div className="grid gap-6">
            {roles.map(role => (
              <Card key={role.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{role.name}</h4>
                        {role.isDefault && (
                          <Badge variant="default" size="sm">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {role.members} member{role.members !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    {!role.isDefault && role.name !== 'Owner' && (
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Permissions</h5>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map(permission => (
                      <Badge key={permission} variant="default" size="sm">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Permission Matrix</h4>
            <p className="text-gray-600 mb-4">Define granular permissions for each role</p>
            <Button
              onClick={() => handleSavePermissionMatrix(settings.permissionMatrix)}
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Permission Matrix'
              )}
            </Button>
          </Card>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Key className="h-5 w-5 inline mr-2" />
              Authentication
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Toggle
                  enabled={settings.security.twoFactor}
                  onChange={enabled =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactor: enabled },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Single Sign-On (SSO)</h4>
                  <p className="text-sm text-gray-500">Enable SSO for your workspace</p>
                </div>
                <Toggle
                  enabled={settings.security.sso}
                  onChange={enabled =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, sso: enabled },
                    })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Clock className="h-5 w-5 inline mr-2" />
              Session Management
            </h3>
            <div className="space-y-4">
              <Select
                label="Session Timeout"
                options={[
                  { value: '1', label: '1 hour' },
                  { value: '8', label: '8 hours' },
                  { value: '24', label: '24 hours' },
                  { value: '168', label: '1 week' },
                  { value: 'never', label: 'Never' },
                ]}
                value={settings.security.sessionTimeout}
                onChange={e =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: e.target.value },
                  })
                }
              />
              <p className="text-sm text-gray-500">
                Users will be automatically logged out after this period of inactivity
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => handleSaveSection('Security')}
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Security Settings'
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Current Session</h4>
                  <p className="text-sm text-gray-500">Chrome on macOS • Last active now</p>
                </div>
                <Badge variant="success" size="sm">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Mobile Session</h4>
                  <p className="text-sm text-gray-500">Safari on iOS • Last active 2 hours ago</p>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600">
                  Revoke
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">IP Allowlist</h3>
            <Input
              label="Allowed IPs"
              placeholder="Comma separated addresses"
              value={settings.ipAllowlist}
              onChange={e => setSettings({ ...settings, ipAllowlist: e.target.value })}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveIPAllowlist} variant="primary" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save IP Allowlist'
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Analytics</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">Enable tracking of anonymous usage data</p>
              <Toggle
                enabled={settings.analyticsEnabled}
                onChange={enabled => setSettings({ ...settings, analyticsEnabled: enabled })}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveAnalytics} variant="primary" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Analytics'
                )}
              </Button>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'billing',
      label: 'Billing & Subscription',
      icon: <CreditCard className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-gray-900">Pro Plan</h4>
                <p className="text-gray-600">$29 per month • Billed monthly</p>
                <p className="text-sm text-gray-500 mt-1">Next billing date: February 15, 2024</p>
              </div>
              <div className="text-right">
                <Badge variant="success" size="sm" className="mb-2">
                  Active
                </Badge>
                <div>
                  <Button variant="ghost" size="sm" className="mr-2">
                    Change Plan
                  </Button>
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-500">Active Members</div>
                <div className="text-xs text-gray-400">of 25 included</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-500">Projects</div>
                <div className="text-xs text-gray-400">unlimited</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2.1 GB</div>
                <div className="text-sm text-gray-500">Storage Used</div>
                <div className="text-xs text-gray-400">of 100 GB</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">•••• •••• •••• 4242</div>
                  <div className="text-sm text-gray-500">Expires 12/25</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Update
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-900">Pro Plan - January 2024</div>
                  <div className="text-sm text-gray-500">Paid on Jan 15, 2024</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">$29.00</div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Download
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-900">Pro Plan - December 2023</div>
                  <div className="text-sm text-gray-500">Paid on Dec 15, 2023</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">$29.00</div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      icon: <AlertTriangle className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <Card className="p-6 border-red-200 bg-red-50">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
                <p className="text-red-800 mb-4">
                  These actions are irreversible and will permanently delete your workspace and all
                  associated data.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Export Options</h4>
            <p className="text-gray-600 mb-4">
              Download a copy of all your workspace data including projects, tasks, and messages.
            </p>
            <div className="space-y-4">
              <Select
                label="Format"
                options={[
                  { value: 'json', label: 'JSON' },
                  { value: 'csv', label: 'CSV' },
                ]}
                value={settings.exportFormat}
                onChange={e => setSettings({ ...settings, exportFormat: e.target.value })}
              />
              <Button onClick={handleExportData} variant="secondary" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Exporting...</span>
                  </div>
                ) : (
                  'Export Data'
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Transfer Workspace Ownership
            </h4>
            <p className="text-gray-600 mb-4">
              Transfer ownership of this workspace to another member. You will lose admin access.
            </p>
            <Button variant="secondary">Transfer Ownership</Button>
          </Card>

          <Card className="p-6 border-red-200">
            <h4 className="text-lg font-semibold text-red-900 mb-2">Delete Workspace</h4>
            <p className="text-red-800 mb-4">
              Permanently delete this workspace and all its data. This action cannot be undone.
            </p>
            <Button
              variant="ghost"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => setShowDeleteWorkspace(true)}
            >
              Delete Workspace
            </Button>
          </Card>
        </div>
      ),
    },
  ];

  const navItems = tabs.map(t => ({
    href: `${pathname}?tab=${t.id}`,
    label: t.label,
    icon: t.icon,
  }));

  return (
    <div>
      <SubNav items={navItems} className="mb-6" />

      {tab === 'general' && tabs[0].content}

      {tab === 'roles' && tabs[1].content}

      {tab === 'security' && tabs[2].content}

      {tab === 'billing' && tabs[3].content}

      {tab === 'danger' && tabs[4].content}

      {/* Delete Workspace Modal */}
      <Modal
        isOpen={showDeleteWorkspace}
        onClose={() => {
          setShowDeleteWorkspace(false);
          setDeleteConfirmation('');
        }}
        title="Delete Workspace"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-900">This action is irreversible</h4>
              <p className="text-sm text-red-800 mt-1">
                All workspace data, projects, tasks, and messages will be permanently deleted.
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-2">
              To confirm deletion, type <strong>DELETE</strong> in the field below:
            </p>
            <Input
              placeholder="Type DELETE to confirm"
              value={deleteConfirmation}
              onChange={e => setDeleteConfirmation(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowDeleteWorkspace(false)}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteWorkspace}
              disabled={deleteConfirmation !== 'DELETE' || loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                'Delete Workspace'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          id="settings-toast"
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
