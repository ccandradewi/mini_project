"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { axiosInstance } from "@/lib/axios.config";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";
import Link from "next/link";

const validationSchema = Yup.object().shape({
  newPassword: Yup.string().required("New password is required"),
  confirmPassword: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

const ChangePassword = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const { token } = useParams();

  const handleSubmit = async (values: any) => {
    try {
      await axiosInstance().post(
        "/users/verifyChangePassword",
        {
          token: token,
          newPassword: values.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponseMessage(
        "New password has been set. Please login with your new password."
      );
    } catch (error) {
      console.log(error);
      setResponseMessage("Error: " + error);
    }
  };

  return (
    <>
      <div className="">
        <div className="flex flex-col justify-center items-center h-screen">
          <a href="/" className="w-[130px]">
            <img
              src="https://i.ibb.co.com/cCF1xH7/Tickzy-3.png"
              alt="tickzy logo"
            />
          </a>
          <h1 className="pt-8">Reset Password</h1>
          <div className="pb-8">Please input your new password</div>
          <center>
            <Formik
              initialValues={{
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              className=""
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form>
                  <div className="form-floating mb-3">
                    <Field
                      type="password"
                      name="newPassword"
                      className="form-control"
                      id="newPassword"
                      placeholder="New Password"
                    />
                    <label htmlFor="newPassword">New Password</label>
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-700"
                    />
                  </div>
                  <div className="form-floating mb-3">
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn my-4 btn-dark"
                    disabled={isSubmitting || !isValid || !dirty}
                  >
                    Change password
                  </button>
                  {responseMessage && (
                    <div className="mt-4 text-center">
                      <p>{responseMessage}</p>
                      <Link href="/auth/login">Go to login</Link>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </center>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
