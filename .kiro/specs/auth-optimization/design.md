# Design Document

## Overview

This design document outlines the architecture and implementation strategy for optimizing the authentication pages (login and registration) in the PeShop e-commerce platform. The optimization aims to reduce bundle size by 30-40% through component extraction, dependency replacement, code splitting, and architectural refactoring while maintaining 100% of existing functionality and user experience.

The authentication system consists of two main pages:

- **Login Page** (`src/views/pages/xac-thuc/page.tsx`) - 334 lines, handles user login
- **Register Page** (`src/views/pages/xac-thuc/register.tsx`) - 772 lines, handles multi-step registration with OTP verification

Both pages must remain as Client Components due to their requirements for client-side interactivity, state management, and API integration.

## Architecture

### Current Architecture

```
Authentication Pages (Client Components)
├── Login Page
│   ├── Form State (useState)
│   ├── Zod Validation
│   ├── Redux Integration
│   ├── API Calls
│   └── Toast Notifications
└── Register Page
    ├── Multi-step State (9 useState hooks)
    ├── Zod Validation
    ├── OTP Flow (Input-OTP library)
    ├── Countdown Timer
    ├── Redux Integration
    ├── API Calls
    └── Toast Notifications
```

### Optimized Architecture

```
Authentication System
├── Shared Components
│   ├── FormField (Client) - Reusable form field with icon, label, error
│   ├── PasswordField (Client) - Password input with toggle visibility
│   ├── AuthCard (Server) - Static card wrapper with image
│   └── OTPInput (Client) - Custom lightweight OTP component
├── Custom Hooks
│   ├── useCountdown - Timer logic
│   ├── useFormValidation - Validation logic
│   └── useAuth - Existing auth hook (maintained)
├── Login Page (Client)
│   ├── Uses shared components
│   ├── HTML5 validation
│   └── Simplified state management
└── Register Page (Client)
    ├── useReducer for state
    ├── Code-split sub-components
    │   ├── EmailVerificationStep (Lazy)
    │   └── RegistrationFormStep (Lazy)
    └── Uses shared components
```

## Components and Interfaces

### 1. Shared Form Components

#### FormField Component (Client)

```typescript
// src/components/auth/FormField.tsx
interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}

export const FormField: React.FC<FormFieldProps>;
```

**Purpose**: Reusable form field component that combines label, input, icon, and error display. Eliminates duplicate form field code across login and register pages.

**Features**:

- Icon support (Mail, User, etc.)
- Error state styling
- HTML5 validation attributes
- Accessible labels and error messages

#### PasswordField Component (Client)

```typescript
// src/components/auth/PasswordField.tsx
interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  minLength?: number;
}

export const PasswordField: React.FC<PasswordFieldProps>;
```

**Purpose**: Specialized password input with built-in show/hide toggle. Eliminates duplicate password toggle logic.

**Features**:

- Eye/EyeOff icon toggle
- Password visibility state management
- Lock icon
- HTML5 validation

#### AuthCard Component (Server)

```typescript
// src/components/auth/AuthCard.tsx
interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  showStepIndicator?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const AuthCard: React.FC<AuthCardProps>;
```

**Purpose**: Server Component for static card layout. Can be rendered on server since it's just layout.

**Features**:

- Card wrapper with styling
- Optional step indicator
- Progress bar
- Responsive design

#### OTPInput Component (Client)

```typescript
// src/components/auth/OTPInput.tsx
interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps>;
```

**Purpose**: Custom lightweight OTP input component to replace input-otp library (~8KB). Target size: <1KB.

**Features**:

- 6 individual input fields
- Auto-focus on next field
- Paste support
- Backspace handling
- Numeric-only input
- Accessible

**Implementation Strategy**:

- Use 6 native input elements
- Manage focus with refs
- Handle paste events to distribute digits
- Use CSS Grid for layout

### 2. Custom Hooks

#### useCountdown Hook

```typescript
// src/hooks/useCountdown.ts
interface UseCountdownReturn {
  countdown: number;
  isActive: boolean;
  start: (seconds: number) => void;
  reset: () => void;
}

export const useCountdown = (): UseCountdownReturn
```

**Purpose**: Reusable countdown timer logic for OTP resend functionality.

**Features**:

- Start countdown with specified seconds
- Auto-decrement every second
- Reset functionality
- Active state tracking

#### useFormValidation Hook

