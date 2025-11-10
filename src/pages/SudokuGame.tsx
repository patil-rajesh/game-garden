import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Lightbulb, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type SudokuGrid = (number | null)[][];

// Multiple pre-defined Sudoku puzzles
const sudokuPuzzles = [
  {
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
    cells: [[0,1], [0,4], [0,7], [1,0], [1,3], [1,6], [2,2], [2,5], [2,8], [3,1], [3,4], [3,7], [4,0], [4,3], [4,6], [5,2], [5,5], [5,8], [6,0], [6,4], [6,7], [7,2], [7,5], [7,8], [8,1], [8,4], [8,6]]
  },
  {
    solution: [
      [7, 2, 6, 4, 9, 3, 8, 1, 5],
      [3, 1, 5, 7, 2, 8, 9, 4, 6],
      [4, 8, 9, 6, 5, 1, 2, 3, 7],
      [8, 5, 2, 1, 4, 7, 6, 9, 3],
      [6, 7, 3, 9, 8, 5, 1, 2, 4],
      [9, 4, 1, 3, 6, 2, 7, 5, 8],
      [1, 9, 4, 8, 3, 6, 5, 7, 2],
      [5, 6, 7, 2, 1, 4, 3, 8, 9],
      [2, 3, 8, 5, 7, 9, 4, 6, 1],
    ],
    cells: [[0,2], [0,5], [0,7], [1,1], [1,4], [1,7], [2,0], [2,3], [2,6], [3,2], [3,5], [3,8], [4,1], [4,4], [4,7], [5,0], [5,3], [5,6], [6,2], [6,5], [6,8], [7,0], [7,4], [7,7], [8,1], [8,3], [8,6]]
  },
  {
    solution: [
      [1, 5, 2, 4, 8, 9, 3, 7, 6],
      [7, 3, 9, 2, 5, 6, 8, 4, 1],
      [4, 6, 8, 3, 7, 1, 2, 9, 5],
      [3, 8, 7, 1, 2, 4, 6, 5, 9],
      [5, 9, 1, 7, 6, 3, 4, 2, 8],
      [2, 4, 6, 8, 9, 5, 7, 1, 3],
      [9, 1, 4, 6, 3, 7, 5, 8, 2],
      [8, 2, 5, 9, 4, 1, 6, 3, 7],
      [6, 7, 3, 5, 1, 2, 9, 4, 8],
    ],
    cells: [[0,0], [0,3], [0,6], [1,2], [1,5], [1,8], [2,1], [2,4], [2,7], [3,0], [3,4], [3,8], [4,2], [4,4], [4,6], [5,0], [5,4], [5,8], [6,1], [6,4], [6,7], [7,0], [7,3], [7,6], [8,2], [8,5], [8,8]]
  }
];

// Simple Sudoku puzzle generator
const generateSudoku = (): { puzzle: SudokuGrid; solution: SudokuGrid } => {
  // Select a random puzzle from the collection
  const selected = sudokuPuzzles[Math.floor(Math.random() * sudokuPuzzles.length)];
  const solution: SudokuGrid = selected.solution.map(row => [...row]);
  
  const puzzle: SudokuGrid = solution.map(row => row.map(() => null));
  
  // Fill in the given cells
  selected.cells.forEach(([row, col]) => {
    puzzle[row][col] = solution[row][col];
  });

  return { puzzle, solution };
};

