import { CommandBox } from "@/components/docs/command-box";
import { HomeCtas } from "@/components/site/home-ctas";
import { PageTransition } from "@/components/site/page-transition";
import { WhatsNewDialog } from "@/components/site/whats-new-dialog";
import { ROUTES } from "@/constants/routes";
import { BreadcrumbJsonLd } from "@/seo/json-ld";

export const dynamic = "force-static";
export const revalidate = false;

export default function IndexPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: ROUTES.HOME }]} />
      <WhatsNewDialog />
      <PageTransition>
        <section className="container-wrapper relative">
          <div className="container flex flex-col items-center gap-4 py-16 text-center md:py-20 lg:py-24">
            <h1 className="max-w-7xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl from-foreground via-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent">
              ING Design
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Components, elements, and blocks built by ING Infinitive. Install directly into your
              project, own the code fully, and apply brand themes via CSS variables.
            </p>
            <CommandBox className="mt-4 w-full max-w-xl" />
            <HomeCtas className="mt-4" />
          </div>
        </section>
      </PageTransition>
    </>
  );
}
