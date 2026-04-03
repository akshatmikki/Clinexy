import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Activity, ArrowRight } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { Button } from './Button';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-9'
        : 'bg-white/80 backdrop-blur-sm border-b border-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group relative z-50">
            <div className="bg-gradient-to-tr from-primary-600 to-primary-500 text-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-primary-700 transition-colors">Clinexy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              item.path ? (
                <Link
                  key={item.label}
                  to={item.path}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-all"
                >
                  {item.label}
                </Link>
              ) : (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all ${activeDropdown === item.label
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                      }`}
                  >
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 w-[600px] pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform -translate-y-2 group-hover:translate-y-0 z-40`}
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 overflow-hidden relative">
                      {/* Decorative background blob */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>

                      <div className="grid grid-cols-2 gap-8 relative z-10">
                        {item.sections && Object.entries(item.sections).map(([sectionName, items]) => (
                          <div key={sectionName}>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                              {sectionName}
                              <div className="h-px bg-slate-100 flex-1"></div>
                            </h4>
                            <ul className="space-y-2">
                              {items.map((subItem) => (
                                <li key={subItem.path}>
                                  <Link to={subItem.path} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="mt-0.5 p-1.5 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                      {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                    </div>
                                    <div>
                                      <div className="text-sm font-semibold text-slate-900 group-hover:text-primary-700 transition-colors flex items-center gap-1">
                                        {subItem.title}
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                      </div>
                                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{subItem.metaDescription}</div>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="https://rishabhkumar.clinexy.com/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
              Log in
            </a>
            <a href="https://rishabhkumar.clinexy.com/signup">
              <Button size="sm" className="rounded-lg px-6 shadow-primary-500/20">Start Free Trial</Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[calc(100%_+_1px)] left-0 w-full bg-white border-b border-slate-200 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="p-4 space-y-6">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                {item.path ? (
                  <Link
                    to={item.path}
                    className="block font-bold text-lg text-slate-900 hover:text-primary-600 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div className="font-bold text-lg text-slate-900 mb-3">{item.label}</div>
                    <div className="pl-2 space-y-6">
                      {item.sections && Object.entries(item.sections).map(([sectionName, items]) => (
                        <div key={sectionName}>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{sectionName}</div>
                          <div className="grid gap-3">
                            {items.map(subItem => (
                              <Link key={subItem.path} to={subItem.path} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50" onClick={() => setIsMobileMenuOpen(false)}>
                                {subItem.icon && <subItem.icon className="h-4 w-4 text-slate-500" />}
                                <span className="text-sm font-medium text-slate-700">{subItem.title}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <a href="https://rishabhkumar.clinexy.com/login" className="w-full text-center py-3 font-medium text-slate-600 bg-slate-100 rounded-xl">
                Log in
              </a>
              <a href="https://rishabhkumar.clinexy.com/signup">
                <Button className="w-full rounded-xl py-3">Start Free Trial</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};