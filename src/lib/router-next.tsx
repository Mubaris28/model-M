"use client";

import React from "react";
import NextLink from "next/link";
import { useRouter, useParams as useNextParams, usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Adapter so existing react-router-dom usage works with Next.js

export function Link({
  to,
  children,
  className,
  ...rest
}: { to: string; children?: React.ReactNode; className?: string } & Omit<ComponentProps<typeof NextLink>, "href">) {
  return (
    <NextLink href={to} className={className} {...rest}>
      {children}
    </NextLink>
  );
}

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
      return;
    }
    if (options?.replace) router.replace(to);
    else router.push(to);
  };
}

export function useParams<_T = unknown>(): Record<string, string | undefined> {
  return (useNextParams() ?? {}) as Record<string, string | undefined>;
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname: pathname ?? "", search: "", hash: "" };
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter();
  React.useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [router, to, replace]);
  return null;
}

type NavLinkProps = Omit<ComponentProps<typeof NextLink>, "href" | "className"> & {
  to: string;
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
  activeClassName?: string;
  pendingClassName?: string;
  children?: React.ReactNode;
};

export function NavLink({
  to,
  className,
  activeClassName,
  pendingClassName,
  children,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname() ?? "";
  const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
  const resolvedClass: string | undefined =
    typeof className === "function" ? (className as (p: { isActive: boolean; isPending: boolean }) => string)({ isActive, isPending: false }) : (className as string);
  return (
    <NextLink href={to} className={cn(resolvedClass, isActive && activeClassName, pendingClassName)} {...rest}>
      {children}
    </NextLink>
  );
}
