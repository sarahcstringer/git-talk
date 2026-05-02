# The Git Commands I Avoided for 9 Years

Slides from Sarah Deaton's talk at Write the Docs Portland 2026.

If you came here from the QR code, [**RESOURCES.md**](./RESOURCES.md) is the takeaway list — `worktree`, `reflog`, `--update-refs`, and the bonus picks (`log -S`, `rerere`, `bisect`, `jj`, etc.).

## Run the slides

The deck is a single-page React app. `Talk.html` loads the JSX files at runtime and compiles them in the browser with Babel. Opening `Talk.html` directly with `file://` shows a blank page because browsers block script loading from the local filesystem — serve the directory over HTTP instead.

From this directory, pick one:

```bash
# Python 3 (preinstalled on macOS)
python3 -m http.server 8000

# Or Node, if you prefer
npx http-server -p 8000 -c-1
```

Then open <http://localhost:8000/Talk.html>.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `→` `↓` `PageDown` `Space` | Next step or slide |
| `←` `↑` `PageUp` | Previous step or slide |
| `Space` (on a video slide) | Play/pause the video |
| `MediaPlayPause` | Play/pause on a video slide |
| `Home` / `End` | Jump to first / last slide |

Click the right or left third of the slide to advance or go back. Position is saved to `localStorage` — reloading drops you back where you were.

## Files

```
Talk.html       entry point — open this in the browser
slides.jsx      slide components
deck.jsx        slide registry + navigation
git-viz.jsx     reusable git visualizations
videos/         clips referenced by the video slides
RESOURCES.md    every command from the talk + a few extras
```

A static export is available at `?print` — open <http://localhost:8000/Talk.html?print> and use the browser's Print to PDF.
