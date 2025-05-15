import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Trophy } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center">
              <Trophy className="h-8 w-8 text-[#004c93]" />
              <span className="ml-2 text-xl font-bold text-[#004c93]">IPL T20 Dashboard</span>
            </NavLink>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#004c93] hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/points-table" 
              className={({isActive}) => 
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Points Table
            </NavLink>
            <NavLink 
              to="/schedule" 
              className={({isActive}) => 
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Schedule
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <NavLink 
            to="/" 
            onClick={() => setIsMenuOpen(false)}
            className={({isActive}) => 
              isActive 
                ? "block pl-3 pr-4 py-2 border-l-4 border-[#004c93] text-[#004c93] bg-blue-50 font-medium" 
                : "block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-[#004c93]"
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/points-table" 
            onClick={() => setIsMenuOpen(false)}
            className={({isActive}) => 
              isActive 
                ? "block pl-3 pr-4 py-2 border-l-4 border-[#004c93] text-[#004c93] bg-blue-50 font-medium" 
                : "block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-[#004c93]"
            }
          >
            Points Table
          </NavLink>
          <NavLink 
            to="/schedule" 
            onClick={() => setIsMenuOpen(false)}
            className={({isActive}) => 
              isActive 
                ? "block pl-3 pr-4 py-2 border-l-4 border-[#004c93] text-[#004c93] bg-blue-50 font-medium" 
                : "block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-[#004c93]"
            }
          >
            Schedule
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;