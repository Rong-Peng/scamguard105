import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RiskLevel } from '../types';

interface AnalysisChartProps {
  score: number;
  level: RiskLevel;
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ score, level }) => {
  const data = [
    { name: 'Risk', value: score },
    { name: 'Safety', value: 100 - score },
  ];

  let color = '#22c55e'; // Green
  if (level === RiskLevel.SUSPICIOUS) color = '#eab308'; // Yellow
  if (level === RiskLevel.DANGEROUS) color = '#f97316'; // Orange
  if (level === RiskLevel.CRITICAL) color = '#ef4444'; // Red

  return (
    <div className="h-48 md:h-64 w-full relative flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="60%"
            innerRadius="65%"
            outerRadius="85%"
            startAngle={180}
            endAngle={0}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-risk" fill={color} />
            <Cell key="cell-safe" fill="#334155" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-3xl md:text-4xl font-bold" style={{ color }}>{score}</p>
        <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mt-1">风险指数</p>
      </div>
    </div>
  );
};

export default AnalysisChart;