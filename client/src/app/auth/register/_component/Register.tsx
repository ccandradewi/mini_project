import React, { useEffect } from "react";
import YupPassword from "yup-password";
import * as Yup from "yup";
import { useFormik } from "formik";
import { axiosInstance } from "@/lib/axios.config";
import Link from "next/link";
import { TUser } from "@/models/user.model";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const router = useRouter();

  YupPassword(Yup);

  const initialValues = {
    email: "",
    password: "",
    role: "buyer",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    reference_code: "",
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
    onSubmit: async (values: TUser) => {
      try {
        console.log("masuk");
        await axiosInstance().post("/users/v1", values);
        router.push(`/verification?email=${values.email}`);
        // alert(data.message);
        //alert bisa custom pake shadcn atau sweetalert
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          Swal.fire({
            title: "Oops...",
            text: error.response?.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "An unexpected error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    },
  });
  useEffect(() => {
    console.log(formik.values);
    if (formik.values.role === "seller") {
      formik.setFieldValue("reference_code", "");
    }
  }, [formik.values]);
  return (
    <>
      <div className="w-screen">
        <div className="flex flex-row">
          <div className="w-1/2">
            <img
              src="https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="h-full w-full object-cover position-bottom saturate-0"
            />
          </div>

          <div className="w-1/2 flex flex-col items-center justify-center lg:px-20 lg:py-10">
            <div className="p-3 p-md-4 p-xl-5">
              <div className="col-12">
                <div className="mb-5">
                  <h2 className="h3">Registration</h2>
                  <h3 className="fs-6 fw-normal text-secondary m-0">
                    Enter your details to register
                  </h3>
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
                    />{" "}
                    <div className=" text-red-700 text-xs">
                      {formik.errors.first_name}
                    </div>
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
                    <div className=" text-red-700 text-xs">
                      {formik.errors.last_name}
                    </div>
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
                    <div className=" text-red-700 text-xs">
                      {formik.errors.email}
                    </div>
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
                    <div className=" text-red-700 text-xs">
                      {formik.errors.username}
                    </div>
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
                    <div className=" text-red-700 text-xs">
                      {formik.errors.password}
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6 className="mb-2 pb-1">Role: </h6>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="role"
                        value="buyer"
                        checked={formik.values.role === "buyer"}
                        onChange={(e) =>
                          formik.setFieldValue("role", e.target.value)
                        }
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
                        value="seller"
                        checked={formik.values.role === "seller"}
                        onChange={(e) =>
                          formik.setFieldValue("role", e.target.value)
                        }
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
                    <div className=" text-red-700 text-xs">
                      {formik.errors.phone_number}
                    </div>
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
                      disabled={formik.values.role == "seller"}
                    />
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <button className="btn bsb-btn-xl btn-dark" type="submit">
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
                    <Link
                      href="/auth/login"
                      passHref
                      className="text-[#3b3a7a] font-semibold text-decoration-none hover:text-[#666699]"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
