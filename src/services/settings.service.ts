import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';

export type NotificationPreferences = {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  messages: boolean;
};

export type PrivacySettings = {
  accountVisibility: 'public' | 'private';
  allowDirectMessages: 'everyone' | 'following' | 'nobody';
};

export type UserSettings = {
  id: number;
  notificationPreferences: NotificationPreferences | null;
  privacySettings: PrivacySettings | null;
};

export type UpdateSettingsData = {
  notificationPreferences?: Partial<NotificationPreferences>;
  privacySettings?: Partial<PrivacySettings>;
};

export const settingsService = {
  /**
   * Get user settings (requires authentication)
   */
  async get(token: string): Promise<UserSettings> {
    return apiClient.get<UserSettings>(`${API_ENDPOINTS.users}/me/settings`, {
      token,
      cache: 'no-store',
    });
  },

  /**
   * Update user settings (requires authentication)
   */
  async update(data: UpdateSettingsData, token: string): Promise<UserSettings> {
    return apiClient.patch<UserSettings>(`${API_ENDPOINTS.users}/me/settings`, data, {
      token,
      cache: 'no-store',
    });
  },
};
