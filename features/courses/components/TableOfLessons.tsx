import {
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { Heading } from "lib/components/ui/Heading";
import { romanize } from "lib/utils";
import Link from "next/link";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

type CourseLessonContentsProps = {
    lessons: {
        slug: string;
        name: string;
    }[];
    courseSlug: string;
};

const links = {
    courses: "/symposia/courses",
};

export function TableOfLessons({
    lessons,
    courseSlug,
}: CourseLessonContentsProps) {
    if (!lessons || lessons.length === 0) {
        return (
            <Paper sx={{ p: 2, mt: 2, maxWidth: 320 }}>
                <Typography>No lesson contents</Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={2}
            sx={{
                mt: 2,
                py: { xs: 2, md: 3 },
                maxWidth: 320,
            }}
        >
            <Heading as="h3" additionalClasses="px-2 mb-1">
                Lessons
            </Heading>

            <List disablePadding>
                {lessons.map((lesson, index) => {
                    const lessonUrl = `${links.courses}/${courseSlug}/${lesson.slug}`;

                    return (
                        <ListItem key={lesson.slug} disablePadding>
                            <ListItemButton component={Link} href={lessonUrl}>
                                <ListItemIcon
                                    sx={{ minWidth: "auto", mr: 1.5 }}
                                >
                                    <DescriptionOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${romanize(index + 1)}. ${lesson.name}`}
                                    slotProps={{
                                        primary: {
                                            variant: "body2",
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
}
