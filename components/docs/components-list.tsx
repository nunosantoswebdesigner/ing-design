import { ROUTES } from "@/constants/routes";
import { isComponentsFolder } from "@/lib/docs";
import type { PageTreeFolder, PageTreePage } from "@/lib/page-tree";
import { getAllPagesFromFolder, getPagesFromFolder } from "@/lib/page-tree";
import { source } from "@/lib/source";
import { ComponentsListView } from "./components-list-view";

const getFolder = (name: string): PageTreeFolder | undefined => {
  for (const node of source.pageTree.children) {
    if (node.type === "folder" && node.name === name) {
      return node;
    }
  }
};

const buildDescriptionMap = (): Map<string, string | undefined> =>
  new Map(source.getPages().map((p) => [p.url, p.data.description]));

const toItems = (pages: PageTreePage[]) => {
  const descMap = buildDescriptionMap();
  return pages.map((p) => ({
    description: descMap.get(p.url),
    name: p.name,
    url: p.url,
  }));
};

export const ComponentsList = ({
  folderName = "Components",
  className,
}: {
  folderName?: string;
  className?: string;
}) => {
  const folder = getFolder(folderName);
  if (!folder) {
    return null;
  }

  if (!isComponentsFolder(folder)) {
    const pages = getPagesFromFolder(folder);
    if (pages.length === 0) {
      return null;
    }
    return <ComponentsListView pages={toItems(pages)} className={className} />;
  }

  const pages = getAllPagesFromFolder(folder).filter((page) => page.url !== ROUTES.DOCS_COMPONENTS);
  if (pages.length === 0) {
    return null;
  }

  return <ComponentsListView pages={toItems(pages)} className={className} />;
};
