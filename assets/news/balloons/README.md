# Balloon scene assets

Created with the built-in image generation tool, not CLI. Transparent PNGs; keep natural fabric and wicker colors.

- balloon-rose.png — papers
- balloon-sage.png — projects
- balloon-blue.png — talks
- balloon-gold.png — team
- river-valley.png — 3D-style landscape illustration (not a WebGL model)

## Final rope correction prompt

Use case: precise-object-edit. Edit this existing hot-air-balloon illustration, changing ONLY the four suspension ropes and their depth/occlusion between the envelope and basket. Preserve the exact balloon silhouette, fabric colors, seams, lighting, basket weave, blank tag, object size and framing.
CRITICAL GEOMETRY, viewed from left to right:
The four upper eyelets U1 U2 U3 U4 lie at depths BACK, FRONT, FRONT, BACK.
The four lower basket rings B1 B2 B3 B4 lie at depths FRONT, BACK, FRONT, BACK.
Correct connections must be U1 to B2 (rear-left rope), U2 to B1 (front-left rope), U3 to B3 (front-right), U4 to B4 (rear-right).
Thus the LEFT TWO ROPES MUST FORM A VISIBLE X between the envelope and basket. The rope descending diagonally from the SECOND upper eyelet down-left into the FIRST/leftmost basket ring passes IN FRONT of and occludes the rear rope descending from the FIRST upper eyelet down-right into the SECOND basket ring. Both ropes are separate taut fibers, never fused. The rear rope is slightly darker/thinner and disappears behind the near-side basket rim where appropriate. Keep all four eyelets and all four basket rings in their original image locations. Keep the right two ropes as they are, front at position 3, rear at position 4.
Approximate anchors in a 1024x1536 image: upper left pair near (370,1030) and (455,1030), lower left pair near (405,1245) and (440,1230). Exchange ONLY these left rope endpoints, producing the X crossing near (420,1170).
Exactly four structural ropes, no added loops or extra ropes. Do not draw labels, numbers, diagrams or arrows. Keep the image background genuinely transparent, preserving all existing alpha outside the subject. Do not add a backdrop.

## Initial asset prompts

Use case: stylized-concept. Asset type: transparent isolated hot-air-balloon PNG for an elegant playful academic personal website. Create ONE beautifully proportioned hot air balloon, full object, no ground, no sky, genuine transparent background. Rounded tall pear-shaped inflated fabric envelope with broad alternating muted sage-green and warm ivory panels, very subtle linen weave and fine seams, soft pillowy volume. Small believable honey wicker gondola, width only about one quarter of balloon width, handwoven texture, rounded corners, four fine suspension ropes, no passengers. A tiny blank ivory paper tag tied flat to the front of the basket, no letters. Beautiful high-end miniature toy photography / refined 3D storybook illustration, delicate tactile materials, large soft studio light upper left, no harsh highlights, airy restrained palette, not shiny plastic, not polygonal, not an icon, not flat vector. Frontal three-quarter view with basket almost frontal. Composition vertical, entire balloon fits with a narrow transparent margin, centered, balloon occupies 90% of canvas height, no shadows cast on a background, no logos, no text, no watermark.

Use case: stylized-concept. Asset type: wide transparent landscape cutout forming the bottom quarter of a minimal pastel personal website. Create a beautifully crafted panoramic miniature river valley, 3D tactile storybook landscape. Long low horizontal composition 3:1, a few smooth rounded sage-green mountains on left and right, gentle pale green foothills, a sinuous clear pale blue river from a distant pass through the center toward a wide calm lake in the foreground. Tiny rounded trees in a few restrained clusters establish scale; no buildings, no people, no balloons. Refined soft sculpted terrain, subtle detailed natural surfaces, not a triangulated mesh, no spiky mountains, no crystalline facets, no square platform or block base. Broad soft ambient daylight from upper left, creamy mist at far edges, very gentle shadows, calm sophisticated nursery-like charm, crisp enough to read at small scale. A low oblique bird's-eye camera, not overhead map. Entire landscape floats as a seamless organic vignette against genuine transparency, especially sky and corners transparent, edges gracefully taper to transparent without a rectangular border. Keep overall silhouette low and wide, tallest peaks under one third of image width. Absolutely no text or watermarks.

Color variants: change only sage fabric to dusty blush rose, soft powder sky blue, or soft buttery pastel yellow, preserving ivory, ropes, basket and transparency. The final blue variant was recolored from the corrected sage version to preserve exactly four ropes.

