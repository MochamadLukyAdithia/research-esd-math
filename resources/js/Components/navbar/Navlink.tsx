import { Link } from "@inertiajs/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

interface NavigationLinksProps {
    isMobile?: boolean;
    onLinkClick?: () => void;
    url: string;
}

interface NavLink {
    href: string;
    translationKey: string;
}

const links: NavLink[] = [
    { href: "/", translationKey: "nav.home" },
    { href: "/portal", translationKey: "nav.portal" },
    { href: "/tutorial", translationKey: "nav.tutorial" },
    { href: "/about-us", translationKey: "nav.about" },
    { href: "/news", translationKey: "nav.news" },
];

export function NavigationLinks({ isMobile = false, onLinkClick, url }: NavigationLinksProps) {
    const { t } = useTranslation();

    const isActive = useCallback(
        (path: string) => (path === '/' ? url === path : url.startsWith(path)),
        [url]
    );

    const linkClass = isMobile
        ? "block px-4 py-3 rounded-md text-sm font-medium transition-colors"
        : "relative px-1 py-2 text-sm font-medium transition-colors group";

    const activeLinkClass = isMobile
        ? "bg-secondary/10 text-secondary"
        : "text-secondary";

    const inactiveLinkClass = isMobile
        ? "text-secondary-light hover:bg-secondary/5"
        : "text-secondary-light hover:text-secondary";

    return (
        <>
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={onLinkClick}
                    className={clsx(
                        linkClass,
                        isActive(link.href) ? activeLinkClass : inactiveLinkClass
                    )}
                >
                    {t(link.translationKey)}
                    {!isMobile && (
                        <span className={clsx(
                            "absolute bottom-0 left-0 h-0.5 bg-secondary transition-all duration-300",
                            isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                        )}></span>
                    )}
                </Link>
            ))}
        </>
    );
}
