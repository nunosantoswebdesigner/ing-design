import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDemo() {
  return (
    <div className="flex flex-col gap-4">
      {/* Basic */}
      <Select>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>

      {/* Groups + separator */}
      <Select>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern (EST)</SelectItem>
            <SelectItem value="cst">Central (CST)</SelectItem>
            <SelectItem value="mst">Mountain (MST)</SelectItem>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="gmt">Greenwich (GMT)</SelectItem>
            <SelectItem value="cet">Central European (CET)</SelectItem>
            <SelectItem value="wet">Western European (WET)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Small size */}
      <Select>
        <SelectTrigger size="sm" className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="az">A → Z</SelectItem>
          <SelectItem value="za">Z → A</SelectItem>
        </SelectContent>
      </Select>

      {/* Disabled */}
      <Select disabled>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="x">Option</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
