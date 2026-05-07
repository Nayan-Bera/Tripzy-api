import { and, eq } from "drizzle-orm";
import db from "..";
import {
  amenities,
  bookingRooms,
  bookings,
  hotelAmenities,
  hotelDocuments,
  hotelPolicies,
  hotels,
  images,
  payments,
  properties,
  reviews,
  roomAvailabilities,
  rooms,
  users,
} from "../schema";
import { Seeder } from "./type";

const ownerEmail = "owner@demo.com";
const guestEmail = "user@demo.com";

const demoHotels = [
  {
    name: "Tripzy Marina Bay",
    contact: "+91-98765-10001",
    city: "Goa",
    state: "Goa",
    country: "India",
    zip: "403516",
    location: "15.5525,73.7517",
    verified: true,
    status: "active" as const,
    amenities: [
      "Free WiFi",
      "Swimming Pool",
      "Sea View",
      "Restaurant",
      "Airport Shuttle",
      "Spa",
      "24-hour Security",
    ],
    policies: {
      checkInTime: "14:00",
      checkOutTime: "11:00",
      cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
      refundPolicy: "Refunds are processed within 5-7 business days.",
    },
    properties: [
      {
        title: "Marina Bay Beach Resort",
        description:
          "Beachside resort with sea-facing rooms, pool access, and easy access to Candolim nightlife.",
        address: "Candolim Beach Road, Near Sinquerim Jetty",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      },
      {
        title: "Marina Bay Heritage Villa",
        description:
          "Portuguese-style villa stay with private balconies, garden breakfast, and quiet work corners.",
        address: "Fort Aguada Road, Candolim",
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      },
    ],
  },
  {
    name: "Tripzy Metro Heights",
    contact: "+91-98765-10002",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    zip: "560001",
    location: "12.9716,77.5946",
    verified: true,
    status: "active" as const,
    amenities: [
      "Free WiFi",
      "Business Center",
      "Meeting Rooms",
      "Fitness Center",
      "Free Parking",
      "Breakfast Buffet",
      "Laundry Service",
    ],
    policies: {
      checkInTime: "13:00",
      checkOutTime: "10:30",
      cancellationPolicy: "One-night charge applies inside 24 hours.",
      refundPolicy: "Eligible refunds return to the original payment method.",
    },
    properties: [
      {
        title: "Metro Heights Business Hotel",
        description:
          "Central business hotel near MG Road with fast WiFi, meeting rooms, and compact premium rooms.",
        address: "MG Road, Ashok Nagar",
        image:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      },
      {
        title: "Metro Heights Serviced Suites",
        description:
          "Long-stay suites with kitchenette, workspace, laundry, and quick metro connectivity.",
        address: "Church Street, Central Bengaluru",
        image:
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
      },
    ],
  },
  {
    name: "Tripzy Lake Palace",
    contact: "+91-98765-10003",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    zip: "313001",
    location: "24.5854,73.7125",
    verified: true,
    status: "active" as const,
    amenities: [
      "Free WiFi",
      "City View",
      "Restaurant",
      "Terrace",
      "Valet Parking",
      "Concierge",
      "Tour Desk",
    ],
    policies: {
      checkInTime: "15:00",
      checkOutTime: "11:00",
      cancellationPolicy: "Free cancellation up to 72 hours before check-in.",
      refundPolicy: "Partial refunds may apply for festival dates.",
    },
    properties: [
      {
        title: "Lake Palace Courtyard",
        description:
          "Boutique courtyard property with lake views, rooftop dining, and heritage interiors.",
        address: "Near Lake Pichola, Chandpole",
        image:
          "https://images.unsplash.com/photo-1602002418082-a4443e081dd1",
      },
      {
        title: "Lake Palace Haveli Rooms",
        description:
          "Traditional haveli rooms with carved windows, local decor, and sunset terrace seating.",
        address: "Gangaur Ghat Marg",
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      },
    ],
  },
  {
    name: "Tripzy Himalayan Nest",
    contact: "+91-98765-10004",
    city: "Manali",
    state: "Himachal Pradesh",
    country: "India",
    zip: "175131",
    location: "32.2432,77.1892",
    verified: false,
    status: "inactive" as const,
    amenities: [
      "Free WiFi",
      "Heating",
      "Mountain View",
      "Cafe",
      "Garden",
      "Power Backup",
      "Pet Friendly",
    ],
    policies: {
      checkInTime: "12:00",
      checkOutTime: "10:00",
      cancellationPolicy: "Free cancellation up to 7 days before check-in.",
      refundPolicy: "No refund for weather-related no-shows.",
    },
    properties: [
      {
        title: "Himalayan Nest Cottage",
        description:
          "Wooden cottage stay with heated rooms, valley-facing balconies, and cafe-style common areas.",
        address: "Old Manali Road, Manu Temple Area",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      },
      {
        title: "Himalayan Nest Orchard Stay",
        description:
          "Quiet orchard property for families with garden seating, bonfire space, and private bathrooms.",
        address: "Naggar Road, Prini",
        image:
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
      },
    ],
  },
  {
    name: "Tripzy Heritage Stay",
    contact: "+91-98765-10005",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    zip: "700016",
    location: "22.5726,88.3639",
    verified: true,
    status: "active" as const,
    amenities: [
      "Free WiFi",
      "24-hour Front Desk",
      "Restaurant",
      "Cafe",
      "Elevator",
      "Daily Housekeeping",
      "CCTV",
    ],
    policies: {
      checkInTime: "14:00",
      checkOutTime: "12:00",
      cancellationPolicy: "Free cancellation up to 24 hours before check-in.",
      refundPolicy: "Refunds are issued after checkout review.",
    },
    properties: [
      {
        title: "Heritage Stay Park Street",
        description:
          "Classic city hotel near restaurants, museums, and shopping with comfortable rooms.",
        address: "Park Street Area",
        image:
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      },
      {
        title: "Heritage Stay Riverside",
        description:
          "Riverside rooms with easy access to Howrah Bridge, local food walks, and family suites.",
        address: "Strand Road, BBD Bagh",
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      },
    ],
  },
];

