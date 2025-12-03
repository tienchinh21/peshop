# Implementation Plan

- [x] 1. Set up foundation with shared components and custom hooks

  - Create reusable form components that eliminate code duplication
  - Extract common logic into custom hooks
  - Establish base for optimization work
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

- [x] 1.1 Create FormField shared component

  - Implement FormField component in `src/components/auth/FormField.tsx`
  - Include props for id, name, type, label, placeholder, value, onChange, error, icon, disabled, HTML5 validation attributes
  - Add icon support (Mail, User, etc.)
  - Implement error state styling with red border and error message display
  - Make component fully typed with TypeScript
  - _Requirements: 1.1_

- [x] 1.2 Create PasswordField shared component

  - Implement PasswordField component in `src/components/auth/PasswordField.tsx`
  - Add password visibility toggle with Eye/EyeOff icons
  - Include Lock icon
  - Manage show/hide password state internally
  - Support HTML5 validation attributes (required, minLength)
  - Make component fully typed with TypeScript
  - _Requirements: 1.2_

- [x] 1.3 Create AuthCard Server Component

  - Implement AuthCard component in `src/components/auth/AuthCard.tsx` as Server Component
  - Create card wrapper with styling for authentication pages
  - Add optional step indicator with current step and total steps
  - Include progress bar visualization
  - Ensure responsive design for mobile and desktop
  - _Requirements: 1.3_

- [x] 1.4 Create useCountdown custom hook

  - Implement useCountdown hook in `src/hooks/useCountdown.ts`
  - Provide start(seconds) function to begin countdown
  - Auto-decrement countdown every second using setInterval
  - Stop at 0 and set isActive to false
  - Include reset() function to clear countdown
  - Clean up interval on unmount to prevent memory leaks
  - Return { countdown, isActive, start, reset }
  - _Requirements: 2.1_

- [x] 1.5 Create useFormValidation custom hook

  - Implement useFormValidation hook in `src/hooks/useFormValidation.ts`
  - Support validation rules: required, minLength, maxLength, pattern, custom functions
  - Provide validate(name, value, rules) for single field validation
  - Provide validateAll(fields) for bulk validation
  - Manage errors state with clearError and clearAllErrors functions
  - Return Vietnamese error messages
  - Make fully typed with TypeScript interfaces
  - _Requirements: 2.2_

- [ ]\* 1.6 Write unit tests for shared components

  - Test FormField renders correctly with all props
  - Test FormField displays errors correctly
  - Test PasswordField toggles visibility
  - Test PasswordField shows/hides password
  - Test AuthCard renders children and step indicator
  - Achieve >80% code coverage for components
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]\* 1.7 Write unit tests for custom hooks

  - Test useCountdown decrements correctly
  - Test useCountdown stops at 0
  - Test useCountdown cleans up on unmount
  - Test useFormValidation validates required fields
  - Test useFormValidation validates patterns
  - Test useFormValidation clears errors
  - Achieve >80% code coverage for hooks
  - _Requirements: 2.1, 2.2_

- [x] 2. Replace heavy dependencies with lightweight alternatives

  - Create custom OTP component to replace input-otp library (~8KB)
  - Implement HTML5 validation to replace Zod (~14KB)
  - Reduce bundle size by ~22KB
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 2.1 Create HTML5 validation patterns and messages

  - Create `src/lib/validations/html5-patterns.ts` file
  - Define VALIDATION_PATTERNS constant with regex patterns for email, password, username, name, otp
  - Define VALIDATION_MESSAGES constant with Vietnamese error messages for each field and validation type
  - Export patterns and messages as const
  - _Requirements: 3.1, 3.2_

-

- [x] 2.2 Create custom lightweight OTP component

  - Implement OTPInput component in `src/components/auth/OTPInput.tsx`
  - Create 6 individual input fields using native HTML inputs
  - Implement auto-focus to next field on digit entry
  - Handle backspace to move to previous field
  - Support paste events to distribute all 6 digits
  - Accept only numeric input (0-9)
  - Use CSS Grid for layout
  - Keep bundle size under 1KB
  - Make accessible with proper ARIA labels
  - _Requirements: 3.3, 3.4_

- [ ]\* 2.3 Write property test for OTP input validation

  - **Property 2: OTP Input Accepts Only Digits**
  - **Validates: Requirements 3.4**
  - Generate random strings with letters, symbols, and numbers
  - Verify only digits are accepted in OTP input
  - Verify maximum length is enforced at 6 characters
  - Run 100 iterations minimum
  - Tag test with: `// Feature: auth-optimization, Property 2: OTP Input Accepts Only Digits`
  - _Requirements: 3.4_

