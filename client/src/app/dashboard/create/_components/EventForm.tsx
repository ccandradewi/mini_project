"use client";
import { axiosInstance } from "@/lib/axios.config";
import { TEvent } from "@/models/event.model";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import * as Yup from "yup";

function EventForm() {
  const router = useRouter();

  const initialValues = {
    banner: null,
    title: "",
    description: "",
    venue: "",
    city: "",
    start_time: "",
    end_time: "",
    location: "",
    category: "",
    promotor: "",
    type: "",
    availability: 0,
    ticket_price: 0,
    promo: "",
    image: null,
    start_promo: "",
    end_promo: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      banner: Yup.mixed().required("Banner is required"),
      title: Yup.string()
        .required("Title is required")
        .min(5, "Title must be at least 5 characters"),
      description: Yup.string(),
      venue: Yup.string()
        .required("Venue is required")
        .min(5, "Venue must be at least 5 characters"),
      location: Yup.string().required("Location is required"),
      start_time: Yup.date().required("Start date is required"),
      end_time: Yup.date().required("End date is required"),
      city: Yup.string()
        .oneOf([
          "JABODETABEK",
          "JAWA",
          "SUMATRA",
          "KALIMANTAN",
          "SULAWESI",
          "BALI_NUSA_TENGGARA",
          "PAPUA_MALUKU",
        ])
        .required("City is required"),
      category: Yup.string()
        .oneOf(["MUSIC", "SPORTS", "EXHIBITION", "CONFERENCE", "THEATRE"])
        .required("Category is required"),
      promotor: Yup.string()
        .required("Promotor is required")
        .min(3, "Promotor must be at least 3 characters"),
      type: Yup.string().oneOf(["PAID", "FREE"]).required("Type is required"),
      availability: Yup.number().required("Availability is required"),
      ticket_price: Yup.number().required("Ticket price is required"),
      promo: Yup.string().oneOf([
        "TEN_PERCENT",
        "TWENTY_FIVE_PERCENT",
        "FIFTY_PERCENT",
      ]),
      start_promo: Yup.date(),
      end_promo: Yup.date(),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Form values:", values);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("venue", values.venue);
        formData.append("city", values.city);
        formData.append(
          "start_time",
          new Date(values.start_time).toISOString()
        );
        formData.append("end_time", new Date(values.end_time).toISOString());
        formData.append("location", values.location);
        formData.append("category", values.category);
        formData.append("promotor", values.promotor);
        formData.append("type", values.type);
        formData.append("availability", values.availability.toString());
        formData.append(
          "ticket_price",
          values.type === "free" ? "0" : values.ticket_price.toString()
        );

        if (values.promo) {
          formData.append("promo", values.promo);
          formData.append("start_promo", values.start_promo);
          formData.append("end_promo", values.end_promo);
        }

        if (values.banner) {
          formData.append("banner", values.banner);
        }
        console.log("try creating event", formData);

        await axiosInstance().post("/event", formData);
        router.push("/dashboard/my-event");
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          alert(error.response?.data.message);
        }
      }
    },
  });

  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <div className="h-screen">
      <div className="flex flex-col px-4 items-center justify-center py-6">
        <h2 className="text-lg font-bold">Create an Event</h2>

        <form className="w-1/2" onSubmit={formik.handleSubmit}>
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

          <div>
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
            <div className="flex flex-col w-full">
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
                <option value="MUSIC">Music</option>
                <option value="SPORTS">Sports</option>
                <option value="EXHIBITION">Exhibition</option>
                <option value="CONFERENCE">Conference</option>
                <option value="THEATRE">Theatre</option>
              </select>
              {formik.errors.category && formik.touched.category && (
                <div className="text-red-600 text-xs">
                  {formik.errors.category}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 w-full">
            <select
              name="city"
              className="select select-bordered w-full text-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
            >
              <option value="" disabled>
                Area*
              </option>
              <option value="JABODETABEK">JABODETABEK</option>
              <option value="JAWA">JAWA</option>
              <option value="SUMATRA">SUMATRA</option>
              <option value="KALIMANTAN">KALIMANTAN</option>
              <option value="SULAWESI">SULAWESI</option>
              <option value="BALI_NUSA_TENGGARA">BALI_NUSA_TENGGARA</option>
              <option value="PAPUA_MALUKU">PAPUA_MALUKU</option>
            </select>
            {formik.errors.city && formik.touched.city && (
              <div className="text-red-600 text-xs">{formik.errors.city}</div>
            )}
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

            <div className="flex flex-col w-1/2">
              <span className="text-sm pb-1">Event location</span>
              <input
                type="text"
                name="location"
                placeholder="Address*"
                className="input input-bordered w-full max-w-xs"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.location}
              />
              {formik.errors.location && formik.touched.location && (
                <div className="text-red-600 text-xs">
                  {formik.errors.location}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-6 pt-2">
            <div className="flex flex-col w-[320px]">
              <label htmlFor="start_time" className="py-2 text-sm">
                Start date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="start_time"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
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
              <label htmlFor="end_time" className="py-2 text-sm">
                End date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="end_time"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
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
                    value="FREE"
                    className="radio radio-primary"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.type === "FREE"}
                  />
                  <span className="ml-2">Free</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="PAID"
                    className="radio radio-primary"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.type === "PAID"}
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
                type="number"
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
              <label htmlFor="ticket_price" className="text-sm py-2">
                Price
              </label>
              <input
                type="number"
                name="ticket_price"
                placeholder="Ticket price"
                className="input input-bordered w-full max-w-xs"
                disabled={formik.values.type === "FREE"}
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
            <label htmlFor="description" className="text-sm pb-1">
              Event description
            </label>
            <textarea
              name="description"
              placeholder="Description"
              className="textarea textarea-bordered w-full h-[200px]"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.errors.description && formik.touched.description && (
              <div className="text-red-600 text-xs">
                {formik.errors.description}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="promo" className="text-sm py-2">
              Promo
            </label>
            <select
              name="promo"
              className="select select-bordered w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.promo}
            >
              <option value="">Select Promo (optional)</option>
              <option value="TEN_PERCENT">10% off</option>
              <option value="TWENTY_FIVE_PERCENT">25% off</option>
              <option value="FIFTY_PERCENT">50% off</option>
            </select>
            {formik.errors.promo && formik.touched.promo && (
              <div className="text-red-600 text-xs">{formik.errors.promo}</div>
            )}
          </div>

          <div className="flex flex-row gap-6 pt-2">
            <div className="flex flex-col w-full">
              <label htmlFor="start_promo" className="py-3 text-sm">
                Start Promo
              </label>
              <input
                type="date"
                name="start_promo"
                className="input input-bordered w-full max-w-xs"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.start_promo}
              />
              {formik.errors.start_promo && formik.touched.start_promo && (
                <div className="text-red-600 text-xs">
                  {formik.errors.start_promo}
                </div>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="end_promo" className="py-3 text-sm">
                End Promo
              </label>
              <input
                type="date"
                name="end_promo"
                className="input input-bordered w-full max-w-xs"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.end_promo}
              />
              {formik.errors.end_promo && formik.touched.end_promo && (
                <div className="text-red-600 text-xs">
                  {formik.errors.end_promo}
                </div>
              )}
            </div>
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
