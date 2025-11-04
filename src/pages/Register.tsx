import React from "react";
import { Formik, Field, Form } from "formik";
import type { FieldProps } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { successToast, errorToast } from "../utils/toast";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
});

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <Formik<RegisterFormValues>
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await api.post("/api/auth/register", values);
              successToast("Registered successfully! Please login.");
              navigate("/login");
            } catch (err: unknown) {
              if (err instanceof Error) {
                errorToast(err.message);
              } else {
                errorToast("Registration failed");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="name">
                {({ field, meta }: FieldProps<RegisterFormValues["name"]>) => (
                  <FormField
                    label="Name"
                    {...field}
                    error={
                      meta.touched && meta.error ? String(meta.error) : null
                    }
                  />
                )}
              </Field>

              <Field name="email">
                {({ field, meta }: FieldProps<RegisterFormValues["email"]>) => (
                  <FormField
                    label="Email"
                    {...field}
                    error={
                      meta.touched && meta.error ? String(meta.error) : null
                    }
                  />
                )}
              </Field>

              {/* Password field with inline error passed to FormField */}
              <Field name="password">
                {({
                  field,
                  meta,
                }: FieldProps<RegisterFormValues["password"]>) => (
                  <FormField
                    label="Password"
                    type="password"
                    {...field}
                    error={
                      meta.touched && meta.error ? String(meta.error) : null
                    }
                  />
                )}
              </Field>

              <div className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Register"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="text-sm mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
