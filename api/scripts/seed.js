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
        "Vi träffas vid Stora Delsjön. Banan är främst på grusvägar, med mindre stigar runt Stora Delsjön än runt Lilla Delsjön. Vi vandrar till Lilla Delsjön och tar en paus och vilar benen vid Kaffestugan Lyckan och Bertilssons stuga. Ta gärna med vattenflaska, mellanmål och kläder efter väder så att du håller dig bekväm under hela turen.",
      capacity: 25,
    },
    {
      title: "Språkutbyte",
      date: "2025-10-20T17:30:00.000Z",
      location: "Stockholm",
      description:
        "En meetup för alla som vill lära sig nya språk i en avslappnad miljö. Vi börjar med en kort introduktionsrunda där alla berättar vilka språk de vill öva på, och därefter delar vi in oss i mindre grupper. Fokus ligger på enkla samtalsövningar, vardagsfraser och att våga prata, oavsett nivå. Ta gärna med anteckningsbok och ett öppet sinne för nya kulturer.",
      capacity: 20,
    },
    {
      title: "Foto",
      date: "2025-08-12T18:00:00.000Z",
      location: "Stockholm",
      description:
        "Vi går runt fina fotoställen i stan och hjälper varandra att bli bättre. Kvällen börjar med en kort genomgång av grundläggande fototeknik som komposition, ljus och perspektiv, och sedan går vi ut tillsammans för att testa i praktiken. Du kan använda mobilkamera eller systemkamera, allt funkar. I slutet samlas vi igen, visar några av våra favoritbilder och delar tips och erfarenheter.",
      capacity: 15,
    },
    {
      title: "Träning",
      date: "2025-07-05T10:00:00.000Z",
      location: "Malmö",
      description:
        "En meetup där vi delar med oss av våra träningstips och peppar varandra. Vi börjar med en gemensam uppvärmning och går sedan igenom några enkla övningar som kan anpassas efter nivå, både styrka och kondition. Fokus ligger på gemenskap snarare än prestation, så alla kan vara med oavsett tidigare erfarenhet. Ta med vattenflaska, bekväma träningskläder och gärna en yogamatta om du har.",
      capacity: 20,
    },
    {
      title: "Brädspel",
      date: "2025-09-01T16:00:00.000Z",
      location: "Uppsala",
      description:
        "En meetup för brädspels-entusiaster i alla åldrar. Vi samlas runt ett par bord, går igenom vilka spel som finns på plats och delar upp oss efter intresse och svårighetsgrad. Det kommer att finnas både lättsamma partyspel och lite mer strategiska utmaningar, och du får gärna ta med egna favoriter. Fokus är på att ha kul, lära känna nya människor och upptäcka spel du kanske aldrig provat tidigare.",
      capacity: 12,
    },
    {
      title: "Löpning",
      date: "2025-06-14T08:30:00.000Z",
      location: "Göteborg",
      description:
        "Gemensam distansrunda i lugnt tempo där alla nivåer är välkomna. Vi startar med en kort genomgång av dagens rutt och en lätt uppvärmning innan vi springer iväg tillsammans. Tempot anpassas så att gruppen kan hålla ihop, och vi lägger in korta gångpauser vid behov. Målet är att få en skön tur, kunna prata under tiden och kanske få med sig några tips om teknik, andning och återhämtning.",
      capacity: 30,
    },
    {
      title: "Matlagning",
      date: "2025-10-05T15:00:00.000Z",
      location: "Stockholm",
      description:
        "Vi lagar vegetarisk street food tillsammans och byter recept och idéer. Träffen inleds med att vi går igenom dagens rätter och fördelar uppgifterna i gruppen, så att alla får vara med i köket oavsett tidigare erfarenhet. Under tiden pratar vi om kryddor, smaksättning och hur man kan göra rätterna både enkla och vardagsvänliga. I slutet dukar vi upp en gemensam buffé och provar allt vi har lagat tillsammans.",
      capacity: 16,
    },
    {
      title: "Bokcirkel",
      date: "2025-09-22T18:30:00.000Z",
      location: "Umeå",
      description:
        "Vi diskuterar månadens bok över fika i en varm och avslappnad miljö. Träffen börjar med en kort runda där alla får dela sina spontana intryck, och sedan går vi djupare in på teman, karaktärer och favoritcitat. Det är helt okej att komma även om du inte hunnit läsa klart, men meddela gärna i början så slipper vi spoila alltför mycket. Ta gärna med egna läsförslag till framtida träffar.",
      capacity: 14,
    },
    {
      title: "Hackkväll",
      date: "2025-08-28T17:00:00.000Z",
      location: "Stockholm",
      description:
        "Bygg små side projects i grupp, dela idéer och demo i slutet av kvällen. Vi börjar med en kort presentationsrunda där alla berättar vad de vill jobba på eller lära sig mer om, och därefter hittar vi naturliga team. Du kan koda själv, para-programmera eller bara sitta bredvid och lära dig. Det finns plats för både nybörjare och mer erfarna utvecklare, och fokus ligger på att leka, testa och inspirera varandra.",
      capacity: 25,
    },
    {
      title: "Yoga i Parken",
      date: "2025-06-21T09:30:00.000Z",
      location: "Lund",
      description:
        "Mjukt vinyasa-pass utomhus där vi fokuserar på andning, närvaro och rörelseglädje. Klassen passar både dig som är nybörjare och dig som yogat tidigare, och instruktören ger alternativ för olika nivåer. Vi börjar med lugna uppvärmningsövningar, går vidare till enkla flöden och avslutar med en längre avslappning i savasana. Ta med egen matta eller handduk, en vattenflaska och gärna en extra tröja om det blåser.",
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
