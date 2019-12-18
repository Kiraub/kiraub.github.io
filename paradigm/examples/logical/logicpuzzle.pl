
/*
  logik puzzle von puzzle-baron
  https://logic.puzzlebaron.com

  kategorien:
    daten:
      okt 3
      okt 7
      okt 11
      okt 15
    teams:
      eagles
      rams
      red and blues
      warriors
    punkte:
      20-13
      24-21
      34-07
      42-20
    städte:
      coachella
      ferndale
      groveland
      humeston

  hinweise:
    1.
      Von den Spielen "Red and Blues" und "42-20" war genau eins in "Humeston" und das andere in "Coachella"
    2.
      Das Spiel mit den "Warriors" war entweder am "Oktober 7" oder "Oktober 11"
    3.
      Das Spiel in "Ferndale" endete mit dem Punktestand "20-13"
    4.
      Das Spiel am "Oktober 3.", das Spiel in "Humeston" und das Spiel in "Ferndale" sind drei separate Spiele
    5.
      Das Spiel in "Groveland" war 4 Tage nach dem "20-13" Spiel
    6.
      Das "24-21" Spiel war irgendwann nach dem Spiel mit den "Eagles"
    7.
      Das Spiel mit den "Rams" war in "Humeston"

  lösung:
    Daten   Teams           Punkte    Städte
    Okt03   Red and Blues   34-07     Coachella
    Okt07   Eagles          20-13     Ferndale
    Okt11   Warriors        24-21     Groveland
    Okt15   Rams            42-20     Humeston
*/

% prädikat date("datum")
date("okt03").
date("okt07").
date("okt11").
date("okt15").

% prädikat team("name")
team("egl").
team("ram").
team("rnb").
team("war").

% prädikat score("punkte")
score("20-13").
score("24-21").
score("34-07").
score("42-20").

% prädikat city("stadt")
city("coach").
city("fernd").
city("grove").
city("humes").

% regel puzzle
puzzle
/*(
  Ad, At, As, Ac,
  Bd, Bt, Bs, Bc,
  Cd, Ct, Cs, Cc,
  Dd, Dt, Ds, Dc
  )*/ :-

    %nodebug,

    % setze die datumswerte um unnötiges backtracking/ mehrfachlösungen zu vermeiden
    Ad = "okt03",
    Bd = "okt07",
    Cd = "okt11",
    Dd = "okt15",

    % A kann alles sein
    date(Ad), team(At), score(As), city(Ac),
    % property A
    property(Ad, At, As, Ac),

    write("gutes A\n"),

    % B ist nicht A
    date(Bd),
    Bd \= Ad,
    team(Bt),
    Bt \= At,
    score(Bs),
    Bs \= As,
    city(Bc),
    Bc \= Ac,
    % property B
    property(Bd, Bt, Bs, Bc),
    % relation B und A
    relation(Bd, Bt, Bs, Bc, Ad, At, As, Ac),

    write("gutes B\n"),

    % C ist nicht B und nicht A
    date(Cd),
    Cd \= Ad, Cd \= Bd,
    team(Ct),
    Ct \= At, Ct \= Bt,
    score(Cs),
    Cs \= As, Cs \= Bs,
    city(Cc),
    Cc \= Ac, Cc \= Bc,
    % property C
    property(Cd, Ct, Cs, Cc),
    % relation C und B, C und A
    relation(Cd, Ct, Cs, Cc, Ad, At, As, Ac),
    relation(Cd, Ct, Cs, Cc, Bd, Bt, Bs, Bc),

    write("gutes C\n"),

    % D ist weder C, B noch A
    date(Dd),
    Dd \= Ad, Dd \= Bd, Dd \= Cd,
    team(Dt),
    Dt \= At, Dt \= Bt, Dt \= Ct,
    score(Ds),
    Ds \= As, Ds \= Bs, Ds \= Cs,
    city(Dc),
    Dc \= Ac, Dc \= Bc, Dc \= Cc,
    % property D
    property(Dd, Dt, Ds, Dc),
    % relation D und C, D und B, D und A
    relation(Dd, Dt, Ds, Dc, Ad, At, As, Ac),
    relation(Dd, Dt, Ds, Dc, Bd, Bt, Bs, Bc),
    relation(Dd, Dt, Ds, Dc, Cd, Ct, Cs, Cc),

    write("gutes D\n"),

    nodebug,

    write("Date  Team  Score  City\n"),
    write(Ad), write(" "), write(At), write("   "), write(As), write("  "), write(Ac), write("\n"),
    write(Bd), write(" "), write(Bt), write("   "), write(Bs), write("  "), write(Bc), write("\n"),
    write(Cd), write(" "), write(Ct), write("   "), write(Cs), write("  "), write(Cc), write("\n"),
    write(Dd), write(" "), write(Dt), write("   "), write(Ds), write("  "), write(Dc), write("\n").

% regel relation
relation(
  Xd, Xt, Xs, Xc,
  Yd, Yt, Ys, Yc
  ) :-
    date(Xd), team(Xt), score(Xs), city(Xc),
    date(Yd), team(Yt), score(Ys), city(Yc),

    hint1(Xt, Xs, Ys, Xc, Yc),
    hint1(Yt, Ys, Xs, Yc, Xc),
    hint5(Xc, Ys, Xd, Yd),
    hint5(Yc, Xs, Yd, Xd),
    hint6(Xs, Xt, Yt, Xd, Yd),
    hint6(Ys, Yt, Xt, Yd, Xd).

% regel property
property(
  D, T, S, C
  ) :-
    date(D), team(T), score(S), city(C),

    hint2(T, D),
    hint3(C, S),
    hint4(D, C),
    hint7(T, C).

% hinweise als regeln

hint1(Team1, Score1, Score2, City1, City2) :-
  (Team1 \= "rnb", !);
  (Score1 \= "42-20", Score2 \= "42-20", !);
  (Team1 = "rnb", Score2 = "42-20", City1 = "humes", City2 = "coach");
  (Team1 = "rnb", Score2 = "42-20", City1 = "coach", City2 = "humes").

hint2(Team1, Date1) :-
  Team1 \= "war", !;
  Date1 = "okt07";
  Date1 = "okt11".

hint3(City1, Score1) :-
  City1 \= "fernd", !;
  Score1 = "20-13".

hint4(Date1, City1) :-
  Date1 \= "okt03", !;
  (City1 \= "humes", City1 \= "fernd").

hint5(City1, Score2, Date1, Date2) :-
  (City1 \= "grove", !; Score2 \= "20-13", !);
  (Date1 = "okt07", Date2 = "okt03");
  (Date1 = "okt11", Date2 = "okt07");
  (Date1 = "okt15", Date2 = "okt11").

hint6(Score1, Team1, Team2, Date1, Date2) :-
  (Score1 \= "24-21", !);
  (Team1 \= "egl", Team2 \= "egl", !);
  (Team2 = "egl", Date1 = "okt15");
  (Team2 = "egl", Date1 = "okt11", Date2 \= "okt15");
  (Team2 = "egl", Date1 = "okt07", Date2 \= "okt15", Date2 \= "okt11").

hint7(Team1, City1) :-
  Team1 \= "ram", !;
  City1 = "humes".