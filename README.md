# bellerichardson.com

Static one-page site for Belle Richardson — soul, pop and RnB vocalist, Hobart.

## Running it

No build step. Open `index.html`, or serve the folder:

```
python3 -m http.server 8000
```

## Structure

```
index.html      all page content
css/style.css   the brand system
js/main.js      reveal-on-scroll, parallax, mobile nav
images/         photos — see images/README.md
```

## Brand

Built to *Brand Guide — Edition One*.

| Token | Hex | Use |
| --- | --- | --- |
| Midnight | `#070A11` | page ground |
| Silver | `#C9CFD6` | all text — never pure white |
| Sapphire | `#2E5C9E` | links, rules, buttons |
| Orchid | `#7A569E` | one hover state only |
| Slate | `#1B2436` | alternating sections, cards |

Display type is Cormorant Garamond (300/400), text is Archivo (300/400/500),
both from Google Fonts with Georgia and Helvetica as fallbacks. Labels are caps
at 0.28em tracking; the wordmark is caps at 0.18em and never bold.

Motion drifts rather than snaps: content fades up over 600ms on a soft ease and
portraits carry a slow parallax. All of it is disabled under
`prefers-reduced-motion`.

## Editing

- **Photos** — drop replacements into `images/` using the existing filenames.
- **Booking email** — `mailto:` link in the `#book` section of `index.html`.
- **Social links** — the `.social` list at the bottom of `index.html` currently
  points at the bare platform homepages; swap in the real profile URLs.
- **Gigs** — add an item to the relevant `<ul class="list">` in `#live`.
