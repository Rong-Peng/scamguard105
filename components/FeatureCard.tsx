import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
      <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-4 text-blue-400 text-xl">
        <i className={icon}></i>
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;