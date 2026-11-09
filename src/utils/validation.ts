import type { LoginData, RegisterData, } from "../api/auth";

export type LoginErrors = Partial<Record<keyof LoginData, string>>;
export type RegisterErrors = Partial<Record<keyof RegisterData, string>>;

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = ({email, password}: LoginData): LoginErrors => {
  const errors: LoginErrors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!EmailRegex.test(email)) {
    errors.email = "Invalid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
 
export const validateRegister = ({name, email, password}: RegisterData, ConfirmPassword?: string): RegisterErrors => {
  const errors: RegisterErrors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!EmailRegex.test(email)) {
    errors.email = "Invalid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  if (ConfirmPassword !== undefined && password !== ConfirmPassword) {
    errors.password = "Passwords do not match";
  }

  return errors;
};