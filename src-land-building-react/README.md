# SRC Land Building & Real Estate

A redesigned React 19 + Vite website based on SRC’s original content and local assets. All eleven routes use native React components with a consistent responsive design.

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

## Validation and production

```bash
npm test
npm run build
npm run preview
```

Deploy `dist` on a static host with all application routes rewritten to `/index.html`.

## Experience

- Architectural visual direction: ivory, navy, sage, and gold; large typography; asymmetric photography; compact sticky navigation.
- Homepage organized around visitor goals: find property, plan a project, or explore previous work.
- Property explorer with name/city/address search, location filters, grid/list views, empty states, and a browser-local shortlist.
- Selected project dialogs, external listing links, and project sector filters.
- Service index and detailed service sections, with context passed into inquiries.
- Team profiles with department filters and expandable biographies.
- Contact and career forms with native validation, reviewable email drafts, and edit/copy actions. No automatic submission or backend is connected. Sending happens in the visitor’s email application.
- Responsive layouts, keyboard controls, visible focus states, skip navigation, and reduced-motion support.

Shortlists persist in the current browser. Inquiry details stay in memory for the current form session and are included in an email draft only when the visitor chooses that action. External listings are source references; confirm availability and pricing directly with SRC.

## Source structure

- `src/main.jsx`: client-side routing, document titles, navigation, and page focus.
- `src/Experience.jsx`: shared navigation/footer, homepage, service definitions, and featured projects.
- `src/Pages.jsx`: About, Services, Projects, Properties/Lots, Team, Contact, and Careers.
- `src/Legal.jsx`: Privacy Policy and Terms & Conditions pages, section navigation, and shortlist privacy controls.
- `src/experience.css`: shared design system and responsive layouts.
- `src/content.json`: normalized source property directory and team profiles.
- `tests/experience.test.mjs`: seven DOM integration checks for routes, filters, shortlist persistence, dialogs, and draft/edit behavior.
- `scripts/extract-content.mjs`: regenerate normalized content from the retained source snapshot.
- `src/site-data.json`, `src/styles.css`, `public/assets`: retained original snapshot and assets. Legacy page markup/styles are no longer loaded by the application.

DOM tests exercise application behavior; they do not replace visual browser and device testing.

Privacy and terms copy is a draft for the current website behavior. Confirm business correspondence, hosting, retention, and legal terms before publication. Privacy wording follows the [FTC guidance on accurate privacy promises](https://www.ftc.gov/business-guidance/privacy-security/consumer-privacy).
