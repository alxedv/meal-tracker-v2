import React, { useState, useMemo, useEffect } from 'react';
import FoodSelector from './components/FoodSelector';
import MealPlanner from './components/MealPlanner';
import Summary from './components/Summary';
import { Food, MealPlan, MealType, Nutrients, WeightEntry } from './types';
import { MEAL_TYPES_ORDER, DEFAULT_NUTRIENT_GOALS, DEFAULT_FOOD_DATABASE } from './constants';
import ThemeSwitcher from './components/ThemeSwitcher';
import WeightTracker from './components/WeightTracker';


// Helper to load state from localStorage
const loadState = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
        // Fix for "dark" string being invalid JSON
        if (key === 'theme' && (saved === 'dark' || saved === 'light')) {
            return JSON.parse(`"${saved}"`);
        }
        return JSON.parse(saved);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error loading state for key "${key}" from localStorage`, error);
    if (key === 'theme' && localStorage.getItem(key)) {
        return localStorage.getItem(key) as T;
    }
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadState<'light' | 'dark'>('theme', 'dark'));
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(() => loadState('weightHistory', []));


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

  useEffect(() => {
    localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
  }, [weightHistory]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleAddFoodToMeal = (food: Food) => {
    setMealPlan(prevPlan => {
      const newFoodInstance = { ...food, instanceId: `${food.id}-${Date.now()}` };
      const updatedMeal = [...prevPlan[activeMeal], newFoodInstance];
      return { ...prevPlan, [activeMeal]: updatedMeal };
    });
  };
  
  const handleSaveFoodToDB = (foodData: Omit<Food, 'id'>, id?: string) => {
    if (id) { // Editing existing food
        setFoodDatabase(prevDB => prevDB.map(f => f.id === id ? { ...f, ...foodData } : f));
    } else { // Adding new food
        const newFood: Food = {
            ...foodData,
            id: `${foodData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
        };
        setFoodDatabase(prevDB => [...prevDB, newFood]);
    }
  };

  const handleDeleteFoodFromDB = (foodId: string) => {
      setFoodDatabase(prevDB => prevDB.filter(f => f.id !== foodId));
  };


  const handleAddRecipeToDB = (recipe: Food) => {
    setFoodDatabase(prevDB => [...prevDB, recipe]);
  };

  const handleRemoveFood = (foodInstanceId: string, meal: MealType) => {
    setMealPlan(prevPlan => {
      const updatedMeal = prevPlan[meal].filter(f => f.instanceId !== foodInstanceId);
      return { ...prevPlan, [meal]: updatedMeal };
    });
  };

  const handleAddWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    const newEntry: WeightEntry = {
      ...entry,
      id: `${entry.date}-${Date.now()}`
    };
    setWeightHistory(prev => [...prev, newEntry]);
  };

  const handleRemoveWeightEntry = (id: string) => {
    setWeightHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const totalNutrients = useMemo<Nutrients>(() => {
    const totals: Nutrients = { calories: 0, carbohydrates: 0, fat: 0, protein: 0 };
    for (const meal of Object.values(mealPlan)) {
      // FIX: Add a check to ensure 'meal' is an array before iterating.
      // This prevents runtime errors if mealPlan is loaded from localStorage
      // with an unexpected structure, and satisfies the compiler.
      if (Array.isArray(meal)) {
        for (const food of meal) {
          totals.calories += food.calories;
          totals.carbohydrates += food.carbohydrates;
          totals.fat += food.fat;
          totals.protein += food.protein;
        }
      }
    }
    return totals;
  }, [mealPlan]);

  return (
    <div className="min-h-screen text-foreground font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Meal Tracker
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Planeje refeições, controle macros e atinja suas metas.</p>
          </div>
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 h-full">
            <FoodSelector 
              foodDatabase={foodDatabase}
              onAddFoodToMeal={handleAddFoodToMeal}
              onSaveFoodToDB={handleSaveFoodToDB}
              onDeleteFoodFromDB={handleDeleteFoodFromDB}
              onAddRecipeToDB={handleAddRecipeToDB}
            />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <MealPlanner
              mealPlan={mealPlan}
              activeMeal={activeMeal}
              setActiveMeal={setActiveMeal}
              onRemoveFood={handleRemoveFood}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Summary 
                totals={totalNutrients} 
                goals={nutrientGoals}
                setGoals={setNutrientGoals}
              />
               <WeightTracker 
                    history={weightHistory}
                    addEntry={handleAddWeightEntry}
                    removeEntry={handleRemoveWeightEntry}
                />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
