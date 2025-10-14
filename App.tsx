import React, { useState, useMemo, useEffect } from 'react';
import FoodSelector from './components/FoodSelector';
import MealPlanner from './components/MealPlanner';
import Summary from './components/Summary';
import { Food, MealPlan, MealType, Nutrients } from './types';
import { MEAL_TYPES_ORDER, DEFAULT_NUTRIENT_GOALS, DEFAULT_FOOD_DATABASE } from './constants';

// Helper to load state from localStorage
const loadState = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading state for key "${key}" from localStorage`, error);
    return defaultValue;
  }
};

const App: React.FC = () => {
  const initialMealPlan: MealPlan = {
    [MealType.Breakfast]: [],
    [MealType.Lunch]: [],
    [MealType.AfternoonSnack]: [],
    [MealType.Dinner]: [],
  };

  const [mealPlan, setMealPlan] = useState<MealPlan>(() => loadState('mealPlan', initialMealPlan));
  const [activeMeal, setActiveMeal] = useState<MealType>(MEAL_TYPES_ORDER[0]);
  const [nutrientGoals, setNutrientGoals] = useState<Nutrients>(() => loadState('nutrientGoals', DEFAULT_NUTRIENT_GOALS));
  const [foodDatabase, setFoodDatabase] = useState<Food[]>(() => loadState('foodDatabase', DEFAULT_FOOD_DATABASE));
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  useEffect(() => {
    localStorage.setItem('nutrientGoals', JSON.stringify(nutrientGoals));
  }, [nutrientGoals]);
  
  useEffect(() => {
    localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));
  }, [foodDatabase]);


  const handleAddFoodToMeal = (food: Food) => {
    setMealPlan(prevPlan => {
      const newFoodInstance = { ...food, instanceId: `${food.id}-${Date.now()}` };
      const updatedMeal = [...prevPlan[activeMeal], newFoodInstance];
      return { ...prevPlan, [activeMeal]: updatedMeal };
    });
  };
  
  const handleAddNewFoodToDB = (foodData: Omit<Food, 'id' | 'instanceId'>) => {
    const newFood: Food = {
        ...foodData,
        id: `${foodData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    };
    setFoodDatabase(prevDB => [...prevDB, newFood]);
  };

  const handleRemoveFood = (foodInstanceId: string, meal: MealType) => {
    setMealPlan(prevPlan => {
      const updatedMeal = prevPlan[meal].filter(f => f.instanceId !== foodInstanceId);
      return { ...prevPlan, [meal]: updatedMeal };
    });
  };

  const totalNutrients = useMemo<Nutrients>(() => {
    const totals: Nutrients = { calories: 0, carbohydrates: 0, fat: 0, protein: 0 };
    for (const meal of Object.values(mealPlan)) {
      for (const food of meal) {
        totals.calories += food.calories;
        totals.carbohydrates += food.carbohydrates;
        totals.fat += food.fat;
        totals.protein += food.protein;
      }
    }
    return totals;
  }, [mealPlan]);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
            Rastreador de Dieta
          </h1>
          <p className="text-dark-text-secondary mt-2 max-w-2xl mx-auto">Planeje suas refeições, controle macros e atinja suas metas nutricionais com facilidade.</p>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <FoodSelector 
              foodDatabase={foodDatabase}
              onAddFoodToMeal={handleAddFoodToMeal}
              onAddNewFoodToDB={handleAddNewFoodToDB}
            />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <MealPlanner
              mealPlan={mealPlan}
              activeMeal={activeMeal}
              setActiveMeal={setActiveMeal}
              onRemoveFood={handleRemoveFood}
            />
            <Summary 
              totals={totalNutrients} 
              goals={nutrientGoals}
              setGoals={setNutrientGoals}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
