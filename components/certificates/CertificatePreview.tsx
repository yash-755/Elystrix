"use client";

import React, { useEffect, useRef, useState } from "react";
import { CertificateRenderer, CertificateRendererProps } from "./CertificateRenderer";

/**
 * A responsive wrapper that visually scales the certificate to fit the container width
 * while preserving the native 4096x2728 aspect ratio.
 */
export function CertificatePreview(props: CertificateRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const calculateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                // Native width is 4096px
                const newScale = containerWidth / 4096;
                setScale(newScale);
            }
        };

        // Initial calculation
        calculateScale();

        // Recalculate on resize
        window.addEventListener("resize", calculateScale);
        return () => window.removeEventListener("resize", calculateScale);
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full relative overflow-hidden bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
            style={{
                // Maintain Native Aspect Ratio for the container height
                aspectRatio: "4096 / 2728"
            }}
        >
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4096px",     // Force Native Width
                    height: "2728px",    // Force Native Height
                    pointerEvents: "none" // Prevent interaction issues during scale
                }}
            >
                <CertificateRenderer {...props} />
            </div>
        </div>
    );
}
