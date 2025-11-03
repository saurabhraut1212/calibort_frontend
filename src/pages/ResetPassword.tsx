import React from "react";
import { Formik, Field, Form } from "formik";
import type { FieldProps } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { successToast, errorToast } from "../utils/toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";

// ✅ Define proper form type
interface ResetPasswordFormValues {
  newPassword: string;
}

// ✅ Yup schema
const Schema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required")
});

const ResetPassword: React.FC = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const token = search.get("token") ?? "";
  const email = search.get("email") ?? "";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>

        <Formik<ResetPasswordFormValues>
          initialValues={{ newPassword: "" }}
          validationSchema={Schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await api.post("/api/auth/reset-password", {
                email,
                token,
                newPassword: values.newPassword
              });
              successToast("Password reset successfully. Please login.");
              navigate("/login");
            } catch (err: unknown) {
              if (err instanceof Error) {
                errorToast(err.message);
              } else {
                errorToast("Failed to reset password");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="newPassword">
                {({ field }: FieldProps<ResetPasswordFormValues["newPassword"]>) => (
                  <FormField label="New Password" type="password" {...field} />
                )}
              </Field>

              <div className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
