module Currying where

addc :: Int -> Int -> Int
addc a b = a + b

addt :: (Int, Int) -> Int
addt (a, b) = a + b 

multt :: (Int, Int, Int) -> Int
multt (a, b, c) = a * b * c

multc :: Int -> (Int -> (Int -> Int))
multc a b c = a * b * c

foo g h c = g( h c)
strange f g = g (f g)

douncurry :: (a -> b -> c) -> (a, b) -> c
douncurry f (a, b) = f a b 

docurry :: ((a, b) -> c) -> a -> b -> c
docurry f a b = f (a, b)

bar = foo douncurry docurry
baz = foo docurry douncurry

doflip :: (a -> b -> c) -> b -> a -> c
doflip f a b = f b a

doswap :: (a, b) -> (b, a)
doswap (a, b) = (b, a)