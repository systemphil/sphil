"use client";

import { Heading } from "lib/components/ui/Heading";
import { useEffect, useRef, useState } from "react";

export default function DebugVideo2() {
    return (
        <div className="flex flex-col flex-wrap ">
            <div className="p-4">
                <Heading>Testing video 2</Heading>
                <p>Do you see the video below? Does it play?</p>
            </div>
            <video
                playsInline
                controls
                controlsList="nodownload"
                poster="/static/images/sphil_owl.webp"
            >
                <source src="/static/video/vid1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
