import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Assuming you're using Shadcn switch

// Define the validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  description: Yup.string(),
  subGroupTitle: Yup.string(),
  client: Yup.string().nullable(),
  user: Yup.string().required("User is required"),
  isActive: Yup.boolean(),
});

interface GroupFormProps {
  initialValues: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  clients?: { _id: string; name: string }[]; // Dropdown options for clients
  users?: { _id: string; name: string }[]; // Dropdown options for users
}

export default function GroupForm({
  initialValues,
  onSubmit,
  isSubmitting,
  clients = [],
  users = [],
}: GroupFormProps) {
  const formInitialValues = {
    name: initialValues.name || "",
    description: initialValues.description || "",
    subGroupTitle: initialValues.subGroupTitle || "",
    client: initialValues.client || "",
    user: initialValues.user || "",
    isActive: initialValues.isActive ?? true,
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({ errors, touched, handleReset, values, setFieldValue }) => (
        <Form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Field
              as={Input}
              id="name"
              name="name"
              placeholder="Enter group name"
              className={errors.name && touched.name ? "border-red-500" : ""}
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subGroupTitle">Sub Group Title</Label>
            <Field
              as={Input}
              id="subGroupTitle"
              name="subGroupTitle"
              placeholder="Enter sub group title"
              className={
                errors.subGroupTitle && touched.subGroupTitle
                  ? "border-red-500"
                  : ""
              }
            />
            <ErrorMessage
              name="subGroupTitle"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Field
              as={Textarea}
              id="description"
              name="description"
              placeholder="Enter group description"
              className={`resize-none ${
                errors.description && touched.description
                  ? "border-red-500"
                  : ""
              }`}
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Field
              as="select"
              name="client"
              className="w-full border p-2 rounded">
              <option value="">Select client (optional)</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="client"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Field
              as="select"
              name="user"
              className="w-full border p-2 rounded">
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="user"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Switch
              id="isActive"
              checked={values.isActive}
              onCheckedChange={(val) => setFieldValue("isActive", val)}
            />
            <Label htmlFor="isActive">Is Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : initialValues._id
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
