"use strict";
/* Grandmaster profiles used for the "closest grandmaster" match.

   To add a player, copy one entry and change it.
   style: one number per file (axis), from -1 to 1.
     +1 means fully the FIRST pole, -1 fully the SECOND pole, 0 is balanced.
       a  Attack (+)      / Defence (-)
       b  Tactical (+)    / Positional (-)
       c  Initiative (+)  / Material (-)
       d  Open (+)        / Closed (-)
       e  Theory (+)      / Improvisation (-)
       f  Middlegame (+)  / Endgame (-)
       g  Intuition (+)   / Calculation (-)
       h  Pragmatic (+)   / Principled (-)
   These placements are opinions set by hand, not measurements. */
const GRANDMASTERS = [
  {
    name: "Mikhail Tal",
    title: "World Champion 1960–61",
    blurb: "Sacrificed on instinct and dared opponents to refute it at the board.",
    study: "Tal–Botvinnik, World Championship 1960, game 6",
    style: { a: 0.95, b: 0.95, c: 1, d: 0.8, e: -0.2, f: 0.8, g: 0.7, h: 0.6 }
  },
  {
    name: "Garry Kasparov",
    title: "World Champion 1985–2000",
    blurb: "Deep preparation feeding relentless initiative and dynamic play.",
    study: "Kasparov–Topalov, Wijk aan Zee 1999",
    style: { a: 0.85, b: 0.6, c: 0.7, d: 0.7, e: 0.95, f: 0.6, g: -0.3, h: -0.2 }
  },
  {
    name: "Bobby Fischer",
    title: "World Champion 1972–75",
    blurb: "Clear, classical, exact. He wanted the best move every time.",
    study: "D. Byrne–Fischer, New York 1956",
    style: { a: 0.5, b: 0.3, c: -0.1, d: 0.6, e: 0.8, f: 0, g: -0.2, h: -0.8 }
  },
  {
    name: "Anatoly Karpov",
    title: "World Champion 1975–85",
    blurb: "Restricted the opponent's pieces until there was nothing left to play.",
    study: "Karpov–Unzicker, Nice Olympiad 1974",
    style: { a: -0.5, b: -0.9, c: -0.5, d: -0.4, e: 0.3, f: -0.6, g: 0.5, h: -0.2 }
  },
  {
    name: "Tigran Petrosian",
    title: "World Champion 1963–69",
    blurb: "Prophylaxis first. He stopped threats before the opponent had thought of them.",
    study: "Petrosian–Spassky, World Championship 1966, game 10",
    style: { a: -0.95, b: -0.8, c: -0.3, d: -0.8, e: -0.1, f: -0.4, g: 0.2, h: 0.3 }
  },
  {
    name: "Magnus Carlsen",
    title: "World Champion 2013–23",
    blurb: "Gets a playable position, then outlasts everyone in long endgames.",
    study: "Carlsen–Anand, World Championship 2013, game 5",
    style: { a: 0, b: -0.5, c: -0.2, d: -0.1, e: -0.6, f: -0.95, g: 0.7, h: 0.8 }
  },
  {
    name: "José Raúl Capablanca",
    title: "World Champion 1921–27",
    blurb: "Effortless simplicity and endgame technique built on natural feel.",
    study: "Capablanca–Tartakower, New York 1924",
    style: { a: -0.3, b: -0.7, c: -0.6, d: 0, e: -0.7, f: -0.9, g: 0.9, h: -0.3 }
  },
  {
    name: "Alexander Alekhine",
    title: "World Champion 1927–35, 1937–46",
    blurb: "Long, concrete combinations growing out of deep opening work.",
    study: "Réti–Alekhine, Baden-Baden 1925",
    style: { a: 0.9, b: 0.7, c: 0.6, d: 0.5, e: 0.6, f: 0.5, g: -0.6, h: 0.2 }
  },
  {
    name: "Vladimir Kramnik",
    title: "World Champion 2000–07",
    blurb: "Rock-solid openings and positional pressure with very few risks.",
    study: "Kramnik–Kasparov, World Championship 2000, game 2",
    style: { a: -0.4, b: -0.7, c: -0.3, d: -0.5, e: 0.9, f: -0.6, g: -0.4, h: -0.7 }
  },
  {
    name: "Viswanathan Anand",
    title: "World Champion 2007–13",
    blurb: "Lightning-fast intuition backed by modern preparation.",
    study: "Aronian–Anand, Wijk aan Zee 2013",
    style: { a: 0.4, b: 0.5, c: 0.3, d: 0.5, e: 0.7, f: 0.2, g: 0.9, h: 0.2 }
  },
  {
    name: "Hikaru Nakamura",
    title: "Five-time US Champion",
    blurb: "Resourceful, fast and practical. He plays the clock and the opponent.",
    study: "Krasenkow–Nakamura, Barcelona 2007",
    style: { a: 0.5, b: 0.7, c: 0.1, d: 0.3, e: -0.2, f: 0.1, g: 0.9, h: 0.95 }
  },
  {
    name: "Judit Polgár",
    title: "Strongest woman player in history",
    blurb: "Direct attacking chess from the first move.",
    study: "Shirov–Polgár, Buenos Aires 1994",
    style: { a: 0.9, b: 0.9, c: 0.6, d: 0.8, e: 0.3, f: 0.7, g: 0.3, h: 0.3 }
  },
  {
    name: "Emanuel Lasker",
    title: "World Champion 1894–1921",
    blurb: "Chose the move that troubled this particular opponent most.",
    study: "Lasker–Capablanca, St Petersburg 1914",
    style: { a: 0.1, b: 0.1, c: 0, d: 0, e: -0.8, f: -0.3, g: -0.1, h: 1 }
  },
  {
    name: "Mikhail Botvinnik",
    title: "World Champion 1948–63",
    blurb: "Scientific preparation and disciplined calculation.",
    study: "Botvinnik–Capablanca, AVRO 1938",
    style: { a: 0.1, b: -0.5, c: -0.2, d: -0.5, e: 1, f: -0.1, g: -0.9, h: -0.8 }
  },
  {
    name: "Aron Nimzowitsch",
    title: "Author of My System",
    blurb: "Blockade, restraint and closed-position manoeuvring.",
    study: "Sämisch–Nimzowitsch, Copenhagen 1923",
    style: { a: -0.6, b: -0.6, c: -0.1, d: -0.9, e: -0.4, f: -0.2, g: -0.5, h: -0.3 }
  },
  {
    name: "Fabiano Caruana",
    title: "World Championship challenger 2018",
    blurb: "Preparation and calculation carried to great depth.",
    study: "His 7/7 start at the 2014 Sinquefield Cup",
    style: { a: 0.3, b: 0.2, c: 0.1, d: 0.4, e: 1, f: 0, g: -0.9, h: -0.8 }
  },
  {
    name: "Akiba Rubinstein",
    title: "Leading player of the 1910s",
    blurb: "Among the finest rook-ending players the game has seen.",
    study: "Rotlewi–Rubinstein, Łódź 1907",
    style: { a: -0.3, b: -0.6, c: -0.4, d: -0.3, e: 0.5, f: -1, g: -0.3, h: -0.7 }
  },
  {
    name: "Paul Morphy",
    title: "Best player of the 1850s",
    blurb: "Rapid development, open lines and a sacrifice to finish.",
    study: "The Opera Game, Paris 1858",
    style: { a: 0.9, b: 0.6, c: 0.9, d: 1, e: -0.3, f: 0.7, g: 0.6, h: -0.4 }
  },
  {
    name: "Viktor Korchnoi",
    title: "Two-time World Championship challenger",
    blurb: "Took the material, defended stubbornly and hit back.",
    study: "His 1978 World Championship match against Karpov",
    style: { a: -0.2, b: 0.3, c: -0.9, d: -0.1, e: 0.3, f: -0.4, g: -0.7, h: 0.5 }
  }
];
