# Lifecraft deploy-ready site

This package is a static website prepared for deployment on Netlify.

## Included
- Landing page focused on the Repatriation Decision Sprint
- Netlify-powered pilot application form
- 5-minute assessment page
- Thank-you page
- Basic privacy page
- Netlify config file for cleaner routing

## Recommended deployment path
1. Create a Netlify project.
2. Deploy this folder by connecting a Git repository or drag-and-drop deployment.
3. In Netlify, enable form detection if needed.
4. Confirm that the form named `pilot-application` appears in the Netlify Forms dashboard after deploy.
5. Add form notifications in Netlify so each new application triggers an email alert.
6. Add your custom domain.

## Important notes before going live
- Replace placeholder privacy wording with your real legal/contact details.
- Add analytics before you start traffic tests.
- If you want payment gating, connect Stripe or a payment link only after manual review and acceptance.
- If you want scheduling, add a Calendly link after acceptance or on the thank-you flow.

## Local preview
Open `index.html` directly in a browser, or use any local static server.
