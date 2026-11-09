# Hacktoberfest 2026 Design System

## Token Tables

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| html/base dark | #2e4742 | footer-like bands, behind sticky headers |
| Page paper | #f2f2eb | main background |
| Off-white card | #f7f7f2 | cards/inputs/images frame background |
| Forest header band | #3d5f58 | dark band sections, eyebrow labels/badges |
| Ink | #10201d | borders (2px solid) and main text |
| Secondary text | #34433f | secondary text elements |
| Red-orange | #e53927 | emphasis text in headings, focus outlines |
| Sky blue | #8bb2de | dot markers |
| Ochre | #f5b726 | dot markers |
| Salmon | #e97b77 | buttons, ::selection bg, skip link bg |
| Hard shadow color | #671912 | hard shadows (no blur) |

### Typography
| Font Family | Stack | Usage |
|-------------|-------|-------|
| Headings | "Barlow Semi Condensed", Helvetica, sans-serif | page title and headings |
| Body | "Inter", system-ui, sans-serif | body text, paragraphs |
| Labels | "Martian Mono", monospace | metadata, eyebrows, badges |

**Typography Properties:**
- Heading weight: 800, letter-spacing: -0.04em, line-height: 0.94
- Body font-size: 16-18px, line-height: 1.55
- Label font-size: ~0.78rem, weight: 700, letter-spacing: 0.08em, uppercase
- Page title size: clamp(2.6rem, 4.8vw, 4.5rem)

### Shadows & Borders
| Element | Border | Shadow |
|---------|--------|--------|
| All elements | 2px solid #10201d | None (hard shadows only for buttons/badges) |
| Featured cards | 2px solid #10201d | none |
| Buttons | 2px solid #10201d | 4px 4px 0 #671912 |
| Badges | 2px solid #10201d | 4px 4px 0 #671912 |
| Interactive elements | 2px solid #10201d | 4px 4px 0 #671912 |

### Dot Grain Overlay (exact recipe from hacktoberfest.com body::after)
- Two radial-gradient dot layers: dark `rgba(24,37,34,0.6)` dots in a 7px grid at 0 0, white `rgba(247,247,242,0.6)` dots in an 11px grid at 4px 5px
- Opacity: 0.075
- Pointer-events: none
- Position: fixed, inset: 0
- Z-index: 1000 (above content)
- mix-blend-mode: multiply

### Interaction states (mirrored from source)
- Card hover: lift `translate(-2px,-2px)` + hard shadow `4px 4px 0 #671912` appears (no shadow at rest)
- Button press: `translate(2px,2px)` + shadow shrinks to `2px 2px 0`
- CTAs (buttons): salmon `#e97b77` background, Inter 700, ink border
- Nav links in forest bands: plain `#f7f7f2` mono text, hover underline
- Focus: white 3px outline + ink halo (`box-shadow: 0 0 0 5px #10201d`) via :focus-visible

## Component Map
| Class | Component | One-line description |
|-------|-----------|---------------------|
| .blog-page | Blog page container | Paper page over #2e4742 html base |
| .blog-band | Full-bleed forest band | Mirrors source header band; contains topbar |
| .blog-wrap | Blog content wrapper | min(calc(100%-40px), 1280px) container, mirrors source Shell |
| .blog-topbar | Blog top navigation | Back button row inside forest band |
| .portal-back | Back link | Plain mono #f7f7f2 link in forest band, hover underline |
| .post-back | All-articles CTA | Salmon CTA with hard shadow, Inter 700 |
| .blog-header | Blog header section | Title and subtitle area |
| .blog-title | Page title | Large Barlow heading, clamp(2.6rem, 4.8vw, 4.5rem), text-wrap balance |
| .blog-sub | Subtitle | Body copy, #34433f, max-width 48ch |
| .blog-featured | Featured post card | Full-width card with cover image and content |
| .blog-featured-cover | Featured image | 200px desktop / 340px desktop, object-fit cover |
| .blog-featured-body | Featured content | Card content area with title and description |
| .blog-featured-title | Featured title | Large heading within featured card |
| .blog-featured-desc | Featured description | Secondary text description |
| .blog-list | Blog posts list | Flex column layout for post rows |
| .blog-row | Individual post row | Card layout with thumbnail and text |
| .blog-row.no-thumb | Post row without thumbnail | Vertical layout for text-only posts |
| .blog-row-thumb | Post thumbnail | 176px × 104px image container |
| .blog-row-body | Post content area | Text content wrapper for rows |
| .blog-row-title | Post row title | Medium heading for list items |
| .blog-row-desc | Post row description | Secondary text for rows |
| .blog-meta | Post metadata | Date and category information |
| .blog-meta-item | Metadata item | Individual metadata element |
| .blog-icon | Metadata icon | Small icon for metadata items |
| .blog-tags | Tags container | Container for post tags |
| .blog-tags .prj-chip | Combined tag selector | Must be preserved exactly |
| .blog-tag | Individual tag | Mono style with color-coded dot indicator |
| .blog-more | Load more button | Salmon button with hard shadow |
| .blog-empty | Empty state container | Shown when no posts available |
| .blog-empty-title | Empty title | Heading for empty state |
| .blog-empty-desc | Empty description | Text for empty state |
| .post-page | Post page container | Single post full-height layout |
| .post-wrap | Post content wrapper | Full-width container with top padding |
| .post-back | Post back button | Same style as portal-back for posts |
| .post-header | Post header | Cover image and metadata area |
| .post-title | Post title | Large heading for single post |
| .post-cover | Post cover image | 340px desktop / 200px mobile, object-fit cover |
| .post-body | Post content | Prose content with 72ch max-width |
| .post-body-no-cover | Post body without cover | Adjusts spacing when no cover image |
| .post-footer | Post footer | Bottom section with dev.to link and canonical hint |

## Accessibility Notes
- **Focus Management**: All interactive elements have 3px solid #e53927 outline with 3px offset
- **Hit Areas**: Interactive elements provide 44px minimum touch targets
- **Reduced Motion**: All transitions and animations respect `prefers-reduced-motion: reduce`
- **Selection Style**: `::selection` uses #10201d text on #e97b77 background
- **Color Contrast**: Main text (#10201d) on light backgrounds meets WCAG AA standards
- **Keyboard Navigation**: All clickable elements are keyboard accessible
- **Skip Link**: Implemented for keyboard users to bypass navigation

## Do NOT List
- Blur effects anywhere in the codebase
- Border-radius beyond 2px anywhere
- Gradients except the dot-grain overlay texture
- Accent-colored body text (use #10201d for all body copy)
- Hero-fade-up dependencies or animations
- Em dash characters (use double hyphens instead)
- Opacity animations or fades without explicit user consent
- Z-index stacking beyond logical layering (0 for overlay, 1 for content)
- CSS custom properties (use direct values)
- BEM methodology extensions beyond required class names
- Shadow blur effects (hard shadows only: 4px 4px 0 or 8px 8px 0)
- CSS transforms except for button hover translations
- CSS Grid or Flexbox for layout beyond required simple layouts
- CSS variables or preprocessors (use plain CSS)
- CSS animations (use transitions only where absolutely necessary)
- CSS filters or backdrop-blur effects
- CSS pseudo-elements beyond required ::before and ::selection