import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";
import { Group } from "@/types/group";

interface GroupFormProps {
  initialValues: Partial<Group>;
  onSubmit: (values: Partial<Group>) => void;
  isSubmitting: boolean;
}

const GroupSchema = Yup.object().shape({
  name: Yup.string().required("Group name is required"),
  subGroupTitle: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  client: Yup.string().required("Client is required"),
});

const GroupForm: React.FC<GroupFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
}) => {
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    select: (data: Client[]) =>
      data.map((client) => ({ label: client.fullname, value: client._id })),
  });

  return (
    <Formik
      initialValues={{
        name: initialValues?.name || "",
        subGroupTitle: initialValues?.subGroupTitle || "",
        email: initialValues?.email || "",
        password: initialValues?.password || "",
        client: initialValues?.client?._id || "",
      }}
      validationSchema={GroupSchema}
      onSubmit={onSubmit}>
      {({ errors, touched, values, setFieldValue }) => (
    <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="name">Group Name</Label>
      <Field
        as={Input}
        id="name"
        name="name"
        className={errors.name && touched.name ? "border-red-500" : ""}
      />
      <ErrorMessage
        name="name"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>

      
    <div>
      <Label htmlFor="client">Client</Label>
      <Field
        as="select"
        id="client"
        name="client"
        className={`w-full p-2 border rounded-md ${
          errors.client && touched.client ? "border-red-500" : "border-gray-300"
        }`}>
        <option value="">Select a client</option>
        {clients?.map((client) => (
          <option key={client.value} value={client.value}>
            {client.label}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name="client"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  
 
  
    <div>
      <Label htmlFor="email">Username</Label>
      <Field
        as={Input}
        name="email"
        className={errors.email && touched.email ? "border-red-500" : ""}
      />
      <ErrorMessage
        name="email"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  
    <div>
      <Label htmlFor="password">Password</Label>
      <Field
        as={Input}
        name="password"
        className={errors.password && touched.password ? "border-red-500" : ""}
      />
      <ErrorMessage
        name="password"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>





    <div>
      <Label htmlFor="subGroupTitle">Sub Group Title</Label>
      <Field
        as={Input}
        id="subGroupTitle"
        name="subGroupTitle"
        className={errors.subGroupTitle && touched.subGroupTitle ? "border-red-500" : ""}
      />
      <ErrorMessage
        name="subGroupTitle"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  
    <div className="col-span-2 text-right">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Saving..."
          : initialValues._id
          ? "Update Group"
          : "Create Group"}
      </Button>
    </div>
  </Form>
  
      )}
    </Formik>
  );
};

export default GroupForm;
