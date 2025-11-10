import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const wordsByDifficulty = {
  easy: ["STRAWBERRY", "BLACKBERRY", "TELEVISION", "PLAYGROUND", "BASKETBALL", "WATERMELON", "SKATEBOARD", "TRAMPOLINE", "HELICOPTER", "MICROPHONE"],
  medium: ["DISPLAY", "NETWORK", "CONNECT", "DESKTOP", "PACKAGE", "BACKEND", "ANDROID", "BROWSER", "COMPASS", "FANTASY"],
  hard: ["REACT", "PHONE", "TABLE", "CLOUD", "APPLE", "MUSIC", "HEART", "LIGHT", "BREAD", "TIGER"]
};

const maxWrongGuessesByDifficulty = {
  easy: 6,
  medium: 6,
  hard: 6
};

type Difficulty = "easy" | "medium" | "hard";

const HangmanGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [maxWrongGuesses, setMaxWrongGuesses] = useState(10);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter) && !guessedLetters.has(letter)) {
        handleGuess(letter);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [guessedLetters, gameOver]);

  const startNewGame = (selectedDifficulty?: Difficulty) => {
    if (!selectedDifficulty) return;
    
    setDifficulty(selectedDifficulty);
    setMaxWrongGuesses(maxWrongGuessesByDifficulty[selectedDifficulty]);
    const wordList = wordsByDifficulty[selectedDifficulty];
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWord(newWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setWon(false);
  };

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || gameOver) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameOver(true);
        setWon(false);
      }
    } else {
      const allLettersGuessed = word.split("").every((l) => newGuessed.has(l));
      if (allLettersGuessed) {
        setGameOver(true);
        setWon(true);
      }
    }
  };

  const displayWord = word
    .split("")
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ");

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Hangman
          </h1>
          <Button variant="ghost" size="sm" onClick={() => startNewGame()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-gradient-card border-border/50">
          <CardContent className="p-6 space-y-6">
            {!difficulty ? (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center">Choose Difficulty</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => startNewGame("easy")}
                    className="h-24 text-lg bg-game-success hover:opacity-90"
                  >
                    <div className="text-center">
                      <div className="font-bold">Easy</div>
                      <div className="text-sm">10 Letters - 6 Lives</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => startNewGame("medium")}
                    className="h-24 text-lg bg-game-warning hover:opacity-90"
                  >
                    <div className="text-center">
                      <div className="font-bold">Medium</div>
                      <div className="text-sm">7 Letters - 6 Lives</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => startNewGame("hard")}
                    className="h-24 text-lg bg-destructive hover:opacity-90"
                  >
                    <div className="text-center">
                      <div className="font-bold">Hard</div>
                      <div className="text-sm">5 Letters - 6 Lives</div>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-lg font-semibold">
                  <div>
                    <span className="text-muted-foreground">Difficulty: </span>
                    <span className={`capitalize ${
                      difficulty === "easy" ? "text-game-success" : 
                      difficulty === "medium" ? "text-game-warning" : "text-destructive"
                    }`}>{difficulty}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Wrong: </span>
                    <span className="text-destructive">{wrongGuesses}</span> / {maxWrongGuesses}
                  </div>
                </div>

                <div className="relative h-48 flex items-center justify-center">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                    <line x1="20" y1="180" x2="180" y2="180" stroke="hsl(var(--border))" strokeWidth="3" />
                    <line x1="40" y1="180" x2="40" y2="20" stroke="hsl(var(--border))" strokeWidth="3" />
                    <line x1="40" y1="20" x2="120" y2="20" stroke="hsl(var(--border))" strokeWidth="3" />
                    <line x1="120" y1="20" x2="120" y2="40" stroke="hsl(var(--border))" strokeWidth="3" />
                    
                    {wrongGuesses >= 1 && <circle cx="120" cy="60" r="20" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />}
                    {wrongGuesses >= 2 && <line x1="120" y1="80" x2="120" y2="130" stroke="hsl(var(--primary))" strokeWidth="3" />}
                    {wrongGuesses >= 3 && <line x1="120" y1="90" x2="100" y2="110" stroke="hsl(var(--primary))" strokeWidth="3" />}
                    {wrongGuesses >= 4 && <line x1="120" y1="90" x2="140" y2="110" stroke="hsl(var(--primary))" strokeWidth="3" />}
                    {wrongGuesses >= 5 && <line x1="120" y1="130" x2="100" y2="160" stroke="hsl(var(--primary))" strokeWidth="3" />}
                    {wrongGuesses >= 6 && <line x1="120" y1="130" x2="140" y2="160" stroke="hsl(var(--primary))" strokeWidth="3" />}
                  </svg>
                </div>

                <div className="text-3xl md:text-4xl font-bold tracking-wider py-4 font-mono">
                  {displayWord}
                </div>

                {gameOver && (
                  <div className="animate-fade-in space-y-4">
                    <div className={`text-2xl font-bold ${won ? "text-game-success" : "text-destructive"}`}>
                      {won ? "You Won! 🎉" : `Game Over! The word was: ${word}`}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => startNewGame()}
                        className="bg-gradient-accent hover:opacity-90 shadow-glow"
                        size="lg"
                      >
                        Play Again
                      </Button>
                      <Button
                        onClick={() => {
                          setDifficulty(null);
                          setWord("");
                        }}
                        variant="outline"
                        size="lg"
                      >
                        Change Difficulty
                      </Button>
                    </div>
                  </div>
                )}

                {!gameOver && (
                  <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
                    {alphabet.map((letter) => {
                      const isGuessed = guessedLetters.has(letter);
                      const isCorrect = isGuessed && word.includes(letter);
                      const isWrong = isGuessed && !word.includes(letter);

                      return (
                        <button
                          key={letter}
                          onClick={() => handleGuess(letter)}
                          disabled={isGuessed}
                          className={`aspect-square rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95 ${
                            isCorrect
                              ? "bg-game-success/20 text-game-success border-2 border-game-success"
                              : isWrong
                              ? "bg-destructive/20 text-destructive border-2 border-destructive"
                              : "bg-secondary/50 hover:bg-secondary/80 border-2 border-border/50 hover:border-primary/50"
                          } ${isGuessed ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="text-center text-sm text-muted-foreground">
                  Tap letters or use your keyboard to guess
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HangmanGame;
