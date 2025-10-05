"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { Menu, LayoutDashboard, Sparkles, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserDropdown } from "@/components/ui/UserDropdown";
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, login } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = async () => {
    if (user) {
      router.push('/dashboard');
    } else {
      try {
        login();
      } catch (error) {
        console.error('Authentication failed:', error);
        alert('Authentication failed. Please try again.');
      }
    }
  };

  const navItems = [];

  // Only show Features on landing page
  if (pathname === '/') {
    navItems.push({ 
      name: "Features", 
      href: "#features", 
      onClick: () => scrollToSection('features') 
    });
  }

  // Show dashboard links when authenticated and not on dashboard
  if (user && pathname !== '/dashboard') {
    navItems.unshift({
      name: "Dashboard",
      href: "/dashboard",
      onClick: () => router.push('/dashboard')
    });
  }

  // Add Playground and Projects links when authenticated
  if (user) {
    if (pathname !== '/playground') {
      navItems.push({
        name: "Playground",
        href: "/playground",
        onClick: () => router.push('/playground')
      });
    }
    if (pathname !== '/projects') {
      navItems.push({
        name: "Projects",
        href: "/projects",
        onClick: () => router.push('/projects')
      });
    }
  }

  return (
    <header
      className={`fixed top-3.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full ${
        isScrolled 
          ? "h-14 bg-black/40 backdrop-blur-xl border border-white/10 scale-95 w-[90%] max-w-2xl" 
          : "h-14 bg-black/60 backdrop-blur-md border border-white/10 w-[95%] max-w-3xl"
      }`}
    >
      <div className="mx-auto h-full px-6">
        <nav className="flex items-center justify-between h-full">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push(user ? '/dashboard' : '/')}
          >
            <Image 
              src="/logo.png" 
              alt="IvyAI Logo" 
              width={28} 
              height={28}
              className="w-7 h-7"
            />
            <span className="font-bold text-base bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">IvyAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.onClick) {
                    item.onClick();
                  }
                }}
                className="text-sm text-gray-300 hover:text-white transition-all duration-300"
              >
                {item.name}
              </a>
            ))}
            
            {pathname !== '/' && <ThemeToggle />}
            
            {user ? (
              <UserDropdown />
            ) : (
              <Button 
                onClick={handleGetStarted}
                size="sm"
                className="button-gradient"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="glass h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-black/95 backdrop-blur-xl border-l border-white/10">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        if (item.onClick) {
                          item.onClick();
                        }
                      }}
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  {pathname !== '/' && (
                    <div className="flex items-center gap-2 py-2">
                      <span className="text-sm text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                  )}
                  
                  {user ? (
                    <div className="mt-4">
                      <UserDropdown />
                    </div>
                  ) : (
                    <Button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleGetStarted();
                      }}
                      className="button-gradient mt-4"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}