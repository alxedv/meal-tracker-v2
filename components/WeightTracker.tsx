import React, { useState, useMemo } from 'react';
import { WeightEntry } from '../types';

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


const WeightChart = ({ data }: { data: WeightEntry[] }) => {
    const PADDING = 40;
    const WIDTH = 500;
    const HEIGHT = 250;

    const memoizedChartData = useMemo(() => {
        if (data.length < 2) return null;

        const weights = data.map(d => d.weight);
        const dates = data.map(d => new Date(d.date).getTime());
        const minW = Math.min(...weights);
        const maxW = Math.max(...weights);
        const range = maxW - minW;
        
        const minWeight = Math.max(0, minW - range * 0.2);
        const maxWeight = maxW + range * 0.2;
        const minDate = Math.min(...dates);
        const maxDate = Math.max(...dates);

        const xScale = (date: number) => {
            if (maxDate === minDate) return PADDING;
            return PADDING + (date - minDate) / (maxDate - minDate) * (WIDTH - 2 * PADDING);
        };
        const yScale = (weight: number) => {
            if (maxWeight === minWeight) return HEIGHT - PADDING;
            return (HEIGHT - PADDING) - (weight - minWeight) / (maxWeight - minWeight) * (HEIGHT - 2 * PADDING);
        };

        const pathData = data
            .map(d => `${xScale(new Date(d.date).getTime())},${yScale(d.weight)}`)
            .join(' L ');

        const yAxisLabels = [];
        const steps = 4;
        const step = (maxWeight - minWeight) / steps;
        for(let i = 0; i <= steps; i++) {
            const weight = minWeight + i * step;
            yAxisLabels.push({
                weight: weight.toFixed(1),
                y: yScale(weight)
            });
        }

        const first = data[0];
        const last = data[data.length - 1];
        const xAxisLabels = [];
        if(first && last){
            xAxisLabels.push({ date: first.date, x: xScale(new Date(first.date).getTime()) });
            if (first.date !== last.date) {
                 xAxisLabels.push({ date: last.date, x: xScale(new Date(last.date).getTime()) });
            }
        }

        const circles = data.map(d => ({
            id: d.id,
            cx: xScale(new Date(d.date).getTime()),
            cy: yScale(d.weight)
        }));
        
        return { pathData, yAxisLabels, xAxisLabels, circles };

    }, [data]);
    
    if (!memoizedChartData) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">Adicione mais um registro para ver o gráfico.</div>
    }
    
    const { pathData, yAxisLabels, xAxisLabels, circles } = memoizedChartData;

    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full">
            {/* Y Axis */}
            <line x1={PADDING} y1={PADDING/2} x2={PADDING} y2={HEIGHT - PADDING} stroke="hsl(var(--border))" strokeWidth="1" />
            {yAxisLabels.map(label => (
                <g key={label.weight}>
                    <text x={PADDING - 8} y={label.y} textAnchor="end" alignmentBaseline="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{label.weight}</text>
                    <line x1={PADDING} y1={label.y} x2={WIDTH - PADDING/2} y2={label.y} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2,2"/>
                </g>
            ))}
            
            {/* X Axis */}
            <line x1={PADDING} y1={HEIGHT - PADDING} x2={WIDTH - PADDING/2} y2={HEIGHT - PADDING} stroke="hsl(var(--border))" strokeWidth="1" />
            {xAxisLabels.map(label => (
                 <text key={label.date} x={label.x} y={HEIGHT - PADDING + 15} textAnchor="middle" alignmentBaseline="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
                     {new Date(label.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'})}
                </text>
            ))}

            {/* Line */}
            <path d={`M ${pathData}`} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />

             {/* Circles */}
            {circles.map(circle => (
                 <circle key={circle.id} cx={circle.cx} cy={circle.cy} r="3" fill="hsl(var(--primary))" />
            ))}
        </svg>
    );
};

interface WeightTrackerProps {
  history: WeightEntry[];
  addEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({ history, addEntry, removeEntry }) => {
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [view, setView] = useState<'chart' | 'list'>('chart');
    
    const sortedHistory = useMemo(() => 
        [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [history]);

    const chartHistory = useMemo(() =>
        [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const weightNum = parseFloat(weight);
        if (weightNum > 0 && date) {
            addEntry({ date, weight: weightNum });
            setWeight('');
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 transition-colors duration-300 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
                <h2 className="text-xl font-bold text-card-foreground">Progresso de Peso</h2>
                <div className="flex items-center bg-secondary rounded-lg p-1">
                    <button onClick={() => setView('chart')} className={`p-1.5 rounded-md ${view === 'chart' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}><ChartIcon/></button>
                    <button onClick={() => setView('list')} className={`p-1.5 rounded-md ${view === 'list' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}><ListIcon/></button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-2 mb-4">
                 <div className="w-full sm:w-auto flex-grow">
                    <label htmlFor="weight" className="block text-sm font-medium text-muted-foreground mb-1">Peso (kg)</label>
                    <input type="number" step="0.1" id="weight" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring" required />
                </div>
                <div className="w-full sm:w-auto">
                    <label htmlFor="date" className="block text-sm font-medium text-muted-foreground mb-1">Data</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring" required />
                </div>
                <button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold p-2.5 rounded-lg transition-colors flex-shrink-0">
                    <PlusIcon className="h-5 w-5"/>
                </button>
            </form>
            
            <div className="flex-grow min-h-[200px]">
                 {history.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                        <p>Adicione seu peso para começar a acompanhar seu progresso.</p>
                    </div>
                ) : (
                    view === 'chart' ? <WeightChart data={chartHistory} /> : (
                        <ul className="space-y-2 overflow-y-auto h-full max-h-[250px] pr-2 -mr-2">
                            {sortedHistory.map(entry => (
                                <li key={entry.id} className="flex justify-between items-center p-2 bg-secondary rounded-md group">
                                    <span>{new Date(entry.date + 'T00:00:00').toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">{entry.weight.toFixed(1)} kg</span>
                                        <button onClick={() => removeEntry(entry.id)} className="text-destructive/60 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>
        </div>
    );
};
export default WeightTracker;