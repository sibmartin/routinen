# Morgen- & Abendroutine (PWA für zwei Kinder)

## Dateien
| Datei | Zweck |
|---|---|
| `index.html` | App-Gerüst, iOS-Meta-Tags für den Home-Bildschirm |
| `style.css` | Design im Gaming-Look, Hintergründe (Tageshimmel bzw. Weltraum), Anpassung an iPad/iPhone, Animationen |
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

## iPhone und andere Bildschirmgrößen
Die App passt sich an iPad und iPhone an, im Hoch- wie im Querformat. Passt die obere Leiste nicht in eine Zeile, werden zuerst die Uhrziffern und die Wörter „Morgen“/„Abend“ ausgeblendet. Reicht das nicht (z. B. iPhone hochkant), wird die Leiste zweizeilig: oben die Kinder und das ⚙️, darunter Uhr und Morgen/Abend. Die Einstellungen füllen auf dem Handy den ganzen Bildschirm.

## Bedienung
- **Kind wählen:** oben links. Die Namen werden im ⚙️-Menü eingetragen und nur auf dem iPad gespeichert, nicht im Code.
- **Welches Kind ist dran?** Ein breiter Rahmen in der Farbe des Kindes läuft um den ganzen Bildschirm, dazu schwebt sein Tierbild im Hintergrund. Das andere Kind ist oben grau dargestellt. Jedes Kind hat eine eigene Farbe: Die Farbe des Geschwisterkindes ist im ⚙️-Menü gesperrt.
- **Routine wählen:** ☀️ Morgen / 🌙 Abend. Der Fortschritt bleibt beim Umschalten erhalten.
- **Kachel antippen:** Sie wird grün, ein „+1“ steigt auf und die Energie-Leiste oben füllt sich. Nochmal antippen macht es rückgängig.
- **Alle Kacheln erledigt:** Eine zufällige Belohnungs-Animation erscheint (je 5 für morgens und abends: Pokal mit 3 Sternen, Feuerwerk, Konfetti-Party, Luftballons, Goldmedaille bzw. abends Sternschnuppen und Nordlicht). Sie bleibt stehen, bis das Kind auf **Weiter** oder irgendwo auf den Bildschirm tippt.
- **Nur eine Belohnung pro Tag:** Pro Kind und Routine gibt es die Belohnung einmal am Tag. Wer die letzte Kachel ab- und wieder anwählt, sieht nur „Heute schon geschafft“.
- **Neuer Tag:** Um 3 Uhr nachts werden alle Kacheln automatisch wieder geöffnet.
- **↺ Alles zurücksetzen:** gilt nur für das aktuelle Kind und die aktuelle Routine. Vorher kommt eine **Elternfreigabe** (Rechenaufgabe wie „7 × 8“ oder „46 + 27“), jedes Mal neu. Das Zurücksetzen gibt auch die Belohnung wieder frei, z. B. wenn ein Kind beim falschen Geschwisterkind abgehakt hat.
- **⚙️ Zahnrad:** Einstellungen für das aktuelle Kind. Dort lassen sich Name und Bild festlegen sowie Kacheln für morgens und abends hinzufügen, entfernen oder sortieren (max. 12).

## Änderungen später ausrollen
Nach Änderungen an den Dateien in `sw.js` die Versionsnummer erhöhen (`routine-app-v1` → `v2`). So lädt das iPad beim nächsten Start mit Internet die neue Version. Gespeicherte Einstellungen und Fortschritte bleiben erhalten.
