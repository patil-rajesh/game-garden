import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SnakeGame from "./pages/SnakeGame";
import SudokuGame from "./pages/SudokuGame";
import BlackjackGame from "./pages/BlackjackGame";
import TicTacToeGame from "./pages/TicTacToeGame";
import RockPaperScissorsGame from "./pages/RockPaperScissorsGame";
import HangmanGame from "./pages/HangmanGame";
import RaceCarGame from "./pages/RaceCarGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/snake" element={<SnakeGame />} />
          <Route path="/sudoku" element={<SudokuGame />} />
          <Route path="/blackjack" element={<BlackjackGame />} />
          <Route path="/tictactoe" element={<TicTacToeGame />} />
          <Route path="/rps" element={<RockPaperScissorsGame />} />
          <Route path="/hangman" element={<HangmanGame />} />
          <Route path="/racecar" element={<RaceCarGame />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
