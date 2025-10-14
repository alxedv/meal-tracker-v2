import React from 'react';
import { MealPlan, MealType, SelectedFood } from '../types';
import { MEAL_TYPES_ORDER } from '../constants';

interface MealPlannerProps {
  mealPlan: MealPlan;
  activeMeal: MealType;
  setActiveMeal: (meal: MealType) => void;
  onRemoveFood: (foodInstanceId: string, meal: MealType) => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


const MealPlanner: React.FC<MealPlannerProps> = ({ mealPlan, activeMeal, setActiveMeal, onRemoveFood }) => {
  return (
    <div className="bg-dark-card rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-dark-text-primary border-b-2 border-dark-border pb-3">Plano de Refeições</h2>
      
      {/* Meal Tabs */}
      <div className="flex border-b border-dark-border mb-4">
        {MEAL_TYPES_ORDER.map((mealType) => (
          <button
            key={mealType}
            onClick={() => setActiveMeal(mealType)}
            className={`py-2 px-4 -mb-px font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none ${
              activeMeal === mealType
                ? 'bg-dark-card text-brand-accent border-b-2 border-brand-accent'
                : 'text-dark-text-secondary hover:bg-dark-border/50'
            }`}
          >
            {mealType}
          </button>
        ))}
      </div>

      {/* Selected Foods Grid */}
      <div className="min-h-[200px] bg-dark-bg/50 rounded-lg p-4">
        {mealPlan[activeMeal].length === 0 ? (
          <p className="text-center text-dark-text-secondary pt-16">Selecione alimentos do banco à esquerda.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mealPlan[activeMeal].map((food) => (
              <div key={food.instanceId} className="bg-dark-border rounded-lg p-3 flex flex-col justify-between shadow-md relative group">
                <div>
                  <h4 className="font-bold text-dark-text-primary">{food.name}</h4>
                  <p className="text-xs text-dark-text-secondary">{food.quantity}</p>
                </div>
                <div className="text-right text-sm font-mono text-brand-accent mt-2">
                  {food.calories.toFixed(0)} cal
                </div>
                <button 
                  onClick={() => onRemoveFood(food.instanceId, activeMeal)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                  aria-label={`Remover ${food.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;