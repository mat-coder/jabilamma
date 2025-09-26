# Design Guidelines for Multilingual Content Generator

## Design Approach
**Selected Approach:** Reference-Based Design inspired by creative tools like Notion and Canva
- Focus on clean, modern interface that feels both professional and approachable
- Emphasize content creation workflow with clear visual hierarchy
- Balance utility with visual appeal for creative content generation

## Core Design Elements

### A. Color Palette
**Primary Colors (Dark Mode):**
- Background: 15 8% 12% (deep charcoal)
- Surface: 15 6% 18% (elevated panels)
- Primary Brand: 260 85% 65% (vibrant purple - creative energy)
- Text Primary: 0 0% 95% (near white)
- Text Secondary: 0 0% 70% (muted gray)

**Light Mode:**
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white panels)
- Primary Brand: 260 75% 55% (deeper purple for contrast)
- Text Primary: 0 0% 15% (dark gray)
- Text Secondary: 0 0% 45% (medium gray)

**Accent Colors:**
- Success (credits): 142 70% 50% (emerald green)
- Warning (low credits): 38 85% 60% (amber)
- Error: 0 75% 60% (coral red)

### B. Typography
- **Primary Font:** Inter (Google Fonts) - clean, modern readability
- **Display Font:** Inter with increased font-weight for headings
- **Hierarchy:**
  - H1: 2.5rem, font-weight 700
  - H2: 2rem, font-weight 600
  - H3: 1.5rem, font-weight 600
  - Body: 1rem, font-weight 400
  - Small: 0.875rem, font-weight 400

### C. Layout System
**Tailwind Spacing Primitives:** 4, 6, 8, 12, 16
- Consistent padding: p-6 for cards, p-4 for compact elements
- Margins: mb-8 for section spacing, mb-4 for element spacing
- Grid gaps: gap-6 for main layout, gap-4 for form elements
- Container max-width: max-w-6xl with centered layout

### D. Component Library

**Navigation:**
- Clean header with logo, credit balance badge, and user menu
- Sticky navigation with subtle shadow on scroll
- Credit counter prominently displayed with color-coded status

**Forms & Controls:**
- Language selector: Grid of 5 cards with language names in both English and native script
- Content type toggle: Large, clear radio buttons or segmented control
- Contextual inputs: Organized in expandable sections with clear labels
- Generate button: Primary CTA with loading states and disabled states when credits insufficient

**Content Display:**
- Generated content in elegant card with language indicator
- Copy-to-clipboard functionality
- Export options clearly visible
- Loading skeleton during generation

**Credit System:**
- Balance display: Prominent but not intrusive
- Purchase modal: Clean pricing tiers with clear value proposition
- Usage tracking: Subtle indication of credits consumed per generation

**Data Displays:**
- Recent generations history with thumbnails and metadata
- Usage analytics in simple, digestible format

### E. Key Layout Structure

**Main Dashboard:**
1. Header with navigation and credit balance
2. Language selection grid (prominent, visual)
3. Content type selector (clear binary choice)
4. Contextual inputs (progressive disclosure)
5. Generate section with prominent CTA
6. Results area with generated content

**Visual Hierarchy:**
- Most important actions (Generate, Buy Credits) use primary color
- Secondary actions use outline buttons
- Destructive actions use error color sparingly

### F. Responsive Behavior
- Mobile-first approach with stacked layouts
- Desktop utilizes wider layout with side-by-side sections
- Touch-friendly button sizes (minimum 44px height)

## Special Considerations

**Cultural Sensitivity:**
- Proper typography support for Indian language scripts
- Respectful representation of languages with equal visual weight
- Clear indication of language selection with both English and native names

**Credit System UX:**
- Non-aggressive credit purchase prompts
- Clear value communication (X credits = Y generations)
- Graceful handling of insufficient credits with immediate purchase option

**Content Generation:**
- Clear loading states with estimated time
- Error handling for API failures
- Content quality indicators and regeneration options

This design prioritizes clarity, cultural sensitivity, and seamless workflow while maintaining a modern, professional aesthetic that builds trust for the credit-based system.