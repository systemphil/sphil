/**
 * Copyright (c) 2023 by Hyperplexed (https://codepen.io/Hyperplexed/pen/VwqLQbo)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Adapted by Firgrep for React, TailwindCSS and TypeScript.
 */

import { useEffect, useState } from "react";
import styles from "./sub-hero-background.module.css";
import cn from "classnames";

const SubHeroBackground = ({ children }: { children?: React.ReactNode }) => {
    const [screenSize, setScreenSize] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1001
    );

    useEffect(() => {
        let stringLength = 2000;
        if (screenSize > 1200) {
            stringLength = 9000;
        } else if (screenSize > 1000) {
            stringLength = 7000;
        } else if (screenSize > 600) {
            stringLength = 4000;
        }
        const chars =
            "abcdefghiklmnopqrstyxzøæåABCDEFGHIKLMNOPQRSTYXZØÆÅ01233456789";
        const randomChar = () =>
            chars[Math.floor(Math.random() * (chars.length - 1))];
        const randomString = (length: number) =>
            Array.from(Array(length)).map(randomChar).join("");

        const card = document.getElementById("targetCard") as HTMLElement;
        const letters = document.getElementById("targetLetters") as HTMLElement;

        const handleResize = () => {
            setScreenSize(window.innerWidth);
        };

        const handleOnMove = (e: MouseEvent | Touch) => {
            if (!card || !letters) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            letters.style.setProperty("--x", `${x}px`);
            letters.style.setProperty("--y", `${y}px`);

            letters.innerText = randomString(stringLength);
        };
        if (card) {
            card.onmousemove = (e) => handleOnMove(e);
            card.ontouchmove = (e) => handleOnMove(e.touches[0]);
        }
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [screenSize]);

    return (
        <div className={styles["card-root"]}>
            <div className={styles["card-track"]}>
                <div className={styles["card-wrapper"]}>
                    <div id="targetCard" className={styles["card"]}>
                        <div className={cn(styles["card-center"])}>
                            {children}
                        </div>
                        <div
                            className={cn(
                                styles["card-gradient"],
                                "bg-radial-gradient dark:bg-radial-gradient-dark"
                            )}
                        ></div>
                        <div
                            id="targetLetters"
                            className={cn(
                                styles["card-letters"],
                                "text-black dark:text-green-100"
                            )}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubHeroBackground;
