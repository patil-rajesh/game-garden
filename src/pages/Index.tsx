import { Link } from "react-router-dom";
import { Gamepad2, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroBanner from "@/assets/hero-banner.jpg";
import snakeGame from "@/assets/snake-game.jpg";
import sudokuGame from "@/assets/sudoku-game.jpg";
import blackjackGame from "@/assets/blackjack-game.jpg";
import tictactoeGame from "@/assets/tictactoe-game.jpg";
import rpsGame from "@/assets/rps-game.jpg";
import hangmanGame from "@/assets/hangman-game.jpg";
import racecarGame from "@/assets/racecar-game.jpg";

const games = [
  {
    id: "snake",
    title: "Snake",
    description: "Classic arcade game. Eat food, grow longer, avoid walls!",
    image: snakeGame,
    path: "/snake",
    difficulty: "Easy",
    players: "1 Player",
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Number puzzle game. Fill the grid with logic!",
    image: sudokuGame,
    path: "/sudoku",
    difficulty: "Medium",
    players: "1 Player",
  },
  {
    id: "blackjack",
    title: "Blackjack",
    description: "Beat the dealer. Get as close to 21 as you can!",
    image: blackjackGame,
    path: "/blackjack",
    difficulty: "Easy",
    players: "1 Player",
  },
  {
    id: "tictactoe",
    title: "Tic-Tac-Toe",
    description: "Classic strategy game. Get three in a row to win!",
    image: tictactoeGame,
    path: "/tictactoe",
    difficulty: "Easy",
    players: "1 Player",
  },
  {
    id: "rps",
    title: "Rock Paper Scissors",
    description: "Beat the computer in this classic hand game!",
    image: rpsGame,
    path: "/rps",
    difficulty: "Easy",
    players: "1 Player",
  },
  {
    id: "hangman",
    title: "Hangman",
    description: "Guess the word before running out of attempts!",
    image: hangmanGame,
    path: "/hangman",
    difficulty: "Medium",
    players: "1 Player",
  },
  {
    id: "racecar",
    title: "Race Car",
    description: "Dodge obstacles and race for the high score!",
    image: racecarGame,
    path: "/racecar",
    difficulty: "Medium",
    players: "1 Player",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80 animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-scale-in-bounce">
            <Gamepad2 className="h-8 w-8 text-primary animate-float" />
            <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent animate-gradient">
              GameHub
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20 animate-gradient" />
        <div className="absolute inset-0 bg-gradient-accent opacity-10 animate-gradient" style={{ animationDelay: '2s' }} />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 animate-fade-in"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 animate-slide-up border-glow">
              <Zap className="h-4 w-4 text-primary animate-glow-pulse" />
              <span className="text-sm font-medium">Play Instantly - No Download Required</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight animate-scale-in-bounce text-glow">
              Play <span className="bg-gradient-accent bg-clip-text text-transparent animate-gradient">Amazing</span> Games
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Challenge yourself with classic games reimagined with modern design. 
              From puzzles to strategy, we've got something for everyone.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-gradient-accent hover:opacity-90 transition-all shadow-glow hover:scale-110 animate-gradient hover:shadow-[0_0_40px_hsl(var(--game-primary)/0.6)]">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Start Playing
              </Button>
              <Button size="lg" variant="outline" className="hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all">
                View All Games
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-4 mb-12 text-center animate-slide-up">
          <h3 className="text-3xl font-bold">Featured Games</h3>
          <p className="text-muted-foreground">
            Start playing instantly. No sign-up required!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <Link 
              key={game.id} 
              to={game.path}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="overflow-hidden border-border/50 bg-gradient-card hover:shadow-glow transition-all duration-500 hover:-translate-y-3 hover:scale-105 h-full animate-slide-up border-glow relative">
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-500 animate-gradient" />
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={game.image} 
                    alt={game.title}
                    className="object-cover w-full h-full group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
                        {game.title}
                      </CardTitle>
                      <CardDescription className="mt-2 transition-all duration-300 group-hover:text-foreground/80">
                        {game.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full animate-glow-pulse ${
                        game.difficulty === 'Easy' ? 'bg-game-success' : 
                        game.difficulty === 'Medium' ? 'bg-game-warning' : 
                        'bg-destructive'
                      }`} />
                      {game.difficulty}
                    </span>
                    <span>•</span>
                    <span>{game.players}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-5 animate-gradient" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Gamepad2 className="h-6 w-6 text-primary group-hover:animate-float" />
              <span className="font-semibold group-hover:text-primary transition-colors">GameHub</span>
            </div>
            <p className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              © 2024 GameHub. Built with passion for gaming.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
