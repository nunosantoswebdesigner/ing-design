"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const gettingStarted: { title: string; href: string; description: string }[] =
  [
    {
      title: "Installation",
      href: "/docs/installation",
      description: "How to install and configure ING Design in your project.",
    },
    {
      title: "Typography",
      href: "/docs/typography",
      description: "Fonts, sizes, and text styling conventions.",
    },
    {
      title: "Theming",
      href: "/docs/theming",
      description: "Customize colors, radius, and design tokens.",
    },
  ];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Trigger with content panel */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mt-4 mb-2 text-lg font-semibold">
                      ING Design
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      A custom component registry built on shadcn/ui.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              {gettingStarted.map((item) => (
                <ListItem key={item.title} href={item.href} title={item.title}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Trigger with simple grid */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {[
                { title: "Button", href: "/docs/components/button" },
                { title: "Dialog", href: "/docs/components/dialog" },
                { title: "Dropdown Menu", href: "/docs/components/dropdown-menu" },
                { title: "Input", href: "/docs/components/input" },
                { title: "Select", href: "/docs/components/select" },
                { title: "Tooltip", href: "/docs/components/tooltip" },
              ].map((item) => (
                <ListItem key={item.title} href={item.href} title={item.title} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Plain link — no content panel */}
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/docs"
            className={navigationMenuTriggerStyle()}
          >
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: React.ComponentProps<"a"> & { title: string }) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        href={href}
        className={cn(
          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors select-none",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        {children && (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        )}
      </a>
    </NavigationMenuLink>
  </li>
);
