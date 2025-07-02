import { FormattedDetails } from "@/models/models";

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
}

export interface DeepLink {
  name: string;
  enabled?: (data: FormattedDetails) => boolean;
  url: (data: FormattedDetails) => string;
}

export type ServiceCategory = 
  | 'streaming'
  | 'tracking'
  | 'discovery'
  | 'media_center'
  | 'database'
  | 'social';

export interface ServiceCategoryInfo {
  id: ServiceCategory;
  name: string;
  description: string;
  icon: string;
}