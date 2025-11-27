"use client";

import {
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    MenuList,
    ListItemIcon,
} from "@mui/material";
import { FadeIn } from "../animations/FadeIn";
import { useSession } from "next-auth/react";
import { Loading } from "../animations/Loading";
import { SignInButtonClient } from "../auth/SignInButtonClient";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { MuiLinkOverride } from "./MuiLinkOverride";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export function UserMenu() {
    // Server-side auth is apparently causing webpack errors. Using client for now.
    const { data: session, status } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (status === "loading") {
        return <Loading.RingMd />;
    }

    if (status === "unauthenticated") {
        return <SignInButtonClient className="" />;
    }

    return (
        <>
            <FadeIn noVertical>
                <IconButton onClick={handleOpen} sx={{ p: 0 }}>
                    <Avatar
                        sx={{ width: 28, height: 28 }}
                        alt={session?.user.name ?? "User Avatar"}
                        src={
                            session?.user.image ??
                            "/static/images/avatar_placeholder.png"
                        }
                    />
                </IconButton>
            </FadeIn>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                disableScrollLock={true}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <MenuList dense>
                    {session?.user?.name && (
                        <MenuItem disabled>{session.user.name}</MenuItem>
                    )}
                    {session?.user?.email && (
                        <MenuItem disabled>{session.user.email}</MenuItem>
                    )}
                    {session?.user?.provider && (
                        <MenuItem disabled>
                            Logged in with {session.user.provider}
                        </MenuItem>
                    )}
                    {(session?.user?.role === "ADMIN" ||
                        session?.user?.role === "SUPERADMIN") && (
                        <MenuItem
                            onClick={handleClose}
                            href="/admin"
                            component={MuiLinkOverride}
                        >
                            <ListItemIcon>
                                <AdminPanelSettingsIcon fontSize="small" />
                            </ListItemIcon>
                            Admin
                        </MenuItem>
                    )}
                    <MenuItem
                        onClick={handleClose}
                        href="/my-courses"
                        component={MuiLinkOverride}
                    >
                        <ListItemIcon>
                            <AccountCircleIcon fontSize="small" />
                        </ListItemIcon>
                        My Courses
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            signOut();
                        }}
                    >
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Sign out
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
}
