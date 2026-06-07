'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';
import HeaderSearch from './HeaderSearch';
import CartDrawer from '@/components/features/cart/CartDrawer';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
  };

  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
    window.location.href = '/';
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const isSuperAdmin = user?.role === 'superadmin';
  const isStaff = user?.role === 'staff';
  const isAdminUser = isSuperAdmin || isStaff;

  const navItems = [
    { name: 'Solar Panels', href: '/products?category=solar-panels' },
    { name: 'Inverters', href: '/products?category=inverters' },
    { name: 'Batteries', href: '/products?category=batteries' },
    { name: 'ESS', href: '/products?category=ess' },
    { name: 'Street Light', href: '/products?category=street-light' },
    { name: 'Accessories', href: '/products?category=accessories' },
    { name: 'Installation', href: '/products?category=installation' }
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      {!isAdminUser && (
        <div className="bg-gradient-to-r from-[#1a2a8a] to-[#40b553] text-white py-2 px-4 text-sm font-medium text-center">
          <div className="max-w-7xl mx-auto flex justify-center items-center">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="mr-2">📞</span>
                <span>080 3366 6041 ⚡24/7 Solar Support</span>
              </span>
              <span className="hidden md:inline"></span>
              <span className="hidden md:inline flex items-center">
                <span className="mr-2"></span>
                <span></span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg'
          : 'bg-white dark:bg-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="https://res.cloudinary.com/djkudkxmx/image/upload/v1779180201/energy_store_2_ajl0so.png"
                alt="Power Afric Store"
                className="h-7 sm:h-8"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#1a2a8a] dark:hover:text-green-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              {isAdminUser && (
                <Link
                  href={isSuperAdmin ? "/admin/dashboard" : isStaff ? "/staff/dashboard" : "/admin/dashboard"}
                  className="ml-2 px-3 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                >
                  {isSuperAdmin ? 'ADMIN' : 'DASHBOARD'}
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <HeaderSearch />
              
              {/* Theme Toggle - Desktop ONLY (visible on md and up) */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              
              {!isAdminUser && (
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#1a2a8a] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Profile - Account Toggle */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleAccountDropdown} 
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#1a2a8a] to-[#40b553] text-white font-semibold text-sm hover:scale-105 transition-transform"
                >
                  {isAuthenticated && user ? (
                    getUserInitials() || <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      {isAuthenticated && user ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1a2a8a] to-[#40b553] flex items-center justify-center text-white font-bold">
                            {getUserInitials()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 dark:text-white">Welcome</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Sign in to your account</div>
                        </div>
                      )}
                    </div>
                    <div className="p-1">
                      {isAuthenticated ? (
                        <>
                          <Link href="/account" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={() => setIsAccountDropdownOpen(false)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <span>My Account</span>
                          </Link>
                          <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            <span>Logout</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={handleLoginClick} className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                            <span>Sign In</span>
                          </button>
                          <button onClick={handleRegisterClick} className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                            <span>Create Account</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu - Theme toggle appears here on mobile */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                {/* Theme Toggle in Mobile Menu */}
                <div className="px-3 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark/Light Mode</span>
                  <ThemeToggle />
                </div>
                
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#1a2a8a] dark:hover:text-green-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                {isAdminUser && (
                  <Link
                    href={isSuperAdmin ? "/admin/dashboard" : isStaff ? "/staff/dashboard" : "/admin/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block mt-2 px-3 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    {isSuperAdmin ? 'ADMIN DASHBOARD' : 'ADMIN DASHBOARD'}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={closeAllModals} onSwitchToRegister={switchToRegister} />
      <RegisterModal isOpen={isRegisterOpen} onClose={closeAllModals} onSwitchToLogin={switchToLogin} />
    </>
  );
};

export default Header;
