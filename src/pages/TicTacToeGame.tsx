import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Player = "X" | "O" | null;
type GameMode = "two-player" | "computer" | null;

const TicTacToeGame = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player>(null);
  const [gameMode, setGameMode] = useState<GameMode>(null);

  const checkWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getAvailableMoves = (squares: Player[]): number[] => {
    return squares.map((cell, index) => cell === null ? index : -1).filter(i => i !== -1);
  };

  const minimax = (squares: Player[], isMaximizing: boolean): number => {
    const winner = checkWinner(squares);
    if (winner === "O") return 10;
    if (winner === "X") return -10;
    if (squares.every(cell => cell !== null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of getAvailableMoves(squares)) {
        squares[move] = "O";
        const score = minimax(squares, false);
        squares[move] = null;
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of getAvailableMoves(squares)) {
        squares[move] = "X";
        const score = minimax(squares, true);
        squares[move] = null;
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  const getComputerMove = (squares: Player[]): number => {
    const availableMoves = getAvailableMoves(squares);
    
    // 30% chance to make a random move (makes it beatable)
    if (Math.random() < 0.3) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    // 70% chance to use minimax (smart move)
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (const move of availableMoves) {
      squares[move] = "O";
      const score = minimax(squares, false);
      squares[move] = null;
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    return bestMove;
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver || !gameMode) return;
    if (gameMode === "computer" && !isXNext) return; // Don't allow clicking during computer's turn

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
      return;
    }
    
    if (newBoard.every((cell) => cell !== null)) {
      setGameOver(true);
      return;
    }

    setIsXNext(!isXNext);

    // Computer's turn in computer mode
    if (gameMode === "computer" && isXNext) {
      setTimeout(() => {
        const computerMove = getComputerMove(newBoard);
        if (computerMove !== -1) {
          const computerBoard = [...newBoard];
          computerBoard[computerMove] = "O";
          setBoard(computerBoard);

          const computerWinner = checkWinner(computerBoard);
          if (computerWinner) {
            setWinner(computerWinner);
            setGameOver(true);
          } else if (computerBoard.every((cell) => cell !== null)) {
            setGameOver(true);
          } else {
            setIsXNext(true);
          }
        }
      }, 500);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setGameMode(null);
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
            Tic-Tac-Toe
          </h1>
          <Button variant="ghost" size="sm" onClick={resetGame}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gradient-card border-border/50">
          <CardContent className="p-6 space-y-6">
            {!gameMode ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center">Choose Game Mode</h2>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={() => setGameMode("two-player")}
                    className="h-20 text-lg bg-gradient-accent hover:opacity-90 shadow-glow"
                  >
                    Two Player
                  </Button>
                  <Button
                    onClick={() => setGameMode("computer")}
                    className="h-20 text-lg bg-primary hover:opacity-90"
                  >
                    vs Computer
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center space-y-2">
                  {gameOver ? (
                    winner ? (
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="h-6 w-6 text-game-success" />
                        <p className="text-2xl font-bold">
                          {gameMode === "computer" && winner === "O" ? "Computer" : `Player ${winner}`} Wins!
                        </p>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-muted-foreground">It's a Draw!</p>
                    )
                  ) : (
                    <p className="text-xl font-semibold">
                      Current Player: <span className="text-primary">
                        {gameMode === "computer" && !isXNext ? "Computer (O)" : isXNext ? "X" : "O"}
                      </span>
                    </p>
                  )}
                </div>

            <div className="grid grid-cols-3 gap-3 aspect-square max-w-sm mx-auto">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className="aspect-square bg-secondary/50 hover:bg-secondary/80 rounded-lg flex items-center justify-center text-4xl md:text-5xl font-bold transition-all hover:scale-105 active:scale-95 border-2 border-border/50 hover:border-primary/50"
                  disabled={gameOver || cell !== null}
                >
                  {cell && (
                    <span className={cell === "X" ? "text-primary" : "text-game-warning"}>
                      {cell}
                    </span>
                  )}
                </button>
              ))}
            </div>

                {gameOver && (
                  <Button
                    onClick={resetGame}
                    className="w-full bg-gradient-accent hover:opacity-90 shadow-glow"
                    size="lg"
                  >
                    Play Again
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TicTacToeGame;
