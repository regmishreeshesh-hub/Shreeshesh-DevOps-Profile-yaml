
import React from 'react';
import { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
  isExpanded: boolean;
  onClick: () => void;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, isExpanded, onClick, index }) => {
  // Format the index as a matrix coordinate (e.g., [0,1])
  const row = Math.floor(index / 3);
  const col = index % 3;
  const coord = `[${row},${col}]`;

  return (
    <>
      {/* Base Matrix Cell */}
      <div 
        onClick={onClick}
        className={`relative group cursor-pointer transition-all duration-500 h-64 md:h-72
          ${isExpanded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
        `}
      >
        <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/10 group-hover:border-white/20 transition-all matrix-cell overflow-hidden">
          {/* Matrix Coordinate Indicator */}
          <div className="absolute top-3 right-3 font-mono-code text-[10px] text-white/20 group-hover:text-white/40 transition-colors">
            {coord}
          </div>
          
          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center text-3xl bg-gradient-to-br ${skill.color} shadow-lg transition-transform group-hover:scale-110 duration-500`}>
              {skill.icon}
            </div>
            <h3 className="text-lg font-black tracking-widest uppercase group-hover:text-orange-400 transition-colors">
              {skill.title}
            </h3>
            <div className="mt-4 w-8 h-1 bg-white/10 group-hover:w-16 group-hover:bg-orange-500/50 transition-all duration-500 rounded-full" />
          </div>
          
          {/* Subtle hover background effect */}
          <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
        </div>
      </div>

      {/* Expanded Overlay (Modal-like but feels like an expansion) */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300"
          onClick={onClick}
        >
          {/* Dark Backdrop */}
          <div className="absolute inset-0 bg-[#060918]/90 backdrop-blur-md" />
          
          {/* Expanded Content Box */}
          <div 
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#0d1117] border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Title Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br ${skill.color}`}>
                  {skill.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{skill.title}</h2>
                  <p className="text-xs text-white/40 font-mono-code uppercase">{coord} NODE_DETAILS</p>
                </div>
              </div>
              <button 
                onClick={onClick}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content (YAML Style) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 font-mono-code text-sm md:text-base no-scrollbar">
              <div className="mb-8">
                <span className="yaml-key">apiVersion</span><span className="yaml-punct">:</span> <span className="yaml-string">v1</span><br/>
                <span className="yaml-key">kind</span><span className="yaml-punct">:</span> <span className="yaml-string">ConfigMap</span><br/>
                <span className="yaml-key">metadata</span><span className="yaml-punct">:</span><br/>
                <span className="pl-4 yaml-key">name</span><span className="yaml-punct">:</span> <span className="yaml-string">{skill.id}-details</span><br/>
                <span className="pl-4 yaml-key">namespace</span><span className="yaml-punct">:</span> <span className="yaml-string">portfolio-shreeshesh</span><br/>
                <span className="yaml-key">data</span><span className="yaml-punct">:</span><br/>
                <span className="pl-4 yaml-key">summary</span><span className="yaml-punct">:</span> <span className="yaml-punct">|</span><br/>
                <span className="pl-8 text-white/70 italic">"{skill.description}"</span><br/>
                <span className="pl-4 yaml-key">capabilities</span><span className="yaml-punct">:</span><br/>
              </div>

              <div className="space-y-3 pl-8">
                {skill.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group/line">
                    <span className="yaml-punct shrink-0 text-orange-500">-</span>
                    <span className="text-white/90 group-hover/line:text-white transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/5 text-white/20 text-xs text-center">
                --- END OF SPEC ---
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkillCard;
