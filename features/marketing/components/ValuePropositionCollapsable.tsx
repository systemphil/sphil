"use client";

import { Collapse, Button, Box } from "@mui/material";
import { ValueProposition } from "./ValueProposition";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";

export function ValuePropositionCollapsable() {
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Box className="w-full my-8">
            <Box className="flex justify-center">
                <Button
                    onClick={handleToggle}
                    aria-expanded={open}
                    aria-controls="value-proposition-content"
                    variant="outlined"
                    endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                    {open ? "Close details" : "Learn more"}
                </Button>
            </Box>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box id="value-proposition-content" className="my-6">
                    <ValueProposition />
                </Box>
            </Collapse>
        </Box>
    );
}
