# Iron Log

A phone-friendly tracker for an 8-week lifting block. Tick each set as you go,
log the weight you used, and the app remembers everything between sessions and
points you to the workout you should do next.

Built as a single static page — no server, no account. Your logged sets and
weights are stored locally on your device.

## Features

- **Tick each set** as you complete it; a progress bar shows sets logged.
- **Log the weight** used on every working set so you can progressively overload.
  Bodyweight moves (Hanging Leg Raise) show no weight field — just reps.
- **Saves automatically** on your device (browser `localStorage`), so reopening
  the app never loses your data.
- **Marks a session done** when all its sets are ticked, badges finished days
  with a ✓, and **opens on the next session you still need to do** — so at the
  gym you always know what's next.
- **Installable PWA** — add it to your home screen and it works offline.

## Use it on your phone (GitHub Pages)

This repo deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`).

**One-time setup:** in this repository on GitHub, go to
**Settings → Pages → Build and deployment → Source** and choose **"GitHub Actions"**.

After that, every push to the `claude/workout-tracker-mobile-1m9ee5` branch
redeploys the app. Once the "Deploy to GitHub Pages" workflow finishes, the app
is live at:

```
https://alexandria-lee.github.io/lifting-program/
```

On your phone, open that URL and:

- **iPhone (Safari):** Share → *Add to Home Screen*.
- **Android (Chrome):** menu → *Add to Home screen* / *Install app*.

It then opens full-screen like a native app and runs offline at the gym.

## Run it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

A plain web server is required (service worker + manifest don't work from a
`file://` URL).

## The program

8 weeks, 5 training days that cycle through phases (Reintroduction →
Accumulation → Intensification → Deload/Retest). Sets, rep targets and RPE
adjust automatically by week. The exercise list is fixed:

- **D1 Squat** — Back Squat, Romanian Deadlift, Bulgarian Split Squat, Leg Press, Standing Calf Raise, Hanging Leg Raise
- **D2 Bench** — Bench Press, Overhead Press, Incline DB Press, Weighted Dip, Lateral Raise, Triceps Pushdown
- **D3 Deadlift** — Deadlift, Barbell Row, Pull-Up / Lat Pulldown, Face Pull, Barbell Curl, Back Extension
- **D4 Bench variation** — Bench Variation, Incline DB Press, Seated Cable Row, Lat Pulldown, Lateral Raise, Hammer Curl
- **D5 Squat variation** — Squat Variation, Romanian Deadlift, Walking Lunge, Leg Curl, Leg Extension, Seated Calf Raise

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app (program data, UI, logic). |
| `manifest.json` | PWA manifest (installability). |
| `sw.js` | Service worker (offline app shell). |
| `icon.svg` | App icon. |
| `.github/workflows/deploy.yml` | GitHub Pages deployment. |
