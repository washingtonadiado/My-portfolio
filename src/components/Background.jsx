"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random";
// Removed the TypeScript-specific import since we're in a .jsx file
// import { Points as PointsType } from "three";

const StarBackground = (props) => {
  const ref = useRef(null);
  // Generate a sphere of stars
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        stride={3}
        positions={new Float32Array(sphere)}
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => (
  <div className="w-full h-full fixed inset-0 -z-10">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </div>
);

const AnimatedBlobs = () => {
  const blobRefs = useRef([]);
  const initialPositions = [
    { x: -4, y: 0 },
    { x: -4, y: 0 },
    { x: 20, y: -8 },
    { x: 20, y: -8 },
  ];

  useEffect(() => {
    let scrollAnimationId;
    const handleScroll = () => {
      const scrollPos = window.pageYOffset;
      blobRefs.current.forEach((blob, index) => {
        if (!blob) return;
        const initialPos = initialPositions[index];
        // Sinusoidal offsets for fluid motion
        const xOffset = Math.sin(scrollPos / 100 + index * 0.5) * 340;
        const yOffset = Math.cos(scrollPos / 100 + index * 0.5) * 40;
        const x = initialPos.x + xOffset;
        const y = initialPos.y + yOffset;
        blob.style.transform = `translate(${x}px, ${y}px)`;
        blob.style.transition = "transform 1.4s ease-out";
      });
      scrollAnimationId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    // Initialize positions in case there's an initial scroll offset
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(scrollAnimationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-20">
      <div
        ref={(ref) => (blobRefs.current[0] = ref)}
        className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-purple-500 rounded-full filter blur-[128px] opacity-40 md:opacity-20"
      ></div>
      <div
        ref={(ref) => (blobRefs.current[1] = ref)}
        className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[128px] opacity-40 md:opacity-20 hidden sm:block"
      ></div>
      <div
        ref={(ref) => (blobRefs.current[2] = ref)}
        className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-40 md:opacity-20"
      ></div>
      <div
        ref={(ref) => (blobRefs.current[3] = ref)}
        className="absolute -bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-20 md:opacity-10 hidden sm:block"
      ></div>
    </div>
  );
};

const GridOverlay = () => (
  <div
    className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(79,79,79,0.0625)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,79,79,0.0625)_1px,transparent_1px)] bg-[size:24px_24px]"
  ></div>
);

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0">
      {/* 3D Star Background */}
      <StarsCanvas />
      {/* Grid Overlay */}
      <GridOverlay />
      {/* Blob Animations */}
      <AnimatedBlobs />
    </div>
  );
};

export default AnimatedBackground;
