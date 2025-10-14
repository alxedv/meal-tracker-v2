import React, { useState } from 'react';
import { Food } from '../types';
import AddFoodModal from './AddFoodModal';

interface FoodSelectorProps {
  foodDatabase: Food[];
  onAddFoodToMeal: (food: Food) => void;
  onAddNewFoodToDB: (food: Omit<Food, 'id' | 'instanceId'>) => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


const FoodSelector: React.FC<FoodSelectorProps> = ({ foodDatabase, onAddFoodToMeal, onAddNewFoodToDB }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    {isModalOpen && <AddFoodModal onClose={() => setIsModalOpen(false)} onAddFood={onAddNewFoodToDB} />}
    <div className="bg-dark-card rounded-xl shadow-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b-2 border-dark-border pb-3">
        <h2 className="text-2xl font-bold text-dark-text-primary">Banco de Alimentos</h2>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center text-sm bg-brand-primary/80 hover:bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
            <PlusIcon />
            <span className="ml-1">Adicionar Alimento</span>
        </button>
      </div>
      <div className="flex-grow overflow-y-auto -mr-3 pr-3">
        <ul className="space-y-2">
            {foodDatabase.map((food) => (
              <li key={food.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-border/50 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-dark-text-primary">{food.name}</p>
                  <p className="text-xs text-dark-text-secondary">{food.quantity}</p>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono text-center w-1/2">
                    <span className="w-1/4">{food.calories.toFixed(0)} <span className="text-dark-text-secondary/70">Cal</span></span>
                    <span className="w-1/4">{food.carbohydrates.toFixed(1)} <span className="text-dark-text-secondary/70">C</span></span>
                    <span className="w-1/4">{food.fat.toFixed(1)} <span className="text-dark-text-secondary/70">G</span></span>
                    <span className="w-1/4">{food.protein.toFixed(1)} <span className="text-dark-text-secondary/70">P</span></span>
                </div>
                 <button
                    onClick={() => onAddFoodToMeal(food)}
                    className="ml-4 p-2 bg-brand-primary/20 text-brand-accent rounded-full hover:bg-brand-primary/40 transition-colors"
                    aria-label={`Adicionar ${food.name}`}
                  >
                    <PlusIcon/>
                  </button>
              </li>
            ))}
          </ul>
      </div>
    </div>
    </>
  );
};

export default FoodSelector;
