import React, { useState, useEffect } from 'react';
import { Nutrients } from '../types';
import ProgressBar from './ProgressBar';
import { NUTRIENT_LABELS } from '../constants';

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
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
        <h2 className="text-xl font-bold text-card-foreground">Resumo Nutricional</h2>
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
      <div className="space-y-6">
        {(Object.keys(totals) as Array<keyof Nutrients>).map((key) => {
          const isOverGoal = totals[key] > goals[key] && goals[key] > 0;
          return (
            <div key={key}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-semibold text-card-foreground">{NUTRIENT_LABELS[key]}</span>
                <div className="flex items-baseline space-x-2">
                   <span className={`text-sm font-mono ${isOverGoal ? 'text-destructive' : 'text-primary'}`}>
                    {totals[key].toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">/</span>
                  {isEditing ? (
                     <input 
                        type="number"
                        value={editableGoals[key]}
                        onChange={(e) => handleGoalChange(key, e.target.value)}
                        className="w-20 text-sm font-mono bg-input border border-border text-right px-2 py-1 rounded-md"
                     />
                  ) : (
                    <span className="text-sm font-mono text-muted-foreground">
                      {goals[key]}
                    </span>
                  )}
                </div>
              </div>
              <ProgressBar value={totals[key]} max={goals[key]} />
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Summary;