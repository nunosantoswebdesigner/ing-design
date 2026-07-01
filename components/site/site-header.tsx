import { CommandMenu } from "@/components/site/command-menu";
import { MainNav } from "@/components/site/main-nav";
import { MobileNav } from "@/components/site/mobile-nav";
import { ModeSwitcher } from "@/components/site/mode-switcher";
// import { NavItemGithub } from "@/components/site/nav-item-github";
import { SiteSettings } from "@/components/site/site-settings";
import { SponsorLink } from "@/components/site/sponsor-link";
import { ROUTES } from "@/constants/routes";
import { source } from "@/lib/source";

const navItems = [
  { href: ROUTES.DOCS, label: "Docs" },
  { href: ROUTES.DOCS_COMPONENTS, label: "Components" },
];

export const SiteHeader = () => (
  <header
    className="bg-background sticky top-0 z-50 w-full"
    style={{ viewTransitionName: "site-header" }}
  >
    <div className="container-wrapper 3xl:fixed:px-0 px-6">
      <div className="3xl:fixed:container flex h-(--header-height) items-center gap-2">
        <MobileNav items={navItems} tree={source.pageTree} className="flex lg:hidden" />
        <SponsorLink />
        {/* <BrandContextMenu>
          <Button asChild variant="ghost" size="icon" className="hidden size-8 lg:flex" sound="click">
            <Link href={ROUTES.HOME} transitionTypes={["nav-back"]}>
              <LogoMark className="size-5" />
              <span className="sr-only">{SITE.NAME}</span>
            </Link>
          </Button>
        </BrandContextMenu> */}
        <MainNav items={navItems} className="hidden lg:flex" />
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
            <CommandMenu navItems={navItems} tree={source.pageTree} />
          </div>
          {/* <NavItemGithub /> */}
          <ModeSwitcher />
          <SiteSettings />
        </div>
      </div>
    </div>
  </header>
);
