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
