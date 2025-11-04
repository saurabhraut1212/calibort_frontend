import React from "react";
import { Formik, Field, Form } from "formik";
import type { FieldProps } from "formik";
import * as Yup from "yup";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import { successToast, errorToast } from "../../utils/toast";
import * as userApi from "../../services/userApi";

interface UserFormValues {
  name: string;
  email: string;
  password?: string;
}

const Schema: Yup.ObjectSchema<UserFormValues> = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters")
});

type Props = {
  initialUser?: userApi.IUser | null;
  onSuccess: () => void;
};

const UserForm: React.FC<Props> = ({ initialUser, onSuccess }) => {
  const isEdit = !!initialUser;

  return (
    <Formik<UserFormValues>
      initialValues={{
        name: initialUser?.name ?? "",
        email: initialUser?.email ?? "",
        password: ""
      }}
      validationSchema={Schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (isEdit && initialUser) {
            const payload = { ...values, email: initialUser.email };
            await userApi.updateUser(initialUser.id, payload);
            successToast("User updated");
          } else {
            await userApi.createUser(values);
            successToast("User created");
          }
          onSuccess();
        } catch (err: unknown) {
          if (err instanceof Error) {
            errorToast(err.message);
          } else {
            errorToast("Error saving user");
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="name">
            {({ field }: FieldProps<UserFormValues["name"]>) => (
              <FormField label="Name" {...field} />
            )}
          </Field>

          <Field name="email">
            {({ field }: FieldProps<UserFormValues["email"]>) => (
              <FormField
                label="Email"
                {...field}
                readOnly={isEdit}
                className={isEdit ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
              />
            )}
          </Field>

          {!isEdit && (
            <Field name="password">
              {({ field }: FieldProps<UserFormValues["password"]>) => (
                <FormField label="Password" type="password" {...field} />
              )}
            </Field>
          )}

          <div className="mt-4 text-right">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
