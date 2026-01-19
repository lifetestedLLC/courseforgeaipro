import type { TemplateFonts, TemplateColors, TemplateClipArt, TemplateLayout, SubscriptionTier, TemplateCategory } from '@/types/template';
import { hasAccessToTier } from '@/lib/subscription';

export interface TemplateConfig {
  name: string;
  description: string;
  category: TemplateCategory;
  tier: SubscriptionTier;
  thumbnail: string;
  fonts: TemplateFonts;
  colors: TemplateColors;
  clipArt: TemplateClipArt;
  layout: TemplateLayout;
}

// Default layout configuration
const defaultLayout: TemplateLayout = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: { top: 72, right: 72, bottom: 72, left: 72 },
  headerHeight: 50,
  footerHeight: 50,
  columns: 1,
};

export const TEMPLATE_CONFIGS: TemplateConfig[] = [
  // FREE TIER TEMPLATES
  {
    name: 'Simple & Clean',
    description: 'A minimalist template perfect for straightforward content',
    category: 'minimal',
    tier: 'free',
    thumbnail: '/templates/simple-clean.png',
    fonts: {
      heading: 'Arial',
      body: 'Arial',
      accent: 'Arial',
    },
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#999999',
      background: '#FFFFFF',
      text: '#333333',
    },
    clipArt: {
      icons: ['📚', '✏️', '📖', '🎓'],
      decorations: [],
      borders: [],
    },
    layout: defaultLayout,
  },
  {
    name: 'Basic Professional',
    description: 'A straightforward professional template',
    category: 'professional',
    tier: 'free',
    thumbnail: '/templates/basic-professional.png',
    fonts: {
      heading: 'Times New Roman',
      body: 'Times New Roman',
      accent: 'Times New Roman',
    },
    colors: {
      primary: '#003366',
      secondary: '#336699',
      accent: '#6699CC',
      background: '#FFFFFF',
      text: '#000000',
    },
    clipArt: {
      icons: ['📋', '💼', '📊', '🎯'],
      decorations: [],
      borders: [],
    },
    layout: defaultLayout,
  },

  // STARTER TIER TEMPLATES
  {
    name: 'Modern Business',
    description: 'Contemporary design with clean lines and professional appeal',
    category: 'business',
    tier: 'starter',
    thumbnail: '/templates/modern-business.png',
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans',
      accent: 'Montserrat',
    },
    colors: {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#3498DB',
      background: '#ECF0F1',
      text: '#2C3E50',
    },
    clipArt: {
      icons: ['💡', '📈', '🎯', '💼', '🚀', '⚡'],
      decorations: ['line-accent', 'corner-flourish'],
      borders: ['simple-line', 'double-line'],
    },
    layout: defaultLayout,
  },
  {
    name: 'Educational Classic',
    description: 'Warm and inviting design perfect for learning materials',
    category: 'education',
    tier: 'starter',
    thumbnail: '/templates/educational-classic.png',
    fonts: {
      heading: 'Roboto Slab',
      body: 'Roboto',
      accent: 'Roboto Slab',
    },
    colors: {
      primary: '#E67E22',
      secondary: '#D35400',
      accent: '#F39C12',
      background: '#FDF6E3',
      text: '#34495E',
    },
    clipArt: {
      icons: ['📚', '🎓', '✨', '🌟', '📝', '🔍', '💭'],
      decorations: ['book-corner', 'ribbon-accent'],
      borders: ['study-border', 'notebook-line'],
    },
    layout: defaultLayout,
  },
  {
    name: 'Creative Spark',
    description: 'Bold and colorful template for creative content',
    category: 'creative',
    tier: 'starter',
    thumbnail: '/templates/creative-spark.png',
    fonts: {
      heading: 'Poppins',
      body: 'Lato',
      accent: 'Poppins',
    },
    colors: {
      primary: '#9B59B6',
      secondary: '#8E44AD',
      accent: '#E74C3C',
      background: '#F8F9FA',
      text: '#2C3E50',
    },
    clipArt: {
      icons: ['🎨', '✨', '🌈', '💫', '🎭', '🖌️', '🎪'],
      decorations: ['paint-splash', 'artistic-swirl'],
      borders: ['creative-frame', 'artistic-border'],
    },
    layout: defaultLayout,
  },

  // PROFESSIONAL TIER TEMPLATES
  {
    name: 'Executive Premium',
    description: 'Sophisticated design for high-end professional content',
    category: 'business',
    tier: 'professional',
    thumbnail: '/templates/executive-premium.png',
    fonts: {
      heading: 'Playfair Display',
      body: 'Source Sans Pro',
      accent: 'Playfair Display',
    },
    colors: {
      primary: '#1A1A2E',
      secondary: '#16213E',
      accent: '#0F3460',
      background: '#FFFFFF',
      text: '#1A1A2E',
    },
    clipArt: {
      icons: ['💎', '🏆', '👔', '📊', '💼', '🎯', '⭐', '🔑'],
      decorations: ['gold-accent', 'premium-divider', 'luxury-flourish'],
      borders: ['elegant-frame', 'gold-border', 'premium-line'],
    },
    layout: {
      ...defaultLayout,
      margins: { top: 80, right: 80, bottom: 80, left: 80 },
    },
  },
  {
    name: 'Elegant Scholar',
    description: 'Refined academic design with classical elements',
    category: 'education',
    tier: 'professional',
    thumbnail: '/templates/elegant-scholar.png',
    fonts: {
      heading: 'Merriweather',
      body: 'Lora',
      accent: 'Merriweather',
    },
    colors: {
      primary: '#5D4E37',
      secondary: '#8B7355',
      accent: '#CD853F',
      background: '#FAF8F3',
      text: '#3E2723',
    },
    clipArt: {
      icons: ['🎓', '📜', '🏛️', '📖', '🔖', '⚖️', '🌿', '🕊️'],
      decorations: ['classical-ornament', 'laurel-wreath', 'vintage-flourish'],
      borders: ['academic-frame', 'manuscript-border', 'scroll-edge'],
    },
    layout: {
      ...defaultLayout,
      margins: { top: 90, right: 80, bottom: 90, left: 80 },
    },
  },
  {
    name: 'Artistic Vision',
    description: 'Premium creative template with artistic flair',
    category: 'creative',
    tier: 'professional',
    thumbnail: '/templates/artistic-vision.png',
    fonts: {
      heading: 'Abril Fatface',
      body: 'Raleway',
      accent: 'Abril Fatface',
    },
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#F7FFF7',
      text: '#2D3142',
    },
    clipArt: {
      icons: ['🎨', '🖼️', '✨', '🌟', '💫', '🎭', '🦋', '🌺'],
      decorations: ['watercolor-splash', 'artistic-frame', 'creative-burst'],
      borders: ['painted-edge', 'artistic-pattern', 'creative-ribbon'],
    },
    layout: {
      ...defaultLayout,
      columns: 2,
    },
  },
  {
    name: 'Minimalist Pro',
    description: 'Ultra-clean design with maximum impact',
    category: 'minimal',
    tier: 'professional',
    thumbnail: '/templates/minimalist-pro.png',
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      accent: 'Inter',
    },
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#0066FF',
      background: '#FFFFFF',
      text: '#1A1A1A',
    },
    clipArt: {
      icons: ['◆', '●', '■', '▲', '→', '✓'],
      decorations: ['minimal-line', 'geometric-accent'],
      borders: ['thin-line', 'minimal-frame'],
    },
    layout: {
      ...defaultLayout,
      margins: { top: 100, right: 100, bottom: 100, left: 100 },
    },
  },

  // ENTERPRISE TIER TEMPLATES
  {
    name: 'Corporate Elite',
    description: 'Ultra-premium template for corporate excellence',
    category: 'business',
    tier: 'enterprise',
    thumbnail: '/templates/corporate-elite.png',
    fonts: {
      heading: 'GT America',
      body: 'Proxima Nova',
      accent: 'GT America',
    },
    colors: {
      primary: '#0A192F',
      secondary: '#172A45',
      accent: '#64FFDA',
      background: '#FFFFFF',
      text: '#0A192F',
    },
    clipArt: {
      icons: ['💎', '🏆', '👑', '⚡', '🚀', '🎯', '💫', '🔱', '🌟'],
      decorations: ['platinum-accent', 'luxury-divider', 'premium-flourish', 'elite-corner'],
      borders: ['luxury-frame', 'platinum-border', 'executive-line', 'prestige-edge'],
    },
    layout: {
      ...defaultLayout,
      margins: { top: 100, right: 100, bottom: 100, left: 100 },
      headerHeight: 80,
      footerHeight: 60,
    },
  },
  {
    name: 'Masterclass Premium',
    description: 'Top-tier educational design for premium courses',
    category: 'education',
    tier: 'enterprise',
    thumbnail: '/templates/masterclass-premium.png',
    fonts: {
      heading: 'Canela',
      body: 'Circular',
      accent: 'Canela',
    },
    colors: {
      primary: '#2B2D42',
      secondary: '#8D99AE',
      accent: '#EF233C',
      background: '#EDF2F4',
      text: '#2B2D42',
    },
    clipArt: {
      icons: ['🎓', '🏆', '⭐', '💡', '🔬', '🌍', '📚', '🎯', '🔮'],
      decorations: ['premium-badge', 'laurel-gold', 'masterclass-seal', 'excellence-ribbon'],
      borders: ['prestige-frame', 'academic-elite', 'scholar-border', 'master-edge'],
    },
    layout: {
      ...defaultLayout,
      margins: { top: 100, right: 90, bottom: 100, left: 90 },
      columns: 2,
    },
  },
  {
    name: "Designer's Choice",
    description: 'Exclusive high-end creative template',
    category: 'creative',
    tier: 'enterprise',
    thumbnail: '/templates/designers-choice.png',
    fonts: {
      heading: 'Freight Display',
      body: 'Avenir Next',
      accent: 'Freight Display',
    },
    colors: {
      primary: '#6C5CE7',
      secondary: '#A29BFE',
      accent: '#FD79A8',
      background: '#FDFDFD',
      text: '#2D3436',
    },
    clipArt: {
      icons: ['🎨', '✨', '🌟', '💎', '🦋', '🌸', '🎭', '🖼️', '👑'],
      decorations: ['designer-flourish', 'artistic-elite', 'creative-crown', 'premium-splash'],
      borders: ['designer-frame', 'artistic-premium', 'creative-elite', 'master-artist-border'],
    },
    layout: {
      ...defaultLayout,
      margins: { top: 90, right: 90, bottom: 90, left: 90 },
      columns: 2,
    },
  },
  {
    name: 'Ultimate Elegance',
    description: 'The pinnacle of sophisticated design',
    category: 'elegant',
    tier: 'enterprise',
    thumbnail: '/templates/ultimate-elegance.png',
    fonts: {
      heading: 'Didot',
      body: 'Garamond',
      accent: 'Didot',
    },
    colors: {
      primary: '#1C1C1C',
      secondary: '#4A4A4A',
      accent: '#D4AF37',
      background: '#FAFAFA',
      text: '#1C1C1C',
    },
    clipArt: {
      icons: ['💎', '👑', '🏆', '⚜️', '🌟', '✨', '🦢', '🎩', '🥂'],
      decorations: ['royal-ornament', 'gold-filigree', 'elegant-swirl', 'luxury-crest'],
      borders: ['royal-frame', 'gold-elegant', 'prestige-border', 'ultimate-edge'],
    },
    layout: {
      ...defaultLayout,
      margins: { top: 110, right: 100, bottom: 110, left: 100 },
      headerHeight: 90,
      footerHeight: 70,
    },
  },
];

// Helper function to get templates by tier
export function getTemplatesByTier(tier: SubscriptionTier): TemplateConfig[] {
  const tierHierarchy: SubscriptionTier[] = ['free', 'starter', 'professional', 'enterprise'];
  const userTierIndex = tierHierarchy.indexOf(tier);
  
  return TEMPLATE_CONFIGS.filter(template => {
    const templateTierIndex = tierHierarchy.indexOf(template.tier);
    return templateTierIndex <= userTierIndex;
  });
}

// Helper function to get templates by category
export function getTemplatesByCategory(category: TemplateCategory): TemplateConfig[] {
  return TEMPLATE_CONFIGS.filter(template => template.category === category);
}

// Helper function to check if user has access to template
export function hasAccessToTemplate(
  userTier: SubscriptionTier | null | undefined, 
  templateTier: SubscriptionTier,
  userRole?: string | null | undefined
): boolean {
  // Use the subscription utility for tier access checking
  // This automatically gives admins access to all templates
  return hasAccessToTier(userTier, userRole, templateTier);
}
