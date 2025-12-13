import React from "react";
import SectionContainer from "./SectionContainer";
interface PageSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}
export default function PageSection({
  title,
  description,
  children
}: PageSectionProps) {
  return <div className="bg-white">
      <SectionContainer>
        <div className="py-6">
          {}
          <div className="flex items-center justify-center mb-4">
            {}
            <div className="flex-1 border-t-2 border-dotted border-gray-300"></div>

            {}
            <div className="mx-4">
              <span className="border border-primary font-bold text-lg px-6 py-2 rounded-lg uppercase">
                {title}
              </span>
            </div>

            {}
            <div className="flex-1 border-t-2 border-dotted border-gray-300"></div>
          </div>

          {}
          {description && <p className="text-gray-600 text-sm text-center">{description}</p>}

          {children}
        </div>
      </SectionContainer>
    </div>;
}