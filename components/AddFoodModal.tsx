import React, { useState } from 'react';
import { Food } from '../types';

interface AddFoodModalProps {
  onClose: () => void;
  onAddFood: (food: Omit<Food, 'id' | 'instanceId'>) => void;
}

type FoodInput = Omit<Food, 'id' | 'isRecipe' | 'ingredients'>;

const initialFormState: FoodInput = {
    name: '',
    quantity: '',
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    protein: 0,
};


const AddFoodModal: React.FC<AddFoodModalProps> = ({ onClose, onAddFood }) => {
    const [foodData, setFoodData] = useState<FoodInput>(initialFormState);
    const [errors, setErrors] = useState<Partial<Record<keyof FoodInput, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFoodData(prev => ({
            ...prev,
            [name]: name === 'name' || name === 'quantity' ? value : parseFloat(value) || 0
        }));
         if (errors[name as keyof FoodInput]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof FoodInput, string>> = {};
        if (!foodData.name.trim()) newErrors.name = "Nome é obrigatório";
        if (!foodData.quantity.trim()) newErrors.quantity = "Quantidade é obrigatória";
        if (foodData.calories < 0) newErrors.calories = "Valor deve ser positivo";
        if (foodData.carbohydrates < 0) newErrors.carbohydrates = "Valor deve ser positivo";
        if (foodData.fat < 0) newErrors.fat = "Valor deve ser positivo";
        if (foodData.protein < 0) newErrors.protein = "Valor deve ser positivo";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onAddFood(foodData);
            onClose();
        }
    };

  return (
    <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-content-show"
        onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-xl shadow-2xl p-8 w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-6 text-card-foreground border-b border-border pb-3">Adicionar Novo Alimento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Nome do Alimento</label>
                <input type="text" name="name" id="name" value={foodData.name} onChange={handleChange} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring" />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
             <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-muted-foreground mb-1">Quantidade (ex: 100g, 1 fatia)</label>
                <input type="text" name="quantity" id="quantity" value={foodData.quantity} onChange={handleChange} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring" />
                {errors.quantity && <p className="text-destructive text-xs mt-1">{errors.quantity}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="calories" className="block text-sm font-medium text-muted-foreground mb-1">Calorias</label>
                    <input type="number" step="any" name="calories" id="calories" value={foodData.calories} onChange={handleChange} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring" />
                    {errors.calories && <p className="text-destructive text-xs mt-1">{errors.calories}</p>}
                </div>
                 <div>
                    <label htmlFor="protein" className="block text-sm font-medium text-muted-foreground mb-1">Proteínas (g)</label>
                    <input type="number" step="any" name="protein" id="protein" value={foodData.protein} onChange={handleChange} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring" />
                    {errors.protein && <p className="text-destructive text-xs mt-1">{errors.protein}</p>}
                </div>
                 <div>
                    <label htmlFor="carbohydrates" className="block text-sm font-medium text-muted-foreground mb-1">Carbs (g)</label>
                    <input type="number" step="any" name="carbohydrates" id="carbohydrates" value={foodData.carbohydrates} onChange={handleChange} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring" />
                    {errors.carbohydrates && <p className="text-destructive text-xs mt-1">{errors.carbohydrates}</p>}
                </div>
                <div>
                    <label htmlFor="fat" className="block text-sm font-medium text-muted-foreground mb-1">Gorduras (g)</label>
                    <input type="number" step="any" name="fat" id="fat" value={foodData.fat} onChange={handleChange} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring" />
                    {errors.fat && <p className="text-destructive text-xs mt-1">{errors.fat}</p>}
                </div>
            </div>
             <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-secondary hover:bg-muted text-secondary-foreground font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors">Salvar Alimento</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;
