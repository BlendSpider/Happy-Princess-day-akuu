import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gamepad2, RotateCcw, Trophy, Sparkles, Key, Coins } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { ChibiPrincessGreeting, FluffyKittenMascot } from '../assets/royal/RoyalCharacters';
import { soundEngine } from '../audio/soundEngine';
import {
  CatchHeartsGame,
  DressUpChallengeGame,
  KittyRescueGame,
  GardenRushGame,
  HeartMemoryGame,
} from '../arcade/ArcadeGamesA';
import {
  HiddenStarsGame,
  TreasureHuntGame,
  PrincessJigsawGame,
  BubbleShooterGame,
  BakeCakeGame,
} from '../arcade/ArcadeGamesB';
import {
  MagicalMazeGame,
  ButterflyCollectorGame,
  BuildCastleGame,
  MatchPearlsGame,
  MysteryQuizGame,
} from '../arcade/ArcadeGamesC';

interface ArcadeDef {
  id: string;
  number: number;
  title: string;
  instructions: string;
  rewardCoins: number;
  rewardKey?: boolean;
}

const GAMES: ArcadeDef[] = [
  { id: 'catch-hearts', number: 1, title: 'Catch the Falling Hearts', instructions: 'Move the pearl basket with your cursor, touch, or arrow keys to catch hearts for 20s.', rewardCoins: 35, rewardKey: true },
  { id: 'dress-challenge', number: 2, title: 'Princess Dress-Up Challenge', instructions: 'Pick the royal outfit that best fits each fairytale occasion.', rewardCoins: 30 },
  { id: 'kitty-rescue', number: 3, title: 'Kitty Rescue', instructions: 'Switch lanes so Mochi avoids puddles on her walk back to the castle.', rewardCoins: 35 },
  { id: 'garden-rush', number: 4, title: 'Magical Flower Garden', instructions: 'Water flower plots quickly to bring blooms to life before time runs out.', rewardCoins: 30 },
  { id: 'memory-match', number: 5, title: 'Heart Memory Match', instructions: 'Flip tiles to match all 8 pairs of royal symbols.', rewardCoins: 40, rewardKey: true },
  { id: 'hidden-stars', number: 6, title: 'Find the Hidden Stars', instructions: 'Spot and tap all 6 faint stars hidden across the twilight sky.', rewardCoins: 30 },
  { id: 'treasure-hunt', number: 7, title: 'Royal Treasure Hunt', instructions: 'Follow the warm/cool clues on the grid to unearth the ruby crown.', rewardCoins: 35 },
  { id: 'princess-jigsaw', number: 8, title: 'Princess Jigsaw', instructions: 'Tap pairs of tiles to swap them until the Royal Castle portrait is whole.', rewardCoins: 45, rewardKey: true },
  { id: 'bubble-shooter', number: 9, title: 'Cute Bubble Shooter', instructions: 'Tap pastel bubbles to pop them before your 12 magic shots run out.', rewardCoins: 30 },
  { id: 'bake-cake', number: 10, title: 'Bake a Princess Cake', instructions: 'Follow the three royal bakery orders in exact ingredient order.', rewardCoins: 35 },
  { id: 'magical-maze', number: 11, title: 'Magical Maze', instructions: 'Navigate the palace hedge labyrinth to reach the golden crown.', rewardCoins: 40 },
  { id: 'butterfly-collector', number: 12, title: 'Butterfly Collector', instructions: 'Tap fluttering butterflies across the meadow in 14 seconds.', rewardCoins: 30 },
  { id: 'build-castle', number: 13, title: 'Build Your Dream Castle', instructions: 'Drop 6 moving tower sections right over the center foundation.', rewardCoins: 35 },
  { id: 'match-pearls', number: 14, title: 'Match the Pearls', instructions: 'Swap pearls to line up 3 matching colours in a row.', rewardCoins: 40 },
  { id: 'mystery-quiz', number: 15, title: 'Akuu’s Mystery Quiz', instructions: 'Answer sweet trivia about Akuu’s Princess World.', rewardCoins: 35, rewardKey: true },
];

