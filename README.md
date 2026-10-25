# Ting Shu · Research Orbits

A self-contained, cartoon 3D Earth homepage for `Shuting/shuting.github.io`.

## Preview locally

Run `python3 -m http.server 8080` in this directory, then visit `http://localhost:8080`. Use an HTTP server rather than opening `index.html` directly, because JavaScript modules and the local land dataset require HTTP.

## GitHub Pages

Copy `index.html`, `styles.css`, `app.js`, `machine-learning.js`, `machine-learning.css`, `precipitation.js`, `precipitation-art.js`, `precipitation.css`, `numerical-modeling.js`, `numerical-modeling.css`, `numerical-art.js`, `multimodal-weather.js`, `multimodal-weather.css`, `multimodal-art.js`, `teaching.js`, `teaching.css`, `teaching-art.js`, `join-maze.js`, `join-maze-art.js`, `join-maze.css`, `collaboration-network.js`, `collaboration-network.css`, `collaboration-art.js`, `about.js`, `about.css`, `assets/ml/`, `favicon.svg`, `.nojekyll`, `vendor/`, and `data/` into the repository root. Keep any existing assets you still need. Configure GitHub Pages to deploy the root of the intended branch. No Node installation, build step, external runtime CDN, API key, or server is required.

The website is served by GitHub Pages at https://shuting.github.io/.

## Edit content

The `topics` array at the start of `app.js` contains the four research directions, descriptions, tags, and selected papers. Paper searches use explicit Google Scholar search links. All four research directions now have custom page designs. `index.html` holds the homepage introduction and page containers; `about.js` holds the interactive About page.

About, Teaching, Collaboration and Join Us are independent pages available through the header navigation. Their former homepage content sections have been removed. Direct links are `#about`, `#teaching`, `#collaboration`, and `#join`; navigation also works from research pages. Teaching now opens a separate circuit-board page. Python Programming and Computer Architecture derive from the supplied CV; Computer Game Development and the graduate Research Methods & Academic Writing course were added at the owner’s request. Join Us also opens an independent maze page. Collaboration and Join Us use mailto links with editable draft subjects and prompts; no message is sent by the site. No specific admissions quota, funding, or deadline is asserted.

## Interaction

- Drag the Earth horizontally to rotate it, or vertically to adjust its tilt.
- Click a satellite, its accessible label, or a research entry to descend into the topic.
- Use the pause button to stop ambient motion.
- Escape cancels a flight or returns from a research page.
- Research routes such as `#research/clouds` support direct links and browser history.
- Reduced-motion preferences disable ambient motion and shorten transitions.
- Without WebGL, the accessible topic buttons remain available.

## Sources and licenses

- Three.js 0.170.0, MIT license; see `vendor/THREE-LICENSE.txt`.
- Natural Earth 1:110m land polygons, public domain, https://www.naturalearthdata.com/about/terms-of-use/; source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson.
- Biographical and publication content derives from the supplied December 2025 CV and `publish.txt`, with the current affiliation supplied by the owner.
- Satellite meshes, cloud meshes, interface, and landing illustration are authored for this prototype; no third-party portfolio artwork is copied.


## Machine Learning page

Open `#research/learning` directly, or enter through the Machine Learning satellite. The existing other research previews and homepage remain intact.

