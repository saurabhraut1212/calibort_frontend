import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FieldProps } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { useAppDispatch } from "../features/auth/hooks";
import { setTokens } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import { errorToast } from "../utils/toast";

// ✅ Define proper type for form values
interface LoginFormValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required")
});

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>

        <Formik<LoginFormValues>
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const resp = await api.post("/api/auth/login", values);
              const data = resp.data.data;
              dispatch(
                setTokens({
                  accessToken: data.accessToken,
                  refreshToken: data.refreshToken,
                  email: values.email
                })
              );
              navigate("/");
            } catch (err: unknown) {
              if (err instanceof Error) {
                errorToast(err.message);
              } else {
                errorToast("Login failed");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* ✅ Strongly typed FieldProps */}
              <Field name="email">
                {({ field }: FieldProps<LoginFormValues["email"]>) => (
                  <FormField label="Email" {...field} />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field name="password">
                {({ field }: FieldProps<LoginFormValues["password"]>) => (
                  <FormField label="Password" type="password" {...field} />
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />

              <div className="flex items-center justify-between mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <Link to="/forgot-password" className="text-sm text-blue-600">
                  Forgot?
                </Link>
              </div>
            </Form>
          )}
        </Formik>

        <p className="text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
