% Autor:
% Datum: 21.06.2016

% z(B,W,Z,K)

% illegal/1
i(z(B,W,Z,_K)):-
  W=Z, g(B,W).
i(z(B,_W,Z,K)):-
  Z=K, g(B,Z).

% gegenueber/2
g(n,s).
g(s,n).

% benachbart/2
b(z(B1,W1,Z1,K1),z(B2,W2,Z2,K2)):-
  (i(z(B1,Z1,W1,K1));
   i(z(B2,Z2,W2,K2))
  ),
  !,
  fail.
b(z(B1,W,Z,K),z(B2,W,Z,K)):-
  g(B1,B2).
b(z(B1,B1,Z,K),z(B2,B2,Z,K)):-
  g(B1,B2).
b(z(B1,W,B1,K),z(B2,W,B2,K)):-
  g(B1,B2).
b(z(B1,W,Z,B1),z(B2,W,Z,B2)):-
  g(B1,B2).

% verbunden/4
v(Z,Z,Ws,Ws).
v(Z1,Z2,Acc,Ws):-
  b(Z1,Zh),
  not(member(Zh,Acc)),
  v(Zh,Z2,[Zh|Acc],Ws).