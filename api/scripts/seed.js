// scripts/seed.js

const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Anpassa paths om dina modeller ligger annorlunda
const User = require("../src/models/User");
const Meetup = require("../src/models/Meetup");

const MONGO = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO) {
  console.error("❌ Missing MONGO_URI/MONGODB_URI in .env");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO);
  console.log("✅ Connected to MongoDB");

  // Rensa gamla seeds (valfritt – kommentera om du vill spara befintligt)
  await Promise.all([User.deleteMany({}), Meetup.deleteMany({})]);
  console.log("🧹 Cleared collections");

  // 5 st hosts
  const rawUsers = [
    { name: "Alice Andersson", email: "alice@example.com" },
    { name: "Bob Berg", email: "bob@example.com" },
    { name: "Carmen Carlsson", email: "carmen@example.com" },
    { name: "David Dahl", email: "david@example.com" },
    { name: "Ella Ek", email: "ella@example.com" },
  ];

  const hashed = await bcrypt.hash("Password123!", 12);
  const users = await User.insertMany(
    rawUsers.map((u) => ({ ...u, password: hashed, role: u.role || "user" }))
  );
  console.log(`👤 Inserted ${users.length} users`);

  // Hjälpare
  const pickHost = (i) => users[i % users.length]._id;
  const someAttendees = (hostId) => {
    // 0–3 slumpade attendees (ej host)
    const pool = users
      .map((u) => String(u._id))
      .filter((id) => id !== String(hostId));
    const n = Math.floor(Math.random() * 4);
    const ids = new Set();
    while (ids.size < n) {
      ids.add(pool[Math.floor(Math.random() * pool.length)]);
    }
    return Array.from(ids);
  };

  // 10 st meetups (svenska titlar/texter)
  const meetups = [
    {
      title: "Vandring",
      date: "2025-11-15T09:00:00.000Z",
      location: "Göteborg",
      description:
        "Vi träffas vid Stora Delsjön. Banan är främst på grusvägar, med mindre stigar runt Stora Delsjön än runt Lilla Delsjön. Vi vandrar till Lilla Delsjön och tar en paus och vilar benen vid Kaffestugan Lyckan och Bertilssons stuga.",
      capacity: 25,
    },
    {
      title: "Språkutbyte",
      date: "2025-10-20T17:30:00.000Z",
      location: "Stockholm",
      description: "En meetup för alla som vill lära sig nya språk.",
      capacity: 20,
    },
    {
      title: "Foto",
      date: "2025-08-12T18:00:00.000Z",
      location: "Stockholm",
      description:
        "Vi går runt fina fotoställen i stan och hjälper varandra att bli bättre.",
      capacity: 15,
    },
    {
      title: "Träning",
      date: "2025-07-05T10:00:00.000Z",
      location: "Malmö",
      description: "En meetup där vi delar med oss av våra träningstips.",
      capacity: 20,
    },
    {
      title: "Brädspel",
      date: "2025-09-01T16:00:00.000Z",
      location: "Uppsala",
      description: "En meetup för brädspels-entusiaster.",
      capacity: 12,
    },
    {
      title: "Löpning",
      date: "2025-06-14T08:30:00.000Z",
      location: "Göteborg",
      description: "Gemensam distansrunda i lugnt tempo. Alla nivåer välkomna.",
      capacity: 30,
    },
    {
      title: "Matlagning",
      date: "2025-10-05T15:00:00.000Z",
      location: "Stockholm",
      description:
        "Vi lagar vegetarisk street food tillsammans och byter recept.",
      capacity: 16,
    },
    {
      title: "Bokcirkel",
      date: "2025-09-22T18:30:00.000Z",
      location: "Umeå",
      description: "Vi diskuterar månadens bok över fika.",
      capacity: 14,
    },
    {
      title: "Hackkväll",
      date: "2025-08-28T17:00:00.000Z",
      location: "Stockholm",
      description:
        "Bygg små side projects i grupp, dela idéer och demo i slutet.",
      capacity: 25,
    },
    {
      title: "Yoga i Parken",
      date: "2025-06-21T09:30:00.000Z",
      location: "Lund",
      description: "Mjukt vinyasa-pass utomhus. Ta med egen matta/handduk.",
      capacity: 20,
    },
  ];

  // Koppla host + några registrerade användare
  const docs = meetups.map((m, i) => {
    const host = pickHost(i);
    return {
      ...m,
      host,
      registeredUsers: someAttendees(host),
    };
  });

  const created = await Meetup.insertMany(docs);
  console.log(`📅 Inserted ${created.length} meetups`);

  await mongoose.disconnect();
  console.log("✅ Done. Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
