import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Plus, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type CardType = {
  suit: "♠" | "♥" | "♦" | "♣";
  value: string;
  numericValue: number;
};

const suits: CardType["suit"][] = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const createDeck = (): CardType[] => {
  const deck: CardType[] = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      let numericValue = parseInt(value);
      if (value === "A") numericValue = 11;
      else if (["J", "Q", "K"].includes(value)) numericValue = 10;

      deck.push({ suit, value, numericValue });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const calculateScore = (hand: CardType[]): number => {
  let score = hand.reduce((sum, card) => sum + card.numericValue, 0);
  let aces = hand.filter((card) => card.value === "A").length;

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
};

const BlackjackGame = () => {
  const [deck, setDeck] = useState<CardType[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealer" | "ended">("betting");
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0);
  const [result, setResult] = useState("");

  const startGame = (betAmount: number) => {
    if (betAmount > balance) {
      toast.error("Insufficient balance!");
      return;
    }

    const newDeck = createDeck();
    const newPlayerHand = [newDeck[0], newDeck[2]];
    const newDealerHand = [newDeck[1], newDeck[3]];
    const remainingDeck = newDeck.slice(4);

    setDeck(remainingDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setBet(betAmount);
    setGameState("playing");
    setPlayerScore(calculateScore(newPlayerHand));
    setDealerScore(calculateScore([newDealerHand[0]]));
    setResult("");

    // Check for immediate blackjack
    if (calculateScore(newPlayerHand) === 21) {
      checkWinner(newPlayerHand, newDealerHand);
    }
  };

  const hit = () => {
    if (deck.length === 0) return;

    const newCard = deck[0];
    const newPlayerHand = [...playerHand, newCard];
    const newDeck = deck.slice(1);

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);

    const score = calculateScore(newPlayerHand);
    setPlayerScore(score);

    if (score > 21) {
      endGame("Bust! Dealer wins", newPlayerHand, dealerHand);
    }
  };

  const stand = () => {
    setGameState("dealer");
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];

    // Dealer draws until 17 or higher
    while (calculateScore(currentDealerHand) < 17 && currentDeck.length > 0) {
      const newCard = currentDeck[0];
      currentDealerHand = [...currentDealerHand, newCard];
      currentDeck = currentDeck.slice(1);
    }

    setDealerHand(currentDealerHand);
    setDeck(currentDeck);
    setDealerScore(calculateScore(currentDealerHand));

    setTimeout(() => {
      checkWinner(playerHand, currentDealerHand);
    }, 500);
  };

  const checkWinner = (pHand: CardType[], dHand: CardType[]) => {
    const pScore = calculateScore(pHand);
    const dScore = calculateScore(dHand);

    let message = "";
    let winnings = 0;

    if (pScore > 21) {
      message = "You bust! Dealer wins";
    } else if (dScore > 21) {
      message = "Dealer busts! You win!";
      winnings = bet * 2;
    } else if (pScore > dScore) {
      message = "You win!";
      winnings = bet * 2;
    } else if (pScore < dScore) {
      message = "Dealer wins!";
    } else {
      message = "Push! It's a tie";
      winnings = bet;
    }

    endGame(message, pHand, dHand, winnings);
  };

  const endGame = (message: string, pHand: CardType[], dHand: CardType[], winnings: number = 0) => {
    setResult(message);
    setGameState("ended");
    setPlayerScore(calculateScore(pHand));
    setDealerScore(calculateScore(dHand));
    setBalance((prev) => prev - bet + winnings);

    if (winnings > bet) {
      toast.success(`${message} +$${winnings - bet}`);
    } else if (winnings === bet) {
      toast.info(message);
    } else {
      toast.error(`${message} -$${bet}`);
    }
  };

  const reset = () => {
    setDeck(createDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setGameState("betting");
    setBet(0);
    setResult("");
  };

  const renderCard = (card: CardType, hidden: boolean = false) => {
    const isRed = card.suit === "♥" || card.suit === "♦";

    if (hidden) {
      return (
        <div className="w-20 h-28 bg-gradient-to-br from-primary to-game-secondary rounded-lg border-2 border-primary/50 flex items-center justify-center">
          <div className="text-3xl">🂠</div>
        </div>
      );
    }

    return (
      <div className="w-20 h-28 bg-card rounded-lg border-2 border-border flex flex-col items-center justify-center shadow-card">
        <div className={`text-2xl font-bold ${isRed ? "text-destructive" : "text-foreground"}`}>
          {card.value}
        </div>
        <div className={`text-3xl ${isRed ? "text-destructive" : "text-foreground"}`}>
          {card.suit}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Blackjack
          </h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-2xl font-bold text-game-accent">${balance}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr,300px] gap-6">
          {/* Game Area */}
          <div className="space-y-6">
            {/* Dealer Hand */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Dealer</span>
                  <span className="text-muted-foreground">
                    {gameState === "playing" ? "?" : dealerScore}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap">
                  {dealerHand.map((card, index) => (
                    <div key={index} className="animate-slide-up">
                      {renderCard(card, gameState === "playing" && index === 1)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Player Hand */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Hand</span>
                  <span className="text-primary">{playerScore}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap">
                  {playerHand.map((card, index) => (
                    <div key={index} className="animate-slide-up">
                      {renderCard(card)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Result Message */}
            {result && (
              <Card className="bg-secondary/50 border-primary/50 border-2">
                <CardContent className="pt-6">
                  <p className="text-center text-xl font-bold">{result}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Card className="bg-gradient-card border-border/50 p-6">
              <h3 className="font-semibold mb-4">Controls</h3>

              {gameState === "betting" && (
                <div className="space-y-3">
                  <Button
                    onClick={() => startGame(50)}
                    className="w-full bg-gradient-accent hover:opacity-90"
                  >
                    Bet $50
                  </Button>
                  <Button
                    onClick={() => startGame(100)}
                    className="w-full bg-gradient-accent hover:opacity-90"
                  >
                    Bet $100
                  </Button>
                  <Button
                    onClick={() => startGame(200)}
                    className="w-full bg-gradient-accent hover:opacity-90"
                  >
                    Bet $200
                  </Button>
                </div>
              )}

              {gameState === "playing" && (
                <div className="space-y-3">
                  <Button onClick={hit} className="w-full" size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Hit
                  </Button>
                  <Button onClick={stand} variant="outline" className="w-full" size="lg">
                    <Hand className="mr-2 h-5 w-5" />
                    Stand
                  </Button>
                </div>
              )}

              {gameState === "ended" && (
                <Button
                  onClick={reset}
                  className="w-full bg-gradient-accent hover:opacity-90"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  New Game
                </Button>
              )}

              {gameState === "dealer" && (
                <div className="text-center text-muted-foreground">
                  Dealer is playing...
                </div>
              )}
            </Card>

            <Card className="bg-gradient-card border-border/50 p-6">
              <h3 className="font-semibold mb-4">How to Play</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Get closer to 21 than dealer</li>
                <li>• Face cards = 10 points</li>
                <li>• Aces = 1 or 11 points</li>
                <li>• Hit to draw a card</li>
                <li>• Stand to end your turn</li>
                <li>• Dealer draws until 17+</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;
