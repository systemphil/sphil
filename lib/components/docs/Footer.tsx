import cn from "clsx";
import { Footer as FooterContent } from "lib/components/navigation/Footer";

/** Site footer chrome, replacing `nextra-theme-docs`' `Footer`. */
export function SiteFooter() {
    return (
        <div className="relative">
            <div
                data-name="footer-flair"
                className="absolute h-20 w-full -top-[80px] bg-linear-to-t from-[#fff6f6] to-transparent dark:from-[#10b981] pointer-events-none opacity-10 z-10"
            />
            <footer
                className={cn(
                    "docs-footer bg-gray-100 pb-[env(safe-area-inset-bottom)]",
                    "dark:bg-neutral-900 print:bg-transparent"
                )}
            >
                <div
                    className={cn(
                        "mx-auto flex max-w-(--docs-content-width) py-12",
                        "text-gray-600 dark:text-gray-400",
                        "pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]",
                        "flex-col items-center md:items-start relative"
                    )}
                >
                    <FooterContent />
                </div>
            </footer>
        </div>
    );
}
