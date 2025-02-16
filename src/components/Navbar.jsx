import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const lastManualScroll = useRef(0);

  const navItems = [
    { href: "#Home", label: "Home" },
    { href: "#About", label: "About" },
    { href: "#Portfolio", label: "Portfolio" },
    { href: "#Contact", label: "Contact" },
  ];

  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (Date.now() - lastManualScroll.current < 300) return;

      const sections = navItems
        .map((item) => {
          const section = document.querySelector(item.href);
          return section
            ? {
                id: item.href.slice(1),
                offset: section.offsetTop - 100,
                height: section.offsetHeight,
              }
            : null;
        })
        .filter(Boolean);

      const currentScroll = window.scrollY;
      const active = sections.find(
        (s) => currentScroll >= s.offset && currentScroll < s.offset + s.height
      );
      if (active) setActiveSection(active.id);
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  // Listen for window resize events to detect mobile vs. desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smooth scroll to section and close mobile menu
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const sectionId = href.slice(1);
    setActiveSection(sectionId);
    lastManualScroll.current = Date.now();

    const section = document.querySelector(href);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  const navBgClass = isOpen || isMobile ? "bg-[#030014]" : "bg-[#030014]/90";

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${navBgClass} ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#Home"
            onClick={(e) => scrollToSection(e, "#Home")}
            className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent"
          >
            ADIADO.
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="group relative px-1 py-2 text-sm font-medium"
                  >
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                          : "text-[#e2d3fd] group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#e2d3fd] hover:text-white transition-transform"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-[#030014] transition-transform duration-300 transform translate-y-0">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`block px-4 py-3 text-lg font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
                      : "text-[#e2d3fd] hover:text-white"
                  }`}   
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
