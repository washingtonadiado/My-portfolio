import React, { useEffect, useRef, useState } from "react";

const AnimatedBackground = () => {
	const blobRefs = useRef([]);
	const initialPositions = [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	];
	const [stars, setStars] = useState([]);

	useEffect(() => {
		let currentScroll = 0;
		let requestId;

		const handleScroll = () => {
			const newScroll = window.pageYOffset;
			const scrollDelta = newScroll - currentScroll;
			currentScroll = newScroll;

			blobRefs.current.forEach((blob, index) => {
				const initialPos = initialPositions[index];

				// Calculating movement in both X and Y direction
				const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340; // Horizontal movement
				const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40; // Vertical movement

				const x = initialPos.x + xOffset;
				const y = initialPos.y + yOffset;

				// Apply transformation with smooth transition
				blob.style.transform = `translate(${x}px, ${y}px)`;
				blob.style.transition = "transform 1.4s ease-out";
			});

			requestId = requestAnimationFrame(handleScroll);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			cancelAnimationFrame(requestId);
		};
	}, []);

	const generateRandomStarPositions = () => {
		const starsArray = [];
		for (let i = 0; i < 100; i++) {
			starsArray.push({
				id: i,
				left: Math.random() * 100, // Random left position
				top: Math.random() * 100, // Random top position
				size: Math.random() * 2 + 1, // Random size for stars
				animationDelay: Math.random() * 10 + "s", // Random animation delay
			});
		}
		setStars(starsArray);
	};

	useEffect(() => {
		// Generate random stars when the component mounts
		generateRandomStarPositions();

		const interval = setInterval(() => {
			// Re-generate star positions at intervals for continuous random movement
			generateRandomStarPositions();
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const renderStars = () => {
		return stars.map((star) => (
			<div
				key={star.id}
				className="absolute rounded-full bg-white opacity-50"
				style={{
					left: `${star.left}vw`,
					top: `${star.top}vh`,
					width: `${star.size}px`,
					height: `${star.size}px`,
					animation: `moveStar 5s linear infinite ${star.animationDelay}`,
				}}
			/>
		));
	};

	return (
		<div className="fixed inset-0 overflow-hidden">
			<div className="absolute inset-0">
				{renderStars()}
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
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
		</div>
	);
};

export default AnimatedBackground;