export const PrincessArcade: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { db, grantReward, showToast } = useKingdom();
  const [activeGame, setActiveGame] = useState<ArcadeDef | null>(null);
  const [phase, setPhase] = useState<'title' | 'playing' | 'summary'>('title');
  const [lastScore, setLastScore] = useState(0);
  const [lastWon, setLastWon] = useState(false);
  const [runId, setRunId] = useState(0);

  if (!db) return null;
  const { gameHighScores } = db.progress;

  const handleGameComplete = (score: number, won: boolean) => {
    if (!activeGame) return;
    setLastScore(score);
    setLastWon(won);
    setPhase('summary');

    if (won) {
      soundEngine.playSfx('achievement');
      confetti({ particleCount: 55, spread: 75, colors: ['#F6B6CE', '#E8C98C', '#F18CAF'] });
    }

    const playedCount = Object.keys(gameHighScores).length + (gameHighScores[activeGame.id] ? 0 : 1);
    const earnedKey = won && activeGame.rewardKey ? 1 : 0;

    void grantReward({
      points: Math.max(15, Math.round(score / 2)),
      coins: won ? activeGame.rewardCoins : 10,
      keys: earnedKey,
      stars: won ? 1 : 0,
      highScoreGame: activeGame.id,
      highScoreValue: score,
      achievementId: playedCount >= 5 ? 'arcade-champion' : 'arcade-spark',
    });

    if (earnedKey) {
      showToast(`Victory! +${activeGame.rewardCoins} Coins & +1 Royal Key!`);
    }
  };

  const renderGame = (id: string) => {
    const props = { key: runId, onFinish: handleGameComplete };
    switch (id) {
      case 'catch-hearts': return <CatchHeartsGame {...props} />;
      case 'dress-challenge': return <DressUpChallengeGame {...props} />;
      case 'kitty-rescue': return <KittyRescueGame {...props} />;
      case 'garden-rush': return <GardenRushGame {...props} />;
      case 'memory-match': return <HeartMemoryGame {...props} />;
      case 'hidden-stars': return <HiddenStarsGame {...props} />;
      case 'treasure-hunt': return <TreasureHuntGame {...props} />;
      case 'princess-jigsaw': return <PrincessJigsawGame {...props} />;
      case 'bubble-shooter': return <BubbleShooterGame {...props} />;
      case 'bake-cake': return <BakeCakeGame {...props} />;
      case 'magical-maze': return <MagicalMazeGame {...props} />;
      case 'butterfly-collector': return <ButterflyCollectorGame {...props} />;
      case 'build-castle': return <BuildCastleGame {...props} />;
      case 'match-pearls': return <MatchPearlsGame {...props} />;
      case 'mystery-quiz': return <MysteryQuizGame {...props} />;
      default: return null;
    }
  };

  return (
    <DestinationFrame
      title="The Princess Arcade"
      subtitle="15 playable mini-games with coins, stars & royal keys for the Treasure Vault"
      chapterNumber={7}
      onBack={onBack}
      rightSlot={
        activeGame ? (
          <RoyalButton variant="secondary" size="sm" onClick={() => setActiveGame(null)}>
            All 15 Games
          </RoyalButton>
        ) : undefined
      }
    >
      {!activeGame ? (
        <div className="space-y-6">
          {/* Glowing Arcade Marquee (Ref Sheet 2 motif) */}
          <div className="rounded-3xl border-2 border-[#E8C98C] bg-gradient-to-r from-[#2E1735] via-[#683A63] to-[#F18CAF]/70 p-6 text-[#FFF9F7] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-end -space-x-4 shrink-0">
                <ChibiPrincessGreeting className="w-20 h-20" />
                <FluffyKittenMascot className="w-16 h-16" accessory="mini-crown" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-[#E8C98C]">Play · Win · Collect Keys</div>
                <h2 className="font-royal text-3xl font-semibold">Princess Arcade Pavilion</h2>
                <p className="text-xs sm:text-sm text-[#F9DCE7] mt-0.5">
                  Every victory earns coins & royal keys to unlock mystery chests in the Treasure Vault.
                </p>
              </div>
            </div>
            <RoyalButton
              variant="gold"
              onClick={() => {
                setActiveGame(GAMES[0]);
                setPhase('title');
              }}
            >
              Let’s Play ♡
            </RoyalButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES.map((g) => {
            const best = gameHighScores[g.id] || 0;
            return (
              <div key={g.id} className="royal-card rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#75476F]/80 mb-2 tabular-nums">
                    <span>Game {String(g.number).padStart(2, '0')}</span>
                    <span>Best: {best}</span>
                  </div>
                  <h2 className="font-romantic text-xl font-semibold text-[#3B2138]">{g.title}</h2>
                  <p className="text-xs text-[#75476F]/85 mt-1.5 leading-relaxed">{g.instructions}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8C98C]/30 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs text-[#75476F] tabular-nums">
                    <Coins className="w-3.5 h-3.5 text-[#E8C98C]" />
                    +{g.rewardCoins}
                    {g.rewardKey && <Key className="w-3.5 h-3.5 text-[#75476F] ml-1" />}
                  </span>
                  <RoyalButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveGame(g);
                      setPhase('title');
                    }}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    Play
                  </RoyalButton>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto royal-card rounded-3xl p-6 sm:p-8 border-2 border-[#E8C98C]">
          {phase === 'title' && (
            <div className="text-center py-8 space-y-4">
              <div className="text-xs uppercase tracking-widest text-[#75476F]">
                Arcade Attraction #{activeGame.number}
              </div>
              <h2 className="font-royal text-4xl font-semibold text-[#3B2138]">{activeGame.title}</h2>
              <p className="text-sm text-[#75476F] max-w-md mx-auto">{activeGame.instructions}</p>
              <div className="pt-2">
                <RoyalButton
                  variant="gold"
                  size="lg"
                  onClick={() => {
                    soundEngine.playSfx('wand');
                    setRunId((r) => r + 1);
                    setPhase('playing');
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Start Game
                </RoyalButton>
              </div>
            </div>
          )}

          {phase === 'playing' && (
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E8C98C]/35">
                <h2 className="font-romantic text-xl font-semibold text-[#3B2138]">{activeGame.title}</h2>
                <RoyalButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRunId((r) => r + 1);
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart
                </RoyalButton>
              </div>
              {renderGame(activeGame.id)}
            </div>
          )}

          {phase === 'summary' && (
            <div className="text-center py-8 space-y-5">
              <Trophy className="w-12 h-12 text-[#E8C98C] mx-auto" />
              <h2 className="font-royal text-4xl font-semibold text-[#3B2138]">
                {lastWon ? 'Splendid Victory!' : 'Good Effort, Princess!'}
              </h2>
              <div className="text-2xl font-romantic text-[#75476F] tabular-nums">
                Final Score: {lastScore}
              </div>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <RoyalButton
                  variant="primary"
                  onClick={() => {
                    setRunId((r) => r + 1);
                    setPhase('playing');
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </RoyalButton>
                <RoyalButton variant="secondary" onClick={() => setActiveGame(null)}>
                  Back to Arcade Lobby
                </RoyalButton>
              </div>
            </div>
          )}
        </div>
      )}
    </DestinationFrame>
  );
};
