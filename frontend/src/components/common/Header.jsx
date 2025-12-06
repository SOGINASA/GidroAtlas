import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Menu, X, LogIn, Home } from 'lucide-react';
import { useAuthStatus } from '../api/AuthUtils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStatus({ withUser: true });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '#about', label: 'О системе' },
    { href: '#features', label: 'Возможности' },
    { href: '#roles', label: 'Для кого' },
    { href: '#contact', label: 'Контакты' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0a4275]/95 backdrop-blur-lg shadow-2xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Droplets className="w-7 h-7 text-white animate-pulse" strokeWidth={2.5} />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                  GidroAtlas
                </h1>
                <p className="text-xs text-cyan-300 opacity-90">Гидроатлас Казахстана</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="relative px-4 py-2 text-white/90 hover:text-white transition-colors duration-300 group"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(link.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
                </a>
              ))}
            </nav>

            {/* Right Section: Login / Dashboard Button */}
            <div className="flex items-center space-x-3">
              {/* If authenticated, show dashboard button; otherwise show login */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    // Map user role to dashboard route
                    const role = user?.role || user?.user_type || '';
                    let route = '/';
                    if (role === 'expert') route = '/expert/dashboard';
                    else if (role === 'emergency' || role === 'mchs') route = '/emergency/control-center';
                    else if (role === 'admin') route = '/admin/overview';
                    else route = '/';
                    navigate(route);
                  }}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-white text-[#0a4275] rounded-lg font-semibold hover:bg-cyan-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Перейти в дашборд</span>
                </button>
              ) : (
                <Link
                  to="/login?role=expert"
                  className="flex items-center space-x-2 px-5 py-2.5 bg-white text-[#0a4275] rounded-lg font-semibold hover:bg-cyan-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Войти</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-20 left-0 right-0 bg-[#0a4275]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="container mx-auto px-4 py-6">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block py-3 px-4 text-white hover:bg-white/10 rounded-lg transition-all duration-300 mb-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    const element = document.querySelector(link.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
      
    </>
  );
};

export default Header;