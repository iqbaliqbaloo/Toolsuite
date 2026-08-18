# Whole-Product UI/UX Design Research Notes

## Design direction for ToolSuite

The redesign will use a warm, friendly, approachable productivity palette rather than the current cold dark-only system. A proposed direction is an off-white/soft sand base, deep charcoal text, peach/coral warmth for emotional energy, and a restrained teal or indigo action accent. This follows the pattern of limiting the interface to a dominant base, a secondary surface tone, and a small accent share rather than making every category a competing color.

LandingPageFlow’s 2026 palette guide describes a “Friendly & Approachable” combination using peach `#FFCBA4`, coral `#FF6B6B`, and charcoal `#333333`; it also emphasizes that limiting the palette to two or three main colors improves focus and consistency. Source: https://landingpageflow.com/post/best-color-combinations-for-better-landing-pages

Tubik’s UI color guidance recommends a 60–30–10 balance between dominant, secondary, and accent colors, reserving the strongest contrast for buttons, alerts, actionable text, and empty-state illustrations. It also warns that color meaning varies across cultures, so ToolSuite should use color as hierarchy and feedback rather than relying on color alone. Source: https://tubikstudio.com/blog/color-matters-6-tips-on-choosing-ui-colors/

Stripe’s accessible color-system research recommends predictable contrast, clear differentiated hues, and consistent visual weight. It cites a minimum contrast ratio of 4.5 for small text and 3.0 for large text, and explains why perceptual color models are safer than casual lightening/darkening of RGB colors. Source: https://stripe.com/blog/accessible-color-systems

## Implementation principles

ToolSuite will use warm surfaces for the main shell, dark charcoal for primary text, a signature coral/peach accent for approachable emphasis, teal or indigo for primary actions, and semantic green/amber/red only for success, progress, warning, and error states. Category colors will be subdued tinted backgrounds rather than six competing neon accents.

The layout will favor a compact, persistent top bar, a collapsible category rail, a large search-first hero, clear “start here” cards, and tool pages with a visible input → processing → output progression. The most common action should be available within the first screen on mobile. Empty states will explain what to do next, while success states will emphasize the next action such as download, copy, edit, or start over.

Animations will be short and purposeful: fade-in-up for page sections, 150–220ms hover/press transitions for controls, and no essential meaning conveyed through motion or color alone. Reduced-motion users will receive the same hierarchy without decorative transitions.
