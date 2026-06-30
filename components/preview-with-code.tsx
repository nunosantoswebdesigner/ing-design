import { PreviewWithCodeUI } from "@/components/preview-with-code-ui";
import { formatCode } from "@/lib/format-code";
import { highlightCode } from "@/lib/highlight-code";
import { getDemoSource, getRegistrySource, readOptionalFromRoot } from "@/lib/registry";

export const PreviewWithCode = async ({
  children,
  name,
  src,
  className,
}: {
  children: React.ReactNode;
  name?: string;
  src?: string;
  className?: string;
}) => {
  let rawCode: string | null = null;

  if (name) {
    rawCode = (await getDemoSource(name)) ?? (await getRegistrySource(name));
  } else if (src) {
    rawCode = await readOptionalFromRoot(src);
  }

  if (!rawCode) {
    return (
      <div className="bg-muted/20 mt-4 flex min-h-[120px] items-center justify-center rounded-xl border p-8">
        {children}
      </div>
    );
  }

  const code = await formatCode(rawCode);
  const highlightedCode = await highlightCode(code, "tsx");

  return (
    <PreviewWithCodeUI code={code} highlightedCode={highlightedCode} className={className}>
      {children}
    </PreviewWithCodeUI>
  );
};
