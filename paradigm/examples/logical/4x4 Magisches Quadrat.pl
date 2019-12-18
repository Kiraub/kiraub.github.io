% Autor: Erik Bauer
% Datum: 07.05.2014

ziffer(1).
ziffer(2).
ziffer(3).
ziffer(4).
ziffer(5).
ziffer(6).
ziffer(7).
ziffer(8).
ziffer(9).
ziffer(10).
ziffer(11).
ziffer(12).
ziffer(13).
ziffer(14).
ziffer(15).
ziffer(16).

start :-   ziffer(A),
           ziffer(B), B\=A,
           ziffer(C), C\=A, C\=B,
           ziffer(D), D\=A, D\=B, D\=C,
           S is A+B+C+D,
           ziffer(E), E\=A, E\=B, E\=C, E\=D,
           ziffer(F), F\=A, F\=B, F\=C, F\=D, F\=E,
           ziffer(G), G\=A, G\=B, G\=C, G\=D, G\=E, G\=F,
           ziffer(H), H\=A, H\=B, H\=C, H\=D, H\=E, H\=F, H\=G,
           S is E+F+G+H,
           ziffer(I), I\=A, I\=B, I\=C, I\=D, I\=E, I\=F, I\=G, I\=H,
           ziffer(J), J\=A, J\=B, J\=C, J\=D, J\=E, J\=F, J\=G, J\=H, J\=I,
           ziffer(K), K\=A, K\=B, K\=C, K\=D, K\=E, K\=F, K\=G, K\=H, K\=I, K\=J,
           ziffer(L), L\=A, L\=B, L\=C, L\=D, L\=E, L\=F, L\=G, L\=H, L\=I, L\=J, L\=K,
           S is I+J+K+L,
           ziffer(M), M\=A, M\=B, M\=C, M\=D, M\=E, M\=F, M\=G, M\=H, M\=I, M\=J, M\=K, M\=L,
           S is D+G+J+M,
           ziffer(N), N\=A, N\=B, N\=C, N\=D, N\=E, N\=F, N\=G, N\=H, N\=I, N\=J, N\=K, N\=L, N\=M,
           ziffer(O), O\=A, O\=B, O\=C, O\=D, O\=E, O\=F, O\=G, O\=H, O\=I, O\=J, O\=K, O\=L, O\=M, O\=N,
           ziffer(P), P\=A, P\=B, P\=C, P\=D, P\=E, P\=F, P\=G, P\=H, P\=I, P\=J, P\=K, P\=L, P\=M, P\=N, P\=O,
           S is M+N+O+P,
           S is A+F+K+P,
           write(A), write(' '), write(B), write(' '), write(C), write(' '), writeln(D),      % A B C D   A E I M
           write(E), write(' '), write(F), write(' '), write(G), write(' '), writeln(H),      % E F G H   B F J N
           write(I), write(' '), write(J), write(' '), write(K), write(' '), writeln(L),      % I J K L   C G K O
           write(M), write(' '), write(N), write(' '), write(O), write(' '), writeln(P),      % M N O P   D H L P
           writeln(' ').