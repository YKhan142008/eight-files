"use strict";
/* The eight style axes, one per file of the board (a to h).
   A / B   the two poles, as shown on the results page
   adj     adjective for each pole, used in the style name ("Attacking ...")
   noun    noun for each pole, used in the style name ("... Tactician")
   desc    one-line description on the home page
   tip     blind-spot advice: [shown when leaning to A, shown when leaning to B] */
const AXES=[
 {f:"a",A:"Attack",B:"Defence",adj:["Attacking","Solid"],noun:["Attacker","Defender"],desc:"Go for the king, or shut everything down first.",
  tip:["You may over-press. Before each attacking move, name your opponent's best defensive resource.","You may pass up winning attacks. When you are better developed, count attackers against defenders near the king before you retreat."]},
 {f:"b",A:"Tactical",B:"Positional",adj:["Tactical","Positional"],noun:["Tactician","Strategist"],desc:"Forcing lines and combinations, or slow improvement.",
  tip:["Quiet positions can drift. Study annotated positional games and practise finding your worst piece and improving it.","You may miss shots. Solve tactics for 15 minutes a day and check every forcing move before you play a quiet one."]},
 {f:"c",A:"Initiative",B:"Material",adj:["Sacrificial","Material-minded"],noun:["Gambiteer","Materialist"],desc:"Give up pawns for activity, or take them and hold.",
  tip:["Your sacrifices need to be sound. Go through your gambit losses and find the move where the compensation ran out.","Grabbing material can cost you the initiative. Practise positions where giving the material back at the right moment wins."]},
 {f:"d",A:"Open",B:"Closed",adj:["Open-game","Closed-game"],noun:["Open-game player","Manoeuvrer"],desc:"Open centres and active pieces, or locked pawn chains.",
  tip:["Closed positions will frustrate you. Play training games in French and King's Indian structures to learn the pawn breaks.","Open positions punish slow play. Practise 1.e4 e5 games to sharpen your development and piece activity."]},
 {f:"e",A:"Theory",B:"Improvisation",adj:["Booked-up","Improvising"],noun:["Theoretician","Improviser"],desc:"Deep preparation, or an early step off the beaten path.",
  tip:["When opponents leave theory early you can lose your bearings. Learn the plans behind your lines as well as the moves.","You give away early advantages. Build a small repertoire: one defence to 1.e4, one to 1.d4 and one system as White."]},
 {f:"f",A:"Middlegame",B:"Endgame",adj:["Knockout","Endgame"],noun:["Finisher","Grinder"],desc:"Decide it with queens on, or win it in the ending.",
  tip:["You may avoid winning endgames. Learn the key rook endings (Lucena, Philidor) so that simplifying becomes a weapon.","You may trade into endings too soon. Before swapping queens, check whether your initiative is worth more than the ending."]},
 {f:"g",A:"Intuition",B:"Calculation",adj:["Intuitive","Calculating"],noun:["Instinct player","Calculator"],desc:"Trust the feel of the move, or work out the lines.",
  tip:["Fast instinct misses concrete refutations. At critical moments, make yourself calculate one line three moves deep.","Deep thought costs clock. Set a budget: no single move over a fifth of your remaining time unless it decides the game."]},
 {f:"h",A:"Pragmatic",B:"Principled",adj:["Pragmatic","Principled"],noun:["Pragmatist","Purist"],desc:"Play the opponent, or play the board.",
  tip:["Tricks stop working against stronger opposition. Check your wins with an engine to see which ones were objectively lost.","You may ignore practical chances. In worse positions, pick the line that gives your opponent the most ways to go wrong."]}
];
