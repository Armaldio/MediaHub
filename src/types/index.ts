import { FormattedDetails } from "../models/models.ts";

export type ServiceCategory = 'streaming' | 'tracking' | 'self-hosted' | 'database' | 'utility';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  websiteUrl: string;
  appUrl: string;
  androidAppId: string;
  deepLinks: DeepLink[];
  color: string;
  category: ServiceCategory;
  isInstalled?: boolean;
  supportsCustomInstances?: boolean;
  customInstances?: CustomServiceInstance[];
}

export interface CustomServiceInstance {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string; // Note: In a real app, never store passwords in plain text
  isDefault?: boolean;
}

export interface DeepLink {
  name: string;
  mediaType: 'movie' | 'tv' | 'all';
  enabled?: (data: FormattedDetails) => boolean;
  url: (data: FormattedDetails, instance?: CustomServiceInstance) => Promise<string> | string;
  customUrlBuilder?: (data: FormattedDetails, instance: CustomServiceInstance) => string;
}