- Seven bilingual topic nodes filter a 31-work research archive. A work may have multiple topic tags.
- `data/ml-papers.js` holds curated titles, short Chinese introductions, topic tags, author metadata, links, and original BibTeX. The introductions describe scope and methods, without adding unverified numerical claims.
- `data/machine-learning.bib` exports the corresponding original 32 bibliography records: the 2020 multi-view subspace clustering journal article and its preprint are grouped into one displayed work. The eight weather-focused records remain outside this archive. The quantum-computing paper appears as a related scientific application, not as a claimed machine-learning algorithm.
- Display years follow the supplied bibliography. Notes distinguish online publication and later volume years for SSRC, the LLM/RL survey, and PCF-LLM. Preprints have explicit badges. Where a direct link is not established, the button explicitly says “检索论文” and opens an exact-title Google Scholar search.
- Eight newest works are initially shown; the remaining works expand on request. Search matches Chinese/English titles, summaries, authors, venues, years and topic labels. Topic filtering, sort order, empty state, individual BibTeX viewing/copy/download and full bibliography download work entirely in the browser.
- `assets/ml/south-china.svg` is a locally rendered regional illustration. Its coastline comes from Natural Earth 1:50m land polygons (public domain); the regional subset is in `data/south-china-land.geojson`. Curvature, terrain shading and clouds are stylized, not elevation measurements. Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_land.geojson . Rebuild with `python3 scripts/build-south-china.py`.
- Paper thumbnails are original SVG concept diagrams rather than experimental figures. All assets are local; no generated mockup screenshot is used as the webpage.
- Stream motion can be paused, respects reduced-motion preferences, and pauses while the hero is outside the viewport or the tab is hidden. Topic nodes have keyboard focus states and mobile layouts.


## Precipitation & Nowcasting page

Open `#research/precipitation` directly, or enter through the first satellite.

- `precipitation-art.js` draws an original SVG water-cycle landscape with ocean, evaporation, clouds, rainfall, river, infiltration and groundwater. Four unboxed text annotations name the natural processes. Two bilingual research callouts, “降水估测” by the radar and “雷达外推” by the rain cloud, link to the corresponding research sections. The landscape is conceptual rather than a geographic map or observed weather. Background explanation: https://www.usgs.gov/water-science-school/water-cycle .
- `precipitation.js` and `precipitation.css` present two research questions: quantitative precipitation estimation (FusionQPE) and radar echo extrapolation (TempEE and the dynamic multiscale fusion GAN paper). The three original bibliography records are in `data/precipitation-papers.js` and `data/precipitation.bib`. DOI links lead to each paper; TempEE also has an open arXiv link.
- FusionQPE's method description was checked against https://www.mdpi.com/2072-4292/18/1/156 ; TempEE's against https://arxiv.org/abs/2304.14131 . The GAN introduction describes the research scope from its bibliographic title, without asserting unverified experimental results.
- The interactive Z–R example uses the fixed illustrative relation Z = 200 R^1.6 and dBZ = 10 log10 Z. It is explicitly labeled as an empirical demonstration, not FusionQPE output. Echo graphics and the four future frames are synthetic concept illustrations, not measurements or model predictions; they carry a visible label.
- Water-cycle motion can be paused and respects reduced-motion preferences. The hero pauses while offscreen, hidden or inactive. The echo animation starts only on request and advances only while the player is visible; leaving the page stops it. Mobile annotation positions keep the research callouts beside their corresponding scene features.
- Each paper includes expandable author metadata, a BibTeX dialog with copy/download, and the page offers a combined bibliography download.


## AI × Numerical Weather Prediction page

Open `#research/clouds` directly or enter through the second satellite. The original route is retained.

- `numerical-art.js` draws an original, conceptual isometric atmosphere grid, coastal terrain, cloud particles, a highlighted learned-physics cell and a detached temperature-product sheet. These are illustrations, not a geographic map, model output or a claim of an integrated operational system. Two bilingual callouts lead to cloud microphysical parameterization and NWP product post-processing.
- The atmosphere layers can be expanded and collapsed. Ambient motion respects reduced-motion settings and pauses when the hero is offscreen, the document is hidden or the page is inactive.
- `data/numerical-papers.js` contains all three supplied works: 1DD-CNN (ICAIBD 2024), LMP-Tr (EGUsphere preprint, 2026), and the spatial downscaling and bias-correction paper (Applied Intelligence, 2024). LMP-Tr is visibly marked as a preprint. The original three bibliography records are also exported in `data/numerical-modeling.bib`. The temperature article's displayed title omits the extraneous author suffix from the supplied record, following the publisher; the exported original BibTeX is preserved.
- Sources for the short method descriptions: https://www.icaibd.org/Assets/files/ICAIBD2024-Program-Final.pdf ; https://egusphere.copernicus.org/preprints/2026/egusphere-2026-3243/ ; https://link.springer.com/article/10.1007/s10489-024-05504-z . No unverified performance numbers or operational-deployment claims are added.
- The temperature explorer independently changes a synthetic field's sampling grid (6 × 6 / 24 × 24) and removes a preset +2°C warm offset. This demonstrates the distinction between spatial detail and bias correction, not a learned downscaling algorithm. The visible note explicitly says it is synthetic, not measurements or paper-model output. The separate 1 km fact is the target product resolution stated in the temperature paper.
- All three papers include DOI links, author details and individual BibTeX copy/download. The visual assets and interaction logic are entirely local.


