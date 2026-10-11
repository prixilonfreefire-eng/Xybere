import React from 'react';
import logoImg from '../assets/images/science_mssn_logo_1791732458753.jpg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`relative ${sizeMap[size]} rounded-full overflow-hidden shadow-sm ring-2 ring-[#0866FF]/60 hover:ring-[#0866FF] transition-all flex-shrink-0 group`}
      >
        <img
          src={logoImg}
          alt="SCIENCE MSSN 2K27 Logo"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold text-sm sm:text-base tracking-wider bg-gradient-to-r from-[#0866FF] via-[#00B4D8] to-[#38B6FF] bg-clip-text text-transparent uppercase">
            SCIENCE MSSN
          </span>
          <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-[#050505] dark:text-[#E4E6EB] opacity-90">
            2K27
          </span>
        </div>
      )}
    </div>
  );
};
