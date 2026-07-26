# Photos

These are Belle's real photos, resized for the web. To swap one out, replace
the file **keeping the same filename** — nothing else needs to change.

| File | Photo | Used on |
| --- | --- | --- |
| `hero-stage.jpg` | Magenta-lit stage shot, drummer behind | hero banner |
| `portrait-press.jpg` | Blue top, seated press portrait | about section |
| `live-festival.jpg` | Silver corset, backlit festival | gallery |
| `portrait-studio.jpg` | Black jacket, crouching studio shot | gallery |

Export at roughly 2000px on the long edge, JPG quality 85. The originals ran
0.4–21MB; at that size a phone visitor would have waited through 33MB of
photos. Resized they come to about 1.2MB all up.

The stylesheet handles the grading — it lifts and slightly desaturates each
photo to sit inside the midnight/silver palette, so upload straight from the
photographer's export.

Two notes on the current set:

- `hero-stage.jpg` is a portrait shot used in a wide banner, so only a
  horizontal band of it shows on desktop. `object-position: 56% 44%` in
  `css/style.css` is what keeps Belle in frame — adjust that if the photo is
  ever replaced with a differently composed shot.
- `portrait-press.jpg` is only 1006x1516, well under the 2000px target. It is
  fine at its current display size but is the one to re-export larger if a
  bigger version turns up.

`favicon.svg` is the BR monogram from the brand guide.
