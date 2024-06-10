import { PrismaClient } from "@prisma/client";
import { Buffer } from "buffer";
import process from "process";
const prisma = new PrismaClient();

async function main() {
  await prisma.event.createMany({
    data: [
      {
        user_id: "clwykv5o60000kpn5ddvqwhde", // Replace with actual user ID
        banner: Buffer.from(""), // Placeholder for actual banner data
        title: "Jakarta Music Festival",
        description:
          "An exciting music festival featuring top artists from around the world.",
        start_time: new Date("2024-06-15T18:00:00.000Z"),
        end_time: new Date("2024-06-15T23:00:00.000Z"),
        venue: "Gelora Bung Karno Stadium",
        city: "JABODETABEK",
        location: "Jl. Pintu Satu Senayan, Gelora, Central Jakarta, Jakarta",
        category: "MUSIC",
        promotor: "XYZ Entertainment",
        type: "PAID",
        start_promo: null,
        end_promo: null,
      },
      {
        user_id: "clwym16oy0001s9fx6f1g42kr", // Replace with actual user ID
        banner: Buffer.from(""), // Placeholder for actual banner data
        title: "Bali Art Exhibition",
        description:
          "A showcase of contemporary art from local and international artists.",
        start_time: new Date("2024-07-01T10:00:00.000Z"),
        end_time: new Date("2024-07-10T18:00:00.000Z"),
        venue: "Bali Nusa Dua Convention Center",
        city: "BALI_NUSA_TENGGARA",
        location: "Kawasan Pariwisata Nusa Dua, Kuta Selatan, Bali",
        category: "EXHIBITION",
        promotor: "Bali Art Community",
        type: "PAID",
        start_promo: null,
        end_promo: null,
      },
      {
        user_id: "clwym5ial0002s9fxjwnsba7f", // Replace with actual user ID
        banner: Buffer.from(""), // Placeholder for actual banner data
        title: "Surabaya Tech Conference",
        description:
          "A conference discussing the latest trends in technology and innovation.",
        start_time: new Date("2024-08-20T09:00:00.000Z"),
        end_time: new Date("2024-08-22T17:00:00.000Z"),
        venue: "Grand City Convex Surabaya",
        city: "JAWA",
        location: "Jl. Walikota Mustajab No.1, Ketabang, Genteng, Surabaya",
        category: "CONFERENCE",
        promotor: "Tech Innovators Group",
        type: "PAID",
        start_promo: null,
        end_promo: null,
      },
      {
        user_id: "clwykv5o60000kpn5ddvqwhde", // Replace with actual user ID
        banner: Buffer.from(""), // Placeholder for actual banner data
        title: "Sumatra Marathon",
        description:
          "Join the annual marathon through the scenic landscapes of Sumatra.",
        start_time: new Date("2024-09-05T06:00:00.000Z"),
        end_time: new Date("2024-09-05T12:00:00.000Z"),
        venue: "Bukit Barisan Selatan National Park",
        city: "SUMATRA",
        location: "Lampung, Sumatra",
        category: "SPORTS",
        promotor: "Sumatra Sports Association",
        type: "FREE",
        start_promo: null,
        end_promo: null,
      },
      {
        user_id: "clwym5ial0002s9fxjwnsba7f", // Replace with actual user ID
        banner: Buffer.from(""), // Placeholder for actual banner data
        title: "Makassar Theatre Festival",
        description:
          "A festival celebrating the best in theatre arts with performances from various troupes.",
        start_time: new Date("2024-10-12T19:00:00.000Z"),
        end_time: new Date("2024-10-20T22:00:00.000Z"),
        venue: "Makassar City Hall",
        city: "SULAWESI",
        location: "Jl. Ahmad Yani No.1, Makassar",
        category: "THEATRE",
        promotor: "Makassar Cultural Committee",
        type: "PAID",
        start_promo: null,
        end_promo: null,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
