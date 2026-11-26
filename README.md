# RUNCOACH PRO — Android-first MVP

This is a working mobile-first installable web app (PWA) prototype with selectable goals from middle-distance events through ultra marathon. It can be added to an Android home screen from a secure HTTPS host. It is not yet a compiled APK.

## Included in this MVP
- Manual run logging: date, type, distance, duration, average HR, RPE, sleep, leg status, notes.
- Local dashboard: weekly mileage, number of runs, average pace, weekly goal progress.
- Activity history and CSV export.
- Local coach insights with conservative rules for reported pain, fatigue, low sleep, high RPE, and multiple hard sessions.
- Local profile settings with goals for 800 m, 1500 m, 3000 m, 5K, 10K, half marathon, marathon, ultra marathon, custom distance, and general fitness.
- PWA manifest and service worker for offline app shell.

## Important current limitations
- Data is stored only in the browser's local storage on this device. Clearing browser/app data may erase it. CSV export is provided for backup.
- Strava is shown as a planned integration, not connected. A real integration needs a Strava developer app, OAuth authorization, redirect URI, token storage and refresh on a backend.
- AI chat is not connected yet. The current coach is a transparent local rules engine, not a generative AI model. A production AI coach requires a backend endpoint and API key stored server-side; never ship a secret key inside the APK. The selected race distance is a profile setting in this prototype; individualized periodized training plans for each distance are a future feature and are not yet generated automatically.
- No GPS recording, smartwatch sync, cloud account, or push notifications yet.

## Run locally
Serve this folder over HTTPS or localhost. For example:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` in a browser. For Android installation, deploy the folder to an HTTPS host and open it in Chrome, then choose **Add to Home screen / Install app**.

## Roadmap to a native Android APK
1. Wrap the PWA using Capacitor or implement native Kotlin screens.
2. Add a secure backend (authentication, database, Strava OAuth, AI coach endpoint).
3. Add privacy consent, data deletion, export and backup controls.
4. Configure Android package ID, app icon, signing key and release build in Android Studio.

A native signed APK cannot be produced in this workspace because the Android SDK/Gradle build toolchain is not installed.


## Mode Coach gratis offline
Evaluasi dan saran Coach Intelligence dihitung secara lokal di browser dari profil dan catatan latihan. Tidak memerlukan API key, kartu kredit, langganan, atau koneksi AI eksternal. Ini adalah analisis berbasis aturan, bukan AI generatif, dan tidak menjamin layanan pihak ketiga gratis selamanya. Strava belum terhubung.
