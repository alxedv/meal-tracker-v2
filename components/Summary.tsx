import React, { useState, useEffect } from 'react';
import { Nutrients } from '../types';
import { NUTRIENT_LABELS } from '../constants';
import CircularProgressBar from './CircularProgressBar';

interface SummaryProps {
  totals: Nutrients;
  goals: Nutrients;
  setGoals: (newGoals: Nutrients) => void;
}

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const Summary: React.FC<SummaryProps> = ({ totals, goals, setGoals }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableGoals, setEditableGoals] = useState(goals);

  useEffect(() => {
    setEditableGoals(goals);
  }, [goals]);

  const handleSave = () => {
    setGoals(editableGoals);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditableGoals(goals);
    setIsEditing(false);
  }

  const handleGoalChange = (key: keyof Nutrients, value: string) => {
    const numValue = parseInt(value, 10);
    setEditableGoals(prev => ({
      ...prev,
      [key]: isNaN(numValue) ? 0 : numValue
    }));
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-card-foreground">Resumo de Hoje</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center text-sm bg-secondary hover:bg-muted text-secondary-foreground font-semibold py-2 px-4 rounded-lg transition-colors">
            <EditIcon />
            Editar Metas
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button onClick={handleCancel} className="text-sm bg-secondary hover:bg-muted text-secondary-foreground font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
            <button onClick={handleSave} className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors">Salvar</button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4 animate-content-show">
            {(Object.keys(goals) as Array<keyof Nutrients>).map((key) => (
                <div key={key} className="flex justify-between items-center">
                    <label htmlFor={key} className="font-semibold text-card-foreground">{NUTRIENT_LABELS[key]}</label>
                    <input 
                        id={key}
                        type="number"
                        value={editableGoals[key]}
                        onChange={(e) => handleGoalChange(key, e.target.value)}
                        className="w-24 text-sm font-mono bg-input border border-border text-right px-2 py-1 rounded-md"
                    />
                </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-content-show">
            <CircularProgressBar
                value={totals.calories}
                max={goals.calories}
                label={NUTRIENT_LABELS.calories}
                unit="kcal"
                size={160}
                strokeWidth={14}
            />
            <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-sm">
                 <CircularProgressBar
                    value={totals.protein}
                    max={goals.protein}
                    label={NUTRIENT_LABELS.protein}
                    unit="g"
                    size={90}
                    strokeWidth={8}
                />
                 <CircularProgressBar
                    value={totals.carbohydrates}
                    max={goals.carbohydrates}
                    label={NUTRIENT_LABELS.carbohydrates}
                    unit="g"
                    size={90}
                    strokeWidth={8}
                />
                 <CircularProgressBar
                    value={totals.fat}
                    max={goals.fat}
                    label={NUTRIENT_LABELS.fat}
                    unit="g"
                    size={90}
                    strokeWidth={8}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
