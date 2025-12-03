import { ProductListSkeleton } from "@/shared/components/skeleton";
import { SectionContainer } from "@/shared/components/layout";

export default function Loading() {
  return (
    <SectionContainer>
      <ProductListSkeleton />
    </SectionContainer>
  );
}
