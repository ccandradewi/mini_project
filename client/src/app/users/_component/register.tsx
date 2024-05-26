"use client";
import React, { useEffect } from "react";
import YupPassword from "yup-password";
import * as Yup from "yup";
import { useFormik } from "formik";
import { axiosInstance } from "@/lib/axios.config";
const Register = () => {
  YupPassword(Yup);
  const initialValues = {
    email: "",
    password: "",
    role: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      email: Yup.string().required().email("Invalid email format"),
      password: Yup.string().required().min(6).minNumbers(1).minUppercase(1),
      username: Yup.string().required().min(5),
      role: Yup.string().oneOf(["seller", "buyer"]).required(),
      first_name: Yup.string().required().min(3),
      last_name: Yup.string().required().min(3),
      phone_number: Yup.string()
        .matches(/^[0-9]+$/)
        .min(10)
        .required(),
      reference_code: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axiosInstance().post("/users/v1", values);
        alert(data.message); //alert bisa custom pake shadcn atau sweetalert
      } catch (error) {
        alert("username/email already registered");
      }
    },
  });
  useEffect(() => {
    if (formik.values.role === "seller") {
      formik.setFieldValue("reference_code", "");
    }
  }, [formik.values.role]);
  return (
    <section className="p-3 p-md-4 p-xl-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 bsb-tpl-bg-platinum">
            <div className="d-flex flex-column justify-content-between h-100 p-3 p-md-4 p-xl-5">
              <h3 className="m-0">Welcome!</h3>
              {/* <img /> */}
              <p className="mb-0">
                Not a member yet?{" "}
                <a href="#!" className="link-secondary text-decoration-none">
                  Register now
                </a>
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 bsb-tpl-bg-lotion">
            <div className="p-3 p-md-4 p-xl-5">
              <div className="row">
                <div className="col-12">
                  <div className="mb-5">
                    <h2 className="h3">Registration</h2>
                    <h3 className="fs-6 fw-normal text-secondary m-0">
                      Enter your details to register
                    </h3>
                  </div>
                </div>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="row gy-3 gy-md-4 overflow-hidden">
                  <div className="col-12">
                    <label htmlFor="first_name" className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      {...formik.getFieldProps("first_name")}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="last_name" className="form-label">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      {...formik.getFieldProps("last_name")}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      {...formik.getFieldProps("email")}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="username" className="form-label">
                      Username <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      {...formik.getFieldProps("username")}
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      {...formik.getFieldProps("password")}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6 className="mb-2 pb-1">Role: </h6>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="role"
                        id="role_buyer"
                        value="buyer"
                        checked={formik.values.role === "buyer"}
                        onChange={formik.handleChange}
                      />
                      <label className="form-check-label" htmlFor="role_buyer">
                        Buyer
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="role"
                        id="role_seller"
                        value="seller"
                        checked={formik.values.role === "seller"}
                        onChange={formik.handleChange}
                      />
                      <label className="form-check-label" htmlFor="role_seller">
                        Seller
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="phone_number" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone_number"
                      {...formik.getFieldProps("phone_number")}
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="reference_code" className="form-label">
                      Have a Referral Code?{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="reference_code"
                      {...formik.getFieldProps("reference_code")}
                      placeholder="for example: hab239"
                      disabled={formik.values.role === "seller"}
                    />
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <button
                        className="btn bsb-btn-xl btn-primary"
                        type="submit"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="row">
                <div className="col-12">
                  <hr className="mt-5 mb-4 border-secondary-subtle" />
                  <p className="m-0 text-secondary text-end">
                    Already have an account?{" "}
                    <a href="#!" className="link-primary text-decoration-none">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
