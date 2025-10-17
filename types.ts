export interface Nutrients {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
}

export interface Food extends Nutrients {
  id: string;
  name: string;
  quantity: string;
  isRecipe?: boolean;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  foodId: string;
  name: string;
  // The quantity of the ingredient in grams or units
  // This is used to calculate the total nutrients of the recipe
  amount: number; 
  // The base quantity of the food item (e.g. 100g)
  baseQuantity: string; 
}

export interface SelectedFood extends Food {
  instanceId: string;
}

export enum MealType {
  Breakfast = 'Café da manha',
  Lunch = 'Almoço',
  AfternoonSnack = 'Café da tarde',
  Dinner = 'Janta',
}

export type MealPlan = Record<MealType, SelectedFood[]>;

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
}
