// Template type definitions for course design templates

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';

export type TemplateCategory = 
  | 'business' 
  | 'education' 
  | 'creative' 
  | 'professional' 
  | 'minimal' 
  | 'elegant';

export interface TemplateFonts {
  heading: string;
  body: string;
  accent: string;
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TemplateClipArt {
  icons: string[];
  decorations: string[];
  borders: string[];
}

export interface TemplateLayout {
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  headerHeight: number;
  footerHeight: number;
  columns: number;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  category: TemplateCategory;
  tier: SubscriptionTier;
  thumbnail: string | null;
  fonts: TemplateFonts;
  colors: TemplateColors;
  clipArt: TemplateClipArt;
  layout: TemplateLayout;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateWithAccess extends Template {
  hasAccess: boolean;
  requiresUpgrade: boolean;
  upgradeToTier?: SubscriptionTier;
}
