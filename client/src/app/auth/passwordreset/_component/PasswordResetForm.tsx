"use client";

import { axiosInstance } from "@/lib/axios.config";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
const PasswordResetForm = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("invalid email address")
        .required("email is required"),
    }),
    onSubmit: async (values) => {
      try {
        await axiosInstance().post(
          "/users/sendChangePassword",
          {
            email: values.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        formik.resetForm;
        setResponseMessage("Email has been sent. Please check your box");
        Swal.fire({
          title: "Success!",
          text: "Email has been sent. Please check your box",
          icon: "success",
        });
      } catch (error) {
        setResponseMessage("Error" + error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong.",
          icon: "error",
        });
      }
    },
  });
  return (
    <>
      <div className="bg-light py-3 py-md-5">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
              <div className="bg-white p-4 p-md-5 rounded shadow-sm ">
                <div className="row gy-3 mb-5">
                  <div className="flex justify-center col-12">
                    <div className="text-center">
                      <img
                        src="https://i.ibb.co.com/cCF1xH7/Tickzy-3.png"
                        alt="Tixzy Logo"
                        width="175"
                        height="57"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <h2 className="fs-6 fw-normal text-center text-secondary m-0 px-md-5">
                      Provide the email address associated with your account to
                      recover your password.
                    </h2>
                  </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className="row gy-3 gy-md-4 overflow-hidden">
                    <div className="col-12">
                      <label
                        htmlFor="forgetPasswordEmailInput"
                        className="form-label"
                      >
                        Email <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-envelope"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          id="forgetPasswordEmailInput"
                          placeholder="name@example.com"
                          {...formik.getFieldProps("email")}
                        />
                      </div>
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger">{formik.errors.email}</div>
                      ) : null}
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <button
                          className="btn btn-primary btn-lg"
                          type="submit"
                          disabled={!formik.values.email}
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetForm;
