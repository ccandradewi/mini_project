"use client";
import { axiosInstance } from "@/lib/axios.config";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { imageSrc } from "@/utils/image.render";

interface EventData {
  id: string;
  banner: string | null;
  title: string;
  description: string;
  venue: string;
  city: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string;
  promotor: string;
  type: string;
  availability: number;
  ticket_price: number;
  promo: string;
  start_promo: string;
  end_promo: string;
}

function EditEventForm() {
  const router = useRouter();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      banner: "",
      title: "", // Default value for title
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
      start_promo: "",
      end_promo: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      venue: Yup.string().required("Venue is required"),
      city: Yup.string().required("City is required"),
      start_time: Yup.date().required("Start time is required"),
      end_time: Yup.date()
        .required("End time is required")
        .min(Yup.ref("start_time"), "End time must be after start time"),
      location: Yup.string().required("Location is required"),
      category: Yup.string()
        .oneOf(["MUSIC", "SPORTS", "EXHIBITION", "CONFERENCE", "THEATRE"])
        .required("Category is required"),
      promotor: Yup.string()
        .required("Promotor is required")
        .min(3, "Promotor must be at least 3 characters"),
      //   type: Yup.string().oneOf(["PAID", "FREE"]).required("Type is required"),
      availability: Yup.number()
        .required("Availability is required")
        .typeError("Amount must be a number"),
      ticket_price: Yup.number()
        .required("Ticket price is required")
        .typeError("Amount must be a number"),
      promo: Yup.string()
        .oneOf(["TEN_PERCENT", "TWENTY_FIVE_PERCENT", "FIFTY_PERCENT"])
        .nullable(),
      start_promo: Yup.date().nullable(),
      end_promo: Yup.date().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Form values:", values);

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("venue", values.venue);
        formData.append("city", values.city);
        formData.append("start_time", values.start_time);
        formData.append("end_time", values.end_time);
        formData.append("location", values.location);
        formData.append("category", values.category);
        formData.append("promotor", values.promotor);
        formData.append("type", values.type);
        formData.append("availability", values.availability.toString());
        formData.append(
          "ticket_price",
          values.type === "FREE" ? "0" : values.ticket_price.toString()
        );

        if (values.promo) {
          formData.append("promo", values.promo);
          formData.append("start_promo", values.start_promo);
          formData.append("end_promo", values.end_promo);
        }

        if (values.banner) {
          formData.append("banner", values.banner);
        }

        formData.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });

        await axiosInstance().patch(`/event/${id}`, formData);
        router.push("/dashboard/my-event");
      } catch (error) {
        console.error("Error updating event:", error);
        if (error instanceof AxiosError) {
          alert(error.response?.data.message);
        }
      }
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance().get(`/event/detail/${id}`);
        const event = response.data.data;
        console.log("Fetched event data:", event);

        const imgSrc = `http://localhost:8000/event/image/${event.id}`;

        if (event.id) {
          formik.setValues({
            banner: imgSrc,
            title: event.title,
            description: event.description,
            venue: event.venue,
            city: event.city,
            start_time: event.start_time,
            end_time: event.end_time,
            location: event.location,
            category: event.category,
            promotor: event.promotor,
            type: event.type,
            availability: event.availability,
            ticket_price: event.ticket_price,
            promo: event.promo || "",
            start_promo: event.start_promo || "",
            end_promo: event.end_promo || "",
          });
        }
        setImagePreview(imgSrc);
        console.log(event.banner);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const imageRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("banner", file);

      const tempUrl = URL.createObjectURL(file);

      setImagePreview(tempUrl);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col px-4 items-center justify-center py-6">
        <h2 className="text-lg font-bold">Edit Event</h2>
        <form className="w-1/2" onSubmit={formik.handleSubmit}>
          <div className="pb-2">
            {formik.errors.banner && (
              <div className="text-red-600 text-xs">{formik.errors.banner}</div>
            )}
            <img
              src={imagePreview}
              alt="event banner"
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
              onChange={handleFileChange}
            />
          </div>
          {/* Title and Venue */}
          <div className="flex flex-row gap-6">
            {/* Title */}
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

            {/* Venue */}
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
          {/* Category Field */}
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
          {/* City Field */}
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
          {/* Promotor and Location Fields */}
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
          {/* Date Fields */}
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
          {/* Event Type */}{" "}
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
                    onChange={(e) =>
                      formik.setFieldValue("type", e.target.value)
                    }
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
                    onChange={(e) =>
                      formik.setFieldValue("type", e.target.value)
                    }
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
          {/* Ticket Availability and Price */}
          <div className="flex flex-row gap-6 py-3">
            <div className="flex flex-col w-full">
              <label htmlFor="availability" className="text-sm py-2">
                Ticket stock
              </label>
              <input
                type="text"
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
                type="text"
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
          {/* Event Description */}
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
          {/* Promo */}
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
              disabled={formik.values.type === "FREE"}
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
          {/* Promo Date Fields */}
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
                disabled={formik.values.type === "FREE"}
                value={
                  formik.values.start_promo
                    ? new Date(formik.values.start_promo)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
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
                disabled={formik.values.type === "FREE"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={
                  formik.values.end_promo
                    ? new Date(formik.values.end_promo)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
              />
              {formik.errors.end_promo && formik.touched.end_promo && (
                <div className="text-red-600 text-xs">
                  {formik.errors.end_promo}
                </div>
              )}
            </div>
          </div>
          {/* Rest of the form fields */}
          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={formik.isSubmitting}
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEventForm;