```typescript
// src/hooks/useFormValidation.ts
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface UseFormValidationReturn {
  errors: Record<string, string>;
  validate: (name: string, value: string, rules: ValidationRule) => boolean;
  validateAll: (fields: Record<string, { value: string; rules: ValidationRule }>) => boolean;
  clearError: (name: string) => void;
  clearAllErrors: () => void;
}

export const useFormValidation = (): UseFormValidationReturn
```

**Purpose**: Centralized form validation logic using HTML5 validation patterns.

**Features**:

- Field-level validation
- Bulk validation
- Error management
- Custom validation functions
- Vietnamese error messages

### 3. Register Page State Management

#### Registration State Reducer

```typescript
// src/views/pages/xac-thuc/registerReducer.ts
interface RegisterState {
  currentStep: 1 | 2;
  formData: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    name: string;
    otp: string;
  };
  verificationKey: string;
  otpSent: boolean;
  isLoading: boolean;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
}

type RegisterAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_STEP'; step: 1 | 2 }
  | { type: 'SET_OTP_SENT'; sent: boolean }
  | { type: 'SET_VERIFICATION_KEY'; key: string }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_SENDING_OTP'; sending: boolean }
  | { type: 'SET_VERIFYING_OTP'; verifying: boolean }
  | { type: 'RESET_FORM' };

export const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState
```

**Purpose**: Replace 9 useState hooks with single useReducer for better performance and maintainability.

### 4. Code-Split Components

#### EmailVerificationStep Component (Lazy Loaded)

```typescript
// src/components/auth/EmailVerificationStep.tsx
interface EmailVerificationStepProps {
  email: string;
  otp: string;
  otpSent: boolean;
  countdown: number;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  errors: Record<string, string>;
  onEmailChange: (email: string) => void;
  onOtpChange: (otp: string) => void;
  onSendOtp: () => void;
  onResendOtp: () => void;
  onVerifyOtp: () => void;
}

export const EmailVerificationStep: React.FC<EmailVerificationStepProps>;
```

**Purpose**: Isolated component for Step 1 of registration. Lazy loaded to reduce initial bundle.

#### RegistrationFormStep Component (Lazy Loaded)

```typescript
// src/components/auth/RegistrationFormStep.tsx
interface RegistrationFormStepProps {
  email: string;
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
  errors: Record<string, string>;
  isLoading: boolean;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const RegistrationFormStep: React.FC<RegistrationFormStepProps>;
```

**Purpose**: Isolated component for Step 2 of registration. Lazy loaded after OTP verification.

## Data Models

### Form Data Types

```typescript
// src/types/auth-optimization.types.ts

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  otp: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  match?: string; // For password confirmation
  custom?: (value: string) => string | null;
}
```

### HTML5 Validation Patterns

