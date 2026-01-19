# Course Design Templates Documentation

## Overview

CourseForge AI Pro now includes professionally designed templates for course PDFs, perfect for selling educational E-guides on platforms like Etsy. Templates feature special fonts, color schemes, and clip art to give your courses visual appeal and professionalism.

## Features

### Subscription Tier System

Templates are organized by subscription tiers, with more premium features available at higher tiers:

- **Free Tier**: 2 basic templates with standard fonts
- **Starter Tier**: 3 additional templates with Google Fonts and basic clip art
- **Professional Tier**: 4 premium templates with premium fonts and extensive clip art
- **Enterprise Tier**: 4 elite templates with custom fonts and exclusive decorations

### Template Categories

Templates are organized into six categories:

1. **Business**: Professional designs for corporate courses
2. **Education**: Warm, inviting designs for learning materials
3. **Creative**: Bold, colorful templates for creative content
4. **Professional**: Sophisticated designs for high-end content
5. **Minimal**: Clean, modern designs with maximum impact
6. **Elegant**: Refined, classical designs

### Template Components

Each template includes:

- **Fonts**: Heading, body, and accent font specifications
- **Colors**: Primary, secondary, accent, background, and text colors
- **Clip Art**: Icons, decorations, and borders appropriate for the tier
- **Layout**: Page configuration including margins, columns, and orientation

## Available Templates

### Free Tier (2 Templates)

1. **Simple & Clean** (Minimal)
   - Basic Arial fonts throughout
   - Black and white color scheme
   - Basic emoji icons (📚 ✏️ 📖 🎓)

2. **Basic Professional** (Professional)
   - Times New Roman fonts
   - Navy blue color scheme
   - Professional emoji icons (📋 💼 📊 🎯)

### Starter Tier (3 Templates)

3. **Modern Business** (Business)
   - Montserrat headings, Open Sans body
   - Modern blue and gray palette
   - Enhanced icon set with decorations

4. **Educational Classic** (Education)
   - Roboto Slab headings, Roboto body
   - Warm orange and cream palette
   - Educational icons and accents

5. **Creative Spark** (Creative)
   - Poppins headings, Lato body
   - Purple and pink accents
   - Creative icons and artistic elements

### Professional Tier (4 Templates)

6. **Executive Premium** (Business)
   - Playfair Display headings, Source Sans Pro body
   - Dark sophisticated palette
   - Premium decorations and borders

7. **Elegant Scholar** (Education)
   - Merriweather headings, Lora body
   - Classical brown and cream palette
   - Academic ornaments and flourishes

8. **Artistic Vision** (Creative)
   - Abril Fatface headings, Raleway body
   - Vibrant multi-color palette
   - Watercolor-style decorations

9. **Minimalist Pro** (Minimal)
   - Inter fonts throughout
   - Black and white with blue accent
   - Geometric shapes and minimal lines

### Enterprise Tier (4 Templates)

10. **Corporate Elite** (Business)
    - GT America headings, Proxima Nova body
    - Dark with teal accents
    - Platinum and luxury decorations

11. **Masterclass Premium** (Education)
    - Canela headings, Circular body
    - Navy with red accents
    - Excellence badges and seals

12. **Designer's Choice** (Creative)
    - Freight Display headings, Avenir Next body
    - Purple and pink luxury palette
    - Designer flourishes and premium elements

13. **Ultimate Elegance** (Elegant)
    - Didot headings, Garamond body
    - Black with gold accents
    - Royal ornaments and filigree

## Implementation

### Database Schema

The `Template` model includes:

```prisma
model Template {
  id          String   @id @default(cuid())
  name        String
  description String?
  category    String
  tier        String
  thumbnail   String?
  fonts       Json
  colors      Json
  clipArt     Json
  layout      Json
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  courses     Course[]
}
```

### API Endpoints

#### GET /api/templates
Lists all templates available to the current user based on their subscription tier.

**Query Parameters:**
- `category`: Filter by category (optional)
- `showAll`: Show all templates including locked ones (default: false)

**Response:**
```json
{
  "success": true,
  "templates": [...],
  "userTier": "free",
  "total": 2
}
```

#### GET /api/templates/[id]
Get details for a specific template.

**Response:**
```json
{
  "success": true,
  "template": {
    "id": "...",
    "name": "Modern Business",
    "hasAccess": true,
    "requiresUpgrade": false,
    ...
  }
}
```

