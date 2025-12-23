import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            // Direct positioning for immediate cursor
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }

            // Delayed positioning for follower
            if (followerRef.current) {
                // We use a timeout to maintain the "lag" effect smoothly or requestAnimationFrame
                // But for simple CSS transition based lag:
                followerRef.current.animate({
                    transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
                }, {
                    duration: 500,
                    fill: 'forwards'
                });
            }
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a') || e.target.getAttribute('role') === 'button') {
                setHovered(true);
            } else {
                setHovered(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
                style={{ pointerEvents: 'none' }}
            ></div>
            <div
                ref={followerRef}
                className={`fixed top-0 left-0 w-8 h-8 border border-white rounded-full mix-blend-difference pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out hidden md:block ${hovered ? 'scale-150 bg-white/20' : 'scale-100'
                    }`}
            ></div>
        </>
    );
};

export default CustomCursor;
