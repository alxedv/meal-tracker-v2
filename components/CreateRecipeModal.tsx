import React, { useState, useMemo } from 'react';
import { Food, Ingredient } from '../types';

interface CreateRecipeModalProps {
  onClose: () => void;
  onAddRecipe: (recipe: Food) => void;
  foodDatabase: Food[];
}

const PlusIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({ onClose, onAddRecipe, foodDatabase }) => {
    const [recipeName, setRecipeName] = useState('');
    const [servings, setServings] = useState(1);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedFoodId, setSelectedFoodId] = useState<string>('');
    const [ingredientAmount, setIngredientAmount] = useState(100);
    const [errors, setErrors] = useState<{name?: string, servings?: string}>({});

    const handleAddIngredient = () => {
        if (!selectedFoodId) return;
        const food = foodDatabase.find(f => f.id === selectedFoodId);
        if (food) {
            setIngredients(prev => [...prev, {
                foodId: food.id,
                name: food.name,
                amount: ingredientAmount,
                baseQuantity: food.quantity
            }]);
            setSelectedFoodId('');
            setIngredientAmount(100);
        }
    };
    
    const handleRemoveIngredient = (index: number) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };

    const totalNutrients = useMemo(() => {
        const totals = { calories: 0, carbohydrates: 0, protein: 0, fat: 0 };
        ingredients.forEach(ing => {
            const food = foodDatabase.find(f => f.id === ing.foodId);
            if (!food) return;

            // Simple scaling based on 100g or 1 unit
            const baseAmountMatch = food.quantity.match(/(\d+)/);
            const baseAmount = baseAmountMatch ? parseFloat(baseAmountMatch[0]) : 1;
            const multiplier = ing.amount / baseAmount;
            
            totals.calories += food.calories * multiplier;
            totals.carbohydrates += food.carbohydrates * multiplier;
            totals.protein += food.protein * multiplier;
            totals.fat += food.fat * multiplier;
        });
        return totals;
    }, [ingredients, foodDatabase]);
    
    const perServingNutrients = useMemo(() => {
        if (servings <= 0) return { calories: 0, carbohydrates: 0, protein: 0, fat: 0 };
         return {
            calories: totalNutrients.calories / servings,
            carbohydrates: totalNutrients.carbohydrates / servings,
            protein: totalNutrients.protein / servings,
            fat: totalNutrients.fat / servings,
        };
    }, [totalNutrients, servings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: {name?: string, servings?: string} = {};
        if (!recipeName.trim()) newErrors.name = "Nome da receita é obrigatório";
        if (servings < 1) newErrors.servings = "Deve haver ao menos 1 porção";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const newRecipe: Food = {
                ...perServingNutrients,
                id: `${recipeName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                name: recipeName,
                quantity: '1 porção',
                isRecipe: true,
                ingredients: ingredients,
            };
            onAddRecipe(newRecipe);
            onClose();
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-content-show" onClick={onClose}>
            <div className="bg-card border border-border rounded-xl shadow-2xl p-8 w-full max-w-2xl m-4 h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-card-foreground border-b border-border pb-3 mb-4">Criar Nova Receita</h2>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label htmlFor="recipeName" className="block text-sm font-medium text-muted-foreground mb-1">Nome da Receita</label>
                            <input type="text" id="recipeName" value={recipeName} onChange={e => setRecipeName(e.target.value)} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring" />
                            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="servings" className="block text-sm font-medium text-muted-foreground mb-1">Nº de Porções</label>
                            <input type="number" id="servings" min="1" value={servings} onChange={e => setServings(parseInt(e.target.value, 10) || 1)} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring" />
                            {errors.servings && <p className="text-destructive text-xs mt-1">{errors.servings}</p>}
                        </div>
                    </div>

                    <div className="mb-4 p-4 bg-secondary/50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Adicionar Ingrediente</h3>
                        <div className="flex flex-col sm:flex-row items-end gap-2">
                            <div className="flex-grow w-full">
                                <label htmlFor="food-select" className="text-xs text-muted-foreground">Alimento</label>
                                <select id="food-select" value={selectedFoodId} onChange={e => setSelectedFoodId(e.target.value)} className="w-full bg-input border border-border rounded-md px-3 py-2">
                                    <option value="">Selecione...</option>
                                    {foodDatabase.map(f => <option key={f.id} value={f.id}>{f.name} ({f.quantity})</option>)}
                                </select>
                            </div>
                            <div className="w-full sm:w-auto">
                                <label htmlFor="amount" className="text-xs text-muted-foreground">Quantidade (g)</label>
                                <input type="number" id="amount" value={ingredientAmount} onChange={e => setIngredientAmount(parseFloat(e.target.value) || 0)} className="w-full bg-input border border-border rounded-md px-3 py-2" />
                            </div>
                            <button type="button" onClick={handleAddIngredient} className="bg-primary/90 hover:bg-primary text-primary-foreground font-semibold p-2.5 rounded-lg transition-colors w-full sm:w-auto">
                                <PlusIcon className="h-5 w-5"/>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <h3 className="text-lg font-semibold">Ingredientes</h3>
                        {ingredients.length === 0 ? <p className="text-muted-foreground text-sm">Nenhum ingrediente adicionado.</p> :
                            ingredients.map((ing, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                                    <p>{ing.name} - {ing.amount}g</p>
                                    <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-destructive/80 hover:text-destructive p-1 rounded-full"><TrashIcon /></button>
                                </div>
                            ))
                        }
                    </div>

                    <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                        <h3 className="text-lg font-semibold">Nutrientes por Porção</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-center">
                            <div className="bg-card p-2 rounded"><span className="font-bold">{perServingNutrients.calories.toFixed(0)}</span><span className="text-muted-foreground"> Cal</span></div>
                            <div className="bg-card p-2 rounded"><span className="font-bold">{perServingNutrients.protein.toFixed(1)}</span><span className="text-muted-foreground"> P</span></div>
                            <div className="bg-card p-2 rounded"><span className="font-bold">{perServingNutrients.carbohydrates.toFixed(1)}</span><span className="text-muted-foreground"> C</span></div>
                            <div className="bg-card p-2 rounded"><span className="font-bold">{perServingNutrients.fat.toFixed(1)}</span><span className="text-muted-foreground"> G</span></div>
                        </div>
                    </div>
                </form>

                <div className="flex justify-end space-x-3 pt-6 border-t border-border mt-auto">
                    <button type="button" onClick={onClose} className="bg-secondary hover:bg-muted text-secondary-foreground font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors">Salvar Receita</button>
                </div>
            </div>
        </div>
    );
};

export default CreateRecipeModal;