const roomTemplates = [
  { name: "Comfort Single", type: "single" as const, pricePerHour: "499.00", pricePerDay: "2499.00", capacity: 1 },
  { name: "Deluxe Double", type: "double" as const, pricePerHour: "799.00", pricePerDay: "3999.00", capacity: 2 },
  { name: "Premium Suite", type: "suite" as const, pricePerHour: "1499.00", pricePerDay: "7499.00", capacity: 4 },
];

async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error(`Seed user missing: ${email}. Run users seeder first.`);
  }

  return user;
}

async function findOrCreateAmenity(name: string) {
  const existing = await db.query.amenities.findFirst({
    where: eq(amenities.name, name),
  });

  if (existing) {
    return existing;
  }

  const [created] = await db.insert(amenities).values({ name }).returning();
  return created;
}

const demoHotelsSeeder: Seeder = {
  name: "Demo Hotels, Properties, Rooms, Amenities Seeder",

  async run() {
    const owner = await getUserByEmail(ownerEmail);
    const guest = await getUserByEmail(guestEmail);

    for (const item of demoHotels) {
      let hotel = await db.query.hotels.findFirst({
        where: and(eq(hotels.name, item.name), eq(hotels.ownerId, owner.id)),
      });

      if (!hotel) {
        [hotel] = await db
          .insert(hotels)
          .values({
            name: item.name,
            contact: item.contact,
            ownerId: owner.id,
            verified: item.verified,
            status: item.status,
          })
          .returning();
      }

      const policy = await db.query.hotelPolicies.findFirst({
        where: eq(hotelPolicies.hotelId, hotel.id),
      });

      if (!policy) {
        await db.insert(hotelPolicies).values({
          hotelId: hotel.id,
          ...item.policies,
        });
      }

      const document = await db.query.hotelDocuments.findFirst({
        where: eq(hotelDocuments.hotelId, hotel.id),
      });

      if (!document) {
        await db.insert(hotelDocuments).values([
          {
            hotelId: hotel.id,
            type: "license",
            fileUrl: `https://example.com/demo-documents/${hotel.id}/license.pdf`,
            uploadedBy: owner.id,
            verified: item.verified,
          },
          {
            hotelId: hotel.id,
            type: "tax",
            fileUrl: `https://example.com/demo-documents/${hotel.id}/tax.pdf`,
            uploadedBy: owner.id,
            verified: item.verified,
          },
        ]);
      }

      for (const amenityName of item.amenities) {
        const amenity = await findOrCreateAmenity(amenityName);

        await db
          .insert(hotelAmenities)
          .values({
            hotelId: hotel.id,
            amenityId: amenity.id,
          })
          .onConflictDoNothing();
      }

      for (const propertyItem of item.properties) {
        let property = await db.query.properties.findFirst({
          where: and(
            eq(properties.hotelId, hotel.id),
            eq(properties.title, propertyItem.title)
          ),
        });

        if (!property) {
          [property] = await db
            .insert(properties)
            .values({
              hotelId: hotel.id,
              title: propertyItem.title,
              description: propertyItem.description,
              address: propertyItem.address,
              city: item.city,
              state: item.state,
              country: item.country,
              zip: item.zip,
              location: item.location,
            })
            .returning();
        }

        const propertyImageUrl = `${propertyItem.image}?auto=format&fit=crop&w=1200&q=80`;
        const propertyImage = await db.query.images.findFirst({
          where: and(
            eq(images.propertyId, property.id),
            eq(images.url, propertyImageUrl)
          ),
        });

        if (!propertyImage) {
          await db.insert(images).values({
            propertyId: property.id,
            url: propertyImageUrl,
            uploadedBy: owner.id,
          });
        }

        for (const roomTemplate of roomTemplates) {
          let room = await db.query.rooms.findFirst({
            where: and(
              eq(rooms.propertyId, property.id),
              eq(rooms.name, roomTemplate.name)
            ),
          });

          if (!room) {
            [room] = await db
              .insert(rooms)
              .values({
                propertyId: property.id,
                ...roomTemplate,
              })
              .returning();
          }

          const availability = await db.query.roomAvailabilities.findFirst({
            where: eq(roomAvailabilities.roomId, room.id),
          });

          if (!availability) {
            await db.insert(roomAvailabilities).values(
              [1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => ({
                roomId: room.id,
                dayOfWeek,
                openTime: "00:00",
                closeTime: "23:59",
              }))
            );
          }

          const roomImageUrl = `${propertyItem.image}?auto=format&fit=crop&w=900&q=80&room=${roomTemplate.type}`;
          const roomImage = await db.query.images.findFirst({
            where: and(eq(images.roomId, room.id), eq(images.url, roomImageUrl)),
          });

          if (!roomImage) {
            await db.insert(images).values({
              roomId: room.id,
              url: roomImageUrl,
              uploadedBy: owner.id,
            });
          }
        }

        const review = await db.query.reviews.findFirst({
          where: and(eq(reviews.userId, guest.id), eq(reviews.propertyId, property.id)),
        });

        if (!review) {
          await db.insert(reviews).values({
            userId: guest.id,
            propertyId: property.id,
            rating: item.verified ? 5 : 4,
            comment: item.verified
              ? "Clean rooms, smooth check-in, and exactly the kind of stay shown in the listing."
              : "Promising property with helpful staff. Waiting for final verification before full launch.",
          });
        }

        const booking = await db.query.bookings.findFirst({
          where: eq(bookings.propertyId, property.id),
        });

        if (!booking) {
          const [createdBooking] = await db
            .insert(bookings)
            .values({
              userId: guest.id,
              propertyId: property.id,
              checkIn: new Date("2026-06-15T14:00:00.000Z"),
              checkOut: new Date("2026-06-17T11:00:00.000Z"),
              status: item.verified ? "confirmed" : "pending",
              otpCode: "123456",
              qrCode: `DEMO-${property.id}`,
            })
            .returning();

          const firstRoom = await db.query.rooms.findFirst({
            where: eq(rooms.propertyId, property.id),
          });

          if (firstRoom) {
            await db.insert(bookingRooms).values({
              bookingId: createdBooking.id,
              roomId: firstRoom.id,
              quantity: 1,
            });
          }

          await db.insert(payments).values({
            bookingId: createdBooking.id,
            amount: item.verified ? "3999.00" : "2499.00",
            paymentMethod: "card",
            status: item.verified ? "completed" : "pending",
          });
        }
      }
    }

    console.log("Demo hotels, properties, rooms, policies, documents, amenities, reviews, and bookings seeded");
  },
};

export default demoHotelsSeeder;
