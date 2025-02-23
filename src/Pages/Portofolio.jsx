import React, { useEffect, useState, useCallback } from "react"; 
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";

const integratedCSS = `
.scroll-container {
  width: 100%;
  background: #07182E;
  position: relative;
  border-radius: 20px;
  padding: 2rem;
  isolation: isolate;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  min-height: 400px;
}

.scroll-container::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 150%;
  background: linear-gradient(
    45deg,
    #00b7ff,
    #ff30ff,
    #00b7ff
  );
  background-size: 200% 200%;
  animation: rotBGimg 4s linear infinite;
  top: -25%;
  left: -25%;
  border-radius: 20px;
  z-index: 1;
}

@keyframes rotBGimg {
  0% {
    transform: rotate(0deg);
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    transform: rotate(360deg);
    background-position: 0% 50%;
  }
}

.scroll-container::after {
  content: '';
  position: absolute;
  background: #07182E;
  inset: 2px;
  border-radius: 18px;
  z-index: 2;
}

.scroll-content {
  position: relative;
  z-index: 3;
  height: 100%;
  width: 100%;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
  place-items: center;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}
`;

const useInjectCSS = (css) => {
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.appendChild(document.createTextNode(css));
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, [css]);
};

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 text-slate-200 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 backdrop-blur-sm group"
  >
    {isShowingMore ? "Show Less" : "Show More"}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-300 ${
        isShowingMore ? "rotate-180" : ""
      }`}
    >
      <path d="M6 9l6 6 6-6"/>
    </svg>
  </button>
);

// Keep TabPanel and a11yProps functions same as before

export default function FullWidthTabs() {
  // Keep state and data fetching logic same as before

  return (
    <div className="md:px-[10%] px-[5%] w-full bg-[#030014] py-16" id="Portfolio">
      <div className="text-center pb-12" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Portfolio Showcase
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
          Curated collection of professional achievements and technical expertise
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            borderRadius: "16px",
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            mb: 4
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                fontSize: "1rem",
                fontWeight: "500",
                color: "#94a3b8",
                py: 2.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#fff",
                  background: "rgba(139, 92, 246, 0.1)"
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))"
                }
              }
            }}
          >
            <Tab icon={<Code className="w-5 h-5" />} label="Projects" {...a11yProps(0)} />
            <Tab icon={<Award className="w-5 h-5" />} label="Certificates" {...a11yProps(1)} />
            <Tab icon={<Boxes className="w-5 h-5" />} label="Tech Stack" {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value}>
          <TabPanel value={value} index={0}>
            <div className="scroll-container">
              <div className="scroll-content">
                <div className="projects-grid">
                  {displayedProjects.map((project, index) => (
                    <CardProject
                      key={project.id}
                      {...project}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    />
                  ))}
                </div>
                {projects.length > initialItems && (
                  <div className="flex justify-center mt-8">
                    <ToggleButton onClick={() => toggleShowMore("projects")} isShowingMore={showAllProjects} />
                  </div>
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div className="scroll-container">
              <div className="scroll-content">
                <div className="certificates-grid">
                  {displayedCertificates.map((certificate, index) => (
                    <Certificate
                      key={index}
                      {...certificate}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    />
                  ))}
                </div>
                {certificates.length > initialItems && (
                  <div className="flex justify-center mt-8">
                    <ToggleButton onClick={() => toggleShowMore("certificates")} isShowingMore={showAllCertificates} />
                  </div>
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <div className="scroll-container">
              <div className="scroll-content">
                <div className="tech-grid">
                  {techStacks.map((stack, index) => (
                    <TechStackIcon
                      key={index}
                      {...stack}
                      data-aos="zoom-in"
                      data-aos-delay={index * 50}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
