module Mathe where

kgv :: Int -> Int -> Int
kgv x y = div ((*) x y) (ggt (x, y))

ggt :: (Int, Int) -> Int
ggt(0, 0) = error "Nicht Definiert"
ggt(0, y) = y
ggt(x, y) = ggt((mod y x), x)

ggt' :: [Int] -> Int
ggt' (h:r) = ggt( h, (ggt' r))

kuerzen :: (Int, Int) -> (Int, Int)
kuerzen (x,y) = (div x g, div y g) where g = ggt(x,y)

sieve (p:ns) = p : sieve [n | n <- ns, n `mod` p /= 0]
primes = sieve[2..]

p5 = take 5 primes
p100 = primes !! 100

s1 (x,y) = x + y
s2 x y = x + y

-- sublist 3 6 list
-- 3. bis 6. element einer liste

sublist :: Int -> Int -> [a] -> [a]
sublist x y z = take (y - x + 1) (drop (x-1) z)

-- summe list
-- summierte zahlen der liste
-- > Rekursion:

summe :: Num a => [a] -> a
summe [a] = a
summe (a:as) = a + summe as

-- twice (*2) 2
-- 2 *2 *2 = 8

twice :: (a -> a) -> a -> a
twice x y = x (x y)