/**
 * Feature Module Main Export
 * 
 * This is the main barrel export for the feature module.
 * It re-exports everything from subdirectories for convenient importing.
 * 
 * Usage in other files:
 * import { FeatureList, useFeature, FeatureService } from '@/features/[domain]/[feature-name]';
 */

// Re-export all components
export * from './components';

// Re-export all hooks
export * from './hooks';

// Re-export all services
export * from './services';

// Re-export all types
export * from './types';

// Re-export all utils (if applicable)
export * from './utils';