### User Interface

#### Templates Page (/templates)

Browse all available templates with:
- Category filtering
- Visual tier badges
- Lock overlays for inaccessible templates
- Upgrade prompts
- Template previews

#### Dashboard Integration

Quick action button added to dashboard for easy template access.

#### Subscription Page Updates

Each subscription tier now highlights:
- Number of templates included
- Font options available
- Clip art library size

## Setup Instructions

### 1. Database Migration

Run the database migration to add the Template model:

```bash
npm run db:push
```

Or create a migration:

```bash
npm run db:migrate
```

### 2. Seed Templates

Populate the database with the 14 predefined templates:

```bash
npm run db:seed
```

This will:
- Create the admin user (if not exists)
- Create all 14 templates from the configuration

### 3. Verify Installation

1. Start the development server: `npm run dev`
2. Navigate to `/templates`
3. You should see templates filtered by your subscription tier

## Usage

### For Users

1. **Browse Templates**: Visit `/templates` to see all available templates
2. **Filter by Category**: Use category buttons to narrow down options
3. **Check Access**: Templates show lock icons if they require an upgrade
4. **Upgrade**: Click "Upgrade to Unlock" to see subscription options

### For Developers

#### Adding New Templates

1. Edit `lib/templates.ts`
2. Add a new template configuration to `TEMPLATE_CONFIGS`
3. Run `npm run db:seed` to add it to the database

#### Applying Templates to Courses

To implement PDF export with templates:

1. Update the Course model to include `templateId`
2. Fetch the template when generating PDFs
3. Apply fonts, colors, and layout from template configuration
4. Insert clip art and decorations based on template

Example:

```typescript
const course = await prisma.course.findUnique({
  where: { id },
  include: { template: true }
});

if (course.template) {
  // Apply template styling to PDF generation
  const fonts = course.template.fonts;
  const colors = course.template.colors;
  // ... use in PDF generation
}
```

## Benefits by Tier

### Free Tier
- Access to 2 basic templates
- Standard system fonts
- Basic emoji icons
- Perfect for getting started

### Starter Tier ($19/month)
- 5 total templates (all free + 3 starter)
- Google Fonts integration
- Basic clip art library
- Line accents and simple borders
- Great for professional-looking courses

### Professional Tier ($49/month)
- 9 total templates (all previous + 4 professional)
- Premium font selections
- Extensive clip art collection
- Advanced decorations and flourishes
- Multi-column layouts available
- Ideal for high-quality course materials

### Enterprise Tier ($99/month)
- 13 total templates (all previous + 4 enterprise)
- Custom and luxury fonts
- Exclusive clip art and decorations
- Royal ornaments and premium elements
- Advanced layout options
- Perfect for premium course offerings

## Future Enhancements

### Planned Features

1. **PDF Export Integration**: Apply templates to generated PDFs
2. **Custom Templates**: Allow users to create and save custom templates
3. **Template Previews**: Add actual preview images for each template
4. **Template Editor**: Visual editor for customizing templates
5. **More Templates**: Expand library with seasonal and specialized templates
6. **Font Upload**: Allow enterprise users to upload custom fonts
7. **Clip Art Upload**: Allow users to add their own clip art

### Technical Improvements

1. Add template versioning
2. Implement template caching
3. Add template analytics (most popular, most used)
4. Create template recommendation system
5. Add A/B testing for template effectiveness

## Troubleshooting

### Templates Not Showing

1. Verify database migration: `npm run db:push`
2. Check if templates are seeded: Check database or run `npm run db:seed`
3. Verify user authentication
4. Check console for API errors

### Access Issues

1. Verify user's subscription tier in database
2. Check `hasAccessToTemplate` function logic
3. Ensure tier hierarchy is correct: free → starter → professional → enterprise

### Build Errors

1. Run `npm run build` to check for TypeScript errors
2. Ensure Prisma client is generated: `npm run db:generate`
3. Check that all imports are correct

## Support

For questions or issues with the templates feature:

1. Check this documentation
2. Review the code in `lib/templates.ts`
3. Check API routes in `app/api/templates/`
4. Contact support or open a GitHub issue

## License

This templates feature is part of CourseForge AI Pro and follows the same license as the main application.
