import React, { useState } from 'react';
import { Coffee, Sparkles } from 'lucide-react';
import { useKingdom } from '../context/KingdomContext';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

const RECIPES = [
  { id: 'rose-latte', name: 'Rosewater Cloud Latte', color: '#F6B6CE', steps: ['Steam Oat Milk', 'Steep Rose Syrup', 'Sprinkle Gold Dust'] },
  { id: 'strawberry-matcha', name: 'Strawberry Cream Matcha', color: '#B8E0B6', steps: ['Crush Fresh Berries', 'Whisk Ceremonial Tea', 'Top with Vanilla Foam'] },
  { id: 'lavender-tea', name: 'Moonlight Lavender Milk Tea', color: '#DCCCFB', steps: ['Brew Earl Grey', 'Swirl Lavender Honey', 'Add Pearl Boba'] },
];

export const MagicalCafe: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { grantReward, showToast } = useKingdom();
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  const recipe = RECIPES[recipeIdx];

  const handleNextStep = () => {
    soundEngine.playSfx(stepProgress + 1 >= recipe.steps.length ? 'chime' : 'fountain');
    if (stepProgress + 1 >= recipe.steps.length) {
      setStepProgress(recipe.steps.length);
      void grantReward({ coins: 25, points: 25 });
      showToast(`Served ${recipe.name}! (+25 Coins)`);
    } else {
      setStepProgress(stepProgress + 1);
    }
  };

  return (
    <DestinationFrame
      title="The Magical Café"
      subtitle="Brew rosewater lattes, pastel teas & royal patisserie treats"
      chapterNumber={11}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-3">
          {RECIPES.map((r, i) => (
            <button
              key={r.id}
              onClick={() => {
                soundEngine.playSfx('pop');
                setRecipeIdx(i);
                setStepProgress(0);
              }}
              className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                recipeIdx === i ? 'bg-[#F9DCE7]/70 border-[#75476F]' : 'bg-white border-[#E8C98C]/45'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: r.color }} />
                <div>
                  <div className="font-romantic font-semibold text-base text-[#3B2138]">{r.name}</div>
                  <div className="text-xs text-[#75476F]/80">3 interactive café steps</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 royal-card rounded-3xl p-8 text-center bg-gradient-to-b from-[#FFF9F7] to-[#F9DCE7]/45">
          <div className="w-36 h-44 mx-auto rounded-b-3xl rounded-t-lg border-4 border-[#E8C98C] bg-white relative overflow-hidden flex items-end shadow-inner">
            <div
              className="w-full transition-all duration-500"
              style={{
                height: `${Math.round((stepProgress / recipe.steps.length) * 85)}%`,
                backgroundColor: recipe.color,
              }}
            />
            <Coffee className="w-7 h-7 text-[#75476F]/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>

          <h2 className="font-royal text-3xl font-semibold text-[#3B2138] mt-6">{recipe.name}</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {recipe.steps.map((s, idx) => (
              <span
                key={s}
                className={`text-xs px-3 py-1 rounded-lg ${
                  idx < stepProgress ? 'bg-[#75476F] text-white' : 'bg-white border border-[#E8C98C]/40 text-[#75476F]'
                }`}
              >
                {idx + 1}. {s}
              </span>
            ))}
          </div>

          <div className="mt-6">
            {stepProgress < recipe.steps.length ? (
              <RoyalButton variant="primary" onClick={handleNextStep}>
                <Sparkles className="w-4 h-4" />
                {recipe.steps[stepProgress]}
              </RoyalButton>
            ) : (
              <RoyalButton variant="gold" onClick={() => setStepProgress(0)}>
                Brew Another Cup
              </RoyalButton>
            )}
          </div>
        </div>
      </div>
    </DestinationFrame>
  );
};
