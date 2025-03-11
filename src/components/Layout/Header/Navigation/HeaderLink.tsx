"use client";
import { useState } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";

interface HeaderLinkProps {
  item: {
    label: string;
    href: string;
    openInNewWindow?: boolean;
  };
}

const HeaderLink = ({ item }: HeaderLinkProps) => {
  const pathUrl = usePathname();
  return (
    <Link
      href={item.href}
      target={item.openInNewWindow ? "_blank" : undefined}
      rel={item.openInNewWindow ? "noopener noreferrer" : undefined}
      className={`text-lg font-medium text-white hover:text-orange-500 transition-colors duration-300 ${
        pathUrl === item.href ? "text-orange-500" : ""
      }`}
    >
      {item.label}
    </Link>
  );
};

export default HeaderLink;
