import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionContainer({
  children,
  className,
}: SectionContainerProps) {
  return (
    <div
      className={cn(
        "container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-15 max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}
