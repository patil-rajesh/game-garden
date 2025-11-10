import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Car {
  x: number;
  y: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
}

const RaceCarGame = () => {
  const [car, setCar] = useState<Car>({ x: 150, y: 400 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();
  const touchStartX = useRef<number>(0);

  const canvasWidth = 350;
  const canvasHeight = 500;
  const carWidth = 40;
  const carHeight = 60;
  const laneWidth = canvasWidth / 3;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setCar((prev) => {
          // Find current lane
          const currentLane = Math.round(prev.x / laneWidth);
          // Move to left lane
          const newLane = Math.max(0, currentLane - 1);
          return { ...prev, x: newLane * laneWidth + laneWidth / 2 };
        });
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setCar((prev) => {
          // Find current lane
          const currentLane = Math.round(prev.x / laneWidth);
          // Move to right lane
          const newLane = Math.min(2, currentLane + 1);
          return { ...prev, x: newLane * laneWidth + laneWidth / 2 };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPlaying || gameOver) return;
    const touchX = e.touches[0].clientX;
    const diff = touchX - touchStartX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff < 0) { // Swipe left - move left
        setCar((prev) => {
          const currentLane = Math.round(prev.x / laneWidth);
          const newLane = Math.max(0, currentLane - 1);
          return { ...prev, x: newLane * laneWidth + laneWidth / 2 };
        });
      } else { // Swipe right - move right
        setCar((prev) => {
          const currentLane = Math.round(prev.x / laneWidth);
          const newLane = Math.min(2, currentLane + 1);
          return { ...prev, x: newLane * laneWidth + laneWidth / 2 };
        });
      }
      touchStartX.current = touchX;
    }
  };

  const moveLeft = () => {
    if (!isPlaying || gameOver) return;
    setCar((prev) => {
      const currentLane = Math.round(prev.x / laneWidth);
      const newLane = Math.max(0, currentLane - 1);
      return { ...prev, x: newLane * laneWidth + laneWidth / 2 };
    });
  };

  const moveRight = () => {
    if (!isPlaying || gameOver) return;
    setCar((prev) => {
      const currentLane = Math.round(prev.x / laneWidth);
      const newLane = Math.min(2, currentLane + 1);
      return { ...prev, x: newLane * laneWidth + laneWidth / 2 };
    });
  };

  const checkCollision = (carPos: Car, obs: Obstacle) => {
    const carLeft = carPos.x - carWidth / 2;
    const carRight = carPos.x + carWidth / 2;
    const carTop = carPos.y;
    const carBottom = carPos.y + carHeight;
    
    const obsLeft = obs.x;
    const obsRight = obs.x + obs.width;
    const obsTop = obs.y;
    const obsBottom = obs.y + 60;
    
    return (
      carLeft < obsRight &&
      carRight > obsLeft &&
      carTop < obsBottom &&
      carBottom > obsTop
    );
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      setObstacles((prev) => {
        const updated = prev
          .map((obs) => ({ ...obs, y: obs.y + speed }))
          .filter((obs) => obs.y < canvasHeight + 60);

        if (Math.random() < 0.02) {
          const lane = Math.floor(Math.random() * 3);
          updated.push({
            x: lane * laneWidth + laneWidth / 2 - 35,
            y: -60,
            width: 70,
          });
        }

        return updated;
      });

      setScore((prev) => {
        const newScore = prev + 1;
        // Increase speed every 100 displayed score points
        if (Math.floor(newScore / 10 / 100) > Math.floor(prev / 10 / 100)) {
          setSpeed((currentSpeed) => Math.min(currentSpeed + 1, 15));
        }
        return newScore;
      });

      setObstacles((obs) => {
        for (const obstacle of obs) {
          if (checkCollision(car, obstacle)) {
            setGameOver(true);
            setIsPlaying(false);
            return obs;
          }
        }
        return obs;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, car, speed]);

  const startGame = () => {
    setCar({ x: laneWidth + laneWidth / 2, y: 400 }); // Center in middle lane
    setObstacles([]);
    setScore(0);
    setSpeed(5);
    setGameOver(false);
    setIsPlaying(true);
  };

  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setCar({ x: laneWidth + laneWidth / 2, y: 400 }); // Center in middle lane
    setObstacles([]);
    setScore(0);
    setSpeed(5);
    setGameOver(false);
    setIsPlaying(false);
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
            Race Car
          </h1>
          <Button variant="ghost" size="sm" onClick={resetGame}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gradient-card border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">
                Score: <span className="text-primary">{Math.floor(score / 10)}</span>
              </div>
              {!gameOver && isPlaying && (
                <Button variant="outline" size="sm" onClick={togglePause}>
                  <Pause className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div
              ref={canvasRef}
              className="relative bg-secondary/30 rounded-lg overflow-hidden mx-auto border-4 border-border/50"
              style={{ width: canvasWidth, height: canvasHeight }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {/* Road lines */}
              <div className="absolute inset-0 flex">
                <div className="flex-1 border-r-2 border-dashed border-border/30" />
                <div className="flex-1 border-r-2 border-dashed border-border/30" />
                <div className="flex-1" />
              </div>

              {/* Player car */}
              <div
                className="absolute transition-all duration-100"
                style={{
                  left: car.x - carWidth / 2,
                  top: car.y,
                  width: carWidth,
                  height: carHeight,
                }}
              >
                <svg viewBox="0 0 40 60" className="w-full h-full drop-shadow-glow">
                  <defs>
                    <linearGradient id="carGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  {/* Car body */}
                  <rect x="5" y="15" width="30" height="40" rx="4" fill="url(#carGradient)" />
                  {/* Windshield */}
                  <rect x="10" y="20" width="20" height="12" rx="2" fill="hsl(var(--secondary))" opacity="0.7" />
                  {/* Wheels */}
                  <rect x="2" y="18" width="6" height="10" rx="2" fill="hsl(var(--foreground))" />
                  <rect x="32" y="18" width="6" height="10" rx="2" fill="hsl(var(--foreground))" />
                  <rect x="2" y="40" width="6" height="10" rx="2" fill="hsl(var(--foreground))" />
                  <rect x="32" y="40" width="6" height="10" rx="2" fill="hsl(var(--foreground))" />
                </svg>
              </div>

              {/* Obstacles */}
              {obstacles.map((obs, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: obs.x,
                    top: obs.y,
                    width: obs.width,
                    height: 60,
                  }}
                >
                  <svg viewBox="0 0 70 60" className="w-full h-full">
                    <defs>
                      <linearGradient id={`obstacleGradient${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "hsl(var(--destructive))", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "hsl(var(--destructive))", stopOpacity: 0.7 }} />
                      </linearGradient>
                    </defs>
                    {/* Car body */}
                    <rect x="10" y="5" width="50" height="50" rx="4" fill={`url(#obstacleGradient${i})`} />
                    {/* Windshield */}
                    <rect x="18" y="35" width="34" height="12" rx="2" fill="hsl(var(--background))" opacity="0.5" />
                    {/* Wheels */}
                    <rect x="5" y="12" width="8" height="12" rx="2" fill="hsl(var(--foreground))" />
                    <rect x="57" y="12" width="8" height="12" rx="2" fill="hsl(var(--foreground))" />
                    <rect x="5" y="36" width="8" height="12" rx="2" fill="hsl(var(--foreground))" />
                    <rect x="57" y="36" width="8" height="12" rx="2" fill="hsl(var(--foreground))" />
                  </svg>
                </div>
              ))}

              {/* Game Over overlay */}
              {gameOver && (
                <div className="absolute inset-0 bg-background/90 flex items-center justify-center animate-fade-in">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-destructive">Game Over!</h2>
                    <p className="text-xl">
                      Final Score: <span className="text-primary font-bold">{Math.floor(score / 10)}</span>
                    </p>
                    <Button
                      onClick={startGame}
                      className="bg-gradient-accent hover:opacity-90 shadow-glow"
                      size="lg"
                    >
                      Play Again
                    </Button>
                  </div>
                </div>
              )}

              {/* Start screen */}
              {!isPlaying && !gameOver && (
                <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Ready to Race?</h2>
                    <p className="text-sm text-muted-foreground">
                      Use Arrow Keys or A/D keys<br />
                      or swipe left/right on mobile
                    </p>
                    <Button
                      onClick={startGame}
                      className="bg-gradient-accent hover:opacity-90 shadow-glow"
                      size="lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Start Game
                    </Button>
                  </div>
                </div>
              )}

              {/* Paused overlay */}
              {!gameOver && !isPlaying && score > 0 && (
                <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Paused</h2>
                    <Button
                      onClick={togglePause}
                      className="bg-gradient-accent hover:opacity-90 shadow-glow"
                      size="lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Resume
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={moveLeft}
                disabled={!isPlaying || gameOver}
                className="w-20 h-20 rounded-full bg-gradient-accent hover:opacity-90 shadow-glow"
                size="lg"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                onClick={moveRight}
                disabled={!isPlaying || gameOver}
                className="w-20 h-20 rounded-full bg-gradient-accent hover:opacity-90 shadow-glow"
                size="lg"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Use Arrow Keys, A/D keys, swipe, or buttons to control
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RaceCarGame;
