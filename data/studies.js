"use strict";
/* Study suggestions shown in "What to work on".

   To add one, copy a line and change it. Each study has:
     title  the game, book, position or exercise
     type   "game", "book", "position" or "practice" (shown as a small label)
     tags   where it appears; a study can have several tags
     note   optional one-line reason (use "" for none)

   Tags
     Skill tags: shown when that skill scores below the opponents
       opening, middle, endgame, attack, defence, convert, clock, upsets
     Style tags: shown to players who lean strongly towards that pole,
     as a remedy for the blind spot of that style
       style:attack      style:defence
       style:tactical    style:positional
       style:initiative  style:material
       style:open        style:closed
       style:theory      style:improvisation
       style:middlegame  style:endgame
       style:intuition   style:calculation
       style:pragmatic   style:principled

   The first three studies with a matching tag are shown, in the order listed here. */
const STUDIES = [
  { title: "Morphy's Opera Game, Paris 1858", type: "game", tags: ["opening", "style:closed"], note: "Fast development and open lines." },
  { title: "Discovering Chess Openings, by John Emms", type: "book", tags: ["opening", "style:improvisation"], note: "Opening principles without memorising lines." },
  { title: "Logical Chess: Move by Move, by Irving Chernev", type: "book", tags: ["middle"], note: "Explains the reason for every move of 33 games." },
  { title: "The Lucena and Philidor positions", type: "position", tags: ["endgame", "style:middlegame"], note: "The two rook endings everyone needs." },
  { title: "Capablanca–Tartakower, New York 1924", type: "game", tags: ["endgame", "style:middlegame"], note: "A model rook ending won with an active king." },
  { title: "Silman's Complete Endgame Course, by Jeremy Silman", type: "book", tags: ["endgame"], note: "Endgames ordered by rating level." },
  { title: "The Greek gift sacrifice (Bxh7+) and the smothered mate", type: "position", tags: ["attack"], note: "Two attacking patterns that come up again and again." },
  { title: "The Art of Attack in Chess, by Vladimir Vuković", type: "book", tags: ["attack", "style:defence"], note: "The standard work on attacking the king." },
  { title: "Capablanca–Marshall, New York 1918", type: "game", tags: ["defence"], note: "Calm defence against a prepared attack." },
  { title: "The Art of Defence in Chess, by Andrew Soltis", type: "book", tags: ["defence"], note: "" },
  { title: "Fischer–Petrosian, Candidates final 1971, game 7", type: "game", tags: ["convert"], note: "Trading down to a simple win." },
  { title: "Endgame Strategy, by Mikhail Shereshevsky", type: "book", tags: ["convert"], note: "How to make an advantage count." },
  { title: "Chess for Tigers, by Simon Webb", type: "book", tags: ["clock", "upsets", "style:calculation", "style:principled"], note: "Practical play: the clock, stronger opponents and swindles." },
  { title: "Your own time-loss games", type: "practice", tags: ["clock"], note: "Mark the moves where the minutes went." },
  { title: "Karpov–Unzicker, Nice Olympiad 1974", type: "game", tags: ["style:attack"], note: "A win built on restriction, with no direct attack." },
  { title: "Kasparov–Topalov, Wijk aan Zee 1999", type: "game", tags: ["style:defence"], note: "What a full-blooded attack looks like." },
  { title: "Simple Chess, by Michael Stean", type: "book", tags: ["style:tactical"], note: "Positional ideas in plain language." },
  { title: "My System, by Aron Nimzowitsch", type: "book", tags: ["style:tactical"], note: "" },
  { title: "D. Byrne–Fischer, New York 1956", type: "game", tags: ["style:positional"], note: "A combination that starts from a quiet-looking position." },
  { title: "Tal–Botvinnik, World Championship 1960, game 6", type: "game", tags: ["style:positional"], note: "A speculative sacrifice that changes the game." },
  { title: "Puzzles on forks, pins and discovered attacks", type: "practice", tags: ["style:positional"], note: "Fifteen minutes a day." },
  { title: "Anderssen–Kieseritzky, London 1851 (the Immortal Game)", type: "game", tags: ["style:initiative"], note: "Go through it with an engine and find where the defence could have held." },
  { title: "Reshevsky–Petrosian, Zürich 1953", type: "game", tags: ["style:material"], note: "Petrosian gives up the exchange to hold a difficult position." },
  { title: "Taimanov–Najdorf, Zürich 1953", type: "game", tags: ["style:open"], note: "A model King's Indian attack behind a closed centre." },
  { title: "Sämisch–Nimzowitsch, Copenhagen 1923", type: "game", tags: ["style:open"], note: "Winning by restriction in a closed position." },
  { title: "Lasker–Capablanca, St Petersburg 1914", type: "game", tags: ["style:theory", "style:principled"], note: "A quiet opening chosen for the opponent, won with a plan." },
  { title: "Karpov–Kasparov, World Championship 1985, game 16", type: "game", tags: ["style:improvisation"], note: "What deep preparation can achieve." },
  { title: "Rotlewi–Rubinstein, Łódź 1907", type: "game", tags: ["style:middlegame"], note: "" },
  { title: "Réti–Alekhine, Baden-Baden 1925", type: "game", tags: ["style:endgame"], note: "The initiative kept alive move after move." },
  { title: "Botvinnik–Capablanca, AVRO 1938", type: "game", tags: ["style:intuition"], note: "One long calculated line decides the game." },
  { title: "Think Like a Grandmaster, by Alexander Kotov", type: "book", tags: ["style:intuition"], note: "A method for calculating variations." },
  { title: "Easy puzzles against a 30-second limit", type: "practice", tags: ["style:calculation"], note: "Practise trusting your first sound idea." },
  { title: "My 60 Memorable Games, by Bobby Fischer", type: "book", tags: ["style:pragmatic"], note: "A player who always looked for the best move." }
];
