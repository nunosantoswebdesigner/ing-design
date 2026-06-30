import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }, (_, i) => `Component ${i + 1}`);

const artworks = [
  { title: "Ornithology", artist: "Charlie Parker" },
  { title: "So What", artist: "Miles Davis" },
  { title: "Waltz for Debby", artist: "Bill Evans" },
  { title: "A Love Supreme", artist: "John Coltrane" },
  { title: "Take Five", artist: "Dave Brubeck" },
  { title: "Kind of Blue", artist: "Miles Davis" },
  { title: "Giant Steps", artist: "John Coltrane" },
  { title: "Maiden Voyage", artist: "Herbie Hancock" },
];

export function ScrollAreaDemo() {
  return (
    <div className="flex gap-6">
      {/* Vertical */}
      <ScrollArea className="h-72 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
          {tags.map((tag) => (
            <div key={tag}>
              <p className="text-sm">{tag}</p>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Horizontal */}
      <ScrollArea className="w-64 rounded-md border">
        <div className="flex gap-4 p-4">
          {artworks.map((artwork) => (
            <figure key={artwork.title} className="shrink-0">
              <div className="overflow-hidden rounded-md">
                <div className="size-[150px] bg-muted" />
              </div>
              <figcaption className="pt-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground block truncate w-[150px]">
                  {artwork.title}
                </span>
                {artwork.artist}
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
