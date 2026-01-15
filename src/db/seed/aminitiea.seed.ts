import db from "..";
import { amenities } from "../schema";

/**
 * Amenities inspired by:
 * - Booking.com
 * - Airbnb
 * - Agoda
 * - Real hotel PMS systems
 */
const HOTEL_AMENITIES = [
  // 🏨 Basic
  "Free WiFi",
  "Air Conditioning",
  "Heating",
  "24-hour Front Desk",
  "Daily Housekeeping",
  "Room Service",
  "Elevator",
  "Power Backup",

  // 🛏️ Room
  "Private Bathroom",
  "Flat-screen TV",
  "Cable TV",
  "Wardrobe / Closet",
  "Desk",
  "Soundproof Rooms",
  "Balcony",
  "City View",
  "Sea View",

  // 🍽️ Food & Drink
  "Restaurant",
  "Bar",
  "Cafe",
  "Breakfast Available",
  "Breakfast Buffet",
  "Mini Bar",
  "Kitchen",
  "Kitchenette",

  // 🚗 Parking & Transport
  "Free Parking",
  "Paid Parking",
  "Valet Parking",
  "Airport Shuttle",
  "Car Rental",
  "Bicycle Rental",

  // 🏊 Wellness & Leisure
  "Swimming Pool",
  "Outdoor Pool",
  "Indoor Pool",
  "Spa",
  "Sauna",
  "Steam Room",
  "Fitness Center",
  "Yoga Classes",
  "Massage",

  // 👨‍👩‍👧 Family
  "Family Rooms",
  "Kids Pool",
  "Kids Play Area",
  "Babysitting Services",

  // 🐶 Pets
  "Pet Friendly",
  "Pet Bowls",
  "Pet Basket",

  // 🧹 Services
  "Laundry Service",
  "Dry Cleaning",
  "Ironing Service",
  "Luggage Storage",
  "Concierge",
  "Tour Desk",

  // 💼 Business
  "Business Center",
  "Meeting Rooms",
  "Conference Hall",
  "Printer",
  "Fax / Photocopying",

  // 🔐 Safety & Security
  "CCTV",
  "Fire Extinguishers",
  "Smoke Alarms",
  "Security Alarm",
  "24-hour Security",
  "In-room Safe",

  // ♿ Accessibility
  "Wheelchair Accessible",
  "Accessible Bathroom",
  "Lower Bathroom Sink",
  "Grab Rails",

  // 🌿 Outdoors
  "Garden",
  "Terrace",
  "Sun Deck",
  "Outdoor Furniture",

  // 🎉 Activities
  "Live Music",
  "Night Club",
  "Game Room",
  "Movie Nights",
];

export default {
  name: "Hotel Amenities Seeder",

  async run() {
    for (const name of HOTEL_AMENITIES) {
      await db
        .insert(amenities)
        .values({ name })
        .onConflictDoNothing();
    }

    console.log("✅ Hotel amenities seeded");
  },
};
