# SRC Land Building — React copy

A React 19 + Vite project reproducing https://srclandbuilding.com/ with its original content, page layouts, branding and downloaded assets.

## Run

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

Deploy `dist` on a static host with all routes rewritten to `/index.html`.

## Structure

- `src/main.jsx`: React Header, Page, Footer and App components; client-side routes and interaction handlers.
- `src/site-data.json`: imported page content for Home, About, Team, Services, Projects, Properties, Lots for Sale, Career and Contact.
- `public/assets`: images, fonts and original layout styles, hosted locally.
- `src/styles.css`: responsive and accessibility fixes for the React runtime.

The original Elementor layout markup is rendered as React elements with html-react-parser to preserve its appearance. WordPress and Elementor JavaScript are not required. Original external listing links and embedded content are preserved. Hero slides, dropdown navigation, accordion controls and page navigation are implemented in the React application.

Contact and career submissions require a backend integration. This copy does not claim to send form data: it displays the SRC phone number after validation. Original tracking scripts have not been copied. Content reflects the source site at the time of conversion.
