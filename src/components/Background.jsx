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

  // Blob scroll animation effect
  useEffect(() => {
    let currentScroll = 0;
    let scrollAnimationId;

    const handleScroll = () => {
      const newScroll = window.pageYOffset;
      currentScroll = newScroll;

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return;
        const initialPos = initialPositions[index];

        // Calculate movement using sine/cosine for fluid motion
        const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340;
        const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40;
        const x = initialPos.x + xOffset;
        const y = initialPos.y + yOffset;

        blob.style.transform = `translate(${x}px, ${y}px)`;
        blob.style.transition = "transform 1.4s ease-out";
      });

      scrollAnimationId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    // Kick off the animation in case there’s an initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(scrollAnimationId);
    };
  }, []);

  // Starfield animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let stars = [];
    const numStars = 100;
    let starAnimationId;

    // Function to resize the canvas to fill the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize stars with random positions, sizes, and speeds
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.2,
      });
    }

    // Animation loop to update and render stars continuously
    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.y += star.speed;
        // Wrap star to the top if it moves off the bottom
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
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
      {/* Blobs container */}
      <div className="absolute inset-0">
        <div
          ref={(ref) => (blobRefs.current[0] = ref)}
          className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[1] = ref)}
          className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 hidden sm:block"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[2] = ref)}
          className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[3] = ref)}
          className="absolute -bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 md:opacity-10 hidden sm:block"
        ></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;

