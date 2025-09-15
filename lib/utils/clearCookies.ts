export const clearCookies = () => {
    const cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
        const d = window.location.hostname.split(".");
        while (d.length > 0) {
            const cookieBase =
                encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
                "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
                d.join(".") +
                " ;path=";
            const p = location.pathname.split("/");
            document.cookie = cookieBase + "/";
            while (p.length > 0) {
                document.cookie = cookieBase + p.join("/");
                p.pop();
            }
            d.shift();
        }
    }
};
