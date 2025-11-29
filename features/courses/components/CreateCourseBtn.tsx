"use client";

import { Button } from "@mui/material";
import Link from "next/link";

export function CreateCourseBtn() {
    return (
        <Button
            variant="contained"
            LinkComponent={Link}
            href="/admin/courses/new"
        >
            Create a course
        </Button>
    );
}
