# Akash S — Portfolio

A hand-built, framework-free portfolio (HTML + CSS + JS) with an oscilloscope background, boot sequence, interactive chip pinout, OTA/MQTT simulations and a working terminal.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page content |
| `style.css` | All styling and themes |
| `script.js` | Interactions. **Your links are in the `CONFIG` block at the top.** |

## Deploy on GitHub Pages

1. Sign in to GitHub and click **New repository**.
2. Name it exactly `<your-username>.github.io` (for you: `Hackerbot16.github.io`). Make it **Public**.
3. Upload `index.html`, `style.css`, `script.js` and `resume.pdf` to the repository root. Use **Add file → Upload files**, then commit.
4. Open **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
5. Wait one to two minutes. Your site will be live at `https://<your-username>.github.io`.

Prefer a different repo name? Any repository works; the URL becomes `https://<your-username>.github.io/<repo-name>/`.

## Customise

- **GitHub / resume buttons:** edit `CONFIG` at the top of `script.js`. Empty values hide the button automatically.
  - *Download resume* is already wired to `resume.pdf`. To update it, replace that file (keep the name). Note the PDF contains your phone number and will be public once uploaded.
- **Text:** all content is plain HTML in `index.html`.
- **Colours:** change the `--accent` variables at the top of `style.css`. Visitors can also click the ◐ button to cycle green / amber / cyan.
- **Preview locally:** double-click `index.html`, or run `python3 -m http.server` in this folder.

## Easter eggs

Try the terminal commands `help` and `sudo hire akash`, and the Konami code.
