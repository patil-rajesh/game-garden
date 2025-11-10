import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Hand, Scissors, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Choice = "rock" | "paper" | "scissors" | null;

const choices = [
  { id: "rock", icon: Hand, label: "Rock" },
  { id: "paper", icon: FileText, label: "Paper" },
  { id: "scissors", icon: Scissors, label: "Scissors" },
] as const;

const RockPaperScissorsGame = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string>("");
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 });

  const getComputerChoice = (): Choice => {
    const choices: Choice[] = ["rock", "paper", "scissors"];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: Choice, computer: Choice): string => {
    if (player === computer) return "draw";
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "player";
    }
    return "computer";
  };

  const handleChoice = (choice: Choice) => {
    const computer = getComputerChoice();
    setPlayerChoice(choice);
    setComputerChoice(computer);

    const winner = determineWinner(choice, computer);
    if (winner === "player") {
      setResult("You Win!");
      setScore((prev) => ({ ...prev, player: prev.player + 1 }));
    } else if (winner === "computer") {
      setResult("Computer Wins!");
      setScore((prev) => ({ ...prev, computer: prev.computer + 1 }));
    } else {
      setResult("It's a Draw!");
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("");
  };

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
            Rock Paper Scissors
          </h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-gradient-card border-border/50">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-muted-foreground">Your Wins</p>
                <p className="text-2xl font-bold text-game-success">{score.player}</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-muted-foreground">Draws</p>
                <p className="text-2xl font-bold text-muted-foreground">{score.draws}</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-muted-foreground">Computer Wins</p>
                <p className="text-2xl font-bold text-destructive">{score.computer}</p>
              </div>
            </div>

            {result && (
              <div className="text-center space-y-4 animate-fade-in">
                <h2 className="text-3xl font-bold">{result}</h2>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">You chose</p>
                    <div className="bg-secondary/50 rounded-lg p-6 border-2 border-primary/50">
                      {playerChoice && (
                        <>
                          {choices.find((c) => c.id === playerChoice)?.icon &&
                            (() => {
                              const Icon = choices.find((c) => c.id === playerChoice)!.icon;
                              return <Icon className="h-12 w-12 mx-auto text-primary" />;
                            })()}
                          <p className="mt-2 font-semibold capitalize">{playerChoice}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Computer chose</p>
                    <div className="bg-secondary/50 rounded-lg p-6 border-2 border-game-warning/50">
                      {computerChoice && (
                        <>
                          {choices.find((c) => c.id === computerChoice)?.icon &&
                            (() => {
                              const Icon = choices.find((c) => c.id === computerChoice)!.icon;
                              return <Icon className="h-12 w-12 mx-auto text-game-warning" />;
                            })()}
                          <p className="mt-2 font-semibold capitalize">{computerChoice}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={resetGame}
                  className="bg-gradient-accent hover:opacity-90 shadow-glow"
                  size="lg"
                >
                  Play Again
                </Button>
              </div>
            )}

            {!result && (
              <div className="space-y-4">
                <p className="text-center text-xl font-semibold">Choose your move:</p>
                <div className="grid grid-cols-3 gap-4">
                  {choices.map(({ id, icon: Icon, label }) => (
                    <Button
                      key={id}
                      onClick={() => handleChoice(id)}
                      className="h-32 flex-col gap-2 text-lg bg-secondary/50 hover:bg-secondary/80 hover:scale-105 transition-all border-2 border-border/50 hover:border-primary/50"
                      variant="outline"
                    >
                      <Icon className="h-12 w-12" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RockPaperScissorsGame;