const SudokuGame = () => {
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [solution, setSolution] = useState<SudokuGrid>([]);
  const [initialGrid, setInitialGrid] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const maxWrongAttempts = 10;

  useEffect(() => {
    const { puzzle, solution: sol } = generateSudoku();
    setGrid(puzzle);
    setSolution(sol);
    setInitialGrid(JSON.parse(JSON.stringify(puzzle)));
  }, []);

  const isValidMove = (row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = boxRow + i;
        const c = boxCol + j;
        if ((r !== row || c !== col) && grid[r][c] === num) return false;
      }
    }

    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] !== null) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) {
      toast.error("Please select a cell first");
      return;
    }

    const { row, col } = selectedCell;
    if (initialGrid[row][col] !== null) return;

    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = num;
    setGrid(newGrid);

    // Check if correct
    if (solution[row][col] === num) {
      toast.success("Correct!");
      const key = `${row}-${col}`;
      const newErrors = new Set(errors);
      newErrors.delete(key);
      setErrors(newErrors);
    } else {
      const newWrongAttempts = wrongAttempts + 1;
      setWrongAttempts(newWrongAttempts);
      
      if (newWrongAttempts >= maxWrongAttempts) {
        toast.error("Game Over! Too many wrong attempts!");
        setIsComplete(true);
        return;
      }
      
      if (!isValidMove(row, col, num)) {
        toast.error(`Wrong! ${maxWrongAttempts - newWrongAttempts} attempts left`);
        const key = `${row}-${col}`;
        setErrors(new Set(errors).add(key));
      } else {
        toast.error(`Incorrect! ${maxWrongAttempts - newWrongAttempts} attempts left`);
      }
    }

    // Check if puzzle is complete
    const isFilled = newGrid.every((row) => row.every((cell) => cell !== null));
    if (isFilled) {
      const isCorrect = newGrid.every((row, i) =>
        row.every((cell, j) => cell === solution[i][j])
      );
      if (isCorrect) {
        setIsComplete(true);
        toast.success("🎉 Puzzle Complete!");
      }
    }
  };

  const resetGame = () => {
    const { puzzle, solution: sol } = generateSudoku();
    setGrid(puzzle);
    setSolution(sol);
    setInitialGrid(JSON.parse(JSON.stringify(puzzle)));
    setSelectedCell(null);
    setErrors(new Set());
    setIsComplete(false);
    setHintsRemaining(3);
    setWrongAttempts(0);
  };

  const showHint = () => {
    if (hintsRemaining <= 0) {
      toast.error("No hints remaining!");
      return;
    }
    
    if (!selectedCell) {
      toast.error("Select a cell to get a hint");
      return;
    }

    const { row, col } = selectedCell;
    if (initialGrid[row][col] !== null) {
      toast.error("This cell is already filled");
      return;
    }

    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = solution[row][col];
    setGrid(newGrid);
    setHintsRemaining(prev => prev - 1);
    toast.success(`Hint: ${solution[row][col]}`);
  };

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
            Sudoku
          </h1>
        </div>

        <div className="grid md:grid-cols-[1fr,250px] gap-6">
          {/* Game Board */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Hints: </span>
                  <span className="font-bold text-primary">{hintsRemaining}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Wrong: </span>
                  <span className={`font-bold ${wrongAttempts >= 7 ? "text-destructive" : "text-game-warning"}`}>
                    {wrongAttempts}/{maxWrongAttempts}
                  </span>
                </div>
              </div>
              
              {isComplete && wrongAttempts >= maxWrongAttempts ? (
                <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-4 flex items-center gap-3">
                  <p className="text-sm font-medium text-destructive">
                    Game Over! You exceeded the maximum wrong attempts.
                  </p>
                </div>
              ) : isComplete && (
                <div className="bg-game-success/20 border border-game-success/50 rounded-lg p-4 flex items-center gap-3">
                  <Check className="h-6 w-6 text-game-success" />
                  <p className="text-sm font-medium text-game-success">
                    Congratulations! You solved the puzzle!
                  </p>
                </div>
              )}

              <div className="inline-block bg-secondary/50 p-2 rounded-lg">
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => {
                      const isInitial = initialGrid[rowIndex][colIndex] !== null;
                      const isSelected =
                        selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                      const hasError = errors.has(`${rowIndex}-${colIndex}`);
                      const isThickBorderRight = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                      const isThickBorderBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

                      return (
                        <button
                          key={colIndex}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          className={`
                            w-10 h-10 flex items-center justify-center
                            border border-border/30 font-semibold text-lg
                            transition-all
                            ${isInitial ? "bg-secondary/80 text-foreground cursor-not-allowed" : "bg-card hover:bg-secondary/50 cursor-pointer"}
                            ${isSelected ? "ring-2 ring-primary shadow-glow" : ""}
                            ${hasError ? "bg-destructive/20 text-destructive" : ""}
                            ${isThickBorderRight ? "border-r-2 border-r-primary/50" : ""}
                            ${isThickBorderBottom ? "border-b-2 border-b-primary/50" : ""}
                          `}
                        >
                          {cell || ""}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Number Input */}
              <div className="grid grid-cols-9 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button
                    key={num}
                    onClick={() => handleNumberInput(num)}
                    variant="outline"
                    className="h-10 hover:bg-primary hover:text-primary-foreground"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Controls */}
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="font-semibold mb-4">Controls</h3>
              <div className="space-y-3">
                <Button 
                  onClick={showHint} 
                  className="w-full" 
                  variant="outline"
                  disabled={hintsRemaining <= 0}
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Get Hint ({hintsRemaining})
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Puzzle
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="font-semibold mb-4">How to Play</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Fill every row with 1-9</li>
                <li>• Fill every column with 1-9</li>
                <li>• Fill every 3x3 box with 1-9</li>
                <li>• No repeating numbers</li>
                <li>• Use hints if stuck</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SudokuGame;
