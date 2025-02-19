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
      const offsetMargin = isMobile ? 64 : 100;

      if (Date.now() - lastManualScroll.current < 600) return;

      const sections = navItems
        .map((item) => {
          const section = document.querySelector(item.href);
          return section
            ? {
                id: item.href.slice(1),
                offset: section.offsetTop - offsetMargin,
                height: section.offsetHeight,
              }
            : null;
        })
        .filter(Boolean);

      const currentScroll = window.scrollY;
      const active = sections.find(
        (s) => currentScroll >= s.offset && currentScroll < s.offset + s.height
      );
      if (active) {
        setActiveSection(active.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems, isMobile]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

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

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const sectionId = href.slice(1);
    setActiveSection(sectionId);
    lastManualScroll.current = Date.now();

    const section = document.querySelector(href);
    if (section) {
      const offsetMargin = isMobile ? 64 : 100;
      window.scrollTo({
        top: section.offsetTop - offsetMargin,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  // Always use solid background regardless of section
  const navBgClass = "bg-[#030014]";

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${navBgClass} ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
        <div className="flex items-center justify-between h-16">
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

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-[#030014]/95 backdrop-blur-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-[#e2d3fd] hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`text-2xl font-medium px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#1a1a2e] text-white"
                      : "text-[#e2d3fd] hover:bg-[#1a1a2e]/50"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
