export interface RegisterState {
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
export type RegisterAction = {
  type: "SET_FIELD";
  field: keyof RegisterState["formData"];
  value: string;
} | {
  type: "SET_STEP";
  step: 1 | 2;
} | {
  type: "SET_OTP_SENT";
  sent: boolean;
} | {
  type: "SET_VERIFICATION_KEY";
  key: string;
} | {
  type: "SET_LOADING";
  loading: boolean;
} | {
  type: "SET_SENDING_OTP";
  sending: boolean;
} | {
  type: "SET_VERIFYING_OTP";
  verifying: boolean;
} | {
  type: "RESET_FORM";
};
export const initialState: RegisterState = {
  currentStep: 1,
  formData: {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    otp: ""
  },
  verificationKey: "",
  otpSent: false,
  isLoading: false,
  isSendingOtp: false,
  isVerifyingOtp: false
};
export const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value
        }
      };
    case "SET_STEP":
      return {
        ...state,
        currentStep: action.step
      };
    case "SET_OTP_SENT":
      return {
        ...state,
        otpSent: action.sent
      };
    case "SET_VERIFICATION_KEY":
      return {
        ...state,
        verificationKey: action.key
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.loading
      };
    case "SET_SENDING_OTP":
      return {
        ...state,
        isSendingOtp: action.sending
      };
    case "SET_VERIFYING_OTP":
      return {
        ...state,
        isVerifyingOtp: action.verifying
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};