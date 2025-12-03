import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  showStepIndicator?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  children,
  showStepIndicator = false,
  currentStep = 1,
  totalSteps = 2,
}) => {
  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-4 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          {title}
        </CardTitle>

        {showStepIndicator && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4">
              {Array.from({ length: totalSteps }, (_, index) => {
                const step = index + 1;
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;

                return (
                  <React.Fragment key={step}>
                    {index > 0 && (
                      <div
                        className={`flex-1 h-1 rounded-full transition-all ${
                          isCompleted ? "bg-green-500" : "bg-gray-200"
                        }`}
                        style={{ maxWidth: "60px" }}
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                          isCurrent
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          step
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-primary/80 h-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            {/* Step Description */}
            {description && (
              <p className="text-center text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6">{children}</CardContent>
    </Card>
  );
};
