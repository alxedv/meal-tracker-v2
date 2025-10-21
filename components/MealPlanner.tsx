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
    <>
      <div className="flex border-b border-border mb-4 -mt-2">
        {MEAL_TYPES_ORDER.map((mealType) => (
          <button
            key={mealType}
            onClick={() => setActiveMeal(mealType)}
            className={`py-2 px-4 -mb-px font-semibold text-sm rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
              activeMeal === mealType
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {mealType}
          </button>
        ))}
      </div>

      <div className="min-h-[200px] bg-secondary/50 rounded-lg p-4">
        {mealPlan[activeMeal].length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full pt-12 text-center">
            <p className="text-muted-foreground">Sua refeição está vazia.</p>
            <p className="text-sm text-muted-foreground/80">Adicione alimentos do banco à esquerda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mealPlan[activeMeal].map((food) => (
              <div key={food.instanceId} className="bg-card border border-border rounded-lg p-3 flex flex-col justify-between shadow-sm relative group transition-all hover:shadow-md hover:-translate-y-1">
                <div>
                  <h4 className="font-bold text-sm text-card-foreground">{food.name}</h4>
                  <p className="text-xs text-muted-foreground">{food.quantity}</p>
                </div>
                <div className="text-right text-sm font-mono text-primary mt-2">
                  {food.calories.toFixed(0)} cal
                </div>
                <button 
                  onClick={() => onRemoveFood(food.instanceId, activeMeal)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm hover:bg-destructive/90 transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                  aria-label={`Remover ${food.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MealPlanner;