- [x] 2.4 Update login page to use HTML5 validation

  - Replace Zod loginSchema validation with HTML5 validation attributes
  - Add pattern, required, minLength attributes to email and password inputs
  - Use useFormValidation hook for validation logic
  - Update error handling to use HTML5 validation messages
  - Remove Zod import and schema
  - Ensure all existing validation behavior is maintained
  - _Requirements: 3.1, 3.2, 8.1_

- [ ]\* 2.5 Write property tests for form validation

  - **Property 3: Form Validation Rejects Invalid Inputs**
  - **Property 4: Form Validation Accepts Valid Inputs**
  - **Validates: Requirements 8.1**
  - Generate invalid emails, passwords, usernames (empty, too short, wrong format)
  - Verify validation fails with appropriate error messages
  - Generate valid emails, passwords, usernames
  - Verify validation succeeds with no errors
  - Run 100 iterations minimum for each property
  - Tag tests with property numbers
  - _Requirements: 8.1_

- [x] 3. Refactor register page with useReducer and code splitting

  - Replace 9 useState hooks with single useReducer
  - Split into sub-components with lazy loading
  - Reduce register page to <400 lines
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 3.1 Create register page reducer

- [x] 3.1 Create register page reducer

  - Create `src/views/pages/xac-thuc/registerReducer.ts` file
  - Define RegisterState interface with all form state
  - Define RegisterAction union type for all actions
  - Implement registerReducer function handling all action types
  - Ensure immutable state updates
  - Export initialState constant
  - _Requirements: 5.1_

- [x] 3.2 Create EmailVerificationStep component

  - Implement EmailVerificationStep in `src/components/auth/EmailVerificationStep.tsx`
  - Accept props: email, otp, otpSent, countdown, loading states, errors, event handlers
  - Use FormField for email input
  - Use custom OTPInput component
  - Include send OTP, resend OTP, and verify OTP buttons
  - Display countdown timer using useCountdown hook
  - Make component lazy-loadable
  - _Requirements: 5.2, 4.1_

- [x] 3.3 Create RegistrationFormStep component

  - Implement RegistrationFormStep in `src/components/auth/RegistrationFormStep.tsx`
  - Accept props: form data, errors, isLoading, event handlers
  - Display verified email (read-only)
  - Use FormField for username and name
  - Use PasswordField for password and confirmPassword
  - Include back and submit buttons
  - Make component lazy-loadable
  - _Requirements: 5.2, 4.2_

- [x] 3.4 Refactor register page to use useReducer and lazy loading

  - Update `src/views/pages/xac-thuc/register.tsx`
  - Replace 9 useState hooks with useReducer(registerReducer, initialState)
  - Lazy load EmailVerificationStep with React.lazy()
  - Lazy load RegistrationFormStep with React.lazy()
  - Update all state updates to use dispatch with appropriate actions
  - Use Suspense for lazy-loaded components
  - Integrate useCountdown hook for timer
  - Use useFormValidation hook for validation
  - Replace input-otp with custom OTPInput
  - Ensure register page is <400 lines
  - _Requirements: 5.1, 5.2, 5.4, 4.1, 4.2_

- [x] 3.5 Update register page to use shared components

  - Replace duplicate form fields with FormField component
  - Replace password inputs with PasswordField component
  - Use HTML5 validation instead of Zod
  - Remove Zod imports and schemas
  - Ensure all validation behavior is maintained
  - _Requirements: 1.1, 1.2, 3.1, 3.2_

- [ ]\* 3.6 Write property test for multi-step flow

  - **Property 5: Multi-Step Registration Flow Progression**
  - **Validates: Requirements 8.2**
  - Generate random form states with and without verification keys
  - Verify Step 2 is blocked when verification key is missing
  - Verify Step 2 is accessible when verification key exists
  - Verify verification key persists across step transitions
  - Run 100 iterations minimum
  - Tag test with property number
  - _Requirements: 8.2_

- [ ]\* 3.7 Write unit tests for register reducer

  - Test registerReducer handles SET_FIELD action
  - Test registerReducer handles SET_STEP action
  - Test registerReducer handles SET_OTP_SENT action
  - Test registerReducer handles SET_VERIFICATION_KEY action
  - Test registerReducer handles all loading state actions
  - Test registerReducer handles RESET_FORM action
  - Verify state immutability
  - Achieve >80% coverage
  - _Requirements: 5.1_

