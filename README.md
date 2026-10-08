# Eight Files

A chess style test. Answer 24 statements about how you like to play, add your
Lichess or Chess.com games, and get:

- your position on eight style axes, one per file of the board (a to h)
- a skill radar that compares you with the opponents you actually faced
- the grandmaster whose style is closest to yours
- a list of what to work on, with games, books and positions to study

**Status: prototype.** The scores are experimental. See "Limits" below.

## Run it

There is no build step and nothing to install.

- **On your computer:** open `index.html` in a browser.
- **On the web:** upload the whole folder to any static host. On GitHub, turn on
  Pages for the repository (Settings, Pages, deploy from the main branch).

Everything runs in the visitor's browser. Games are not sent to any server of
yours.

## Files

| File | What it holds |
|---|---|
| `index.html` | The page shell and the list of scripts |
| `css/styles.css` | All styling, including light and dark colours |
| `data/axes.js` | The eight axes, their pole names and blind-spot advice |
| `data/questions.js` | The 24 test statements |
| `data/grandmasters.js` | Grandmaster profiles for the match |
| `data/skills.js` | The eight radar skills and their advice |
| `data/studies.js` | Study suggestions, picked by tag |
| `js/util.js` | Small shared helpers |
| `js/scoring.js` | Axis positions, style name, grandmaster match |
| `js/analysis.js` | PGN reading, game replay, the figures behind each score |
| `js/engine.js` | Optional Stockfish analysis |
| `js/charts.js` | The radar chart and study lists |
| `js/app.js` | Page state and the four screens |

## Common edits

### Add a study

Open `data/studies.js` and add a line:

```js
{ title: "Game, book or position", type: "game", tags: ["endgame"], note: "Why it helps." },
```

`tags` decides where it appears. Skill tags (`opening`, `middle`, `endgame`,
`attack`, `defence`, `convert`, `clock`, `upsets`) show the study when that
skill scores below the opponents. Style tags (`style:attack`, `style:closed`
and so on) show it to players who lean strongly towards that pole. The full
tag list is at the top of the file. The first three matching studies are
shown, in file order.

### Add a grandmaster

Open `data/grandmasters.js`, copy an entry and set the eight `style` numbers
from -1 to 1. The meaning of each letter is at the top of the file.

### Change a test statement

Open `data/questions.js`. Each entry is `[axis number, direction, statement]`.

## How the scores work

- **Style axes** combine your test answers with figures counted from your
  games, each compared with the same figure for your opponents (checks given,
  exchanges started, queen trades offered, clock left).
- **Skill radar** shows eight skills. 50 means level with the opponents you
  played. The results page lists the exact figures behind every score and how
  many games each is based on.
- **Engine analysis** is optional. Stockfish replays your newest games and
  measures move accuracy for you and your opponents, which replaces the
  material-based estimates for five of the skills.

## Limits

- Without the engine, scores come from results and material counts, not move
  quality.
- The engine searches 8 half-moves deep to stay fast. Its accuracy figures are
  for comparing you with your opponents and will not match the numbers Lichess
  or Chess.com show.
- How many points a given gap is worth, the test statements and the
  grandmaster placements are judgement calls, not validated measurements.
- Study suggestions are the same for every rating level.
- Fetching games straight from Lichess and Chess.com only works when the page
  is hosted on the web. If a fetch fails, the page offers a download link and
  a file drop instead.

## Credits

- [chess.js](https://github.com/jhlywa/chess.js) 0.10.3 replays the games
  (loaded from cdnjs).
- [Stockfish.js](https://github.com/nmrugg/stockfish.js) 10.0.2 is the engine
  (loaded from jsDelivr when the visitor starts the analysis). It is licensed
  under the GPL.
- Fonts are Archivo and IBM Plex, loaded from Google Fonts.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Changes go
through pull requests and are merged after the maintainer reviews them.

## License

[MIT](LICENSE)
