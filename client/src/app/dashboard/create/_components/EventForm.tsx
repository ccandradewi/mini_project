"use client";
import { axiosInstance } from "@/lib/axios.config";
import { TEvent } from "@/models/event.model";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { PiImageSquareFill } from "react-icons/pi";
import * as Yup from "yup";

enum CategoryName {
  MUSIC = "Music",
  SPORTS = "Sports",
  EXHIBITION = "Exhibition",
  CONFERENCE = "Conference",
  THEATRE = "Theatre",
}

enum LocationName {
  JABODETABEK = "Jabodetabek",
  JAWA = "Pulau Jawa",
  SUMATRA = "Pulau Sumatra",
  KALIMANTAN = "Pulau Kalimantan",
  SULAWESI = "Pulau Sulawesi",
  BALI_NUSA_TENGGARA = "Bali dan Nusa Tenggara",
  PAPUA_MALUKU = "Papua dan  Maluku",
}

enum Promo {
  NO_PROMO = "No discount",
  TEN_PERCENT = "10% off",
  TWENTY_FIVE_PERCENT = "25% off",
  FIFTY_PERCENT = "50%",
}

function EventForm() {
  const router = useRouter();

  const initialValues = {
    banner: null,
    title: "",
    desc: "",
    venue: "",
    city: "",
    start_date: "",
    end_date: "",
    location: "",
    category: "",
    promotor: "",
    type: "",
    availability: 0,
    ticket_price: 0,
    promo: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      banner: Yup.mixed().required(),
      title: Yup.string().required().min(5),
      desc: Yup.string(),
      venue: Yup.string().required().min(5),
      location: Yup.string().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
      city: Yup.string().oneOf(Object.values(LocationName)).required(),
      category: Yup.string().oneOf(Object.values(CategoryName)).required(),
      promotor: Yup.string().required().min(3),
      type: Yup.string().oneOf(["paid", "free"]).required(),
      availability: Yup.number().required(),
      // price: Yup.number().when("type", {
      //   is: "paid",
      //   then: Yup.number().required().min(1),
      //   otherwise: Yup.number().notRequired(),
      // }),
      // ticket_price: Yup.lazy((value, context) => {
      //   return context.parent.type === "paid"
      //     ? Yup.number().required().min(1)
      //     : Yup.number().notRequired();
      // }),
      ticket_price: Yup.number().required(),
      promo: Yup.number().notRequired(),
    }),
    onSubmit: async (values: TEvent) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title || "");
        formData.append("desc", values.desc || "");
        formData.append("venue", values.venue || "");
        formData.append("city", values.city || "");
        formData.append("start_time", values.start_time?.toISOString() || "");
        formData.append("end_time", values.end_time?.toISOString() || "");
        formData.append("location", values.location || "");
        formData.append("category", values.category || "");
        formData.append("promotor", values.promotor || "");
        formData.append("type", values.type || "");
        formData.append("availability", values.availability?.toString() || "0");
        formData.append(
          "price",
          values.type === "free" ? "0" : values.ticket_price?.toString() || "0"
        );
        formData.append("promo", values.promo || "");
        if (values.banner) {
          formData.append("banner", values.banner);
        }

        await axiosInstance().post("/event", values);
        router.push("/dashboard");
        console.log("create event");
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) alert(error.response?.data.message);
      }
    },
  });

  // useEffect(() => {
  //   console.log(formik.values);
  //   if (formik.values.type === "free") {
  //     formik.setFieldValue("price", 0);
  //   }
  // }, [formik.values])

  const imageRef = useRef<HTMLInputElement>(null);
  return (
    <div className="h-screen">
      <div className="flex flex-col px-4 items-center justify-center py-6">
        <h2 className="text-lg font-bold">Create an Event</h2>

        <form action="" className="w-1/2" onSubmit={formik.handleSubmit}>
          <div className="pb-2">
            {formik.errors.banner && (
              <div className="text-red-600 text-xs">{formik.errors.banner}</div>
            )}
            <img
              src={
                formik.values.banner
                  ? URL.createObjectURL(formik.values.banner)
                  : "https://assets.loket.com/images/banner-event.jpg"
              }
              alt=""
              className="rounded-xl w-full"
              onClick={() => imageRef.current?.click()}
            />
          </div>

          <div className="">
            <input
              type="file"
              ref={imageRef}
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.currentTarget.files) {
                  formik.setFieldValue("banner", e.currentTarget.files[0]);
                }
              }}
            />
          </div>

          <div className="flex flex-row gap-6">
            <div className="flex flex-col w-full ">
              <input
                type="text"
                name="title"
                placeholder="Event title*"
                className="input input-bordered w-full max-w-xs"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
              {formik.errors.title && formik.touched.title && (
                <div className="text-red-600 text-xs">
                  {formik.errors.title}
                </div>
              )}
            </div>

            <div className="flex flex-col w-full">
              <input
                type="text"
                name="venue"
                placeholder="Venue*"
                className="input input-bordered w-full max-w-xs"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.venue}
              />
              {formik.errors.venue && formik.touched.venue && (
                <div className="text-red-600 text-xs">
                  {formik.errors.venue}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <div className="pt-3 w-full">
              <select
                name="category"
                className="select select-bordered w-full text-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.category}
              >
                <option value="" disabled>
                  Event Category*
                </option>
                {Object.values(CategoryName).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {formik.errors.category && formik.touched.category && (
                <div className="text-red-600 text-xs">
                  {formik.errors.category}
                </div>
              )}
            </div>

            <div className="pt-3 w-full">
              <select
                name="location"
                className="select select-bordered w-full text-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
              >
                <option value="" disabled>
                  Area*
                </option>
                {Object.values(LocationName).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {formik.errors.city && formik.touched.city && (
                <div className="text-red-600 text-xs">{formik.errors.city}</div>
              )}
            </div>
          </div>

          <div className="flex flex-row pt-3  gap-6">
            <div className="flex flex-col w-1/2">
              <span className="text-sm pb-1">Organized by</span>
              <input
                type="text"
                name="promotor"
                placeholder="Event promoter*"
                className="input input-bordered w-full max-w-xs"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.promotor}
              />
              {formik.errors.promotor && formik.touched.promotor && (
                <div className="text-red-600 text-xs">
                  {formik.errors.promotor}
                </div>
              )}
            </div>

            {/* TODO: */}
            <div className="flex flex-col w-1/2">
              <span className="text-sm pb-1">Event location</span>
              <input
                type="text"
                placeholder="Address*"
                className="input input-bordered w-full max-w-xs"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.location}
              />
            </div>
          </div>

          <div className="flex flex-row gap-6 pt-2">
            <div className="flex flex-col w-[320px]">
              <label htmlFor="start_time" className="py-2 text-sm">
                Start date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <PiImageSquareFill className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="date"
                  name="start_time"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={
                    formik.values.start_time
                      ? new Date(formik.values.start_time)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                />
                {formik.errors.start_time && formik.touched.start_time && (
                  <div className="text-red-600 text-xs">
                    {formik.errors.start_time}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col w-[320px]">
              <label htmlFor="end_date" className="py-2 text-sm">
                End date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <PiImageSquareFill className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={
                    formik.values.end_time
                      ? new Date(formik.values.end_time)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                />
                {formik.errors.end_time && formik.touched.end_time && (
                  <div className="text-red-600 text-xs">
                    {formik.errors.end_time}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-6 pt-2">
            <div className="flex flex-col w-full">
              <label htmlFor="type" className="py-3 text-sm">
                Event type
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="free"
                    className="radio radio-primary"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.type === "free"}
                  />
                  <span className="ml-2">Free</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="paid"
                    className="radio radio-primary"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.type === "paid"}
                    // defaultChecked
                  />
                  <span className="ml-2">Paid</span>
                </label>
              </div>
              {formik.errors.type && formik.touched.type && (
                <div className="text-red-600 text-xs">{formik.errors.type}</div>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-6 py-3">
            <div className="flex flex-col w-full">
              <label htmlFor="availability" className="text-sm py-2">
                Ticket stock
              </label>
              <input
                type="string"
                name="availability"
                placeholder="Ticket stock*"
                className="input input-bordered w-full max-w-xs"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.availability}
              />
              {formik.errors.availability && formik.touched.availability && (
                <div className="text-red-600 text-xs">
                  {formik.errors.availability}
                </div>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="Ticket price" className="text-sm py-2">
                {" "}
                Price
              </label>
              <input
                type="string"
                placeholder="Ticket price"
                className="input input-bordered w-full max-w-xs"
                disabled={formik.values.type === "free"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ticket_price}
              />
              {formik.errors.ticket_price && formik.touched.ticket_price && (
                <div className="text-red-600 text-xs">
                  {formik.errors.ticket_price}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm pb-1">Event description</span>
            <textarea
              // type="text"
              placeholder="Description"
              className="input input-bordered w-full h-[200px]"
            />
            {formik.errors.desc && formik.touched.desc && (
              <div className="text-red-600 text-xs">{formik.errors.desc}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={formik.isSubmitting}
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
