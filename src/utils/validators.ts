import * as Yup from "yup";

export const emailSchema = Yup.string().email("Invalid email").required("Email is required");
export const passwordSchema = Yup.string().min(8, "Minimum 8 characters").required("Password is required");
