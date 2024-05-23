import React from "react";
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
    address: "",
    gender: "",
    dob: "",
    reference_code: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      email: Yup.string().required().email("Invalid email format"),
      password: Yup.string().required().min(6).minNumbers(1).minUppercase(1),
      username: Yup.string().required().min(5),
      role: Yup.string().oneOf(["seller", "buyer"]).required(),
      first_name: Yup.string().required(),
      last_name: Yup.string().required(),
      phone_number: Yup.string()
        .matches(/^[0-9]+$/)
        .min(10)
        .required(),
      address: Yup.string().required(),
      gender: Yup.string().oneOf(["male", "female", "other"]).required(),
      dob: Yup.date().required().nullable(),
      reference_code: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axiosInstance().post("/users/v2", values);
        alert(data.message); //alert bisa custom pake shadcn atau sweetalert
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <section className="p-3 p-md-4 p-xl-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 bsb-tpl-bg-platinum">
            <div className="d-flex flex-column justify-content-between h-100 p-3 p-md-4 p-xl-5">
              <h3 className="m-0">Welcome!</h3>
              <img />
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
              <form action="#!">
                <div className="row gy-3 gy-md-4 overflow-hidden">
                  <div className="col-12">
                    <label htmlFor="firstName" className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      id="firstName"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="lastName" className="form-label">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      id="lastName"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      ${formik.values.email}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      placeholder="name@example.com"
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
                      name="password"
                      id="password"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="iAgree"
                        id="iAgree"
                        required
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="iAgree"
                      >
                        I agree to the{" "}
                        <a
                          href="#!"
                          className="link-primary text-decoration-none"
                        >
                          terms and conditions
                        </a>
                      </label>
                    </div>
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
