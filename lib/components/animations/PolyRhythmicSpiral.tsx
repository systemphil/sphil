"use client";

import { useEffect } from "react";
import "./spiral.css";

type ArcObject = {
    color: string;
    velocity: number;
    lastImpactTime: number;
    nextImpactTime: number;
};

type Center = {
    x: number;
    y: number;
};

type Base = {
    initialRadius?: number;
    circleRadius?: number;
    clearance?: number;
    spacing?: number;
    length: number;
    minAngle: number;
    startAngle: number;
    maxAngle: number;
};

const COLORS = [
    "#D0E7F5",
    "#D9E7F4",
    "#D6E3F4",
    "#BCDFF5",
    "#B7D9F4",
    "#C3D4F0",
    "#9DC1F3",
    "#9AA9F4",
    "#8D83EF",
    "#AE69F0",
    "#D46FF1",
    "#DB5AE7",
    "#D911DA",
    "#D601CB",
    "#E713BF",
    "#F24CAE",
    "#FB79AB",
    "#FFB6C1",
    "#FED2CF",
    "#FDDFD5",
    "#FEDCD1",
];

/**
 * Modified based on HyperPlexed's work. Many thanks to
 * him for sharing and making it publicly available.
 * @link https://codepen.io/Hyperplexed/pen/XWxqgGE
 * @cool https://unsplash.com/photos/tZCrFpSNiIQ
 */
export const PolyRhythmicSpiral = () => {
    useEffect(() => {
        const paper = document.getElementById("paper") as HTMLCanvasElement;
        if (!paper) return;
        const pen = paper.getContext("2d");

        const settings = {
            startTime: Date.now(), // This can be in the future
            duration: 900, // Total time for all dots to realign at the starting point
            maxCycles: Math.max(COLORS.length, 100), // Must be above colors.length or else...
            soundEnabled: false, // User still must interact with screen first
            pulseEnabled: true, // Pulse will only show if sound is enabled as well
            instrument: "vibraphone", // "default" | "wave" | "vibraphone"
        };

        let arcs: ArcObject[] = [];

        const calculateVelocity = (index: number) => {
            const numberOfCycles = settings.maxCycles - index,
                distancePerCycle = 2 * Math.PI;

            return (numberOfCycles * distancePerCycle) / settings.duration;
        };

        const calculateNextImpactTime = (
            currentImpactTime: number,
            velocity: number
        ) => {
            return currentImpactTime + (Math.PI / velocity) * 1000;
        };

        const calculateDynamicOpacity = (
            currentTime: number,
            lastImpactTime: number,
            baseOpacity: number,
            maxOpacity: number,
            duration: number
        ) => {
            const timeSinceImpact = currentTime - lastImpactTime,
                percentage = Math.min(timeSinceImpact / duration, 1),
                opacityDelta = maxOpacity - baseOpacity;

            return maxOpacity - opacityDelta * percentage;
        };

        const determineOpacity = (
            currentTime: number,
            lastImpactTime: number,
            baseOpacity: number,
            maxOpacity: number,
            duration: number
        ) => {
            if (!settings.pulseEnabled) return baseOpacity;

            return calculateDynamicOpacity(
                currentTime,
                lastImpactTime,
                baseOpacity,
                maxOpacity,
                duration
            );
        };

        const calculatePositionOnArc = (
            center: Center,
            radius: number,
            angle: number
        ) => ({
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle),
        });

        const init = () => {
            if (!pen) return;
            pen.lineCap = "round";

            arcs = COLORS.map((color, index) => {
                const velocity = calculateVelocity(index),
                    lastImpactTime = 0,
                    nextImpactTime = calculateNextImpactTime(
                        settings.startTime,
                        velocity
                    );

                return {
                    color,
                    velocity,
                    lastImpactTime,
                    nextImpactTime,
                };
            });
        };

        const drawArc = (
            x: number,
            y: number,
            radius: number,
            start: number,
            end: number,
            action = "stroke"
        ) => {
            if (!pen) return;
            pen.beginPath();

            pen.arc(x, y, radius, start, end);

            if (action === "stroke") pen.stroke();
            else pen.fill();
        };

        const drawPointOnArc = (
            center: Center,
            arcRadius: number,
            pointRadius: number,
            angle: number
        ) => {
            const position = calculatePositionOnArc(center, arcRadius, angle);

            drawArc(
                position.x,
                position.y,
                pointRadius,
                0,
                2 * Math.PI,
                "fill"
            );
        };

        const draw = () => {
            // Definitely not optimized
            paper.width = paper.clientWidth;
            paper.height = paper.clientHeight;

            const currentTime = Date.now(),
                elapsedTime = (currentTime - settings.startTime) / 1000;

            const length = Math.min(paper.width, paper.height) * 0.9,
                offset = (paper.width - length) / 2;

            const start = {
                x: offset,
                y: paper.height / 2,
            };

            const end = {
                x: paper.width - offset,
                y: paper.height / 2,
            };

            const center: Center = {
                x: paper.width / 2,
                y: paper.height / 2,
            };

            const base: Base = {
                length: end.x - start.x,
                minAngle: 0,
                startAngle: 0,
                maxAngle: 2 * Math.PI,
            };

            base.initialRadius = base.length * 0.05;
            base.circleRadius = base.length * 0.006;
            base.clearance = base.length * 0.03;
            base.spacing =
                (base.length - base.initialRadius - base.clearance) /
                2 /
                COLORS.length;

            arcs.forEach((arc, index) => {
                if (
                    !base.initialRadius ||
                    !base.spacing ||
                    !pen ||
                    !base.circleRadius
                )
                    return;
                const radius = base.initialRadius + base.spacing * index;

                // Draw arcs
                pen.globalAlpha = determineOpacity(
                    currentTime,
                    arc.lastImpactTime,
                    0.15,
                    0.65,
                    1000
                );
                pen.lineWidth = base.length * 0.002;
                pen.strokeStyle = arc.color;

                const offset = (base.circleRadius * (5 / 3)) / radius;

                drawArc(
                    center.x,
                    center.y,
                    radius,
                    Math.PI + offset,
                    2 * Math.PI - offset
                );

                drawArc(center.x, center.y, radius, offset, Math.PI - offset);

                // Draw impact points
                pen.globalAlpha = determineOpacity(
                    currentTime,
                    arc.lastImpactTime,
                    0.15,
                    0.85,
                    1000
                );
                pen.fillStyle = arc.color;

                drawPointOnArc(
                    center,
                    radius,
                    base.circleRadius * 0.75,
                    Math.PI
                );

                drawPointOnArc(
                    center,
                    radius,
                    base.circleRadius * 0.75,
                    2 * Math.PI
                );

                // Draw moving circles
                pen.globalAlpha = 1;
                pen.fillStyle = arc.color;

                if (currentTime >= arc.nextImpactTime) {
                    arc.nextImpactTime = calculateNextImpactTime(
                        arc.nextImpactTime,
                        arc.velocity
                    );
                }

                const distance =
                        elapsedTime >= 0 ? elapsedTime * arc.velocity : 0,
                    angle = (Math.PI + distance) % base.maxAngle;

                drawPointOnArc(center, radius, base.circleRadius, angle);
            });

            requestAnimationFrame(draw);
        };

        init();

        draw();
    }, []);

    return (
        <canvas
            id="paper"
            style={{
                height: "75vh",
                width: "75vw",
                position: "relative",
                zIndex: 9,
            }}
        ></canvas>
    );
};
