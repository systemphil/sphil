import { LinearProgress, Box, Typography } from "@mui/material";
import { dbGetUserProgressForCourse } from "lib/database/dbFuncs";
import { cacheKeys } from "lib/config/cacheKeys";
import { cacheLife, cacheTag } from "next/cache";

export async function CourseProgressBar({
    courseId,
    userId,
}: {
    courseId: string;
    userId: string;
}) {
    "use cache";
    cacheTag(cacheKeys.keys.userProgressCourse({ userId, courseId }));
    cacheLife("weeks");

    const { totalLessons, userProgress } = await dbGetUserProgressForCourse({
        courseId,
        userId,
    });

    const progressPercent =
        totalLessons > 0 ? (userProgress.length / totalLessons) * 100 : 0;

    const value = Math.round(progressPercent);

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Box sx={{ width: "100%", mr: 1 }}>
                <Box className="flex justify-center">
                    <Typography variant="body2" color="text.secondary">
                        {value === 100
                            ? "Course completed"
                            : `Course progression ${value}%`}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={value}
                    color={value === 100 ? "success" : "primary"}
                    sx={{ height: 10, borderRadius: 5 }}
                />
            </Box>
        </Box>
    );
}
