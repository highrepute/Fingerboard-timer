# Fingerboard Timer

An interval timer for fingerboard training. Runs in the browser, installs to your
home screen, and works offline.

**[Open the app](https://highrepute.github.io/Fingerboard-timer/)**

## What it does

Set your sets, reps, hang time and rest periods, hit Start, and it counts you
through the session — audio cues at the start and end of every hang, ticks for
the final seconds so you can prepare without watching the screen.

- **Presets** — Repeaters and Max hangs built in, plus up to 8 of your own
- **Hand alternation** — optional L/R indicator for one-arm work, alternating each set
- **Time remaining** — shows the whole session's length before you start, counts down during
- **Restart set** — rewinds to a 10-second countdown if you miss the start of a set
- **Add set** — extend the session by one set while it's running
- **Light and dark themes**
- **Works offline** once installed, and survives being backgrounded or reloaded mid-session

## Installing

**Android (Chrome):** open the link, then ⋮ → *Install app* (or *Add to Home screen*).

**iPhone (Safari):** open the link, then Share → *Add to Home Screen*.

Installing gives you a home-screen icon and full-screen launch. You can also just
use it in a browser tab.

## Using it

Tap **Setup** to expand the settings; it collapses automatically when you start,
making the countdown larger.

| Field | Meaning |
|---|---|
| Sets | Number of sets |
| Reps | Hangs per set |
| Rep time | Length of each hang, in seconds |
| Rep rest | Rest between hangs, in seconds |
| Set rest | Rest between sets, in seconds |

Every session opens with a 10-second get-ready countdown.

**Sounds.** A long tone marks the start and end of each hang. Ticks count the last
3 seconds of a hang, rep rest, or the get-ready countdown, and the last 10 seconds
of a set rest. Both can be switched off.

**Start** becomes **Pause**, then **Resume** — it keeps your place. **Reset** is the
only thing that returns to the beginning.

### Built-in presets

| | Sets | Reps | Rep time | Rep rest | Set rest |
|---|---|---|---|---|---|
| Repeaters | 4 | 6 | 7s | 3s | 180s |
| Max hangs | 5 | 1 | 10s | – | 180s |

To save your own, set the numbers you want and tap **Save**. Presets store the hand
setting too. **Edit** appears once you have one, and reveals a × to delete.

## Notes and limitations

- **Keep the app in the foreground.** Browsers suspend background tabs, so the sound
  stops if you switch apps. The timer itself stays correct — it's anchored to the
  clock, so it shows the right phase when you come back — but you'll miss the cues.
  The app requests a wake lock to stop the screen sleeping during a session.
- Settings, presets and theme are stored on your device only. Nothing is uploaded,
  and there are no accounts or tracking.
- Clearing your browser's site data will erase your presets.

## Training safely

Fingerboarding loads tendons and pulleys hard, and finger injuries are slow to heal.
Warm up thoroughly before hanging, build up gradually, and stop if you feel anything
sharp. If you're new to it, read up on a structured protocol rather than guessing —
this app is just a timer and assumes you know what you're doing on the board.

## Development

Everything is static — no build step, no dependencies.

| File | Purpose |
|---|---|
| `index.html` | The whole app: markup, styles and logic |
| `service-worker.js` | Offline caching and update handling |
| `manifest.json` | Install metadata |
| `icon-*.png` | App icons, including a maskable variant for Android |

To run locally, serve the folder over HTTP (`python3 -m http.server`) rather than
opening the file directly — service workers need a secure context, which means
HTTPS or `localhost`.

Deployed via GitHub Pages. The version number at the bottom of the settings panel
matches `CACHE_NAME` in `service-worker.js`; bump both when releasing so you can
confirm an update has landed.
