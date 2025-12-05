import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  ArrowUp,
  Heart
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'О системе', href: '#about' },
    { label: 'Возможности', href: '#features' },
    { label: 'Для кого', href: '#roles' },
    { label: 'Контакты', href: '#contact' }
  ];

  const userRoles = [
    { label: 'Гость', href: '/guest/map' },
    { label: 'Эксперт', href: '/login?role=expert' },
    { label: 'МЧС', href: '/login?role=emergency' },
    { label: 'Администратор', href: '/login?role=admin' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#0a4275] via-[#083a66] to-[#062f54] pt-16 pb-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center space-x-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Droplets className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xl font-bold text-white">GidroAtlas KZ</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Современная система мониторинга и управления водными ресурсами Казахстана.
              Интегрированная платформа с AI-прогнозированием и системой приоритизации.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 bg-white/10 hover:bg-cyan-500/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 transform group"
                >
                  <social.icon className="w-4 h-4 text-white/70 group-hover:text-cyan-300 transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <div className="w-1 h-5 bg-cyan-400 rounded-full mr-2" />
              Навигация
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-cyan-300 text-sm transition-all duration-300 flex items-center group"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="w-0 h-0.5 bg-cyan-400 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <div className="w-1 h-5 bg-cyan-400 rounded-full mr-2" />
              Доступ к системе
            </h4>
            <ul className="space-y-2">
              {userRoles.map((role, index) => (
                <li key={index}>
                  <Link
                    to={role.href}
                    className="text-white/70 hover:text-cyan-300 text-sm transition-all duration-300 flex items-center group"
                  >
                    <div className="w-0 h-0.5 bg-cyan-400 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {role.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <div className="w-1 h-5 bg-cyan-400 rounded-full mr-2" />
              Контакты
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-white/70 text-sm group">
                <MapPin className="w-4 h-4 mt-0.5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:text-white transition-colors duration-300">
                  г. Астана, Казахстан
                </span>
              </li>
              <li className="flex items-start space-x-3 text-white/70 text-sm group">
                <Mail className="w-4 h-4 mt-0.5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="mailto:info@gidroatlas.kz"
                  className="group-hover:text-cyan-300 transition-colors duration-300"
                >
                  info@gidroatlas.kz
                </a>
              </li>
              <li className="flex items-start space-x-3 text-white/70 text-sm group">
                <Phone className="w-4 h-4 mt-0.5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="tel:+77000000000"
                  className="group-hover:text-cyan-300 transition-colors duration-300"
                >
                  +7 (700) 000-00-00
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-white/50 text-sm text-center md:text-left">
            <p className="flex items-center justify-center md:justify-start">
              © 2024 GidroAtlas Kazakhstan. Все права защищены.
            </p>
            <p className="flex items-center justify-center md:justify-start mt-1">
              Сделано с <Heart className="w-3 h-3 mx-1 text-red-400 fill-current animate-pulse" /> для
              Казахстана
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-6 text-sm">
            <a
              href="#"
              className="text-white/50 hover:text-cyan-300 transition-colors duration-300"
            >
              Политика конфиденциальности
            </a>
            <a
              href="#"
              className="text-white/50 hover:text-cyan-300 transition-colors duration-300"
            >
              Условия использования
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 transform group z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-white group-hover:animate-bounce" />
      </button>
    </footer>
  );
};

export default Footer;