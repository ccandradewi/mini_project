"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "@/lib/axios.config";
// import FormWrapper from "./Wrapper";
import { useAppDispatch } from "@/app/hooks";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { AxiosError } from "axios";
import { userLogin } from "@/lib/redux/middleware/auth.middleware";
import { useLoading } from "@/utils/hooks";
import Link from "next/link";

const LoginForm: React.FC = () => {
  const router = useRouter();

  const { isLoading, setIsLoading } = useLoading();

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        // setIsLoading(true);
        await dispatch(
          userLogin({
            email: values.email,
            password: values.password,
          })
        );
        formik.resetForm;
        // router.refresh();
        // router.push("/");
        window.location.reload();
      } catch (error) {
        // if (error instanceof AxiosError) alert(error.response?.data?.message);
        // else if (error instanceof Error) console.log(error.message);
        console.log(error);
      }
      // finally {
      //   setIsLoading(false);
      // }
    },
  });

  const isFormEmpty = formik.values.email && formik.values.password;

  return (
    <div className="w-screen h-screen">
      <div className="flex flex-row">
        <div className="w-1/2">ini foto</div>

        <div className="w-1/2 h-screen flex flex-col items-center justify-center">
          <div className="w-[100px]">
            <img
              src="https://i.ibb.co.com/yqxWWt2/Tickzy-2.png"
              alt="tickzy logo"
            />
          </div>
          <h1 className="pt-8">Welcome Back!</h1>
          <div className="pb-8">Please log into your account.</div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col justify-center items-center"
          >
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                {...formik.getFieldProps("email")}
              />
              <label htmlFor="floatingInput">Email address</label>
              {formik.touched.email && formik.errors.email ? (
                <div className="text-danger">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                {...formik.getFieldProps("password")}
              />
              <label htmlFor="floatingPassword">Password</label>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-danger">{formik.errors.password}</div>
              ) : null}
            </div>
            <Link
              href="/auth/passwordreset"
              className="link-primary text-decoration-none"
            >
              Forgot password?
            </Link>
            <button
              type="submit"
              className="btn my-4 btn-neutral"
              disabled={!isFormEmpty}
            >
              Sign In
            </button>
            <p className="py-4">
              {"Don't have an account? "}
              <a href="/auth/register" className="text-black">
                {" "}
                Register here.
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
