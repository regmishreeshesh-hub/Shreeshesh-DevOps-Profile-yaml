
import React, { useState, useEffect, useRef, useMemo } from 'react';
import SkillCard from './components/SkillCard';
import ProjectCard from './components/ProjectCard';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import { SKILLS, PROJECTS, SOCIAL_LINKS, RESUME_LINKS } from './constants';

const App: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
  const [highlightStatus, setHighlightStatus] = useState(false);
  const [highlightContact, setHighlightContact] = useState(false);
  const [highlightRole, setHighlightRole] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const statusRef = useRef<HTMLSpanElement>(null);
  const deployStatusRef = useRef<HTMLSpanElement>(null);
  const buildLogsRef = useRef<HTMLSpanElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const resumeLinksRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  // Particle Generation for atmospheric effect
  useEffect(() => {
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 6,
    }));
    setParticles(newParticles);
  }, []);

  const handleCardClick = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleDeployStatusClick = () => {
    // Scroll to STATUS: ONLINE
    statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Trigger highlight
    setHighlightStatus(true);
    
    // Remove highlight after 5 seconds
    setTimeout(() => {
      setHighlightStatus(false);
    }, 5000);
  };

  const handleBuildLogsClick = () => {
    // Scroll to contact section (which includes email and phone)
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Trigger highlight for both contact and social links
    setHighlightContact(true);
    
    // Remove highlight after 5 seconds
    setTimeout(() => {
      setHighlightContact(false);
    }, 5000);
  };

  const handleSystemInfoClick = () => {
    // Scroll to ROLE: DEVOPS_ENGINEER
    roleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Trigger highlight
    setHighlightRole(true);
    
    // Remove highlight after 5 seconds
    setTimeout(() => {
      setHighlightRole(false);
    }, 5000);
  };

  // Filter skills based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) {
      return SKILLS;
    }

    const query = searchQuery.toLowerCase();
    return SKILLS.filter(skill => {
      // Search in title, description, and items
      const titleMatch = skill.title.toLowerCase().includes(query);
      const descriptionMatch = skill.description.toLowerCase().includes(query);
      const itemsMatch = skill.items.some(item => 
        item.toLowerCase().includes(query)
      );
      
      return titleMatch || descriptionMatch || itemsMatch;
    });
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-300" style={{ 
      backgroundColor: 'var(--theme-background)',
      color: 'var(--theme-text)'
    }}>
      {/* Background Layers */}
      <div className="fixed inset-0 transition-colors duration-300" style={{ 
        backgroundColor: 'var(--theme-background)'
      }} />
      
      {/* Atmospheric Glows */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full blur-[120px]" style={{ 
          background: 'var(--theme-gradient1)' 
        }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full blur-[120px]" style={{ 
          background: 'var(--theme-gradient2)' 
        }} />
      </div>

      {/* Theme Toggle Button - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Vertical Floating Particles */}
      <div className="fixed inset-0 pointer-events-none -z-5">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute bottom-0 w-[1px] h-20 bg-gradient-to-t from-transparent via-white/10 to-transparent"
            style={{
              left: `${p.left}%`,
              animation: `float-up ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(100vh); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-20vh); opacity: 0; }
        }
      `}</style>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl relative z-10">
        
        {/* Header Section */}
        <header className="text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 uppercase" style={{ 
              color: 'var(--theme-text)',
              filter: 'var(--theme-glow) drop-shadow(0 0 10px var(--theme-accent))'
            }}>
              Shreeshesh <span style={{ color: 'var(--theme-accent)' }}>Regmi</span>
            </h1>
            <div className="h-px w-full" style={{ 
              background: 'linear-gradient(to right, transparent, var(--theme-border), transparent)' 
            }} />
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10 font-mono-code text-sm md:text-base tracking-[0.2em]" style={{ 
              color: 'var(--theme-textSecondary)'
            }}>
            <span 
              ref={statusRef}
              className={`flex items-center gap-3 transition-all duration-500 ${
                highlightStatus 
                  ? 'scale-110 shadow-[0_0_20px_rgba(251,146,60,0.6)]' 
                  : ''
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"/> STATUS: ONLINE
            </span>
            <span 
              ref={roleRef}
              className={`flex items-center gap-3 transition-all duration-500 ${
                highlightRole 
                  ? 'scale-110 shadow-[0_0_20px_rgba(59,130,246,0.6)]' 
                  : ''
              }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                ROLE: DEVOPS_ENGINEER
              </span>
            <span className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location: Kathmandu, Nepal
              </span>
          </div>
          
          <div 
            ref={contactRef}
            className={`mt-12 flex flex-col md:flex-row items-center justify-center gap-6 transition-all duration-500 ${
              highlightContact 
                ? 'scale-105 shadow-[0_0_20px_rgba(59,130,246,0.6)]' 
                : ''
            }`}
          >
            <a 
              href="mailto:shreeshesh.regmi@gmail.com" 
              className="flex items-center gap-4 px-8 py-4 rounded-xl transition-all duration-300 group text-lg md:text-xl font-semibold hover:scale-105 relative overflow-hidden" 
              style={{
                backgroundColor: 'var(--theme-card)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--theme-accent)';
                e.currentTarget.style.backgroundColor = 'var(--theme-surface)';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--theme-border)';
                e.currentTarget.style.backgroundColor = 'var(--theme-card)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span className="relative z-10 group-hover:rotate-12 transition-transform duration-300 text-2xl" style={{ 
                color: 'var(--theme-accent)',
                filter: 'drop-shadow(0 0 8px var(--theme-glow))'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="relative z-10">shreeshesh.regmi@gmail.com</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </a>
            <a 
              href="tel:+9779704556365" 
              className="flex items-center gap-4 px-8 py-4 rounded-xl transition-all duration-300 group text-lg md:text-xl font-semibold hover:scale-105 relative overflow-hidden" 
              style={{
                backgroundColor: 'var(--theme-card)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--theme-accentSecondary)';
                e.currentTarget.style.backgroundColor = 'var(--theme-surface)';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--theme-border)';
                e.currentTarget.style.backgroundColor = 'var(--theme-card)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span className="relative z-10 group-hover:scale-110 transition-transform duration-300 text-2xl" style={{ 
                color: 'var(--theme-accentSecondary)',
                filter: 'drop-shadow(0 0 8px var(--theme-glow))'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <span className="relative z-10">+977 9704556365</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </a>
          </div>

           {/* Social Links */}
           <div 
            ref={socialLinksRef}
            className={`mt-8 flex flex-wrap items-center justify-center gap-4 transition-all duration-500 ${
              highlightContact 
                ? 'scale-105 shadow-[0_0_20px_rgba(168,85,247,0.6)]' 
                : ''
            }`}
          >
             {SOCIAL_LINKS.map((social, index) => (
               <a
                 key={index}
                 href={social.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 group text-sm font-medium relative overflow-hidden hover:scale-105" 
                 style={{
                   backgroundColor: 'var(--theme-card)',
                   border: '1px solid var(--theme-border)',
                   color: 'var(--theme-text)'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.borderColor = 'var(--theme-accent)';
                   e.currentTarget.style.backgroundColor = 'var(--theme-surface)';
                   e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                   e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.borderColor = 'var(--theme-border)';
                   e.currentTarget.style.backgroundColor = 'var(--theme-card)';
                   e.currentTarget.style.transform = 'translateY(0) scale(1)';
                   e.currentTarget.style.boxShadow = 'none';
                 }}
               >
                 <span 
                   className="relative z-10 text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-5"
                   style={{ 
                     color: social.name === 'LinkedIn' ? '#0A66C2' : 'var(--theme-accent)'
                   }}
                   dangerouslySetInnerHTML={{ __html: social.icon }}
                 />
                 <span className="relative z-10 uppercase tracking-wide">{social.name}</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
               </a>
             ))}
           </div>

           {/* Resume Links */}
           <div 
            ref={resumeLinksRef}
            className={`mt-6 flex flex-wrap items-center justify-center gap-4 transition-all duration-500 ${
              highlightContact 
                ? 'scale-105 shadow-[0_0_20px_rgba(34,197,94,0.6)]' 
                : ''
            }`}
          >
             <a
               href="https://docs.google.com/document/d/1toJdmql6JRBV0Gj80xhro4LOf-gUGLtl/edit?usp=drive_link&ouid=107834041569382404825&rtpof=true&sd=true"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 group text-sm font-medium relative overflow-hidden hover:scale-105" 
               style={{
                 backgroundColor: 'var(--theme-card)',
                 border: '1px solid var(--theme-border)',
                 color: 'var(--theme-text)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.borderColor = '#22c55e';
                 e.currentTarget.style.backgroundColor = 'var(--theme-surface)';
                 e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                 e.currentTarget.style.boxShadow = '0 8px 20px rgba(34,197,94,0.2)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.borderColor = 'var(--theme-border)';
                 e.currentTarget.style.backgroundColor = 'var(--theme-card)';
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = 'none';
               }}
             >
               <span className="relative z-10 text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-5" style={{ 
                 color: '#22c55e',
                 filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.5))'
               }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
                 <span className="relative z-10 uppercase tracking-wide">Resume (DOCX)</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
               </a>
             <a
               href="https://drive.google.com/file/d/14KuBd5zaL_I9JNKhd1sSDx5sSrBXeKX0/view?usp=drive_link"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 group text-sm font-medium relative overflow-hidden hover:scale-105" 
               style={{
                 backgroundColor: 'var(--theme-card)',
                 border: '1px solid var(--theme-border)',
                 color: 'var(--theme-text)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.borderColor = '#22c55e';
                 e.currentTarget.style.backgroundColor = 'var(--theme-surface)';
                 e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                 e.currentTarget.style.boxShadow = '0 8px 20px rgba(34,197,94,0.2)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.borderColor = 'var(--theme-border)';
                 e.currentTarget.style.backgroundColor = 'var(--theme-card)';
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = 'none';
               }}
             >
               <span className="relative z-10 text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-5" style={{ 
                 color: '#22c55e',
                 filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.5))'
               }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
                 <span className="relative z-10 uppercase tracking-wide">Resume (PDF)</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
               </a>
           </div>
        </header>



        {/* 3x3 MATRIX GRID */}
        <div className="relative mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 uppercase" style={{ 
              color: 'var(--theme-text)'
            }}>
              Technical <span style={{ color: 'var(--theme-accent)' }}>Skills</span>
            </h2>
            <div className="h-px w-32 md:w-48 mx-auto" style={{ 
              background: 'linear-gradient(to right, transparent, var(--theme-accent), transparent)' 
            }} />
            <p className="mt-4 text-sm md:text-base max-w-2xl mx-auto" style={{ 
              color: 'var(--theme-textSecondary)'
            }}>
              My expertise in modern DevOps technologies and practices
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={setSearchQuery} />

          {/* Search Results Count */}
          {searchQuery && (
            <div className="text-center mb-8">
              <p className="text-sm font-mono-code" style={{ 
                color: 'var(--theme-textSecondary)'
              }}>
                Found <span style={{ color: 'var(--theme-accent)' }} className="font-bold">{filteredSkills.length}</span> skill{filteredSkills.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 lg:gap-6">
            {filteredSkills.map((skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={index}
                isExpanded={expandedId === skill.id}
                onClick={() => handleCardClick(skill.id)}
                searchQuery={searchQuery}
              />
            ))}
          </div>
          
          {/* Subtle Grid Lines Overlay for Matrix Aesthetic */}
          <div className="absolute -inset-8 pointer-events-none opacity-10 hidden md:block">
             <div className="h-full w-full border-x border-white/20 flex justify-evenly">
                <div className="w-px bg-white/20 h-full" />
                <div className="w-px bg-white/20 h-full" />
             </div>
             <div className="absolute inset-0 border-y border-white/20 flex flex-col justify-evenly">
                <div className="h-px bg-white/20 w-full" />
                <div className="h-px bg-white/20 w-full" />
             </div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-32 pt-12 border-t border-gray-200 dark:border-white/5 flex flex-col items-center justify-center gap-6 text-gray-600 dark:text-white/60 text-sm font-mono-code uppercase tracking-widest text-center">
          <div className="flex gap-8 mb-2">
            <span 
              ref={buildLogsRef}
              onClick={handleBuildLogsClick}
              className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              BUILD_LOGS
            </span>
            <span 
              onClick={handleSystemInfoClick}
              className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              SYSTEM_INFO
            </span>
            <span 
              ref={deployStatusRef}
              onClick={handleDeployStatusClick}
              className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              DEPLOY_STATUS
            </span>
          </div>
          <div className="drop-shadow-[0_0_12px_rgba(251,146,60,0.8)] text-orange-400">
            © {new Date().getFullYear()} Shreeshesh Regmi • Built for Modern DevOps Landscapes
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
