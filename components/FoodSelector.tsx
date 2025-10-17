import React, { useState } from 'react';
import { Food } from '../types';
import AddFoodModal from './AddFoodModal';
import CreateRecipeModal from './CreateRecipeModal';

interface FoodSelectorProps {
  foodDatabase: Food[];
  onAddFoodToMeal: (food: Food) => void;
  // FIX: Corrected the type of the food parameter in onSaveFoodToDB. 'instanceId' does not exist on Food.
  onSaveFoodToDB: (food: Omit<Food, 'id'>, id?:string) => void;
  onDeleteFoodFromDB: (foodId: string) => void;
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

const EditIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const TrashIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const FoodSelector: React.FC<FoodSelectorProps> = ({ foodDatabase, onAddFoodToMeal, onSaveFoodToDB, onDeleteFoodFromDB, onAddRecipeToDB }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState<Food | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const handleDelete = (foodId: string, foodName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${foodName}"? Esta ação não pode ser desfeita.`)) {
        onDeleteFoodFromDB(foodId);
    }
  };

  return (
    <>
      {(isAddModalOpen || foodToEdit) && (
        <AddFoodModal 
            onClose={() => {
                setIsAddModalOpen(false);
                setFoodToEdit(null);
            }} 
            onSave={onSaveFoodToDB}
            foodToEdit={foodToEdit ?? undefined} 
        />
      )}
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
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center text-xs sm:text-sm bg-primary/90 hover:bg-primary text-primary-foreground font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                    <PlusIcon className="h-4 w-4" />
                    <span className="ml-1.5">Adicionar</span>
                </button>
            </div>
        </div>
        <div className="flex-grow overflow-y-auto -mr-3 pr-3">
            <ul className="space-y-0">
                {foodDatabase.map((food) => (
                <li key={food.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors border-b border-border last:border-b-0">
                    <div className="flex-1 flex items-center min-w-0">
                       {food.isRecipe && <span className="mr-3 flex-shrink-0"><RecipeIcon /></span>}
                       <div className="min-w-0">
                            <p className="font-semibold text-card-foreground truncate">{food.name}</p>
                            <p className="text-xs text-muted-foreground">{food.quantity}</p>
                       </div>
                    </div>
                    
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1 text-xs font-mono ml-3 flex-shrink-0 text-center sm:w-60 md:w-64">
                        <div>
                            <span className="font-semibold text-card-foreground">{food.calories.toFixed(0)}</span>
                            <span className="block text-muted-foreground/80 text-[10px] leading-tight">Calorias</span>
                        </div>
                        <div>
                            <span className="font-semibold text-card-foreground">{food.protein.toFixed(1)}g</span>
                            <span className="block text-muted-foreground/80 text-[10px] leading-tight">Proteína</span>
                        </div>
                        <div>
                            <span className="font-semibold text-card-foreground">{food.carbohydrates.toFixed(1)}g</span>
                            <span className="block text-muted-foreground/80 text-[10px] leading-tight">Carbs</span>
                        </div>
                        <div>
                            <span className="font-semibold text-card-foreground">{food.fat.toFixed(1)}g</span>
                            <span className="block text-muted-foreground/80 text-[10px] leading-tight">Gordura</span>
                        </div>
                    </div>

                    <div className="flex items-center ml-4 space-x-0.5 flex-shrink-0">
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {!food.isRecipe && (
                                <>
                                <button
                                    onClick={() => setFoodToEdit(food)}
                                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                                    aria-label={`Editar ${food.name}`}
                                >
                                    <EditIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(food.id, food.name)}
                                    className="p-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-md"
                                    aria-label={`Excluir ${food.name}`}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => onAddFoodToMeal(food)}
                            className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                            aria-label={`Adicionar ${food.name}`}
                        >
                            <PlusIcon className="h-4 w-4"/>
                        </button>
                    </div>
                </li>
                ))}
            </ul>
        </div>
    </div>
    </>
  );
};

export default FoodSelector;