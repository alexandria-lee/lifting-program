# Strength Trainer

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
- **Backup & restore** — export all your logs to a file (Files / iCloud Drive)
  and restore them later. Your data is otherwise only on this device, so the
  backup is your safety net before reinstalling or switching phones.

## Use it on your phone (GitHub Pages)

This repo deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`).
The workflow enables GitHub Pages for you on the first run (`enablement: true`),
so no manual setup is normally needed.

Every push to the `claude/workout-tracker-mobile-1m9ee5` branch redeploys the app.
Once the "Deploy to GitHub Pages" workflow finishes, the app is live at:

```
https://alexandria-lee.github.io/lifting-program/
```

If the workflow ever can't enable Pages automatically (e.g. restricted Actions
permissions), enable it once by hand: **Settings → Pages → Build and deployment
→ Source → "GitHub Actions"**, then re-run the workflow.

On your phone, open that URL and:

- **iPhone (Safari):** Share → *Add to Home Screen*.
- **Android (Chrome):** menu → *Add to Home screen* / *Install app*.

It then opens full-screen like a native app and runs offline at the gym.

## Back up & restore your data

Your sets and weights live only in this device's browser storage. Deleting the
home-screen app, clearing website data, or switching phones wipes them — so
keep a backup file, which lives *outside* the app where those actions can't
touch it.

- **Backup** (top-right) packages everything into a small `.json` file and opens
  the share sheet — choose **Save to Files** (iCloud Drive is safest) or AirDrop
  / email it to yourself.
- **Restore** opens a file picker; choose a backup to load it back. It *replaces*
  what's in the app (with a confirm), and you get an **Undo** straight after.
- A small dot on **Backup** means you've logged sets since your last backup.

**When to back up:** after each session, and always before deleting/reinstalling
the app, clearing Safari data, a big iOS update, or moving to a new phone.

## Evolving the data schema (for future changes)

Backups and on-device storage share one versioned shape so the app can change
without losing entries. On every launch the app migrates stored data forward to
`CURRENT_SCHEMA`; imports run through the same pipeline. The relevant pieces live
in the `BACKUP / MIGRATION` block of `index.html`:

- **Adding an optional field** (e.g. a per-set `notes`): **no schema bump.**
  `normRow()` fills missing fields with defaults and preserves unknown ones, so
  old data and old backups just gain the new field empty.
- **Renaming/removing a field, changing a key format, or re-meaning a value:**
  bump `CURRENT_SCHEMA` by 1 and add a `MIGRATIONS[n]` step that upgrades data
  from schema `n` to `n+1`. Every old backup and existing device upgrades
  automatically.
- **Changing the unit** (kg ↔ lb): change `APP_UNIT`. Import compares it against
  the file's `app.unit` and offers to convert rather than silently relabelling.

Guard rails: a backup from a *newer* schema than the app is refused (update the
app first); an unrecognised/corrupt file is rejected without touching live data;
and a restore snapshots the previous state so it can be undone.

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
