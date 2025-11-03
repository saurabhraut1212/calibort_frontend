import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import type { FieldProps } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { successToast, errorToast } from "../utils/toast";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";

// ✅ Proper form value interface
interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(8, "Minimum 8 characters").required("Password is required")
});

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
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
                {({ field }: FieldProps<RegisterFormValues["name"]>) => (
                  <FormField label="Name" {...field} />
                )}
              </Field>
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field name="email">
                {({ field }: FieldProps<RegisterFormValues["email"]>) => (
                  <FormField label="Email" {...field} />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field name="password">
                {({ field }: FieldProps<RegisterFormValues["password"]>) => (
                  <FormField label="Password" type="password" {...field} />
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />

              <div className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Register"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="text-sm mt-4">
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
