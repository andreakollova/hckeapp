
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Newspaper, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Domov', path: '/', icon: <Home size={22} /> },
    { name: 'Zápasy', path: '/matches', icon: <Calendar size={22} /> },
    { name: 'Novinky', path: '/news', icon: <Newspaper size={22} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-transparent text-white font-sans flex flex-col relative z-10">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5 px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/7/75/HC_Ko%C5%A1ice_logo.svg/1044px-HC_Ko%C5%A1ice_logo.svg.png" 
            alt="HC Košice" 
            className="h-12 w-auto transition-transform group-hover:scale-110 group-hover:rotate-3"
          />
          <div className="flex flex-col">
            <span className="font-sports font-black text-2xl tracking-tighter leading-none group-hover:text-primary transition-colors">HC KOŠICE</span>
            <span className="text-[9px] font-black tracking-[0.3em] text-white/40 uppercase">Aplikácia fanúšika</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-sports text-xl uppercase tracking-widest transition-all relative py-2 ${
                isActive(item.path) ? 'text-primary' : 'text-white/50 hover:text-white'
              }`}
            >
              {item.name}
              {isActive(item.path) && (
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full shadow-glow" />
              )}
            </Link>
          ))}
        </nav>

        <button 
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white hover:bg-primary transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>

      <div className={`fixed inset-0 z-[60] bg-black/95 backdrop-blur-3xl transition-all duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} md:hidden`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/7/75/HC_Ko%C5%A1ice_logo.svg/1044px-HC_Ko%C5%A1ice_logo.svg.png" 
                alt="HC Košice" 
                className="h-14 w-auto"
              />
              <span className="font-sports font-black text-3xl tracking-tighter">HC KOŠICE</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-primary transition-colors">
              <X size={32} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-6 font-sports text-5xl uppercase tracking-tighter transition-all ${
                  isActive(item.path) ? 'text-primary translate-x-4' : 'text-white/40'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="flex-grow pt-20">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-white/5 flex items-center justify-around h-20 z-40 px-4 shadow-nav">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all relative ${
                active ? 'text-primary' : 'text-white/30'
              }`}
            >
              {active && (
                <div className="absolute top-0 w-12 h-1 bg-primary rounded-full shadow-glow" />
              )}
              <div className={`${active ? 'scale-110 -translate-y-1' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[9px] uppercase font-black tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
