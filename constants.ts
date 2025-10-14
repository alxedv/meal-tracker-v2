import { Food, MealType, Nutrients } from './types';

export const DEFAULT_FOOD_DATABASE: Food[] = [
  { id: 'arroz', name: 'Arroz', quantity: '100g', calories: 130, carbohydrates: 28, fat: 0.3, protein: 2.7 },
  { id: 'feijao', name: 'Feijão', quantity: '100g', calories: 76, carbohydrates: 14, fat: 0.5, protein: 5 },
  { id: 'frango', name: 'Frango', quantity: '100g', calories: 165, carbohydrates: 0, fat: 0.3, protein: 31 },
  { id: 'patinho', name: 'Patinho', quantity: '100g', calories: 195, carbohydrates: 0, fat: 8, protein: 29 },
  { id: 'musculo', name: 'Músculo', quantity: '100g', calories: 200, carbohydrates: 0, fat: 8, protein: 30 },
  { id: 'acem', name: 'Acém', quantity: '100g', calories: 235, carbohydrates: 0, fat: 15, protein: 25 },
  { id: 'paleta', name: 'Paleta', quantity: '100g', calories: 230, carbohydrates: 0, fat: 15, protein: 25 },
  { id: 'ovo', name: 'Ovo', quantity: '100g', calories: 155, carbohydrates: 1.1, fat: 11, protein: 13 },
  { id: 'mussarela', name: 'Mussarela', quantity: '100g', calories: 300, carbohydrates: 3, fat: 22, protein: 22 },
  { id: 'pao_frances', name: 'Pão Frances', quantity: '1x', calories: 145, carbohydrates: 58, fat: 1.5, protein: 4.5 },
  { id: 'pao_de_forma', name: 'Pão de forma', quantity: '1x', calories: 66, carbohydrates: 12, fat: 1, protein: 2 },
];

export const MEAL_TYPES_ORDER: MealType[] = [
  MealType.Breakfast,
  MealType.Lunch,
  MealType.AfternoonSnack,
  MealType.Dinner,
];

export const DEFAULT_NUTRIENT_GOALS: Nutrients = {
  calories: 1800,
  carbohydrates: 250,
  fat: 70,
  protein: 150,
};

export const NUTRIENT_LABELS: Record<keyof Nutrients, string> = {
    calories: "Calorias",
    carbohydrates: "Carboidratos",
    fat: "Gordura",
    protein: "Proteína"
};