```typescript
// src/lib/validations/html5-patterns.ts

export const VALIDATION_PATTERNS = {
  email: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
  password: ".{6,}", // Minimum 6 characters
  username: "[a-zA-Z0-9_]{3,50}",
  name: "[a-zA-ZÀ-ỹ\\s]{2,100}",
  otp: "\\d{6}",
} as const;

export const VALIDATION_MESSAGES = {
  email: {
    required: "Email là bắt buộc",
    pattern: "Email không hợp lệ",
  },
  password: {
    required: "Mật khẩu là bắt buộc",
    minLength: "Mật khẩu phải có ít nhất 6 ký tự",
  },
  username: {
    required: "Tên đăng nhập là bắt buộc",
    minLength: "Tên đăng nhập phải có ít nhất 3 ký tự",
    pattern: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
  },
  name: {
    required: "Họ và tên là bắt buộc",
    minLength: "Họ và tên phải có ít nhất 2 ký tự",
  },
  otp: {
    required: "Mã OTP là bắt buộc",
    pattern: "Mã OTP phải có 6 số",
  },
  confirmPassword: {
    required: "Vui lòng xác nhận mật khẩu",
    match: "Mật khẩu xác nhận không khớp",
  },
} as const;
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Countdown Timer Decrement

_For any_ countdown timer started with a positive number of seconds, each second that passes should decrement the countdown value by exactly 1 until it reaches 0.

**Validates: Requirements 2.1**

### Property 2: OTP Input Accepts Only Digits

_For any_ input to the OTP component, only numeric characters (0-9) should be accepted, and the final value should always be a string of digits with maximum length 6.

**Validates: Requirements 3.4**

### Property 3: Form Validation Rejects Invalid Inputs

_For any_ form field with validation rules, when an invalid value is provided (empty when required, too short, doesn't match pattern), the validation should fail and return an appropriate error message.

**Validates: Requirements 8.1**

### Property 4: Form Validation Accepts Valid Inputs

_For any_ form field with validation rules, when a valid value is provided (meets all requirements), the validation should succeed and return no error.

**Validates: Requirements 8.1**

### Property 5: Multi-Step Registration Flow Progression

_For any_ registration attempt, the user should not be able to proceed to Step 2 (registration form) without successfully completing Step 1 (OTP verification), and the verification key should be preserved across steps.

**Validates: Requirements 8.2**

### Property 6: API Integration State Updates

_For any_ successful API call (login, register, OTP verification), the corresponding state should be updated correctly (loading states, form data, verification keys, error states).

**Validates: Requirements 8.3**

### Property 7: Error Toast Notifications

_For any_ error that occurs during authentication operations (invalid credentials, network errors, validation failures), a toast notification should be displayed with an appropriate error message.

**Validates: Requirements 8.4**

### Property 8: Successful Authentication Navigation

_For any_ successful authentication (login or registration), the user should be navigated to the appropriate page (home page for login, login page for registration completion).

**Validates: Requirements 8.5**

### Property 9: Real-Time Validation Feedback

_For any_ form field with validation, when the user types and the value becomes invalid, an error message should appear immediately; when the value becomes valid, the error should clear immediately.

**Validates: Requirements 9.2**

### Property 10: Loading State Indicators

_For any_ asynchronous operation (API calls, OTP sending), while the operation is in progress, a loading indicator should be displayed, and when the operation completes, the indicator should be removed.

**Validates: Requirements 9.3**

### Property 11: Countdown Display Format

_For any_ countdown value greater than 0, the display should show the format "Bạn có thể gửi lại mã sau {countdown}s", and when countdown reaches 0, the display should change to "Không nhận được mã?".

**Validates: Requirements 9.4**

## Error Handling

### Validation Errors

**Strategy**: Use HTML5 validation with custom error messages in Vietnamese.

**Error Types**:

1. **Required Field Errors**: "Email là bắt buộc", "Mật khẩu là bắt buộc"
2. **Format Errors**: "Email không hợp lệ", "Mã OTP phải có 6 số"
3. **Length Errors**: "Mật khẩu phải có ít nhất 6 ký tự"
4. **Match Errors**: "Mật khẩu xác nhận không khớp"

**Display**: Errors shown below each field in red text, with red border on input.

### API Errors

**Strategy**: Catch all API errors and display user-friendly messages via toast notifications.

**Error Types**:

1. **Authentication Errors**: "Email hoặc mật khẩu không đúng"
2. **Network Errors**: "Không thể kết nối đến server. Vui lòng thử lại"
3. **OTP Errors**: "Mã OTP không đúng", "Mã OTP đã hết hạn"
4. **Registration Errors**: "Email đã được sử dụng", "Tên đăng nhập đã tồn tại"

**Display**: Toast notifications with error styling (red background, error icon).

### State Management Errors

**Strategy**: Use try-catch blocks around all state updates and API calls.

**Handling**:

1. Reset loading states in finally blocks
2. Clear sensitive data on errors
3. Preserve form data when possible for user convenience
4. Log errors to console for debugging

### Countdown Timer Edge Cases

**Scenarios**:

1. **Timer at 0**: Disable countdown, enable resend button
2. **Component Unmount**: Clear timer to prevent memory leaks
3. **Multiple Resends**: Reset countdown to 60 seconds each time

## Testing Strategy

### Unit Testing

**Framework**: Jest + React Testing Library

**Test Coverage**:

1. **Component Tests**:

   - FormField renders correctly with all props
   - PasswordField toggles visibility
   - OTPInput accepts only digits
   - OTPInput handles paste events
   - AuthCard renders children correctly

2. **Hook Tests**:

   - useCountdown decrements correctly
   - useCountdown stops at 0
   - useCountdown cleans up on unmount
   - useFormValidation validates required fields
   - useFormValidation validates patterns
   - useFormValidation clears errors

3. **Reducer Tests**:

   - registerReducer handles all action types
   - registerReducer maintains state immutability
   - registerReducer updates correct fields

4. **Integration Tests**:
   - Login flow with valid credentials
   - Login flow with invalid credentials
   - Registration flow complete path
   - OTP verification flow
   - Error handling scenarios

### Property-Based Testing

**Framework**: fast-check (for TypeScript/JavaScript)

**Configuration**: Each property test should run minimum 100 iterations.

**Test Tagging**: Each property-based test must include a comment with format:

```typescript
// Feature: auth-optimization, Property {number}: {property_text}
```

**Property Tests**:

1. **Property 1: Countdown Timer Decrement**

   - Generate random starting values (1-300 seconds)
   - Verify countdown decrements by 1 each second
   - Verify countdown stops at 0

2. **Property 2: OTP Input Accepts Only Digits**

   - Generate random strings (with letters, symbols, numbers)
   - Verify only digits are accepted
   - Verify max length is 6

3. **Property 3: Form Validation Rejects Invalid Inputs**

   - Generate invalid emails, passwords, usernames
   - Verify validation fails with appropriate errors

4. **Property 4: Form Validation Accepts Valid Inputs**

   - Generate valid emails, passwords, usernames
   - Verify validation succeeds

5. **Property 5: Multi-Step Registration Flow Progression**

   - Generate random form states
   - Verify step 2 is blocked without verification key
   - Verify verification key persists

6. **Property 6: API Integration State Updates**

   - Mock API responses (success/error)
   - Verify state updates correctly for all scenarios

7. **Property 7: Error Toast Notifications**

   - Generate various error scenarios
   - Verify toast is called with correct message

8. **Property 8: Successful Authentication Navigation**

   - Mock successful auth responses
   - Verify navigation is triggered

9. **Property 9: Real-Time Validation Feedback**

   - Generate sequences of valid/invalid inputs
   - Verify errors appear/clear immediately

10. **Property 10: Loading State Indicators**

    - Mock async operations with delays
    - Verify loading states toggle correctly

11. **Property 11: Countdown Display Format**
    - Generate countdown values (0-60)
    - Verify display format matches specification

### Performance Testing

**Metrics to Measure**:

1. **Bundle Size**:

   - Before: Measure current bundle size
   - After: Measure optimized bundle size
   - Target: 30-40% reduction

2. **Initial Load Time**:

   - Measure First Contentful Paint (FCP)
   - Measure Time to Interactive (TTI)
   - Target: 10-15% improvement

3. **Code Metrics**:
   - Lines of code reduction
   - Code duplication percentage
   - Component count

**Tools**:

- webpack-bundle-analyzer for bundle analysis
- Lighthouse for performance metrics
- Chrome DevTools for load time measurement

### Visual Regression Testing

**Strategy**: Ensure UI remains identical after optimization.

**Tools**: Percy or Chromatic for visual diff testing

**Test Cases**:

- Login page desktop view
- Login page mobile view
- Register page Step 1 desktop
- Register page Step 1 mobile
- Register page Step 2 desktop
- Register page Step 2 mobile
- Error states
- Loading states

## Implementation Phases

### Phase 1: Foundation (Shared Components & Hooks)

**Duration**: 2-3 days

**Tasks**:

1. Create FormField component
2. Create PasswordField component
3. Create AuthCard component
4. Create useCountdown hook
5. Create useFormValidation hook
6. Write unit tests for all components and hooks

**Deliverables**:

- Reusable components in `src/components/auth/`
- Custom hooks in `src/hooks/`
- Unit tests with >80% coverage

### Phase 2: Dependency Replacement

**Duration**: 3-4 days

**Tasks**:

1. Create custom OTPInput component
2. Implement HTML5 validation patterns
3. Create validation helper functions
4. Replace Zod with HTML5 validation in login page
5. Replace Zod with HTML5 validation in register page
6. Replace input-otp library with custom component
7. Write property-based tests for validation

**Deliverables**:

- Custom OTPInput component (<1KB)
- HTML5 validation patterns file
- Updated login and register pages
- Property-based tests

### Phase 3: Register Page Refactoring

**Duration**: 3-4 days

**Tasks**:

1. Create registerReducer
2. Refactor register page to use useReducer
3. Extract EmailVerificationStep component
4. Extract RegistrationFormStep component
5. Implement code splitting with lazy loading
6. Write integration tests

**Deliverables**:

- Refactored register page (<400 lines)
- Code-split sub-components
- Integration tests

### Phase 4: Optimization & Polish

**Duration**: 2-3 days

**Tasks**:

1. Optimize icon usage
2. Optimize image loading
3. Implement conditional mobile image loading
4. Run bundle analysis
5. Run performance tests
6. Visual regression testing
7. Fix any issues found

**Deliverables**:

- Optimized assets
- Performance metrics report
- Visual regression test results
- Bug fixes

### Phase 5: Validation & Documentation

**Duration**: 1-2 days

**Tasks**:

1. Run all tests (unit, property, integration)
2. Measure bundle size reduction
3. Measure performance improvements
4. Update documentation
5. Code review
6. Final QA

**Deliverables**:

- Test results report
- Performance comparison report
- Updated documentation
- Production-ready code

## Migration Strategy

### Backward Compatibility

**Approach**: Incremental migration with feature flags if needed.

**Steps**:

1. Create new components alongside existing code
2. Test new components thoroughly
3. Replace old components one at a time
4. Keep old code until new code is verified
5. Remove old code after successful migration

### Rollback Plan

**Strategy**: Git-based rollback with clear commit boundaries.

**Checkpoints**:

1. After Phase 1: Can rollback shared components
2. After Phase 2: Can rollback dependency changes
3. After Phase 3: Can rollback register refactor
4. After Phase 4: Can rollback optimizations

**Testing**: Each phase should be tested independently before proceeding.

## Success Criteria

### Functional Requirements

- ✅ All existing authentication features work identically
- ✅ All form validations work correctly
- ✅ All API integrations function properly
- ✅ All error handling works as expected
- ✅ All navigation flows work correctly

### Performance Requirements

- ✅ Bundle size reduced by 30-40%
- ✅ Initial load time improved by 10-15%
- ✅ Code duplication reduced by 15-20%
- ✅ Register page reduced to <400 lines

### Quality Requirements

- ✅ All unit tests pass (>80% coverage)
- ✅ All property-based tests pass (100 iterations each)
- ✅ All integration tests pass
- ✅ Visual regression tests show no differences
- ✅ TypeScript compiles without errors
- ✅ No console errors or warnings

## Risk Assessment

### High Risk

1. **Breaking Existing Functionality**

   - Mitigation: Comprehensive testing at each phase
   - Rollback: Git-based rollback plan

2. **Validation Behavior Changes**
   - Mitigation: Property-based testing to verify equivalence
   - Rollback: Keep Zod as fallback option

### Medium Risk

1. **Performance Regression**

   - Mitigation: Continuous performance monitoring
   - Rollback: Revert specific optimizations

2. **User Experience Changes**
   - Mitigation: Visual regression testing
   - Rollback: Revert UI changes

### Low Risk

1. **Bundle Size Not Meeting Target**

   - Mitigation: Additional optimization techniques
   - Fallback: Accept lower reduction percentage

2. **Development Timeline Overrun**
   - Mitigation: Prioritize high-impact optimizations
   - Fallback: Implement in multiple releases

## Dependencies

### External Libraries (Maintained)

- React 19.1.0
- Next.js 15.5.4
- Redux Toolkit 2.9.0
- Sonner (toast notifications)
- Lucide React (icons)
- Radix UI components

### External Libraries (Removed)

- Zod validation (~14KB) → Replaced with HTML5 validation
- Input-OTP library (~8KB) → Replaced with custom component

### Internal Dependencies

- useAuth hook (maintained)
- Auth service layer (maintained)
- Redux auth slice (maintained)
- Existing UI components (Button, Input, Label, Card)

## Monitoring and Metrics

### Bundle Size Monitoring

**Tool**: webpack-bundle-analyzer

**Metrics**:

- Total bundle size
- Per-page bundle size
- Dependency sizes
- Code splitting effectiveness

### Performance Monitoring

**Tool**: Lighthouse CI

**Metrics**:

- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

### Code Quality Monitoring

**Tools**: ESLint, TypeScript, Jest coverage

**Metrics**:

- Test coverage percentage
- TypeScript error count
- ESLint warning count
- Code duplication percentage

## Future Enhancements

### Potential Optimizations

1. **Icon Sprite System**: Implement SVG sprite system for all icons
2. **Form State Persistence**: Save form data to localStorage
3. **Progressive Enhancement**: Add offline support
4. **Accessibility Improvements**: Enhanced keyboard navigation and screen reader support
5. **Animation Optimization**: Use CSS animations instead of JavaScript where possible

### Scalability Considerations

1. **Additional Auth Methods**: OAuth, social login
2. **Multi-factor Authentication**: Beyond OTP
3. **Password Strength Meter**: Visual feedback for password strength
4. **Internationalization**: Support multiple languages
5. **Theme Support**: Dark mode, custom themes
