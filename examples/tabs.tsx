import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsDemo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Basic */}
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview" sound="tabSwitch">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" sound="tabSwitch">
            Code
          </TabsTrigger>
          <TabsTrigger value="docs" sound="tabSwitch">
            Docs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="bg-muted/40 flex h-20 items-center justify-center rounded-md border text-sm">
            Preview content
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="bg-muted/40 flex h-20 items-center justify-center rounded-md border text-sm">
            Code content
          </div>
        </TabsContent>
        <TabsContent value="docs">
          <div className="bg-muted/40 flex h-20 items-center justify-center rounded-md border text-sm">
            Docs content
          </div>
        </TabsContent>
      </Tabs>

      {/* With icons and card panels */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="account" className="flex-1" sound="tabSwitch">
            Account
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1" sound="tabSwitch">
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tabs-name">Name</Label>
                <Input id="tabs-name" defaultValue="Nuno Santos" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tabs-username">Username</Label>
                <Input id="tabs-username" defaultValue="@nunosantos" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tabs-current">Current password</Label>
                <Input id="tabs-current" type="password" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tabs-new">New password</Label>
                <Input id="tabs-new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Disabled trigger */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" sound="tabSwitch">
            Active
          </TabsTrigger>
          <TabsTrigger value="archived" sound="tabSwitch">
            Archived
          </TabsTrigger>
          <TabsTrigger value="deleted" disabled>
            Deleted
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="text-muted-foreground text-sm">Active items shown here.</div>
        </TabsContent>
        <TabsContent value="archived">
          <div className="text-muted-foreground text-sm">Archived items shown here.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
