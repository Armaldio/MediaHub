import { FormattedDetails } from "../models/models.ts";

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
  isInstalled?: boolean;
}

export interface DeepLink {
  name: string;
  enabled?: (data: FormattedDetails) => boolean;
  url: (data: FormattedDetails) => Promise<string> | string;
}