# Morgen- & Abendroutine (PWA für zwei Kinder)

## Dateien
| Datei | Zweck |
|---|---|
| `index.html` | App-Gerüst, iOS-Meta-Tags für den Home-Bildschirm |
| `style.css` | Design, Hintergründe (Sonne/Vögel bzw. Mond/Eule), Animationen |
| `app.js` | Logik: Kacheln, Speichern, Einstellungen, Belohnungs-Animationen |
| `sw.js` | Service Worker, speichert alle Dateien für den Offline-Betrieb |
| `manifest.json` | Web-App-Manifest |
| `icons/` | App-Icons (u. a. `apple-touch-icon` für iOS) |

## Auf das iPad bringen
Ein Service Worker funktioniert nur über **HTTPS**. Die Dateien müssen daher einmal auf einen Webserver:

1. **Am einfachsten:** [Netlify Drop](https://app.netlify.com/drop) öffnen und den ganzen Ordner hineinziehen. Alternativ GitHub Pages.
2. Die URL auf dem iPad in **Safari** öffnen.
3. Teilen-Symbol → **„Zum Home-Bildschirm“**.
4. Die App **einmal vom Home-Bildschirm starten**, solange noch Internet da ist. Danach läuft sie komplett offline.

**Wichtig:**
- Kacheln erst **in der Home-Bildschirm-App** einstellen. iOS speichert die Daten der Home-Bildschirm-App getrennt von Safari.
- Für den Offline-Betrieb ist **iOS 11.3 oder neuer** nötig. Das gilt z. B. für iPad Air 1 und iPad mini 2 (bis iOS 12.5). Auf älteren Geräten läuft die App, braucht aber Internet.

## Bedienung
- **Kind wählen:** oben links. Die Namen werden im ⚙️-Menü eingetragen und nur auf dem iPad gespeichert, nicht im Code.
- **Routine wählen:** ☀️ Morgen / 🌙 Abend. Der Fortschritt bleibt beim Umschalten erhalten.
- **Kachel antippen:** Sie wird grün. Nochmal antippen macht es rückgängig.
- **Alle Kacheln erledigt:** Eine zufällige Belohnungs-Animation erscheint (je 5 für morgens und abends).
- **↺ Alles zurücksetzen:** gilt nur für das aktuelle Kind und die aktuelle Routine.
- **⚙️ Zahnrad:** Einstellungen für das aktuelle Kind. Dort lassen sich Name und Bild festlegen sowie Kacheln für morgens und abends hinzufügen, entfernen oder sortieren (max. 12).

## Änderungen später ausrollen
Nach Änderungen an den Dateien in `sw.js` die Versionsnummer erhöhen (`routine-app-v1` → `v2`). So lädt das iPad beim nächsten Start mit Internet die neue Version. Gespeicherte Einstellungen und Fortschritte bleiben erhalten.
