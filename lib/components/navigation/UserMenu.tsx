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

    const menuItemCss =
        "dark:hover:!bg-acid-green/50 duration-125 transition-colors";

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
                            className={menuItemCss}
                        >
                            <ListItemIcon>
                                <AdminPanelSettingsIcon fontSize="small" />
                            </ListItemIcon>
                            Admin
                        </MenuItem>
                    )}
                    <MenuItem
                        onClick={handleClose}
                        href="/billing"
                        component={MuiLinkOverride}
                        className={menuItemCss}
                    >
                        <ListItemIcon>
                            <AccountCircleIcon fontSize="small" />
                        </ListItemIcon>
                        Account & Billing
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        className={menuItemCss}
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
// <ul
//     tabIndex={0}
//     className="d-menu d-dropdown-content p-2 shadow-sm bg-white dark:bg-neutral-900 z-50 rounded-box w-52 drop-shadow-2xl"
// >
//     <li onClick={handleClick}>
//         <a className="pointer-events-none cursor-default opacity-75 text-lg pb-0">
//             {session && session.user?.name}
//         </a>
//     </li>
//     <li onClick={handleClick}>
//         <a className="pointer-events-none cursor-default opacity-75">
//             {session && session.user?.email}
//         </a>
//     </li>
//     {session && session.user.provider && (
//         <li>
//             <a className="pointer-events-none cursor-default opacity-75">
//                 Logged in with {session.user.provider}
//             </a>
//         </li>
//     )}
//     {session &&
//         (session.user.role === "ADMIN" ||
//             session.user.role === "SUPERADMIN") && (
//             <li
//                 onClick={handleClick}
//                 className="dark:hover:bg-acid-green/50 rounded-md duration-75 transition-colors"
//             >
//                 <Link href="/admin">Admin 🛡️</Link>
//             </li>
//         )}
//     <li className="border-t my-1" />
//     <li
//         onClick={handleClick}
//         className="dark:hover:bg-acid-green/50 rounded-md duration-75 transition-colors"
//     >
//         <Link href="/billing">Account & Billing</Link>
//     </li>
//     <li className="border-t my-1" />
//     <li
//         onClick={handleClick}
//         className="dark:hover:bg-acid-green/50 rounded-md duration-75 transition-colors"
//     >
//         <SignOutButtonClient className="w-[157px] flex" />
//     </li>
// </ul>
