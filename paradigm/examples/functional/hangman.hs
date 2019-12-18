import Data.Char

main :: IO Int
main = do hangman

placeholder :: Char
placeholder = '*'

readString :: IO String
readString = getLine

str2int :: String -> Int
str2int = read

readInt :: IO Int
readInt = do
    str <- getLine
    if and $ map isDigit str
        then do
            return $ str2int str
        else do
            putStrLn "###FEHLER: Bitte eine Zahl eingeben."
            n <- readInt
            return n

readChar :: IO Char
readChar = do
    str <- getLine
    if (length str == 1) && isAlpha  (head str)
        then do
            return $ head str
        else do
            putStrLn "###FEHLER: Bitte einen Buchstaben eingeben."
            c <- readChar
            return c

chrInStr :: Char -> String -> Char
chrInStr c s
    | or[ c==c' | c'<-s ] = c
    | otherwise = placeholder

check :: String -> String -> String
check s1 s2 = map (\c2 -> if or[ c1 == c2 | c1 <- s1] then c2 else placeholder) s2

hangman :: IO Int
hangman = do 
    putStrLn "Bitte das Geheimwort eingeben."
    geheim <- readString
    putStrLn "Bitte die Versuchszahl festlegen."
    versuche <- readInt
    geschafft <- hmGame geheim "" versuche
    if geschafft
        then do
            putStrLn "Erraten!"
            putStrLn $ "Das Geheimwort lautet: " ++ geheim
            return 0
        else do
            putStrLn "Leider nicht erraten!"
            putStrLn $ "Das Geheimwort lautet: " ++ geheim
            return 0

hmGame :: String -> String -> Int -> IO Bool
hmGame _ _ 0 = return False
hmGame gh eing vs = do
    let lgh = sum [1 | _ <- gh]
    putStrLn $ "\n\nNoch " ++ (show vs) ++ " Versuche."
    putStrLn "Bereits eingegebene Buchstaben:"
    putStrLn eing
    putStrLn $ check eing gh
    putStrLn "Bitte einen Buchstaben eingeben."
    eingabe <- readChar
    if (chrInStr eingabe eing) == placeholder
        then do
            if (chrInStr eingabe gh) == placeholder
                then do
                    putStrLn "Leider ist dieser Buchstabe nicht im Geheimwort enthalten."
                    hmGame gh (eingabe:eing) (vs-1)
                else do
                    putStrLn "Der Buchstabe ist im Geheimwort enthalten!"
                    if gh == (check (eingabe:eing) gh)
                        then return True
                        else hmGame gh (eingabe:eing) vs
        else do
            putStrLn "Den Buchstaben haben Sie schon einmal eingegeben."
            hmGame gh eing vs