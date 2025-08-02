"use client";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import toast from "react-hot-toast";

export function SeminarParticipantsTable({
    users,
}: {
    users: {
        name: string | null;
        email: string;
    }[];
}) {
    async function copyToClipboard(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied!");
        } catch (err) {
            toast.error(`Error copying to clipboard ${err}`);
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="participants table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <b>Participants</b>
                        </TableCell>
                        <TableCell align="right">
                            <b>Email</b>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{ cursor: "pointer" }}
                                onClick={() => copyToClipboard(row.email)}
                            >
                                {row.email}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
