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
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
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
    <div className="bg-dark-card rounded-xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6 border-b-2 border-dark-border pb-3">
        <h2 className="text-2xl font-bold text-dark-text-primary">Resumo Nutricional</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center text-sm bg-dark-border/50 hover:bg-dark-border text-dark-text-secondary font-semibold py-2 px-4 rounded-lg transition-colors">
            <EditIcon />
            Editar Metas
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button onClick={handleCancel} className="text-sm bg-slate-600 hover:bg-slate-500 text-dark-text-primary font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
            <button onClick={handleSave} className="text-sm bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors">Salvar</button>
          </div>
        )}
      </div>
      <div className="space-y-6">
        {(Object.keys(totals) as Array<keyof Nutrients>).map((key) => (
          <div key={key}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-bold text-lg text-dark-text-primary">{NUTRIENT_LABELS[key]}</span>
              <div className="flex items-baseline space-x-2">
                 <span className="text-sm font-mono bg-dark-bg px-2 py-1 rounded">
                  {totals[key].toFixed(1)}
                </span>
                <span className="text-dark-text-secondary">/</span>
                {isEditing ? (
                   <input 
                      type="number"
                      value={editableGoals[key]}
                      onChange={(e) => handleGoalChange(key, e.target.value)}
                      className="w-20 text-sm font-mono bg-dark-border text-right px-2 py-1 rounded"
                   />
                ) : (
                  <span className="text-sm font-mono bg-dark-border px-2 py-1 rounded">
                    {goals[key]}
                  </span>
                )}
              </div>
            </div>
            <ProgressBar value={totals[key]} max={goals[key]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;