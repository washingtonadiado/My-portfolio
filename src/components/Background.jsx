import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
    const blobRefs = useRef([])
    const canvasRef = useRef(null)
    const starsRef = useRef([])
    const animationFrameId = useRef(null)
    const initialPositions = [
        { x: -4, y: 0 },
        { x: -4, y: 0 },
        { x: 20, y: -8 },
        { x: 20, y: -8 },
    ]

    // Star background animation
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        
        const initStars = () => {
            starsRef.current = []
            const numberOfStars = window.innerWidth < 768 ? 50 : 100
            for (let i = 0; i < numberOfStars; i++) {
                starsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    opacity: Math.random(),
                    velocity: Math.random() * 0.02
                })
            }
        }

        const animate = () => {
            ctx.fillStyle = "#0f172a" // Match the dark background color
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            starsRef.current.forEach(star => {
                star.opacity += star.velocity
                if (star.opacity > 1 || star.opacity < 0) {
                    star.velocity = -star.velocity
                }
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
                ctx.fill()
            })
            
            animationFrameId.current = requestAnimationFrame(animate)
        }

        // Initial setup
        resizeCanvas()
        initStars()
        animate()

        // Handle window resize
        const handleResize = () => {
            resizeCanvas()
            initStars()
        }
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            cancelAnimationFrame(animationFrameId.current)
        }
    }, [])

    // Blob scroll animation
    useEffect(() => {
        let currentScroll = 0
        let requestId

        const handleScroll = () => {
            const newScroll = window.pageYOffset
            const scrollDelta = newScroll - currentScroll
            currentScroll = newScroll

            blobRefs.current.forEach((blob, index) => {
                const initialPos = initialPositions[index]
                const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340
                const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40
                const x = initialPos.x + xOffset
                const y = initialPos.y + yOffset

                blob.style.transform = `translate(${x}px, ${y}px)`
                blob.style.transition = "transform 1.4s ease-out"
            })

            requestId = requestAnimationFrame(handleScroll)
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
            cancelAnimationFrame(requestId)
        }
    }, [])

    return (
        <div className="fixed inset-0">
            <canvas ref={canvasRef} className="fixed inset-0" />
            <div className="absolute inset-0">
                <div
                    ref={ref => (blobRefs.current[0] = ref)}
                    className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20"
                />
                <div
                    ref={ref => (blobRefs.current[1] = ref)}
                    className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 hidden sm:block"
                />
                <div
                    ref={ref => (blobRefs.current[2] = ref)}
                    className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20"
                />
                <div
                    ref={ref => (blobRefs.current[3] = ref)}
                    className="absolute -bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 md:opacity-10 hidden sm:block"
                />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
    )
}

export default AnimatedBackground
