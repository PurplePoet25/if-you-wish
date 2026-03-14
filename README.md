# How the Voice Arrives

A single-page React experience for Hasan Bukhari's poem **"if you wish"**. The site is designed for **GitHub Pages** and uses **no build step**, so it is stable, lightweight, and easy to deploy.

## Files

- `index.html` — page shell
- `styles.css` — all theme, layout, and animation styles
- `app.js` — React app logic, excerpts, score states, and canvas fireworks

## How to deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload these three files:
   - `index.html`
   - `styles.css`
   - `app.js`
3. Optionally upload this `README.md` too.
4. In the GitHub repo, go to **Settings → Pages**.
5. Under **Build and deployment**, set:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (or `master`), folder `/root`
6. Save.
7. Wait a minute and GitHub will generate your live site link.

## Notes

- This project uses React through ESM imports, so it works directly in the browser without npm, Vite, or Babel.
- The poem can always be opened through the **Read the whole poem** button.
- The fireworks are rendered on a canvas for better performance and smoother visual stability than heavy DOM animation.
- If a viewer has **reduced motion** enabled, the fireworks and motion effects automatically turn off.

## Customizing states

The randomized voice conditions live in the `STATES` array inside `app.js`. Each state has:

- `title`
- `blurb`
- `caption`
- `accent`
- `excerpt`
- `score`

That means you can easily change the language, cues, or excerpt mapping later without rewriting the rest of the app.
