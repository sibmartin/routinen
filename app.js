/* =========================================================
   Routine-App für zwei Kinder (Namen werden im ⚙️-Menü eingestellt)
   Bewusst in ES5 geschrieben, damit sie auch auf alten iPads
   (Safari/iOS 10–12) läuft.
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'kinder-routine-v1';
  var MAX_TILES = 12;
  var MAX_NAME = 16;

  var KIDS = [
    { id: 'kind1', defaultName: 'Kind 1', avatar: '🦊', color: '#ff8a5b' },
    { id: 'kind2', defaultName: 'Kind 2', avatar: '🦄', color: '#a77bff' }
  ];

  var AVATARS = ['🦊', '🦄', '🐱', '🐶', '🐰', '🐻', '🐼', '🦁', '🐸', '🐯', '🐨', '🐧', '🦋', '🐞', '🌸', '⭐'];
  var KID_COLORS = ['#ff8a5b', '#a77bff', '#34aadc', '#3cc45a', '#ff5e9a', '#ffb627', '#1fbfae', '#5b6ee1'];

  var ROUTINES = {
    morning: { label: 'Morgen', icon: '☀️' },
    evening: { label: 'Abend',  icon: '🌙' }
  };

  /* Eigene Icons für Motive, die es (auf alten iPads) nicht als Emoji gibt */
  var SVG = {
    // Haarbürste und Kamm
    haare: '<svg viewBox="0 0 64 64">' +
      '<g transform="rotate(35 32 32)"><rect x="10" y="27" width="44" height="7" rx="3" fill="#ffb627"/>' +
      '<path d="M13 34v9M17 34v9M21 34v9M25 34v9M29 34v9M33 34v9M37 34v9M41 34v9M45 34v9M49 34v9" stroke="#f39c12" stroke-width="2.4" stroke-linecap="round"/></g>' +
      '<g transform="rotate(35 32 32)"><rect x="28" y="30" width="8" height="30" rx="4" fill="#e0508f"/>' +
      '<ellipse cx="32" cy="18" rx="14" ry="16" fill="#ff7eb6"/><ellipse cx="32" cy="18" rx="10" ry="12" fill="#ffd1e6"/>' +
      '<g fill="#c2457e"><circle cx="27" cy="10" r="1.4"/><circle cx="32" cy="9" r="1.4"/><circle cx="37" cy="10" r="1.4"/>' +
      '<circle cx="25" cy="15" r="1.4"/><circle cx="30" cy="15" r="1.4"/><circle cx="35" cy="15" r="1.4"/><circle cx="39" cy="15" r="1.4"/>' +
      '<circle cx="25" cy="21" r="1.4"/><circle cx="30" cy="21" r="1.4"/><circle cx="35" cy="21" r="1.4"/><circle cx="39" cy="21" r="1.4"/>' +
      '<circle cx="27" cy="26" r="1.4"/><circle cx="32" cy="27" r="1.4"/><circle cx="37" cy="26" r="1.4"/></g></g></svg>',

    // Erwachsener umarmt Kind
    kuscheln: '<svg viewBox="0 0 64 64">' +
      '<path d="M8 62C8 50 12 44 20 44S32 50 32 62Z" fill="#ff7a8a"/>' +
      '<circle cx="20" cy="36" r="8" fill="#f9d0a8"/>' +
      '<path d="M12 35C12 26 28 26 28 35C25 31 15 31 12 35Z" fill="#e8a33d"/>' +
      '<circle cx="11.5" cy="33" r="3" fill="#e8a33d"/><circle cx="28.5" cy="33" r="3" fill="#e8a33d"/>' +
      '<path d="M16 36q1.2-1.4 2.4 0M21.6 36q1.2-1.4 2.4 0M17.5 39.5q2.5 2.5 5 0" stroke="#5a3a22" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '<path d="M26 62C26 44 30 36 42 36S58 44 58 62Z" fill="#5b8def"/>' +
      '<circle cx="42" cy="24" r="10" fill="#f7c59f"/>' +
      '<path d="M32 23C31 11 53 11 52 23C49 17 36 17 32 23Z" fill="#6b4226"/>' +
      '<path d="M37 24q1.5-1.6 3 0M44 24q1.5-1.6 3 0M39 28.5q3 3 6 0" stroke="#5a3a22" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
      '<circle cx="36" cy="27.5" r="1.8" fill="#ff9aa2" opacity=".7"/><circle cx="15" cy="39" r="1.5" fill="#ff9aa2" opacity=".7"/>' +
      '<path d="M37 45C29 44 19 47 12 53" stroke="#5b8def" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="12" cy="53" r="3.5" fill="#f7c59f"/>' +
      '<path d="M22 22C14 16 14 8 19 8C21 8 22 10 22 11C22 10 23 8 25 8C30 8 30 16 22 22Z" fill="#ff4d6d"/></svg>',

    // Geschirrspülmaschine mit Tellern
    teller: '<svg viewBox="0 0 64 64">' +
      '<rect x="8" y="6" width="48" height="54" rx="6" fill="#e4eaf1"/>' +
      '<path d="M8 12a6 6 0 0 1 6-6h36a6 6 0 0 1 6 6v6H8z" fill="#8fa3b8"/>' +
      '<circle cx="15" cy="12" r="2.2" fill="#4cd964"/><circle cx="22" cy="12" r="2.2" fill="#fff"/>' +
      '<rect x="35" y="9.5" width="15" height="5" rx="2" fill="#2d3e50"/>' +
      '<rect x="26" y="20" width="12" height="2.4" rx="1.2" fill="#8fa3b8"/>' +
      '<rect x="13" y="24" width="38" height="31" rx="5" fill="#bfe6ff" stroke="#8fa3b8" stroke-width="2"/>' +
      '<g fill="#fff" stroke="#7fb2d9" stroke-width="1.5"><ellipse cx="22" cy="39" rx="4" ry="10"/><ellipse cx="31" cy="39" rx="4" ry="10"/><ellipse cx="40" cy="39" rx="4" ry="10"/></g>' +
      '<g fill="none" stroke="#cfe6f7" stroke-width="1.2"><ellipse cx="22" cy="39" rx="2" ry="6"/><ellipse cx="31" cy="39" rx="2" ry="6"/><ellipse cx="40" cy="39" rx="2" ry="6"/></g>' +
      '<path d="M15 50h34" stroke="#8fa3b8" stroke-width="2" stroke-linecap="round"/>' +
      '<g fill="#fff" stroke="#9fd3f5" stroke-width="1"><circle cx="46" cy="29" r="2.6"/><circle cx="47" cy="37" r="1.8"/><circle cx="17" cy="28" r="1.6"/><circle cx="36" cy="27.5" r="1.3"/></g></svg>',

    // Brotdose mit Pausenbrot und Apfel
    brotdose: '<svg viewBox="0 0 64 64">' +
      '<path d="M9 32L13 10H51L55 32Z" fill="#9fdc7c"/>' +
      '<path d="M13 14H51" stroke="#7ccd5b" stroke-width="2"/>' +
      '<path d="M12 34L28 13L44 34Z" fill="#f4c27a" stroke="#c98a3a" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M18 32L28 19L38 32Z" fill="#fde7b5"/>' +
      '<path d="M22 30h7l-3 3z" fill="#ffd93b"/>' +
      '<path d="M11 34q4-3 8 0t8 0t8 0t8 0" stroke="#4cd964" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<circle cx="49" cy="28" r="7" fill="#ff5e5e"/><path d="M49 21q0-3 2-5" stroke="#8a5a2b" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M50 19q4-4 7-2q-3 4-7 2z" fill="#4cd964"/><circle cx="46.5" cy="25.5" r="1.8" fill="#fff" opacity=".6"/>' +
      '<rect x="6" y="31" width="52" height="27" rx="7" fill="#3cc45a"/>' +
      '<path d="M10 37h44" stroke="#2eaa4b" stroke-width="2"/>' +
      '<rect x="25" y="41" width="14" height="6" rx="3" fill="#fff" opacity=".85"/></svg>',

    // Gesicht mit Waschlappen und Wassertropfen
    gesicht: '<svg viewBox="0 0 64 64">' +
      '<circle cx="27" cy="34" r="20" fill="#f9d0a8"/>' +
      '<path d="M7 32C7 12 47 12 47 32C43 22 34 18 27 18S11 22 7 32Z" fill="#e8a33d"/>' +
      '<path d="M17 34q2.5-2.6 5 0M30 34q2.5-2.6 5 0M21 42q6 5 12 0" stroke="#5a3a22" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<circle cx="15.5" cy="40" r="3" fill="#ff9aa2" opacity=".6"/>' +
      '<g transform="rotate(18 47 44)"><rect x="36" y="33" width="23" height="21" rx="3" fill="#34aadc"/>' +
      '<path d="M36 38h23M36 49h23" stroke="#bfe6ff" stroke-width="2"/>' +
      '<path d="M38 54v3M42 54v3M46 54v3M50 54v3M54 54v3" stroke="#34aadc" stroke-width="1.6" stroke-linecap="round"/></g>' +
      '<path d="M55 6C55 6 59 12 59 14A4 4 0 0 1 51 14C51 12 55 6 55 6Z" fill="#6cc3f5"/>' +
      '<path d="M46 3C46 3 49 7 49 9A3 3 0 0 1 43 9C43 7 46 3 46 3Z" fill="#9fd3f5"/>' +
      '<g fill="#fff" stroke="#9fd3f5" stroke-width="1"><circle cx="40" cy="25" r="2.6"/><circle cx="45" cy="21" r="1.6"/></g></svg>',

    // Zahnbürste mit Zahnpasta und fröhlicher Zahn
    zaehne: '<svg viewBox="0 0 64 64">' +
      '<g transform="rotate(-35 40 26)"><rect x="20" y="24" width="42" height="8" rx="4" fill="#34aadc"/>' +
      '<rect x="41" y="13" width="18" height="11" rx="2" fill="#fff" stroke="#9fd3f5" stroke-width="1.4"/>' +
      '<path d="M45 13v11M49.5 13v11M54 13v11" stroke="#cfe6f7" stroke-width="1.2"/>' +
      '<path d="M40 13c0-5 4-7 8-5 3-4 9-2 9 1 4 0 4 4 1 4z" fill="#fff" stroke="#8fd9c2" stroke-width="1.4"/>' +
      '<path d="M44 10.5q4-2.5 8 0" stroke="#ff7a8a" stroke-width="1.8" fill="none"/></g><g transform="translate(-3 -7) scale(1.15)">' +
      '<path d="M5 38c0-6 4-9 9-8 2 .4 3 1.5 5 1.5s3-1.1 5-1.5c5-1 9 2 9 8 0 4-1.5 6-2.5 10-.8 3.5-1 10-4.5 10-2.6 0-2.6-7-5-7s-2.4 7-5 7c-3.5 0-3.7-6.5-4.5-10C6.5 44 5 42 5 38z" fill="#fff" stroke="#b8c4d6" stroke-width="1.6"/>' +
      '<circle cx="14" cy="39" r="1.5" fill="#5a3a22"/><circle cx="24" cy="39" r="1.5" fill="#5a3a22"/>' +
      '<path d="M15.5 43q3.5 3 7 0" stroke="#5a3a22" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '</g><path d="M36 44l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#ffd93b"/></svg>',

    // Hand mit Seifenblasen und Seife
    haende: '<svg viewBox="0 0 64 64">' +
      '<g fill="#f9d0a8"><rect x="17" y="30" width="24" height="24" rx="9"/>' +
      '<rect x="17.5" y="15" width="5.5" height="22" rx="2.75"/><rect x="23.5" y="11" width="5.5" height="24" rx="2.75"/>' +
      '<rect x="29.5" y="12" width="5.5" height="24" rx="2.75"/><rect x="35.5" y="16" width="5.5" height="22" rx="2.75"/>' +
      '<rect x="9" y="30" width="6" height="16" rx="3" transform="rotate(-35 12 38)"/></g>' +
      '<rect x="36" y="46" width="22" height="13" rx="5" fill="#ff9ec4"/><rect x="40" y="49" width="14" height="4" rx="2" fill="#ffd1e6"/>' +
      '<g fill="#fff" fill-opacity=".85" stroke="#6cc3f5" stroke-width="1.4">' +
      '<circle cx="48" cy="22" r="7"/><circle cx="55" cy="36" r="4.5"/><circle cx="12" cy="18" r="4"/><circle cx="8" cy="54" r="3.5"/><circle cx="30" cy="40" r="4"/></g>' +
      '<path d="M45 19q2-2 4-1" stroke="#fff" stroke-width="1.5" fill="none"/></svg>',

    // Wäschekorb mit Kleidung
    kleidung: '<svg viewBox="0 0 64 64">' +
      '<path d="M15 30L13 16L22 11H27Q31.5 16 36 11H41L50 16L48 30Z" fill="#ff7a8a"/>' +
      '<path d="M10 32h44l-5 26H15z" fill="#5b8def"/>' +
      '<g fill="#8fb4ff"><rect x="17" y="38" width="5" height="12" rx="2.5"/><rect x="25" y="38" width="5" height="12" rx="2.5"/>' +
      '<rect x="33" y="38" width="5" height="12" rx="2.5"/><rect x="41" y="38" width="5" height="12" rx="2.5"/></g>' +
      '<rect x="7" y="28" width="50" height="7" rx="3.5" fill="#3f6fd0"/>' +
      '<path d="M45 24v12q0 5 5 5h5q3 0 3-3t-3-3h-4V24z" fill="#ffd93b"/>' +
      '<path d="M45 27h6" stroke="#ffb627" stroke-width="2"/></svg>',

    // Sparschwein mit Münze
    taschengeld: '<svg viewBox="0 0 64 64">' +
      '<circle cx="33" cy="11" r="8" fill="#ffd93b" stroke="#f0a500" stroke-width="2"/>' +
      '<text x="33" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#c98a00">€</text>' +
      '<rect x="18" y="50" width="7" height="10" rx="2.5" fill="#ff7eb6"/><rect x="38" y="50" width="7" height="10" rx="2.5" fill="#ff7eb6"/>' +
      '<path d="M22 27l3-9 7 7z" fill="#ff7eb6"/>' +
      '<ellipse cx="31" cy="40" rx="22" ry="16" fill="#ff9ec4"/>' +
      '<rect x="27" y="24.5" width="12" height="3" rx="1.5" fill="#c2457e"/>' +
      '<ellipse cx="53" cy="40" rx="5" ry="6" fill="#ff7eb6"/><circle cx="52" cy="38" r="1.2" fill="#c2457e"/><circle cx="52" cy="42" r="1.2" fill="#c2457e"/>' +
      '<circle cx="43" cy="34" r="2" fill="#5a3a22"/>' +
      '<path d="M9 38q-6-1-4-6q2-3 4 0" stroke="#ff7eb6" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',

    // Ordentliches Regal mit Glitzer
    aufraeumen: '<svg viewBox="0 0 64 64">' +
      '<rect x="8" y="10" width="48" height="48" rx="4" fill="#c98a5a"/>' +
      '<rect x="12" y="14" width="40" height="18" fill="#f4d9b8"/><rect x="12" y="35" width="40" height="19" fill="#f4d9b8"/>' +
      '<rect x="15" y="17" width="5" height="15" rx="1" fill="#ff5e5e"/><rect x="21" y="19" width="5" height="13" rx="1" fill="#34aadc"/>' +
      '<rect x="27" y="17" width="5" height="15" rx="1" fill="#4cd964"/>' +
      '<circle cx="43" cy="26" r="6" fill="#ffb627"/><path d="M37.5 24q5.5 3 11 0" stroke="#fff" stroke-width="1.6" fill="none"/>' +
      '<rect x="15" y="42" width="14" height="12" rx="1.5" fill="#a77bff"/><rect x="19" y="40" width="6" height="3" rx="1" fill="#8a5fe0"/>' +
      '<rect x="33" y="44" width="9" height="10" rx="1.5" fill="#ff7a8a"/><rect x="43" y="44" width="7" height="10" rx="1.5" fill="#ffd93b"/>' +
      '<g fill="#ffd93b" stroke="#f0a500" stroke-width=".8"><path d="M56 2l1.6 4.4 4.4 1.6-4.4 1.6L56 14l-1.6-4.4L50 8l4.4-1.6z"/>' +
      '<path d="M6 50l1.2 3.3 3.3 1.2-3.3 1.2L6 59l-1.2-3.3-3.3-1.2 3.3-1.2z"/></g></svg>',

    // Spielkiste: Teddy und Ball wandern hinein
    spielzeug: '<svg viewBox="0 0 64 64">' +
      '<path d="M8 36L12 24H52L56 36Z" fill="#ffc07a"/>' +
      '<circle cx="19" cy="23" r="3.5" fill="#b5835a"/><circle cx="31" cy="23" r="3.5" fill="#b5835a"/>' +
      '<circle cx="25" cy="30" r="8" fill="#c9965c"/><circle cx="25" cy="33" r="3.2" fill="#ecd2b0"/>' +
      '<circle cx="22" cy="28" r="1.2" fill="#3a2a1a"/><circle cx="28" cy="28" r="1.2" fill="#3a2a1a"/><circle cx="25" cy="32" r="1" fill="#3a2a1a"/>' +
      '<circle cx="42" cy="31" r="7" fill="#34aadc"/><path d="M35.5 29q6.5 4 13 0" stroke="#fff" stroke-width="1.8" fill="none"/>' +
      '<rect x="6" y="35" width="52" height="24" rx="4" fill="#ff9f43"/>' +
      '<rect x="6" y="35" width="52" height="5" fill="#f08a2a"/>' +
      '<path d="M24 46h16" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M29 1h6v8h5l-8 9-8-9h5z" fill="#4cd964"/></svg>',

    // Sonnencreme-Flasche mit Sonne und Klecks
    sonnencreme: '<svg viewBox="0 0 64 64">' +
      '<g stroke="#ffb627" stroke-width="2.4" stroke-linecap="round"><path d="M52 2v4M52 22v4M40 14h4M60 14h4M44 6l2.5 2.5M57.5 19.5L60 22M44 22l2.5-2.5M57.5 8.5L60 6"/></g>' +
      '<circle cx="52" cy="14" r="6" fill="#ffd93b"/>' +
      '<rect x="23" y="7" width="12" height="11" rx="3" fill="#ff7a2f"/>' +
      '<rect x="17" y="17" width="24" height="41" rx="7" fill="#ffd93b"/>' +
      '<circle cx="29" cy="38" r="7" fill="#ff9f43"/><circle cx="29" cy="38" r="4" fill="#ffb627"/>' +
      '<path d="M44 50c0-4 6-6 9-3 4-1 7 3 4 6-2 3-12 3-13-3z" fill="#fff" stroke="#e0d7c0" stroke-width="1.4"/></svg>',

    // Glas Wasser
    trinken: '<svg viewBox="0 0 64 64">' +
      '<path d="M15 10h34l-4.5 46a4 4 0 0 1-4 3.6H23.5a4 4 0 0 1-4-3.6z" fill="#eef8ff" stroke="#9fd3f5" stroke-width="2"/>' +
      '<path d="M18.2 26q6.8-3 13.8 0t13.8 0l-3.2 29.5a2.5 2.5 0 0 1-2.5 2.2H23.9a2.5 2.5 0 0 1-2.5-2.2z" fill="#6cc3f5"/>' +
      '<g fill="#fff" opacity=".8"><circle cx="28" cy="40" r="2"/><circle cx="36" cy="48" r="1.5"/><circle cx="34" cy="34" r="1.2"/></g>' +
      '<rect x="20" y="14" width="3" height="36" rx="1.5" fill="#fff" opacity=".7"/>' +
      '<path d="M54 30C54 30 58 36 58 38A4 4 0 0 1 50 38C50 36 54 30 54 30Z" fill="#6cc3f5"/></svg>',

    // Katze mit Futternapf
    haustier: '<svg viewBox="0 0 64 64">' +
      '<path d="M19 22L18 6L30 15Z" fill="#ffb627"/><path d="M45 22L46 6L34 15Z" fill="#ffb627"/>' +
      '<path d="M21 18L20.5 10L27 15Z" fill="#ff9ec4"/><path d="M43 18L43.5 10L37 15Z" fill="#ff9ec4"/>' +
      '<circle cx="32" cy="29" r="15" fill="#ffb627"/>' +
      '<circle cx="26" cy="27" r="2" fill="#3a2a1a"/><circle cx="38" cy="27" r="2" fill="#3a2a1a"/>' +
      '<path d="M30 32h4l-2 2z" fill="#ff7a8a"/><path d="M29 35.5q3 2 6 0" stroke="#3a2a1a" stroke-width="1.2" fill="none"/>' +
      '<path d="M14 30h8M14 34h8M42 30h8M42 34h8" stroke="#8a5a2b" stroke-width="1" stroke-linecap="round"/>' +
      '<path d="M12 46q5-6 10 0q5-6 10 0q5-6 10 0q5-6 10 0z" fill="#b5835a"/>' +
      '<path d="M8 46h48l-6 12H14z" fill="#ff5e5e"/><rect x="24" y="50" width="16" height="4" rx="2" fill="#fff" opacity=".7"/></svg>',

    // Gießkanne gießt Blume
    blumen: '<svg viewBox="0 0 64 64">' +
      '<path d="M8 20q7-12 16 0" stroke="#2a8fc4" stroke-width="3" fill="none"/>' +
      '<path d="M30 30L46 15l3 3-15 16z" fill="#34aadc"/><rect x="44" y="11" width="8" height="5" rx="2" transform="rotate(45 48 13.5)" fill="#2a8fc4"/>' +
      '<rect x="4" y="20" width="28" height="22" rx="5" fill="#34aadc"/>' +
      '<g fill="#6cc3f5"><path d="M52 22c0 0 2 3 2 4a2 2 0 0 1-4 0c0-1 2-4 2-4z"/><path d="M57 26c0 0 2 3 2 4a2 2 0 0 1-4 0c0-1 2-4 2-4z"/><path d="M53 31c0 0 2 3 2 4a2 2 0 0 1-4 0c0-1 2-4 2-4z"/></g>' +
      '<path d="M50 62V46" stroke="#4cd964" stroke-width="3"/><path d="M50 56q-6-1-7-6q6 0 7 6z" fill="#4cd964"/>' +
      '<g fill="#ff7eb6"><circle cx="50" cy="38" r="4"/><circle cx="55" cy="42" r="4"/><circle cx="45" cy="42" r="4"/><circle cx="53" cy="47" r="4"/><circle cx="47" cy="47" r="4"/></g>' +
      '<circle cx="50" cy="43" r="3.2" fill="#ffd93b"/>' +
      '<rect x="36" y="60" width="28" height="4" rx="2" fill="#a0724a"/></svg>',

    // Aufgeschlagenes Buch mit Mond und Sternen
    geschichte: '<svg viewBox="0 0 64 64">' +
      '<path d="M40 3a10 10 0 1 0 7 15 8 8 0 0 1-7-15z" fill="#ffd93b"/>' +
      '<g fill="#ffd93b"><path d="M18 8l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z"/><path d="M56 22l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z"/></g>' +
      '<path d="M4 30v28q14-5 28 2 14-7 28-2V30z" fill="#5b6ee1"/>' +
      '<path d="M7 28q13-4 25 2v27q-12-6-25-2z" fill="#fff" stroke="#c9c4dc" stroke-width="1.2"/>' +
      '<path d="M57 28q-13-4-25 2v27q12-6 25-2z" fill="#fff" stroke="#c9c4dc" stroke-width="1.2"/>' +
      '<g stroke="#c9c4dc" stroke-width="1.6" stroke-linecap="round"><path d="M11 35q8-2 17 1M11 41q8-2 17 1M11 47q8-2 17 1M36 36q9-3 17-1M36 42q9-3 17-1M36 48q9-3 17-1"/></g></svg>',

    // Schlafanzug mit Monden und Sternen
    schlafanzug: '<svg viewBox="0 0 64 64">' +
      '<path d="M16 38H48L50 61H37L32 47L27 61H14Z" fill="#6f95ea"/>' +
      '<path d="M14 7L3 16L9 27L14 24V39H50V24L55 27L61 16L50 7H41Q32 15 23 7Z" fill="#8fb4ff"/>' +
      '<path d="M32 13V39" stroke="#6f95ea" stroke-width="1.5"/>' +
      '<g fill="#fff"><circle cx="32" cy="20" r="1.5"/><circle cx="32" cy="27" r="1.5"/><circle cx="32" cy="34" r="1.5"/></g>' +
      '<g fill="#ffd93b"><path d="M22 18a4 4 0 1 0 3 6 3.2 3.2 0 0 1-3-6z"/><path d="M42 29a4 4 0 1 0 3 6 3.2 3.2 0 0 1-3-6z"/>' +
      '<path d="M42 16l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z"/><path d="M21 31l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z"/>' +
      '<path d="M22 48l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/><path d="M42 50l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></g></svg>',

    // Kind erzählt: Sprechblase mit Sonne und Herz
    'mein-tag': '<svg viewBox="0 0 64 64">' +
      '<rect x="26" y="3" width="35" height="26" rx="9" fill="#fff" stroke="#a77bff" stroke-width="2.2"/>' +
      '<path d="M32 28l-6 9 13-8z" fill="#fff" stroke="#a77bff" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<rect x="31" y="26" width="9" height="3" fill="#fff"/>' +
      '<circle cx="37" cy="16" r="4.5" fill="#ffd93b"/>' +
      '<path d="M50 22c-5-3.5-6-6.5-6-8.5a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2-1 5-6 8.5z" fill="#ff4d6d"/>' +
      '<circle cx="19" cy="46" r="15" fill="#f9d0a8"/>' +
      '<path d="M4 44C4 28 34 28 34 44C30 36 24 34 19 34S8 36 4 44Z" fill="#6b4226"/>' +
      '<circle cx="14" cy="45" r="1.8" fill="#3a2a1a"/><circle cx="24" cy="45" r="1.8" fill="#3a2a1a"/>' +
      '<ellipse cx="19" cy="52" rx="3.5" ry="3" fill="#c2455a"/>' +
      '<circle cx="9" cy="50" r="2.2" fill="#ff9aa2" opacity=".6"/><circle cx="29" cy="50" r="2.2" fill="#ff9aa2" opacity=".6"/></svg>',

    // Kleidung zurechtgelegt, dazu Sonne für "morgen"
    'kleidung-morgen': '<svg viewBox="0 0 64 64">' +
      '<g stroke="#ffb627" stroke-width="2.2" stroke-linecap="round"><path d="M50 2v3M50 21v3M39 13h3M58 13h3M42 5l2 2M56 19l2 2M42 21l2-2M56 7l2-2"/></g>' +
      '<circle cx="50" cy="13" r="5.5" fill="#ffd93b"/>' +
      '<rect x="8" y="48" width="40" height="11" rx="3" fill="#5b8def"/><path d="M28 48v11" stroke="#3f6fd0" stroke-width="1.5"/>' +
      '<rect x="10" y="36" width="36" height="12" rx="3" fill="#ff7a8a"/><path d="M22 36l6 5 6-5" stroke="#fff" stroke-width="2" fill="none" stroke-linejoin="round"/>' +
      '<rect x="14" y="28" width="28" height="8" rx="3" fill="#ffd93b"/><path d="M28 28v8" stroke="#ffb627" stroke-width="1.5"/>' +
      '<path d="M4 61h48" stroke="#c9c4dc" stroke-width="2.5" stroke-linecap="round"/></svg>',

    // Gedeckter Platz: Teller, Gabel, Messer
    'tisch-decken': '<svg viewBox="0 0 64 64">' +
      '<rect x="2" y="12" width="60" height="42" rx="9" fill="#ffd1a8"/>' +
      '<circle cx="32" cy="33" r="16" fill="#fff" stroke="#d8d3e6" stroke-width="2"/><circle cx="32" cy="33" r="10.5" fill="none" stroke="#e8e4f0" stroke-width="2"/>' +
      '<g fill="#8fa3b8"><rect x="9" y="30" width="3.4" height="21" rx="1.7"/><path d="M6.5 16h1.6v8h1.3v-8H11v8h1.3v-8h1.6v10a3.2 3.2 0 0 1-3.2 3.2H9.7a3.2 3.2 0 0 1-3.2-3.2z"/>' +
      '<path d="M52 16q7 4 4.5 17H52z"/><rect x="52" y="32" width="3.6" height="19" rx="1.8"/></g></svg>',

    // Musiknoten mit Mond
    lied: '<svg viewBox="0 0 64 64">' +
      '<path d="M14 4a9 9 0 1 0 6.5 14 7 7 0 0 1-6.5-14z" fill="#ffd93b"/>' +
      '<path d="M53 30l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#ffd93b"/>' +
      '<g fill="#a77bff"><path d="M27 16l24-6v6l-24 6z"/><rect x="25" y="17" width="3.5" height="31" rx="1.5"/><rect x="48.5" y="11" width="3.5" height="31" rx="1.5"/>' +
      '<ellipse cx="21" cy="48" rx="7" ry="5.5" transform="rotate(-20 21 48)"/><ellipse cx="44.5" cy="42" rx="7" ry="5.5" transform="rotate(-20 44.5 42)"/></g></svg>',

    // Hasen-Hausschuhe
    hausschuhe: '<svg viewBox="0 0 64 64">' +
      '<g><ellipse cx="17" cy="16" rx="3.2" ry="9" fill="#fff" stroke="#ff9ec4" stroke-width="1.5"/><ellipse cx="27" cy="16" rx="3.2" ry="9" fill="#fff" stroke="#ff9ec4" stroke-width="1.5"/>' +
      '<ellipse cx="17" cy="16" rx="1.4" ry="6" fill="#ffd1e6"/><ellipse cx="27" cy="16" rx="1.4" ry="6" fill="#ffd1e6"/>' +
      '<ellipse cx="22" cy="42" rx="13" ry="19" fill="#ff9ec4"/><ellipse cx="22" cy="34" rx="10" ry="10" fill="#fff"/>' +
      '<circle cx="18.5" cy="32" r="1.6" fill="#3a2a1a"/><circle cx="25.5" cy="32" r="1.6" fill="#3a2a1a"/><path d="M20.5 36h3l-1.5 1.8z" fill="#ff7a8a"/></g>' +
      '<g><ellipse cx="41" cy="16" rx="3.2" ry="9" fill="#fff" stroke="#ff9ec4" stroke-width="1.5"/><ellipse cx="51" cy="16" rx="3.2" ry="9" fill="#fff" stroke="#ff9ec4" stroke-width="1.5"/>' +
      '<ellipse cx="41" cy="16" rx="1.4" ry="6" fill="#ffd1e6"/><ellipse cx="51" cy="16" rx="1.4" ry="6" fill="#ffd1e6"/>' +
      '<ellipse cx="46" cy="42" rx="13" ry="19" fill="#ff9ec4"/><ellipse cx="46" cy="34" rx="10" ry="10" fill="#fff"/>' +
      '<circle cx="42.5" cy="32" r="1.6" fill="#3a2a1a"/><circle cx="49.5" cy="32" r="1.6" fill="#3a2a1a"/><path d="M44.5 36h3l-1.5 1.8z" fill="#ff7a8a"/></g></svg>',

    // Ausgeschaltete Lampe in der Nacht
    'licht-aus': '<svg viewBox="0 0 64 64">' +
      '<circle cx="32" cy="32" r="30" fill="#2d3480"/>' +
      '<path d="M46 9a8 8 0 1 0 6 12 6.4 6.4 0 0 1-6-12z" fill="#ffd93b"/>' +
      '<g fill="#fff"><circle cx="14" cy="18" r="1.3"/><circle cx="52" cy="38" r="1.1"/><circle cx="12" cy="40" r="1"/></g>' +
      '<circle cx="31" cy="28" r="12" fill="#c9cfdc"/>' +
      '<path d="M24 36h14v7H24z" fill="#c9cfdc"/>' +
      '<path d="M27 30l2-4 2 4 2-4 2 4" stroke="#8a93a8" stroke-width="1.5" fill="none" stroke-linejoin="round"/>' +
      '<rect x="24" y="43" width="14" height="10" rx="2.5" fill="#8fa3b8"/><path d="M24 47h14M24 50.5h14" stroke="#6f8199" stroke-width="1.2"/>' +
      '<path d="M26 22q2-4 6-4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/></svg>',

    // Heft mit Stift
    hausaufgaben: '<svg viewBox="0 0 64 64">' +
      '<rect x="8" y="8" width="36" height="50" rx="4" fill="#5b8def"/>' +
      '<rect x="12" y="10" width="30" height="46" rx="2" fill="#fff"/>' +
      '<g stroke="#bfe6ff" stroke-width="1.5"><path d="M15 20h24M15 27h24M15 34h24M15 41h24M15 48h24"/></g>' +
      '<path d="M16 26q3-4 5 0t5 0" stroke="#ff5e5e" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<g transform="rotate(35 46 36)"><rect x="42" y="10" width="8" height="36" fill="#ffd93b"/><rect x="42" y="10" width="8" height="5" fill="#ff9ec4"/>' +
      '<rect x="42" y="15" width="8" height="2.5" fill="#c9cfdc"/><path d="M42 46h8l-4 9z" fill="#f4d9b8"/><path d="M44.7 52h2.6L46 55z" fill="#3a2a1a"/></g></svg>'
  };

  /* Alle verfügbaren Kacheln.
     r: 'm' = passt morgens, 'e' = passt abends, 'b' = passt immer.
     Emojis bewusst bis Emoji-Version 11 gewählt (iOS 12 kann sie anzeigen). */
  var CATALOG = [
    // Morgens
    { id: 'guten-morgen',   label: 'Guten Morgen',        icon: '🌞', r: 'm' },
    { id: 'bett',           label: 'Bett machen',         icon: '🛏️', r: 'm' },
    { id: 'brotdose',       label: 'Brotdose packen',     svg: SVG.brotdose, r: 'm' },
    { id: 'anziehen',       label: 'Anziehen',            icon: '👕', r: 'm' },
    { id: 'schuhe',         label: 'Schuhe anziehen',     icon: '👟', r: 'm' },
    { id: 'gesicht',        label: 'Gesicht waschen',     svg: SVG.gesicht, r: 'b' },
    { id: 'kleidung',       label: 'Kleidung aufräumen',  svg: SVG['kleidung'], r: 'b' },
    { id: 'taschengeld',    label: 'Taschengeld',         svg: SVG['taschengeld'], r: 'm' },
    { id: 'aufraeumen',     label: 'Aufräumen',           svg: SVG['aufraeumen'], r: 'b' },
    { id: 'fruehstueck',    label: 'Frühstücken',         icon: '🥣', r: 'm' },
    { id: 'schultasche',    label: 'Schultasche packen',  icon: '🎒', r: 'm' },
    { id: 'jacke',          label: 'Jacke anziehen',      icon: '🧥', r: 'm' },
    { id: 'socken',         label: 'Socken anziehen',     icon: '🧦', r: 'm' },
    { id: 'wetter',         label: 'Wetter anschauen',    icon: '🌦️', r: 'm' },
    { id: 'sonnencreme',    label: 'Eincremen',           svg: SVG['sonnencreme'], r: 'm' },
    { id: 'obst',           label: 'Obst essen',          icon: '🍎', r: 'b' },
    { id: 'trinken',        label: 'Wasser trinken',      svg: SVG['trinken'], r: 'b' },
    { id: 'haustier',       label: 'Haustier füttern',    svg: SVG['haustier'], r: 'b' },
    { id: 'blumen',         label: 'Blumen gießen',       svg: SVG['blumen'], r: 'm' },
    { id: 'turnen',         label: 'Morgen-Turnen',       icon: '🤸', r: 'm' },
    { id: 'nase',           label: 'Nase putzen',         icon: '🤧', r: 'b' },
    { id: 'tschuess',       label: 'Tschüss sagen',       icon: '👋', r: 'm' },
    { id: 'kita',           label: 'Ab in die Schule',    icon: '🏫', r: 'm' },
    // Für beide Tageszeiten
    { id: 'zaehne',         label: 'Zähne putzen',        svg: SVG['zaehne'], r: 'b' },
    { id: 'haare',          label: 'Haare kämmen',        svg: SVG.haare, r: 'b' },
    { id: 'toilette',       label: 'Toilette',            icon: '🚽', r: 'b' },
    { id: 'haende',         label: 'Hände waschen',       svg: SVG['haende'], r: 'b' },
    // Abends
    { id: 'abendessen',     label: 'Abendessen',          icon: '🍝', r: 'e' },
    { id: 'kuscheln',       label: 'Kuscheln',            svg: SVG.kuscheln, r: 'e' },
    { id: 'geschichte',     label: 'Gute-Nacht-Geschichte', svg: SVG['geschichte'], r: 'e' },
    { id: 'teller',         label: 'Teller in die Spülmaschine', svg: SVG.teller, r: 'e' },
    { id: 'elternzeit',     label: 'Mama/Papa-Zeit',      icon: '👨‍👩‍👧', r: 'e' },
    { id: 'schlafanzug',    label: 'Schlafanzug anziehen', svg: SVG['schlafanzug'], r: 'e' },
    { id: 'mein-tag',       label: 'Mein Tag erzählen',   svg: SVG['mein-tag'], r: 'e' },
    { id: 'baden',          label: 'Baden / Duschen',     icon: '🛁', r: 'e' },
    { id: 'spielzeug',      label: 'Spielzeug aufräumen', svg: SVG['spielzeug'], r: 'e' },
    { id: 'kleidung-morgen',label: 'Kleidung für morgen', svg: SVG['kleidung-morgen'], r: 'e' },
    { id: 'tisch-decken',   label: 'Tisch decken',        svg: SVG['tisch-decken'], r: 'b' },
    { id: 'lesen',          label: 'Buch anschauen',      icon: '📚', r: 'e' },
    { id: 'hausaufgaben',   label: 'Hausaufgaben',        svg: SVG['hausaufgaben'], r: 'e' },
    { id: 'lied',           label: 'Gute-Nacht-Lied',     svg: SVG['lied'], r: 'e' },
    { id: 'kuss',           label: 'Gute-Nacht-Kuss',     icon: '😘', r: 'e' },
    { id: 'danke',          label: 'Wofür bin ich dankbar?', icon: '🙏', r: 'e' },
    { id: 'hausschuhe',     label: 'Hausschuhe hinstellen', svg: SVG['hausschuhe'], r: 'e' },
    { id: 'schultasche-abend', label: 'Schultasche für morgen', icon: '🎒', r: 'e' },
    { id: 'malen',          label: 'Malen',               icon: '🎨', r: 'b' },
    { id: 'licht-aus',      label: 'Licht aus',           svg: SVG['licht-aus'], r: 'e' },
    { id: 'schlafen',       label: 'Augen zu & schlafen', icon: '😴', r: 'e' }
  ];

  var CATALOG_BY_ID = {};
  CATALOG.forEach(function (t) { CATALOG_BY_ID[t.id] = t; });

  var DEFAULT_TILES = {
    morning: ['guten-morgen', 'bett', 'brotdose', 'anziehen', 'zaehne', 'schuhe',
              'haare', 'gesicht', 'kleidung', 'toilette', 'taschengeld', 'aufraeumen'],
    evening: ['abendessen', 'haare', 'kuscheln', 'geschichte', 'teller', 'elternzeit',
              'zaehne', 'schlafanzug', 'mein-tag', 'toilette']
  };

  var TILE_COLORS = {
    morning: ['#ffe4d6', '#fff2c2', '#dcf5d3', '#d6eeff', '#ece0ff', '#ffe0ef'],
    evening: ['#e3e3ff', '#dcecff', '#efe0ff', '#fff3cf', '#dff4f0', '#ffe3ef']
  };

  /* ---------------------------- Speicher ---------------------------- */

  var state;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function freshKid(kid) {
    return {
      name: '',
      avatar: kid.avatar,
      color: kid.color,
      tiles: clone(DEFAULT_TILES),
      done: { morning: {}, evening: {} }
    };
  }

  function load() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { saved = null; }

    var s = { current: { kid: KIDS[0].id, routine: 'morning' }, kids: {} };
    if (saved && typeof saved === 'object') {
      if (saved.current) {
        if (findKid(saved.current.kid)) s.current.kid = saved.current.kid;
        if (ROUTINES[saved.current.routine]) s.current.routine = saved.current.routine;
      }
    }
    KIDS.forEach(function (kid) {
      var k = freshKid(kid);
      var sk = saved && saved.kids && saved.kids[kid.id];
      if (sk) {
        if (typeof sk.name === 'string') k.name = sk.name.slice(0, MAX_NAME);
        if (sk.avatar) k.avatar = sk.avatar;
        if (KID_COLORS.indexOf(sk.color) !== -1) k.color = sk.color;
        ['morning', 'evening'].forEach(function (r) {
          if (sk.tiles && sk.tiles[r] && sk.tiles[r].length !== undefined) {
            k.tiles[r] = sk.tiles[r].filter(function (id) { return !!CATALOG_BY_ID[id]; }).slice(0, MAX_TILES);
          }
          if (sk.done && sk.done[r]) k.done[r] = sk.done[r];
        });
      }
      s.kids[kid.id] = k;
    });
    return s;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // z. B. privater Modus in altem Safari – App funktioniert weiter, nur ohne Speichern
      if (window.console) console.warn('Speichern nicht möglich', e);
    }
  }

  function findKid(id) {
    for (var i = 0; i < KIDS.length; i++) if (KIDS[i].id === id) return KIDS[i];
    return null;
  }

  function kidState(id) { return state.kids[id || state.current.kid]; }

  /* Name aus den Einstellungen, sonst Platzhalter ("Kind 1") */
  function kidName(id) {
    id = id || state.current.kid;
    var n = (state.kids[id].name || '').replace(/^\s+|\s+$/g, '');
    return n || findKid(id).defaultName;
  }

  /* Eindeutige Schlüssel pro Kachel-Platz. Kommt eine Kachel doppelt vor
     (z. B. „Kuscheln“ abends), erhält jede ihren eigenen Status. */
  function slots(list) {
    var seen = {};
    return list.map(function (id) {
      seen[id] = (seen[id] || 0) + 1;
      return { id: id, key: id + '#' + seen[id], tile: CATALOG_BY_ID[id] };
    });
  }

  function pruneDone(kidId, routine) {
    var ks = kidState(kidId);
    var valid = {};
    slots(ks.tiles[routine]).forEach(function (s) { valid[s.key] = true; });
    var done = ks.done[routine];
    Object.keys(done).forEach(function (k) { if (!valid[k]) delete done[k]; });
  }

  /* ----------------------------- Helfer ----------------------------- */

  function $(id) { return document.getElementById(id); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  /* Icon einer Kachel: eigenes SVG oder Emoji */
  function iconEl(tag, cls, tile) {
    var e = el(tag, cls);
    if (tile.svg) e.innerHTML = tile.svg;
    else e.textContent = tile.icon;
    return e;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function setTransform(node, t) { node.style.webkitTransform = t; node.style.transform = t; }

  /* Startet eine CSS-Transition zuverlässig (auch auf altem Safari). */
  function animateTo(node, styles, delay) {
    node.getBoundingClientRect(); // Reflow erzwingen
    setTimeout(function () {
      for (var k in styles) {
        if (k === 'transform') setTransform(node, styles[k]);
        else node.style[k] = styles[k];
      }
    }, delay || 20);
  }

  /* ----------------------------- Anzeige ---------------------------- */

  var grid = $('grid');

  function render() {
    var routine = state.current.routine;
    document.body.className = routine;
    document.documentElement.className = routine;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', routine === 'morning' ? '#7ec8f0' : '#0b1437');

    renderKidTheme();
    renderKids();
    var btns = document.querySelectorAll('.routine-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-routine') === routine);
    }
    renderGrid();
  }

  function renderKids() {
    var box = $('kids');
    box.innerHTML = '';
    KIDS.forEach(function (kid) {
      var b = el('button', 'kid-btn');
      var active = kid.id === state.current.kid;
      if (active) { b.className += ' active'; b.style.backgroundColor = state.kids[kid.id].color; }
      var a = el('span', 'avatar', state.kids[kid.id].avatar);
      b.appendChild(a);
      b.appendChild(el('span', 'name', kidName(kid.id)));
      b.addEventListener('click', function () {
        if (state.current.kid === kid.id) return;
        state.current.kid = kid.id;
        save();
        render();
        kidSplash();
      });
      box.appendChild(b);
    });
  }

  /* --------------------- Erkennungszeichen je Kind --------------------- */

  // Positionen der schwebenden Tierbilder im Hintergrund (in % des Bildschirms)
  var KID_BG_SPOTS = [
    { x: 2,  y: 16, s: 90,  r: -12 }, { x: 44, y: 11, s: 60,  r: 6 },   { x: 86, y: 20, s: 74,  r: 10 },
    { x: 22, y: 36, s: 64,  r: 14 },  { x: 66, y: 34, s: 70,  r: -14 }, { x: 10, y: 58, s: 76,  r: 8 },
    { x: 48, y: 50, s: 110, r: 0 },   { x: 84, y: 58, s: 96,  r: -8 },  { x: 28, y: 78, s: 82,  r: -6 },
    { x: 62, y: 80, s: 72,  r: 12 },  { x: 90, y: 86, s: 60,  r: -10 }, { x: 4,  y: 88, s: 58,  r: 10 }
  ];
  var lastThemeKey = '';

  function hexToRgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* Farbrahmen und schwebende Tierbilder des aktiven Kindes */
  function renderKidTheme() {
    var ks = kidState();
    var key = state.current.kid + ks.avatar + ks.color;
    var frame = $('kidFrame');
    frame.style.boxShadow = 'inset 0 0 0 10px ' + ks.color + ', inset 0 0 90px ' + hexToRgba(ks.color, 0.45);
    if (key === lastThemeKey) return;
    var first = lastThemeKey === '';
    lastThemeKey = key;

    var bg = $('kidBg');
    bg.innerHTML = '';
    KID_BG_SPOTS.forEach(function (p, i) {
      var outer = el('div', 'kid-bg-item' + (first ? '' : ' pop'));
      outer.style.left = p.x + '%';
      outer.style.top = p.y + '%';
      outer.style.fontSize = p.s + 'px';
      outer.style.animationDelay = first ? '0s' : (i * 0.04) + 's';
      var inner = el('div', 'kid-bg-float', ks.avatar);
      setTransform(inner, 'rotate(' + p.r + 'deg)');
      inner.style.animationDelay = (-i * 0.7) + 's';
      outer.appendChild(inner);
      bg.appendChild(outer);
    });
  }

  /* Kurze große Begrüßung beim Umschalten des Kindes */
  var splashTimer;
  function kidSplash() {
    var box = $('kidSplash');
    var ks = kidState();
    box.innerHTML = '';
    var av = el('div', 'av', ks.avatar);
    av.style.backgroundColor = ks.color;
    box.appendChild(av);
    box.appendChild(el('div', 'nm', 'Hallo ' + kidName() + '!'));
    box.className = 'kid-splash';
    void box.offsetWidth; // Animation neu starten
    box.className = 'kid-splash show';
    clearTimeout(splashTimer);
    splashTimer = setTimeout(function () { box.className = 'kid-splash'; }, 1500);
  }

  function renderGrid() {
    var routine = state.current.routine;
    var ks = kidState();
    var list = slots(ks.tiles[routine]);
    var done = ks.done[routine];
    var colors = TILE_COLORS[routine];

    grid.innerHTML = '';
    if (!list.length) {
      var hint = el('div', 'tile empty-hint', 'Noch keine Kacheln – tippe oben rechts auf ⚙️');
      grid.appendChild(hint);
    }
    list.forEach(function (s, i) {
      var t = el('button', 'tile' + (done[s.key] ? ' done' : ''));
      t.setAttribute('data-key', s.key);
      t.style.backgroundColor = colors[i % colors.length];
      t.appendChild(el('div', 'fill'));
      t.appendChild(iconEl('div', 'icon', s.tile));
      t.appendChild(el('div', 'label', s.tile.label));
      t.appendChild(el('div', 'check', '✓'));
      t.addEventListener('click', function () { toggleTile(s.key, t); });
      grid.appendChild(t);
    });
    layoutGrid();
    updateProgress();
  }

  /* Berechnet die Kachelgröße so, dass alle Kacheln ohne Scrollen
     möglichst groß auf den Bildschirm passen (Hoch- und Querformat). */
  function layoutGrid() {
    var tiles = grid.querySelectorAll('.tile');
    var n = tiles.length;
    if (!n) return;
    var W = grid.clientWidth, H = grid.clientHeight, M = 16;
    var best = null;
    for (var cols = 1; cols <= n; cols++) {
      var rows = Math.ceil(n / cols);
      var w = W / cols - M, h = H / rows - M;
      var score = Math.min(w, h * 1.15);
      if (!best || score > best.score) best = { score: score, w: w, h: h };
    }
    var tw = Math.floor(Math.min(best.w, best.h * 1.5));
    var th = Math.floor(Math.min(best.h, best.w * 1.1));
    var iconSize = Math.round(Math.min(tw * 0.42, th * 0.45));
    var labelSize = Math.round(Math.max(15, Math.min(30, th * 0.12, tw * 0.1)));
    for (var i = 0; i < n; i++) {
      var t = tiles[i];
      t.style.width = tw + 'px';
      t.style.height = th + 'px';
      if (t.classList.contains('empty-hint')) continue;
      t.querySelector('.icon').style.fontSize = iconSize + 'px';
      t.querySelector('.label').style.fontSize = labelSize + 'px';
      var c = t.querySelector('.check');
      var cs = Math.round(Math.max(30, Math.min(46, th * 0.22)));
      c.style.width = c.style.height = c.style.lineHeight = cs + 'px';
      c.style.fontSize = Math.round(cs * 0.65) + 'px';
    }
  }

  function progress() {
    var ks = kidState();
    var r = state.current.routine;
    var list = slots(ks.tiles[r]);
    var count = 0;
    list.forEach(function (s) { if (ks.done[r][s.key]) count++; });
    return { done: count, total: list.length };
  }

  function updateProgress() {
    var p = progress();
    $('progressFill').style.width = (p.total ? (p.done / p.total) * 100 : 0) + '%';
    $('progressText').textContent = (p.total && p.done === p.total ? '⭐ ' : '') + p.done + ' / ' + p.total;
  }

  function toggleTile(key, tile) {
    var done = kidState().done[state.current.routine];
    var before = progress();
    if (done[key]) {
      delete done[key];
      tile.classList.remove('done');
    } else {
      done[key] = true;
      tile.classList.add('done');
      tile.classList.remove('pop');
      void tile.offsetWidth; // Animation neu starten
      tile.classList.add('pop');
      sparkle(tile);
    }
    save();
    updateProgress();
    var after = progress();
    if (after.total > 0 && after.done === after.total && before.done < before.total) {
      setTimeout(celebrate, 750);
    }
  }

  function sparkle(tile) {
    var r = tile.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var symbols = state.current.routine === 'morning' ? ['⭐', '✨', '🌟', '💛'] : ['⭐', '✨', '💫', '🌟'];
    for (var i = 0; i < 9; i++) {
      var s = el('div', 'spark', pick(symbols));
      s.style.left = (cx - 15) + 'px';
      s.style.top = (cy - 15) + 'px';
      setTransform(s, 'translate(0,0) scale(.4)');
      document.body.appendChild(s);
      var ang = (Math.PI * 2 * i) / 9 + rand(-0.3, 0.3);
      var dist = rand(r.width * 0.45, r.width * 0.8);
      animateTo(s, {
        transform: 'translate(' + Math.round(Math.cos(ang) * dist) + 'px,' + Math.round(Math.sin(ang) * dist) + 'px) scale(1.2)',
        opacity: '0'
      });
      (function (node) { setTimeout(function () { node.parentNode && node.parentNode.removeChild(node); }, 1000); })(s);
    }
  }

  /* --------------------------- Zurücksetzen -------------------------- */

  function openModal(id) { $(id).classList.add('open'); }
  function closeModal(id) { $(id).classList.remove('open'); }

  $('resetBtn').addEventListener('click', function () {
    $('confirmText').textContent = ROUTINES[state.current.routine].label + ' von ' + kidName() + ' zurücksetzen?';
    openModal('confirmModal');
  });
  $('confirmNo').addEventListener('click', function () { closeModal('confirmModal'); });
  $('confirmYes').addEventListener('click', function () {
    kidState().done[state.current.routine] = {};
    save();
    closeModal('confirmModal');
    renderGrid();
  });

  /* ---------------------------- Umschalten --------------------------- */

  var rBtns = document.querySelectorAll('.routine-btn');
  for (var rb = 0; rb < rBtns.length; rb++) {
    rBtns[rb].addEventListener('click', function () {
      var r = this.getAttribute('data-routine');
      if (state.current.routine === r) return;
      state.current.routine = r;
      save();
      render();
    });
  }

  /* --------------------------- Einstellungen ------------------------- */

  var settingsRoutine = 'morning';

  $('gearBtn').addEventListener('click', function () {
    settingsRoutine = state.current.routine;
    var input = $('nameInput');
    input.value = kidState().name || '';
    input.placeholder = findKid(state.current.kid).defaultName;
    showVersion();
    renderSettings();
    openModal('settingsModal');
    $('settingsModal').querySelector('.settings-body').scrollTop = 0;
  });

  /* Versionsnummer aus dem Cache-Namen des Service Workers (sw.js: 'routine-app-vX').
     Zeigt die installierte Version – so sieht man, ob ein Update angekommen ist. */
  function showVersion() {
    var box = $('appVersion');
    if (!window.caches || !caches.keys) { box.textContent = 'Version –'; return; }
    caches.keys().then(function (keys) {
      var best = 0;
      keys.forEach(function (k) {
        var m = /^routine-app-v(\d+)$/.exec(k);
        if (m && +m[1] > best) best = +m[1];
      });
      box.textContent = 'Version ' + (best || '–');
    }).catch(function () { box.textContent = 'Version –'; });
  }

  // Name wird beim Tippen gespeichert
  $('nameInput').setAttribute('maxlength', MAX_NAME);
  $('nameInput').addEventListener('input', function () {
    kidState().name = this.value.slice(0, MAX_NAME);
    save();
    $('settingsTitle').textContent = '⚙️ Einstellungen für ' + kidName();
    renderKids();
  });
  $('nameInput').addEventListener('keydown', function (e) {
    if (e.keyCode === 13) this.blur(); // "Fertig" auf der Tastatur schließt sie
  });
  $('settingsDone').addEventListener('click', function () {
    $('nameInput').blur();
    closeModal('settingsModal');
    render();
  });

  var sTabs = document.querySelectorAll('#settingsTabs .tab');
  for (var st = 0; st < sTabs.length; st++) {
    sTabs[st].addEventListener('click', function () {
      settingsRoutine = this.getAttribute('data-routine');
      renderSettings();
    });
  }

  $('restoreDefaults').addEventListener('click', function () {
    kidState().tiles[settingsRoutine] = DEFAULT_TILES[settingsRoutine].slice();
    changedTiles();
  });

  function changedTiles() {
    pruneDone(state.current.kid, settingsRoutine);
    save();
    renderSettings();
  }

  function renderSettings() {
    var ks = kidState();
    var list = ks.tiles[settingsRoutine];

    $('settingsTitle').textContent = '⚙️ Einstellungen für ' + kidName();

    // Avatar
    var ap = $('avatarPicker');
    ap.innerHTML = '';
    AVATARS.forEach(function (a) {
      var b = el('button', a === ks.avatar ? 'active' : '', a);
      b.addEventListener('click', function () {
        ks.avatar = a;
        save();
        renderSettings();
        renderKids();
        renderKidTheme();
      });
      ap.appendChild(b);
    });

    // Farbe
    var cp = $('colorPicker');
    cp.innerHTML = '';
    KID_COLORS.forEach(function (c) {
      var b = el('button', c === ks.color ? 'active' : '');
      b.style.backgroundColor = c;
      b.addEventListener('click', function () {
        ks.color = c;
        save();
        renderSettings();
        renderKids();
        renderKidTheme();
      });
      cp.appendChild(b);
    });

    // Tabs
    for (var i = 0; i < sTabs.length; i++) {
      sTabs[i].classList.toggle('active', sTabs[i].getAttribute('data-routine') === settingsRoutine);
    }

    // Ausgewählte Kacheln
    $('selCount').textContent = '(' + list.length + ' / ' + MAX_TILES + ')';
    var sel = $('selList');
    sel.innerHTML = '';
    if (!list.length) sel.appendChild(el('div', 'sel-empty', 'Noch keine Kacheln ausgewählt.'));
    list.forEach(function (id, idx) {
      var t = CATALOG_BY_ID[id];
      var row = el('div', 'sel-item');
      row.appendChild(el('span', 'num', (idx + 1) + '.'));
      row.appendChild(iconEl('span', 'e', t));
      row.appendChild(el('span', 't', t.label));
      var up = el('button', '', '▲');
      var down = el('button', '', '▼');
      var del = el('button', 'del', '✕');
      if (idx === 0) up.disabled = true;
      if (idx === list.length - 1) down.disabled = true;
      up.addEventListener('click', function () { move(list, idx, idx - 1); });
      down.addEventListener('click', function () { move(list, idx, idx + 1); });
      del.addEventListener('click', function () { list.splice(idx, 1); changedTiles(); });
      row.appendChild(up); row.appendChild(down); row.appendChild(del);
      sel.appendChild(row);
    });

    // Auswahl-Pool: passende Kacheln zuerst
    var full = list.length >= MAX_TILES;
    $('addHint').textContent = full
      ? 'Es sind schon 12 Kacheln ausgewählt. Entferne eine, um eine andere hinzuzufügen.'
      : 'Antippen, um die Kachel hinzuzufügen. Maximal 12 Kacheln pro Routine.';
    var fit = settingsRoutine === 'morning' ? 'm' : 'e';
    var sorted = CATALOG.filter(function (t) { return t.r === fit || t.r === 'b'; })
      .concat(CATALOG.filter(function (t) { return t.r !== fit && t.r !== 'b'; }));
    var pool = $('pool');
    pool.innerHTML = '';
    sorted.forEach(function (t) {
      var inList = list.indexOf(t.id) !== -1;
      var b = el('button', 'pool-item' + (inList ? ' in' : ''));
      b.appendChild(iconEl('span', 'e', t));
      b.appendChild(document.createTextNode(t.label));
      if (full) b.disabled = true;
      b.addEventListener('click', function () {
        if (list.length >= MAX_TILES) return;
        list.push(t.id);
        changedTiles();
      });
      pool.appendChild(b);
    });
  }

  function move(list, from, to) {
    if (to < 0 || to >= list.length) return;
    var item = list.splice(from, 1)[0];
    list.splice(to, 0, item);
    changedTiles();
  }

  /* ======================= Belohnungs-Animationen ======================= */

  var celebrateBox = $('celebrate');
  var stage = $('celebrateStage');
  var celebrateTimers = [];
  var celebrateOpenedAt = 0;
  var lastAnim = { morning: -1, evening: -1 };

  function later(fn, ms) { celebrateTimers.push(setTimeout(fn, ms)); }
  function every(fn, ms) { celebrateTimers.push(setInterval(fn, ms)); }

  function add(cls, text, css) {
    var e = el('div', 'c-abs ' + cls, text);
    if (css) for (var k in css) e.style[k] = css[k];
    stage.appendChild(e);
    return e;
  }

  function W() { return window.innerWidth; }
  function H() { return window.innerHeight; }

  function confettiBurst(count) {
    var colors = ['#ff5e5e', '#ffb627', '#ffe14d', '#4cd964', '#34aadc', '#a77bff', '#ff7ac2'];
    for (var i = 0; i < count; i++) {
      var dur = rand(2.4, 4.2);
      var c = add('c-confetti', '', {
        left: rand(0, W()) + 'px',
        backgroundColor: pick(colors),
        transitionDuration: dur + 's'
      });
      animateTo(c, { transform: 'translate(' + Math.round(rand(-120, 120)) + 'px,' + (H() + 80) + 'px) rotate(' + Math.round(rand(360, 1080)) + 'deg)' },
        Math.round(rand(0, 1200)));
    }
  }

  function twinkleStars(count) {
    for (var i = 0; i < count; i++) {
      add('c-star', pick(['⭐', '✨', '🌟']), {
        left: rand(0, W() - 40) + 'px', top: rand(0, H() * 0.7) + 'px',
        fontSize: Math.round(rand(24, 50)) + 'px',
        animationDelay: rand(0, 1.5) + 's'
      });
    }
  }

  var MORNING_ANIMS = [
    // 1) Die Sonne geht auf
    function (name) {
      var sun = add('c-sunrise');
      sun.appendChild(el('div', 'rays'));
      sun.appendChild(el('div', 'face', '🌞'));
      later(function () { confettiBurst(40); }, 1200);
      return ['Super, ' + name + '!', 'Die Sonne freut sich mit dir! ☀️'];
    },
    // 2) Konfetti-Party
    function (name) {
      add('c-bigmoon', '🎉', { left: '50%', top: '30%', marginLeft: '-80px', right: 'auto', fontSize: '160px' });
      confettiBurst(80);
      later(function () { confettiBurst(50); }, 1600);
      return ['Juhu, ' + name + '!', 'Alles geschafft – Party! 🥳'];
    },
    // 3) Rakete startet
    function (name) {
      var rocket = add('c-rocket');
      var inner = el('div', '', '🚀');
      setTransform(inner, 'rotate(-45deg)');
      rocket.appendChild(inner);
      every(function () {
        var r = rocket.getBoundingClientRect();
        if (r.bottom < 0) return;
        var t = add('c-trail', pick(['✨', '⭐', '💨', '🌟']), { left: (r.left + r.width / 2 - 20) + 'px', top: (r.bottom - 30) + 'px' });
        setTransform(t, 'scale(.4)');
        animateTo(t, { transform: 'translate(' + Math.round(rand(-80, 80)) + 'px,120px) scale(1.3)', opacity: '0' });
      }, 90);
      return ['Wow, ' + name + '!', 'Du startest durch wie eine Rakete! 🚀'];
    },
    // 4) Regenbogen
    function (name) {
      var box = add('c-rainbow');
      var colors = ['#ff5e5e', '#ffa23a', '#ffe14d', '#4cd964', '#34aadc', '#a77bff'];
      colors.forEach(function (c, i) {
        var a = el('div', 'arc');
        var off = i * 40;
        a.style.left = off + 'px'; a.style.top = off + 'px';
        a.style.width = a.style.height = (640 - off * 2) + 'px';
        a.style.borderColor = c;
        a.style.animationDelay = (i * 0.12) + 's';
        box.appendChild(a);
      });
      var scale = Math.min(1, (W() - 40) / 640);
      setTransform(box, 'scale(' + scale + ')');
      add('c-rainbow-cloud', '☁️', { left: (W() / 2 - 320 * scale - 50) + 'px', top: (H() / 2 - 40) + 'px', animationDelay: '.8s' });
      add('c-rainbow-cloud', '☁️', { left: (W() / 2 + 320 * scale - 70) + 'px', top: (H() / 2 - 40) + 'px', animationDelay: '1s' });
      later(function () { twinkleStars(14); }, 900);
      return ['Klasse, ' + name + '!', 'Ein Regenbogen nur für dich! 🌈'];
    },
    // 5) Luftballons & Vögel
    function (name) {
      var balloons = ['🎈', '🎈', '🎈', '🎁', '🎈'];
      for (var i = 0; i < 14; i++) {
        add('c-balloon', pick(balloons), {
          left: rand(0, W() - 80) + 'px',
          animationDuration: rand(3.5, 6) + 's',
          animationDelay: rand(0, 1.8) + 's'
        });
      }
      for (var j = 0; j < 4; j++) {
        add('c-bird', pick(['🐦', '🐤', '🕊️']), {
          right: '-100px', top: rand(8, 45) + '%',
          animationDuration: rand(4, 6.5) + 's',
          animationDelay: rand(0, 2) + 's'
        });
      }
      return ['Toll gemacht, ' + name + '!', 'Die Vögel singen für dich! 🎶'];
    }
  ];

  var EVENING_ANIMS = [
    // 1) Sternschnuppen
    function (name) {
      twinkleStars(22);
      var n = 0;
      every(function () {
        if (n++ > 14) return;
        add('c-shoot', '', { left: rand(-100, W() * 0.6) + 'px', top: rand(0, H() * 0.45) + 'px' });
      }, 380);
      return ['Toll, ' + name + '!', 'Wünsch dir was – eine Sternschnuppe! 🌠'];
    },
    // 2) Die Eule gratuliert
    function (name) {
      twinkleStars(16);
      add('c-bigmoon', '🌙');
      add('c-owl', '🦉');
      return ['Super, ' + name + '!', 'Die Eule ist stolz auf dich! 🦉'];
    },
    // 3) Schäfchen zählen
    function (name) {
      twinkleStars(12);
      add('c-fence', '', {
        width: '120px', height: '90px', marginLeft: '-60px',
        background: 'repeating-linear-gradient(to right, #c9965c 0 16px, transparent 16px 34px)',
        borderTop: '12px solid #b07a42', borderRadius: '6px'
      });
      for (var i = 0; i < 4; i++) {
        add('c-sheep', '🐑', { animationDelay: (i * 0.9) + 's' });
      }
      return ['Prima, ' + name + '!', 'Jetzt Schäfchen zählen … 1, 2, 3, 4 🐑'];
    },
    // 4) Glühwürmchen
    function (name) {
      add('c-bigmoon', '🌛');
      var flies = [];
      for (var i = 0; i < 28; i++) {
        var f = add('c-firefly', '', { left: rand(0, W()) + 'px', top: rand(0, H()) + 'px', opacity: '.2' });
        flies.push(f);
      }
      function moveFlies() {
        flies.forEach(function (f) {
          setTransform(f, 'translate(' + Math.round(rand(-120, 120)) + 'px,' + Math.round(rand(-120, 120)) + 'px)');
          f.style.opacity = rand(0.3, 1).toFixed(2);
        });
      }
      later(moveFlies, 50);
      every(moveFlies, 2200);
      return ['Wunderbar, ' + name + '!', 'Die Glühwürmchen tanzen für dich ✨'];
    },
    // 5) Der Mond wird müde
    function (name) {
      twinkleStars(18);
      add('c-moonface', '🌜');
      every(function () {
        add('c-z', 'Z', { left: (W() / 2 + 60) + 'px', top: (H() / 2 - 150) + 'px', fontSize: Math.round(rand(30, 60)) + 'px' });
      }, 600);
      return ['Gut gemacht, ' + name + '!', 'Schlaf schön und träum was Süßes 💤'];
    }
  ];

  function celebrate() {
    var routine = state.current.routine;
    var anims = routine === 'morning' ? MORNING_ANIMS : EVENING_ANIMS;
    var idx;
    do { idx = Math.floor(Math.random() * anims.length); } while (anims.length > 1 && idx === lastAnim[routine]);
    lastAnim[routine] = idx;

    closeCelebrate();
    celebrateBox.className = 'celebrate open ' + routine;
    var msg = anims[idx](kidName());
    var m = $('celebrateMsg');
    m.innerHTML = '';
    m.appendChild(document.createTextNode(msg[0]));
    m.appendChild(el('small', '', msg[1]));
    // Animation der Nachricht neu starten
    m.style.animation = 'none'; void m.offsetWidth; m.style.animation = '';
    celebrateOpenedAt = Date.now();
    later(closeCelebrate, 7500);
  }

  function closeCelebrate() {
    celebrateTimers.forEach(function (t) { clearTimeout(t); clearInterval(t); });
    celebrateTimers = [];
    stage.innerHTML = '';
    celebrateBox.className = 'celebrate';
  }

  celebrateBox.addEventListener('click', function () {
    if (Date.now() - celebrateOpenedAt > 1200) closeCelebrate();
  });

  /* ------------------------------- Uhr ------------------------------- */

  function initClock() {
    var ns = 'http://www.w3.org/2000/svg';
    var ticks = $('clockTicks');
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6, big = i % 3 === 0;
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', (20 + Math.sin(a) * 14.5).toFixed(2));
      c.setAttribute('cy', (20 - Math.cos(a) * 14.5).toFixed(2));
      c.setAttribute('r', big ? '1.5' : '0.9');
      if (big) c.setAttribute('class', 'big');
      ticks.appendChild(c);
    }

    var hEl = $('clkH'), mEl = $('clkM'), clock = $('clock');
    var lastH = null;

    function two(n) { return (n < 10 ? '0' : '') + n; }
    function setDigit(node, value) {
      if (node.textContent === value) return;
      node.textContent = value;
      node.classList.remove('pop');
      void node.offsetWidth; // Animation neu starten
      node.classList.add('pop');
    }
    function rotate(id, deg) { $(id).setAttribute('transform', 'rotate(' + deg + ' 20 20)'); }

    function tick() {
      var d = new Date(), h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
      rotate('hHand', (h % 12) * 30 + m * 0.5);
      rotate('mHand', m * 6 + s * 0.1);
      rotate('sHand', s * 6);
      setDigit(hEl, two(h));
      setDigit(mEl, two(m));
      // Zur vollen Stunde wackelt die Uhr kurz
      if (lastH !== null && h !== lastH) {
        clock.classList.remove('wiggle'); void clock.offsetWidth; clock.classList.add('wiggle');
      }
      lastH = h;
      // Möglichst genau zum Sekundenwechsel wieder aufrufen
      setTimeout(tick, 1000 - d.getMilliseconds() + 20);
    }
    tick();
  }

  /* ------------------------------ Start ------------------------------ */

  state = load();
  KIDS.forEach(function (k) { pruneDone(k.id, 'morning'); pruneDone(k.id, 'evening'); });
  save();
  render();
  initClock();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutGrid, 150);
  });
  window.addEventListener('orientationchange', function () { setTimeout(layoutGrid, 300); });

  // Doppeltipp-Zoom auf altem iOS verhindern (nur bei zweitem Tipp aufs selbe Element,
  // damit schnelles Antippen verschiedener Kacheln weiter funktioniert)
  var lastTouch = 0, lastTarget = null;
  document.addEventListener('touchend', function (e) {
    var now = Date.now();
    if (now - lastTouch < 300 && e.target === lastTarget && e.target.tagName !== 'INPUT') e.preventDefault();
    lastTouch = now;
    lastTarget = e.target;
  }, false);

  // Offline-Fähigkeit
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        if (window.console) console.warn('Service Worker nicht registriert', err);
      });
    });
  }
  // Browser bitten, die Daten dauerhaft zu behalten
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(function () {});
  }
})();