## Multimodal & Regional Weather Forecasting page

Open `#research/multimodal` directly or enter through the third satellite. The direction's bilingual name now includes regional weather forecasting, following the owner's approved scope.

- `multimodal-art.js` draws a flat South China map with numerical, visual and textual concept layers. The three source windows select a view; “综合视图” restores all layers. Layer and connector emphasis changes together, with an accessible status message. Three research callouts link to visual understanding, cross-modal alignment and the ongoing regional-AI direction.
- Coastlines use the existing public-domain Natural Earth 1:50m subset. `scripts/build-multimodal-coast.py` renders `data/multimodal-coast.js` for 105–119°E, 17–26°N. Place labels provide geographic context; weather graphics, motion and text are conceptual and do not represent actual observations, forecasts, or an operational model domain.
- The owner-confirmed regional AI forecasting work is separately marked “正在开展 / Ongoing Research”. No architecture, training dataset, forecast horizon, performance number or deployed system is asserted for this ongoing work.
- `data/multimodal-papers.js` and `data/multimodal-weather.bib` hold the two supplied publications and original BibTeX. MASK-CNN-Transformer is described as image-based multi-label weather recognition, not as a numerical-image-text fusion model. Its description was checked against https://www.sciencedirect.com/science/article/abs/pii/S0950705123006317 and https://arxiv.org/abs/2304.14857 .
- The LoRA entry follows the supplied AIIPCC 2025 / publication-year-2026 record. Its concise introduction describes only the scope stated in the supplied title; the button says “检索论文” and opens an exact-title Scholar search because a primary publication URL was not established. The LoRA diagram is explicitly conceptual, not a reconstructed paper architecture.
- Source-window interaction, section links, citation copy/download, pause control, reduced-motion behavior and responsive layouts work locally. The ambient illustrations pause when the hero is offscreen, the page is inactive or the document is hidden.


## Teaching circuit board

Open `#teaching`, or use Teaching in the header. `teaching.js` holds the four course records, `teaching-art.js` draws the original SVG components and traces, and `teaching.css` provides the responsive board and course details.

- Each native button selects a course, lights its circuit and indicator, and scrolls to the matching introduction. Previous/next controls cycle through all four courses. The header Teaching link opens the circuit board.
- The fourth course is explicitly labeled as a graduate course. General introductions and focus areas are editorial summaries of the supplied course titles, not official syllabi. No engine, textbook, timetable, assessment scheme or course material availability is asserted.
- Numerical labels U1–U4 and the four component types are visual metaphors, not a functional electronic schematic. All art is local and scalable.
- Pause, reduced-motion settings, page visibility and offscreen detection control circuit and fan animations. Native buttons support keyboard use; a status message announces course selection. Mobile layout keeps all four components and the long graduate-course title readable.
- Teaching is a separate view with direct linking, browser back/forward support, a home action and navigation to the research and personal sections.


## Join Us maze

Open `#join` or use Join Us in the header. `join-maze-art.js` builds a deterministic 9 × 7 garden maze and original isometric SVG; `join-maze.js` contains the four stages, invitation, research links and contact information; `join-maze.css` handles desktop and mobile layouts.

