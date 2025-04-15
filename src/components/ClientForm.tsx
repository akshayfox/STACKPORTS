import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { getTemplates } from "@/services/templateService";
import { Template } from "@/types/editor";

interface ClientFormProps {
  initialValues: Partial<Client>;
  onSubmit: (values: Partial<Client>) => void;
  isSubmitting: boolean;
}

const ClientSchema = Yup.object().shape({
  fullname: Yup.string().required("Full name is required"),
  place: Yup.string().required("Place is required"),
  contact: Yup.string()
    .matches(/^\d{10}$/, "Please enter a valid 10-digit phone number")
    .required("Contact number is required"),
  grouptitle: Yup.string().required("Group title is required"),
  template: Yup.string().required("Template is required"),
});

const ClientForm: React.FC<ClientFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
}) => {
  console.log(initialValues,'initialValues')
  const { data: templates = [] } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
    select: (data) =>
      data.map((template: Template) => ({
        label: template.name,
        value: template._id,
      })),
  });


  console.log(templates,'templates')
  

  return (
    <Formik
    initialValues={{
      fullname: initialValues?.fullname || "",
      place: initialValues?.place || "",
      contact: initialValues?.contact || "",
      grouptitle: initialValues?.grouptitle || "",
      template: initialValues?.template?._id || "",
      isActive: initialValues?.isActive ?? true,
    }}
    
      validationSchema={ClientSchema}
      onSubmit={onSubmit}>
      {({ errors, touched, values, setFieldValue }) => (
        <>
        <Form className="space-y-4">
          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Field
              as={Input}
              id="fullname"
              name="fullname"
              className={
                errors.fullname && touched.fullname ? "border-red-500" : ""
              }
            />
            <ErrorMessage
              name="fullname"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Label htmlFor="place">Place</Label>
            <Field
              as={Input}
              id="place"
              name="place"
              className={errors.place && touched.place ? "border-red-500" : ""}
            />
            <ErrorMessage
              name="place"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contact">Contact Number</Label>
            <Field
              as={Input}
              id="contact"
              name="contact"
              className={
                errors.contact && touched.contact ? "border-red-500" : ""
              }
            />
            <ErrorMessage
              name="contact"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Label htmlFor="grouptitle">Group Title</Label>
            <Field
              as={Input}
              id="grouptitle"
              name="grouptitle"
              className={
                errors.grouptitle && touched.grouptitle ? "border-red-500" : ""
              }
            />
            <ErrorMessage
              name="grouptitle"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Label htmlFor="template">Template</Label>
            <Field
              as="select"
              id="template"
              name="template"
              className={`w-full p-2 border rounded-md ${
                errors.template && touched.template
                  ? "border-red-500"
                  : "border-gray-300"
              }`}>
              <option value="999">Select a template</option>
              {templates?.length > 0 ? (
                templates.map((template:any) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))
              ) : (
                <option disabled>No templates available</option>
              )}
            </Field>
            <ErrorMessage
              name="template"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={values.isActive}
              onCheckedChange={(checked) => setFieldValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialValues._id
              ? "Update Client"
              : "Create Client"}
          </Button>
        </Form>
        </>
      )}
    </Formik>
  );
};

export default ClientForm;
