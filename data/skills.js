"use strict";
/* The eight skills on the radar: [label, advice shown when the skill scores below the opponents].
   The keys are also the tags used in studies.js. */
const SKILLS={
 opening:["Opening","You come out of the opening worse off than your opponents. Review the first 15 moves of your losses and fix one recurring line per week."],
 middle:["Middlegame","Your opponents outplay you between the opening and the endgame. Before every move, check what their last move attacks and what it stopped defending."],
 endgame:["Endgame","You do worse than you should once the pieces come off. Study basic king-and-pawn and rook endings, then play out winning endings against an engine."],
 attack:["Attacking","Fewer of your wins are quick or end in mate than your opponents' wins against you. Practise mating patterns and attack-the-king puzzles."],
 defence:["Defending","From worse positions you save fewer points than your opponents do from theirs. Keep pieces on, look for active counterplay and make them find hard moves."],
 convert:["Converting","Your opponents finish off winning positions against you more often than you do against them. When ahead, trade pieces (not pawns), remove counterplay first and keep your king safe."],
 clock:["Clock","You lose on time more often than your opponents do. Play with increment, move faster in the opening and decide quickly when the choice barely matters."],
 upsets:["Vs stronger","You score below what the ratings predict against higher-rated players. Play your normal openings and avoid early simplification out of respect."]
};