- Four native-button landmarks and matching notebook entries select curiosity, research interests, a personal introduction and contact. The traveler follows actual adjacent passages in the same graph used to render the walls. The 63-cell graph is connected, has 62 passages and preserves the composed entrance-to-exit route.
- Visitors can reveal the complete route or reset the journey. They can also access all research and contact content directly; completing the maze is never required.
- The four research links enter the existing research pages. The contact card offers a copy-email button and an editable mailto draft. No email is sent by the site and no form data is collected. Existing owner-provided invitation content is retained without asserting vacancies, funding, admission conditions or deadlines.
- Finite travel animations respect reduced-motion settings and stop on page exit or document hiding. Landmarks support native keyboard activation; stage changes are announced. Direct linking and browser history work across Teaching, Join Us, the homepage and research pages.


## Collaboration network

Open `#collaboration` or use Collaboration in the header. This page presents existing relationships supplied by the owner, replacing the earlier generic collaboration invitation. `data/collaboration-partners.js` contains all 15 universities and five meteorological organizations, with their supplied full Chinese names.

- `collaboration-art.js` renders four minimal sage islands using original, local SVG paths: Australia, Hong Kong/Macau, mainland universities and meteorological project partners. Native HTML labels and buttons keep the artwork accessible and responsive. The hero has no introductory heading above the map.
- Each island opens a keyboard-accessible modal listing its partners (2, 4, 9 and 5 respectively). Escape closes only that modal; a link scrolls to the matching full directory section. Mobile uses a compact two-by-two island layout.
- All 15 universities and five meteorological organizations are also listed in full below the map. The five meteorological partners are explicitly marked as project collaborators following the owner's statement. No employment guarantee, institution-wide agreement, specific dataset entitlement, named project or funding amount is invented.
- The invitation opens an editable email draft. No message is sent automatically. Existing page routing and reduced-motion preferences are preserved.

## About: many sides of one person

Open `#about` from the header. This independent page replaces the former About dialog. A CSS 3D toy cube has six faces: introduction, career coordinates, research, teaching, everyday interests, and contact. Drag, click, use arrow keys, choose a face, or pick a random different face. A companion content panel follows the selected face. A small visited indicator tracks only this page session, with no analytics or persistence.

Career coordinates reuse the existing supplied profile, without adding unverified dates. The owner supplied the four interests: TV dramas, novels, writing, and food. The everyday-life face includes four illustrated switches. Research, teaching, collaboration and joining links lead to the existing pages; email uses mailto. Mobile stacks the toy and panel, and reduced-motion settings remove turn transitions.

The About cube uses fixed standard die pip layouts: front/right/back/left/top/bottom = 1/2/6/5/3/4. Every value appears once, and opposing faces sum to seven. The selected front face retains its original illustration and title; the other faces display their assigned pip patterns.

All four research pages open directly on their interactive visualizations. Former introductory headings, subtitles and top breadcrumbs are removed; screen-reader headings, global home navigation, bottom return buttons, visualization controls and research content are retained.

四个研究方向页共用小云朵切换入口（桌面右上角，手机右下角），不占据可视化布局；点击展开四个方向，当前方向以小圆点标记。选择方向、点击外部或按 Escape 收起；支持手机、键盘和浏览器前进/后退。

关于我、教学、加入我们页移除顶部宣传标题与介绍，分别直接呈现多面体、电路板和迷宫。保留图内提示、课程内容与联系入口。

教学页使用米白底上的细线电路与独立课程元件，移除整块绿色板底、厚边、螺丝与边缘接插件；保留课程选择和电流动画。

主导航持续以橙色标记当前子页面；研究页的云朵显示当前方向名称与“其他方向”，点击展开方向列表。

## Latest news

`#news` opens the lab newspaper. The 14 owner-supplied events are in `data/news.js`, sorted by event date with category and year filters. Acceptance notices preserve the supplied conference tracks; no unprovided award, funding amount, or publication URL is added.
