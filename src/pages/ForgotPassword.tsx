import React from "react";
import { Formik, Field, Form } from "formik";
import type { FieldProps } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { successToast, errorToast } from "../utils/toast";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";

// ✅ Define form type
interface ForgotPasswordFormValues {
  email: string;
}

// ✅ Yup validation schema
const Schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required")
});

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>

        <Formik<ForgotPasswordFormValues>
          initialValues={{ email: "" }}
          validationSchema={Schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await api.post("/api/auth/forgot-password", values);
              successToast("If the email exists, a reset link has been sent.");
            } catch (err: unknown) {
              if (err instanceof Error) {
                errorToast(err.message);
              } else {
                errorToast("An unexpected error occurred.");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="email">
                {({ field }: FieldProps<ForgotPasswordFormValues["email"]>) => (
                  <FormField label="Email" {...field} />
                )}
              </Field>

              <div className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