- [ ] 4. Update login page to use shared components

  - Replace duplicate code with shared components
  - Reduce login page bundle size
  - _Requirements: 1.1, 1.2, 8.1_

- [ ] 4.1 Refactor login page to use shared components

  - Update `src/views/pages/xac-thuc/page.tsx`
  - Replace email field with FormField component
  - Replace password field with PasswordField component
  - Use useFormValidation hook for validation
  - Remove duplicate password toggle logic
  - Ensure all existing functionality is maintained
  - _Requirements: 1.1, 1.2, 8.1_

- [ ]\* 4.2 Write property tests for API integration

  - **Property 6: API Integration State Updates**
  - **Validates: Requirements 8.3**
  - Mock successful and error API responses for login, register, OTP operations
  - Verify loading states toggle correctly (true during call, false after)
  - Verify form data is preserved or cleared appropriately
  - Verify error states are set correctly on failures
  - Verify success states trigger correct actions
  - Run 100 iterations minimum
  - Tag test with property number
  - _Requirements: 8.3_

- [ ]\* 4.3 Write property tests for error notifications

  - **Property 7: Error Toast Notifications**
  - **Validates: Requirements 8.4**
  - Generate various error scenarios (validation, API, network)
  - Verify toast notification is called for each error
  - Verify toast contains appropriate error message
  - Run 100 iterations minimum
  - Tag test with property number
  - _Requirements: 8.4_

- [ ]\* 4.4 Write property test for navigation

  - **Property 8: Successful Authentication Navigation**
  - **Validates: Requirements 8.5**
  - Mock successful login and registration responses
  - Verify router.push is called with correct path
  - Verify navigation happens after state updates
  - Run 100 iterations minimum
  - Tag test with property number
  - _Requirements: 8.5_

- [ ] 5. Optimize assets and icons

  - Optimize image loading
  - Reduce icon bundle size
  - Implement conditional mobile loading
  - _Requirements: 6.1, 6.2, 6.3, 7.1, 7.2, 7.3_

- [ ] 5.1 Optimize hero image loading

  - Update Image components in both login and register pages
  - Add quality={75} attribute for optimal file size
  - Add placeholder="blur" for better loading experience
  - Ensure priority attribute is set for above-fold images
  - Verify WebP format is used by Next.js Image optimization
  - _Requirements: 7.1, 7.2_

- [ ] 5.2 Implement conditional mobile image loading

  - Add client-side device detection or use CSS media queries
  - Conditionally render hero images only on desktop (lg breakpoint and above)
  - Ensure images are not loaded on mobile devices where they're hidden
  - Test on various screen sizes
  - _Requirements: 7.3_

- [ ] 5.3 Optimize icon imports

  - Review all Lucide icon imports in auth pages
  - Ensure only necessary icons are imported
  - Consider creating an icon component that lazy loads icons
  - Document icon optimization strategy for future reference
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 6. Write comprehensive tests for user experience preservation

  - Ensure all UX behaviors are maintained
  - Test real-time validation, loading states, countdown display
  - _Requirements: 9.2, 9.3, 9.4_

- [ ]\* 6.1 Write property test for real-time validation feedback

  - **Property 9: Real-Time Validation Feedback**
  - **Validates: Requirements 9.2**
  - Generate sequences of valid and invalid input values
  - Verify error messages appear immediately when value becomes invalid
  - Verify error messages clear immediately when value becomes valid
  - Test for all form fields (email, password, username, name)
  - Run 100 iterations minimum
  - Tag test with property number
  - _Requirements: 9.2_

- [ ]\* 6.2 Write property test for loading state indicators

  - **Property 10: Loading State Indicators**
  - **Validates: Requirements 9.3**
  - Mock async operations with various delays
  - Verify loading indicator appears when operation starts
  - Verify loading indicator disappears when operation completes
  - Test for all async operations (login, register, OTP send, OTP verify)
  - Run 100 iterations minimum
  - Tag test with property number
  - _Requirements: 9.3_

- [ ]\* 6.3 Write property test for countdown display format

  - **Property 11: Countdown Display Format**
  - **Validates: Requirements 9.4**
  - Generate countdown values from 0 to 60
  - Verify format is "Bạn có thể gửi lại mã sau {countdown}s" when countdown > 0
  - Verify format changes to "Không nhận được mã?" when countdown = 0
  - Run 100 iterations minimum
  - Tag test with property number
  - _Requirements: 9.4_

