import { ProductListSkeleton } from "@/components/skeleton";
import { SectionContainer } from "@/components/common";

export default function Loading() {
  return (
    <SectionContainer>
      <ProductListSkeleton />
    </SectionContainer>
  );
}
