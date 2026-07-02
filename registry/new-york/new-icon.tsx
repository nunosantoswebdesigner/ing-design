import { cn } from "@/lib/utils";

export type NewIconProps = React.SVGAttributes<SVGSVGElement> & {
  size?: number;
};

const NewIcon = ({ className, size = 24, ...props }: NewIconProps) => (
  <svg
    className={cn(className)}
    data-slot="new-icon"
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
  </svg>
);

NewIcon.displayName = "NewIcon";

export { NewIcon };
export default NewIcon;