- [ ]\* 6.4 Write property test for countdown timer behavior

  - **Property 1: Countdown Timer Decrement**
  - **Validates: Requirements 2.1**
  - Generate random starting values (1-300 seconds)
  - Verify countdown decrements by exactly 1 each second
  - Verify countdown stops at 0
  - Verify countdown doesn't go negative
  - Run 100 iterations minimum
  - Tag test with: `// Feature: auth-optimization, Property 1: Countdown Timer Decrement`
  - _Requirements: 2.1_

- [ ]\* 6.5 Write integration tests for complete auth flows

  - Test complete login flow with valid credentials
  - Test complete login flow with invalid credentials
  - Test complete registration flow from email to completion
  - Test OTP verification flow with valid and invalid codes
  - Test error handling for network failures
  - Test form state persistence across steps
  - Achieve >80% integration coverage
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 7. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Measure and validate optimization results

  - Measure bundle size reduction
  - Measure performance improvements
  - Validate all requirements are met
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 8.1 Run bundle size analysis

  - Use webpack-bundle-analyzer to analyze bundle
  - Measure total bundle size before and after optimization
  - Measure per-page bundle size for login and register pages
  - Calculate percentage reduction
  - Verify 30-40% reduction target is met
  - Document results in performance report
  - _Requirements: 11.1_

- [ ] 8.2 Run performance benchmarks

  - Use Lighthouse to measure FCP (First Contentful Paint)
  - Use Lighthouse to measure TTI (Time to Interactive)
  - Measure TBT (Total Blocking Time)
  - Measure CLS (Cumulative Layout Shift)
  - Compare before and after metrics
  - Verify 10-15% improvement in load times
  - Document results in performance report
  - _Requirements: 11.2, 11.3, 11.4_

- [ ] 8.3 Validate code quality metrics

  - Run TypeScript compiler and verify no errors
  - Run ESLint and verify no errors
  - Check test coverage is >80%
  - Verify register page is <400 lines
  - Verify code duplication is reduced by 15-20%
  - Document results
  - _Requirements: 10.4, 5.4, 1.4_

- [ ]\* 8.4 Run visual regression tests

  - Set up visual regression testing with Percy or Chromatic
  - Capture screenshots of login page (desktop and mobile)
  - Capture screenshots of register page Step 1 (desktop and mobile)
  - Capture screenshots of register page Step 2 (desktop and mobile)
  - Capture screenshots of error states
  - Capture screenshots of loading states
  - Compare with baseline screenshots
  - Verify no visual differences
  - _Requirements: 9.1, 9.5_

- [ ] 8.5 Create performance comparison report

  - Compile all metrics (bundle size, performance, code quality)
  - Create before/after comparison tables
  - Document achieved vs target metrics
  - Highlight areas that exceeded expectations
  - Note any areas that didn't meet targets
  - Include recommendations for future optimizations
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 9. Final validation and cleanup

  - Verify all functionality is maintained
  - Clean up unused code
  - Update documentation
  - _Requirements: 8.6, 10.1, 10.2, 10.3_

- [ ] 9.1 Verify all existing functionality works

  - Manually test login flow with valid and invalid credentials
  - Manually test registration flow end-to-end
  - Manually test OTP sending and verification
  - Manually test error scenarios
  - Manually test on different browsers (Chrome, Firefox, Safari)
  - Manually test on different devices (desktop, tablet, mobile)
  - Verify all toast notifications appear correctly
  - Verify all navigation works correctly
  - _Requirements: 8.6_

- [ ] 9.2 Remove unused code and dependencies

  - Remove Zod validation schemas from auth.schemas.ts (keep only helper functions if needed)
  - Remove input-otp library from package.json
  - Remove any unused imports from auth pages
  - Remove any commented-out code
  - Clean up console.log statements
  - _Requirements: 3.1, 3.3_

- [ ] 9.3 Update TypeScript types and documentation

  - Ensure all new components have proper TypeScript types
  - Ensure all hooks have proper return type annotations
  - Add JSDoc comments to all exported functions and components
  - Update README if needed with optimization details
  - Document any breaking changes (should be none)
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 9.4 Code review and final QA

  - Request code review from team
  - Address any code review feedback
  - Run final test suite
  - Verify all tests pass
  - Verify TypeScript compiles without errors
  - Verify ESLint passes without errors
  - Create pull request with detailed description
  - _Requirements: 8.6, 10.4_

- [ ] 10. Final Checkpoint - Verify production readiness
  - Ensure all tests pass, ask the user if questions arise.
