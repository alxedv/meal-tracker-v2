import React, { useState } from 'react';
import { Food } from '../types';
import AddFoodModal from './AddFoodModal';
import CreateRecipeModal from './CreateRecipeModal';

interface FoodSelectorProps {
  foodDatabase: Food[];
  onAddFoodToMeal: (food: Food) => void;
  onAddNewFoodToDB: (food: Omit<Food, 'id' | 'instanceId'>) => void;
  onAddRecipeToDB: (recipe: Food) => void;
}

const PlusIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const RecipeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 00-2 0v2a1 1 0 102 0V9zm2-1a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm3 2a1 1 0 10-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
    </svg>
);


const FoodSelector: React.FC<FoodSelectorProps> = ({ foodDatabase, onAddFoodToMeal, onAddNewFoodToDB, onAddRecipeToDB }) => {
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  return (
    <>
      {isAddFoodModalOpen && <AddFoodModal onClose={() => setIsAddFoodModalOpen(false)} onAddFood={onAddNewFoodToDB} />}
      {isRecipeModalOpen && <CreateRecipeModal foodDatabase={foodDatabase} onClose={() => setIsRecipeModalOpen(false)} onAddRecipe={onAddRecipeToDB} />}

      <div className="bg-card border border-border rounded-xl shadow-sm p-6 h-full flex flex-col transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-border pb-3 gap-3">
            <h2 className="text-xl font-bold text-card-foreground">Banco de Alimentos</h2>
            <div className="flex items-center space-x-2">
                 <button 
                    onClick={() => setIsRecipeModalOpen(true)}
                    className="flex items-center text-xs sm:text-sm bg-secondary hover:bg-muted text-secondary-foreground font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                    <RecipeIcon />
                    <span className="ml-1.5">Criar Receita</span>
                </button>
                <button 
                    onClick={() => setIsAddFoodModalOpen(true)}
                    className="flex items-center text-xs sm:text-sm bg-primary/90 hover:bg-primary text-primary-foreground font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                    <PlusIcon className="h-4 w-4" />
                    <span className="ml-1.5">Adicionar</span>
                </button>
            </div>
        </div>
        <div className="flex-grow overflow-y-auto -mr-3 pr-3">
            <ul className="space-y-2">
                {foodDatabase.map((food) => (
                <li key={food.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="flex-1 flex items-center">
                       {food.isRecipe && <span className="mr-3"><RecipeIcon /></span>}
                       <div>
                            <p className="font-semibold text-card-foreground">{food.name}</p>
                            <p className="text-xs text-muted-foreground">{food.quantity}</p>
                       </div>
                    </div>
                    <div className="hidden sm:flex items-center space-x-3 text-xs font-mono text-center w-[45%]">
                        <span className="w-1/4">{food.calories.toFixed(0)} <span className="text-muted-foreground/70">Cal</span></span>
                        <span className="w-1/4">{food.carbohydrates.toFixed(1)} <span className="text-muted-foreground/70">C</span></span>
                        <span className="w-1/4">{food.fat.toFixed(1)} <span className="text-muted-foreground/70">G</span></span>
                        <span className="w-1/4">{food.protein.toFixed(1)} <span className="text-muted-foreground/70">P</span></span>
                    </div>
                    <button
                        onClick={() => onAddFoodToMeal(food)}
                        className="ml-4 p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                        aria-label={`Adicionar ${food.name}`}
                    >
                        <PlusIcon className="h-4 w-4"/>
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
