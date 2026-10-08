"use strict";
/* The test statements.
   Each entry is [axis number, direction, statement].
     axis number  0 = a-file ... 7 = h-file (see axes.js)
     direction    +1 if agreeing leans to the first pole, -1 if it leans to the second
   Keep the number of statements a multiple of 8, in a-to-h order, so the progress board lines up. */
const QS=[
 [0,1,"When I see a chance to open lines against the enemy king, I take it, even if my own position gets loose."],
 [1,1,"I look for forcing moves (checks, captures, threats) before anything else."],
 [2,1,"I happily give up a pawn for faster development and open lines."],
 [3,1,"I am most comfortable when the centre is open and the pieces have room."],
 [4,1,"I know my main openings well past move ten."],
 [5,-1,"I am glad to trade queens when I am slightly better."],
 [6,1,"I usually play the move that feels right and trust it."],
 [7,1,"I choose the move that is hardest for this opponent to meet, even if it is not objectively best."],
 [0,-1,"I would rather neutralise every threat first and attack later, if at all."],
 [1,-1,"I enjoy slowly improving my worst-placed piece more than hunting for a combination."],
 [2,-1,"If my opponent offers material and I cannot see the refutation, I take it and make them prove it."],
 [3,-1,"Locked pawn chains and slow manoeuvring behind them suit me."],
 [4,-1,"I would rather reach an unfamiliar position early than follow a memorised line."],
 [5,1,"I try to decide the game before an endgame appears."],
 [6,-1,"In a critical position I calculate concrete lines until I am sure, even if it costs a lot of clock."],
 [7,-1,"I want to play the correct move regardless of who is sitting opposite."],
 [0,1,"A wild game that I lose bothers me less than a dull draw."],
 [1,-1,"I often choose a move because of the pawn structure it leads to ten moves later."],
 [2,1,"Giving up a rook for a bishop or knight to get long-term pressure seems natural to me."],
 [3,1,"I usually trade central pawns early instead of keeping the tension."],
 [4,1,"After a loss, the first thing I check is where I left my preparation."],
 [5,-1,"Rook endings are where I pick up most of my extra half points."],
 [6,1,"I play better in blitz than in slow games."],
 [7,1,"In a lost position I set traps instead of defending accurately."]
];
const ANS=[["Strongly agree",2],["Agree",1],["Not sure",0],["Disagree",-1],["Strongly disagree",-2]];

/* A fixed example shown on the home page before anyone has results. */
const EXAMPLE={skills:{opening:64,middle:48,endgame:31,attack:71,defence:42,convert:58,clock:77,upsets:55},gm:"Judit Polgár",pct:81};
