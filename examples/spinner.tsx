import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export const SpinnerDemo = () => (
    <div className="flex flex-col gap-8">
      {/* Sizes */}
      <div className="flex items-center gap-4">
        <Spinner size="sm" />
        <Spinner size="default" />
        <Spinner size="lg" />
        <Spinner size="xl" />
      </div>
      {/* Colors via text color */}
      <div className="flex items-center gap-4">
        <Spinner className="text-primary" />
        <Spinner className="text-destructive" />
        <Spinner className="text-muted-foreground" />
        <Spinner className="text-green-500" />
      </div>
      {/* In a button */}
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled>
          <Spinner size="sm" />
          Saving…
        </Button>
        <Button variant="outline" disabled>
          <Spinner size="sm" />
          Loading
        </Button>
        <Button variant="ghost" disabled>
          <Spinner size="sm" />
          Please wait
        </Button>
      </div>
      {/* Full-page overlay pattern */}
      <div className="bg-background relative flex h-28 items-center justify-center rounded-lg border">
        <div className="text-muted-foreground flex flex-col items-center gap-2">
          <Spinner size="lg" className="text-primary" />
          <span className="text-sm">Loading content…</span>
        </div>
      </div>
    </div>
  );
