import React, { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const blobRefs = useRef([]);
  const canvasRef = useRef(null);
  const initialPositions = [
    { x: -4, y: 0 },
    { x: -4, y: 0 },
    { x: 20, y: -8 },
    { x: 20, y: -8 },
  ];

  // Blob animation effect (scroll based)
  useEffect(() => {
    let scrollAnimationId;
    const handleScroll = () => {
      const scrollPos = window.pageYOffset;
      blobRefs.current.forEach((blob, index) => {
        if (!blob) return;
        const initialPos = initialPositions[index];
        // Calculate offsets for smooth sinusoidal movement
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
    // Trigger initial positioning
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(scrollAnimationId);
    };
  }, []);

  // Starfield animation effect (constant motion)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let stars = [];
    const numStars = 150;
    let starAnimationId;

    // Set canvas to cover full viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize stars with random properties and drift velocities
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.3, // slight horizontal drift
        speedY: Math.random() * 0.5 + 0.2,     // downward drift
        opacity: Math.random(),
        opacitySpeed: (Math.random() - 0.5) * 0.005, // for twinkling
      });
    }

    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        // Update position
        star.x += star.speedX;
        star.y += star.speedY;
        // Update opacity for twinkle effect
        star.opacity += star.opacitySpeed;
        if (star.opacity < 0.1 || star.opacity > 1) {
          star.opacitySpeed = -star.opacitySpeed;
        }
        // Wrap horizontally
        if (star.x < 0) star.x = canvas.width;
        else if (star.x > canvas.width) star.x = 0;
        // Wrap vertically
        if (star.y > canvas.height) star.y = 0;
        // Draw the star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
      starAnimationId = requestAnimationFrame(animateStars);
    };

    animateStars();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(starAnimationId);
    };
  }, []);

  return (
    <div className="fixed inset-0">
      {/* Starfield background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: "#000" }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,79,79,0.0625)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,79,79,0.0625)_1px,transparent_1px)] bg-[size:24px_24px] z-10"
      ></div>
      {/* Blob container */}
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
    </div>
  );
};

export default AnimatedBackground;


