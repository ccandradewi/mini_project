// "use client";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { axiosInstance } from "@/lib/axios.config";

// interface Event {
//   id: string;
//   banner: string;
//   title: string;
//   description: string;
//   start_time: string;
//   location: string;
//   ticket_price: number;
//   promotor: string;
//   discount_price?: number;
//   promo?: string;
//   venue: string;
// }


// //   const searchParams = useSearchParams();

// //   const [event, setEvent] = useState<Event | null>(null);

// //   useEffect(() => {
// //     const fetchEventData = async () => {
// //       try {
// //         const eventId = searchParams.get("eventId");
// //         if (!eventId) return;

// //         const response = await axiosInstance().get(`/event/detail/${eventId}`);
// //         const eventData: Event = response.data;
// //         setEvent(eventData);
// //       } catch (error) {
// //         console.error("Error fetching event data:", error);
// //       }
// //     };

// //     fetchEventData();
// //   }, [searchParams]);



//   return (
//     <div className="w-screen">
//       <div className="px-10">
//         <div className="text-sm breadcrumbs pt-6">
//           <ul>
//             <li>
//               <a href="/">Home</a>
//             </li>
//             <li>{event.title}</li>
//           </ul>
//         </div>

//         <div className="flex flex-row px-8">
//           <div>
//             {event.banner && <img src={event.banner} alt={event.title} />}
//           </div>
//           <div>{/* Render other event details */}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventDetails;
