
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
        className={`relative group cursor-pointer transition-all duration-500 h-64 md:h-72 transform hover:scale-105
          ${isExpanded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
        `}
      >
        <div className={`absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-md group-hover:bg-white/10 transition-all matrix-cell overflow-hidden border border-white/10 group-hover:border-white/20 
          ${coord === '[0,0]' ? 'shadow-[0_0_30px_rgba(251,146,60,0.4)] group-hover:shadow-[0_0_50px_rgba(251,146,60,0.6)]' : 
            coord === '[0,1]' ? 'shadow-[0_0_30px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]' : 
            coord === '[0,2]' ? 'shadow-[0_0_30px_rgba(34,197,94,0.4)] group-hover:shadow-[0_0_50px_rgba(34,197,94,0.6)]' : 
            coord === '[1,0]' ? 'shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]' : 
            coord === '[1,1]' ? 'shadow-[0_0_30px_rgba(239,68,68,0.4)] group-hover:shadow-[0_0_50px_rgba(239,68,68,0.6)]' : 
            coord === '[1,2]' ? 'shadow-[0_0_30px_rgba(250,204,21,0.4)] group-hover:shadow-[0_0_50px_rgba(250,204,21,0.6)]' : 
            coord === '[2,0]' ? 'shadow-[0_0_30px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_50px_rgba(34,211,238,0.6)]' : 
            coord === '[2,1]' ? 'shadow-[0_0_30px_rgba(244,114,182,0.4)] group-hover:shadow-[0_0_50px_rgba(244,114,182,0.6)]' : 
            coord === '[2,2]' ? 'shadow-[0_0_30px_rgba(129,140,248,0.4)] group-hover:shadow-[0_0_50px_rgba(129,140,248,0.6)]' : 
            'shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]'}`}>
          {/* Matrix Coordinate Indicator */}
          <div className={`absolute top-4 right-4 font-mono-code text-xs transition-all transform group-hover:scale-110
            ${coord === '[0,0]' ? 'text-orange-400 font-bold drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]' : 
              coord === '[0,1]' ? 'text-blue-400 font-bold drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 
              coord === '[0,2]' ? 'text-green-400 font-bold drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 
              coord === '[1,0]' ? 'text-purple-400 font-bold drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 
              coord === '[1,1]' ? 'text-red-400 font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 
              coord === '[1,2]' ? 'text-yellow-400 font-bold drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 
              coord === '[2,0]' ? 'text-cyan-400 font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 
              coord === '[2,1]' ? 'text-pink-400 font-bold drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]' : 
              coord === '[2,2]' ? 'text-indigo-400 font-bold drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 
              'text-white/30 group-hover:text-white/50'}`}>
            {coord}
          </div>
          
          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <div className={`w-32 h-32 mb-4 flex items-center justify-center text-6xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-5 ${
              coord === '[0,0]' ? 'text-orange-400' : 
              coord === '[0,1]' ? 'text-blue-400' : 
              coord === '[0,2]' ? 'text-green-400' : 
              coord === '[1,0]' ? 'text-purple-400' : 
              coord === '[1,1]' ? 'text-red-400' : 
              coord === '[1,2]' ? 'text-yellow-400' : 
              coord === '[2,0]' ? 'text-cyan-400' : 
              coord === '[2,1]' ? 'text-pink-400' : 
              coord === '[2,2]' ? 'text-indigo-400' : 
              'text-white'
            }`}>
              {skill.icon}
            </div>
            <h3 className="text-lg font-black tracking-widest uppercase transition-colors duration-300
              ${coord === '[0,0]' ? 'group-hover:text-orange-400' : 
                coord === '[0,1]' ? 'group-hover:text-blue-400' : 
                coord === '[0,2]' ? 'group-hover:text-green-400' : 
                coord === '[1,0]' ? 'group-hover:text-purple-400' : 
                coord === '[1,1]' ? 'group-hover:text-red-400' : 
                coord === '[1,2]' ? 'group-hover:text-yellow-400' : 
                coord === '[2,0]' ? 'group-hover:text-cyan-400' : 
                coord === '[2,1]' ? 'group-hover:text-pink-400' : 
                coord === '[2,2]' ? 'group-hover:text-indigo-400' : 
                'group-hover:text-orange-400'}`">
              {skill.title}
            </h3>
            <div className={`mt-4 w-8 h-1 rounded-full transition-all duration-500 group-hover:w-20
              ${coord === '[0,0]' ? 'bg-orange-500/30 group-hover:bg-orange-500/70' : 
                coord === '[0,1]' ? 'bg-blue-500/30 group-hover:bg-blue-500/70' : 
                coord === '[0,2]' ? 'bg-green-500/30 group-hover:bg-green-500/70' : 
                coord === '[1,0]' ? 'bg-purple-500/30 group-hover:bg-purple-500/70' : 
                coord === '[1,1]' ? 'bg-red-500/30 group-hover:bg-red-500/70' : 
                coord === '[1,2]' ? 'bg-yellow-500/30 group-hover:bg-yellow-500/70' : 
                coord === '[2,0]' ? 'bg-cyan-500/30 group-hover:bg-cyan-500/70' : 
                coord === '[2,1]' ? 'bg-pink-500/30 group-hover:bg-pink-500/70' : 
                coord === '[2,2]' ? 'bg-indigo-500/30 group-hover:bg-indigo-500/70' : 
                'bg-white/20 group-hover:bg-orange-500/70'}`} 
            />
          </div>
          
          {/* Subtle hover background effect */}
          <div className={`absolute -bottom-16 -right-16 w-40 h-40 bg-gradient-to-br transition-all duration-700 transform group-hover:scale-110 opacity-0 group-hover:opacity-30 blur-3xl
            ${coord === '[0,0]' ? 'from-orange-400/15 to-transparent' : 
              coord === '[0,1]' ? 'from-blue-400/15 to-transparent' : 
              coord === '[0,2]' ? 'from-green-400/15 to-transparent' : 
              coord === '[1,0]' ? 'from-purple-400/15 to-transparent' : 
              coord === '[1,1]' ? 'from-red-400/15 to-transparent' : 
              coord === '[1,2]' ? 'from-yellow-400/15 to-transparent' : 
              coord === '[2,0]' ? 'from-cyan-400/15 to-transparent' : 
              coord === '[2,1]' ? 'from-pink-400/15 to-transparent' : 
              coord === '[2,2]' ? 'from-indigo-400/15 to-transparent' : 
              'from-orange-400/10 to-transparent'}`} 
          />
        </div>
      </div>

      {/* Expanded Overlay (Modal-like but feels like an expansion) */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300"
          onClick={onClick}
        >
          {/* Dark Backdrop */}
          <div className="absolute inset-0 bg-[#060918]/95 backdrop-blur-lg" />
          
          {/* Expanded Content Box */}
          <div 
            className={`relative w-full max-w-4xl max-h-[85vh] bg-[#0d1117] border rounded-3xl overflow-hidden flex flex-col
              ${coord === '[0,0]' ? 'border-orange-500/30 shadow-[0_0_80px_rgba(251,146,60,0.5)]' : 
                coord === '[0,1]' ? 'border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.5)]' : 
                coord === '[0,2]' ? 'border-green-500/30 shadow-[0_0_80px_rgba(34,197,94,0.5)]' : 
                coord === '[1,0]' ? 'border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.5)]' : 
                coord === '[1,1]' ? 'border-red-500/30 shadow-[0_0_80px_rgba(239,68,68,0.5)]' : 
                coord === '[1,2]' ? 'border-yellow-500/30 shadow-[0_0_80px_rgba(250,204,21,0.5)]' : 
                coord === '[2,0]' ? 'border-cyan-500/30 shadow-[0_0_80px_rgba(34,211,238,0.5)]' : 
                coord === '[2,1]' ? 'border-pink-500/30 shadow-[0_0_80px_rgba(244,114,182,0.5)]' : 
                coord === '[2,2]' ? 'border-indigo-500/30 shadow-[0_0_80px_rgba(129,140,248,0.5)]' : 
                'border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.2)]'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Title Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-20 h-20 mb-4 flex items-center justify-center text-3xl
                  ${coord === '[0,0]' ? 'text-orange-400' : 
                    coord === '[0,1]' ? 'text-blue-400' : 
                    coord === '[0,2]' ? 'text-green-400' : 
                    coord === '[1,0]' ? 'text-purple-400' : 
                    coord === '[1,1]' ? 'text-red-400' : 
                    coord === '[1,2]' ? 'text-yellow-400' : 
                    coord === '[2,0]' ? 'text-cyan-400' : 
                    coord === '[2,1]' ? 'text-pink-400' : 
                    coord === '[2,2]' ? 'text-indigo-400' : 
                    'text-white'}`}>
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
