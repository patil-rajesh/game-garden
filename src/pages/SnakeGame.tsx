import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    setNextDirection("RIGHT");
    setScore(0);
    generateFood();
    setIsPlaying(false);
  }, [generateFood]);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return snakeBody.some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      // Update direction
      setDirection(nextDirection);

      // Move head
      switch (nextDirection) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Check collision
      if (checkCollision(head, prevSnake)) {
        toast.error(`Game Over! Score: ${score}`);
        if (score > highScore) {
          setHighScore(score);
          toast.success(`New High Score: ${score}!`);
        }
        resetGame();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        generateFood();
        toast.success("+10 points!");
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food, score, highScore, checkCollision, generateFood, resetGame]);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      moveSnake();
    }, INITIAL_SPEED);

    return () => clearInterval(gameLoop);
  }, [isPlaying, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (e.key === " ") {
        setIsPlaying((prev) => !prev);
        return;
      }

      setNextDirection((prevDirection) => {
        switch (e.key) {
          case "ArrowUp":
            return prevDirection !== "DOWN" ? "UP" : prevDirection;
          case "ArrowDown":
            return prevDirection !== "UP" ? "DOWN" : prevDirection;
          case "ArrowLeft":
            return prevDirection !== "RIGHT" ? "LEFT" : prevDirection;
          case "ArrowRight":
            return prevDirection !== "LEFT" ? "RIGHT" : prevDirection;
          default:
            return prevDirection;
        }
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Snake Game
          </h1>
        </div>

        <div className="grid md:grid-cols-[1fr,250px] gap-6">
          {/* Game Board */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-3xl font-bold text-primary">{score}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-sm text-muted-foreground">High Score</p>
                  <p className="text-2xl font-bold text-accent">{highScore}</p>
                </div>
              </div>

              <div
                className="bg-secondary/50 border-2 border-primary/20 rounded-lg mx-auto"
                style={{
                  width: GRID_SIZE * CELL_SIZE,
                  height: GRID_SIZE * CELL_SIZE,
                  position: "relative",
                }}
              >
                {/* Snake */}
                {snake.map((segment, index) => (
                  <div
                    key={index}
                    className={`absolute transition-all`}
                    style={{
                      width: CELL_SIZE - 2,
                      height: CELL_SIZE - 2,
                      left: segment.x * CELL_SIZE,
                      top: segment.y * CELL_SIZE,
                    }}
                  >
                    {index === 0 ? (
                      // Snake head with mouth
                      <div className="w-full h-full bg-primary shadow-glow rounded-sm relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 20 20" className="w-full h-full">
                            <circle cx="6" cy="6" r="2" fill="hsl(var(--background))" />
                            <circle cx="14" cy="6" r="2" fill="hsl(var(--background))" />
                            <path d="M 5 14 Q 10 16 15 14" stroke="hsl(var(--background))" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      // Snake body
                      <div className="w-full h-full bg-primary/80 rounded-sm" />
                    )}
                  </div>
                ))}

                {/* Food */}
                <div
                  className="absolute bg-accent rounded-full animate-glow-pulse"
                  style={{
                    width: CELL_SIZE - 4,
                    height: CELL_SIZE - 4,
                    left: food.x * CELL_SIZE + 2,
                    top: food.y * CELL_SIZE + 2,
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Controls */}
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="font-semibold mb-4">Controls</h3>
              <div className="space-y-4">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-full bg-gradient-accent hover:opacity-90"
                  size="lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                
                {/* Direction Buttons for Mobile */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">Direction Buttons</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div />
                    <Button
                      onClick={() => setNextDirection((prev) => prev !== "DOWN" ? "UP" : prev)}
                      variant="outline"
                      size="lg"
                      disabled={!isPlaying}
                      className="h-12"
                    >
                      ↑
                    </Button>
                    <div />
                    <Button
                      onClick={() => setNextDirection((prev) => prev !== "RIGHT" ? "LEFT" : prev)}
                      variant="outline"
                      size="lg"
                      disabled={!isPlaying}
                      className="h-12"
                    >
                      ←
                    </Button>
                    <Button
                      onClick={() => setNextDirection((prev) => prev !== "UP" ? "DOWN" : prev)}
                      variant="outline"
                      size="lg"
                      disabled={!isPlaying}
                      className="h-12"
                    >
                      ↓
                    </Button>
                    <Button
                      onClick={() => setNextDirection((prev) => prev !== "LEFT" ? "RIGHT" : prev)}
                      variant="outline"
                      size="lg"
                      disabled={!isPlaying}
                      className="h-12"
                    >
                      →
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="font-semibold mb-4">How to Play</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use arrow keys to move</li>
                <li>• Press Space to pause/resume</li>
                <li>• Eat food to grow longer</li>
                <li>• Avoid walls and yourself</li>
                <li>• Each food = 10 points</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
