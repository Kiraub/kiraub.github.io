% Autor:
% Datum: 19.04.2016

symbol('%').
% Anzeigesymbol fur die Felder in denen eine Dame steht

feld_ausgabe('yes').
%feld_ausgabe('no').
/*
 wenn der fakt "feld_ausgabe('yes')." besteht, dann werden
 die Schachfelderausgegeben
*/

dame(Qs):-
   Qs = [1/_,2/_,3/_,4/_,5/_,6/_,7/_,8/_],
   loesung(Qs),
   feld_ausgabe(YN),
   ( YN = 'yes'
   -> zeig(1/1,Qs)
   ;  write('')
   ).
   
loesung([]).
loesung([X/Y|Others]):-
   loesung(Others),
   member(Y,[1,2,3,4,5,6,7,8]),
   noattack(X/Y,Others).
   
noattack(_,[]).
noattack(X/Y,[X1/Y1|Others]):-
   Y =\= Y1,
   Y1-Y =\= X1-X,
   Y1-Y =\= X-X1,
   noattack(X/Y,Others).
   
zeig(X/Y,Qs):-
  symbol(S),
  ( X/Y = 1/1
  -> writeln(' _ _ _ _ _ _ _ _')
  ;  write('')
  ),
  ( X = 1
  -> write('|')
  ;  write('')
  ),
  ( member(X/Y,Qs)
  ->
     write(S)
  ;
     write('_')
  ),
  ( X = 8
  ->
     writeln('|'),
     ( Y = 8
     ->
        writeln('')
     ;
        Yn is Y + 1,
        zeig(1/Yn,Qs)
     )
  ;
     write('|'),
     Xn is X + 1,
     zeig(Xn/Y,Qs)
  ).