// Initiate

const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

  await Promise.all([User.deleteMany({}), Meetup.deleteMany({})]);
  console.log("🧹 Cleared collections");

  // Data

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

  const pickHost = (i) => users[i % users.length]._id;
  const someAttendees = (hostId) => {
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

  const meetups = [
    // ----- 5 GAMLA (före 2025-11-04) -----
    {
      title: "Vandring",
      date: "2025-10-01T09:00:00.000Z",
      location: "Göteborg",
      description:
        "Vi träffas vid Stora Delsjön. Banan är främst på grusvägar, med mindre stigar runt Stora Delsjön än runt Lilla Delsjön. Vi vandrar till Lilla Delsjön och tar en paus och vilar benen vid Kaffestugan Lyckan och Bertilssons stuga. Ta gärna med vattenflaska, mellanmål och kläder efter väder så att du håller dig bekväm under hela turen.",
      capacity: 25,
    },
    {
      title: "Språkutbyte",
      date: "2025-10-05T17:30:00.000Z",
      location: "Stockholm",
      description:
        "En meetup för alla som vill lära sig nya språk i en avslappnad miljö. Vi börjar med en kort introduktionsrunda där alla berättar vilka språk de vill öva på, och därefter delar vi in oss i mindre grupper. Fokus ligger på enkla samtalsövningar, vardagsfraser och att våga prata, oavsett nivå. Ta gärna med anteckningsbok och ett öppet sinne för nya kulturer.",
      capacity: 20,
    },
    {
      title: "Foto",
      date: "2025-10-10T18:00:00.000Z",
      location: "Stockholm",
      description:
        "Vi går runt fina fotoställen i stan och hjälper varandra att bli bättre. Kvällen börjar med en kort genomgång av grundläggande fototeknik som komposition, ljus och perspektiv, och sedan går vi ut tillsammans för att testa i praktiken. Du kan använda mobilkamera eller systemkamera, allt funkar. I slutet samlas vi igen, visar några av våra favoritbilder och delar tips och erfarenheter.",
      capacity: 15,
    },
    {
      title: "Träning",
      date: "2025-10-15T10:00:00.000Z",
      location: "Malmö",
      description:
        "En meetup där vi delar med oss av våra träningstips och peppar varandra. Vi börjar med en gemensam uppvärmning och går sedan igenom några enkla övningar som kan anpassas efter nivå, både styrka och kondition. Fokus ligger på gemenskap snarare än prestation, så alla kan vara med oavsett tidigare erfarenhet. Ta med vattenflaska, bekväma träningskläder och gärna en yogamatta om du har.",
      capacity: 20,
    },
    {
      title: "Brädspel",
      date: "2025-10-20T16:00:00.000Z",
      location: "Uppsala",
      description:
        "En meetup för brädspels-entusiaster i alla åldrar. Vi samlas runt ett par bord, går igenom vilka spel som finns på plats och delar upp oss efter intresse och svårighetsgrad. Det kommer att finnas både lättsamma partyspel och lite mer strategiska utmaningar, och du får gärna ta med egna favoriter. Fokus är på att ha kul, lära känna nya människor och upptäcka spel du kanske aldrig provat tidigare.",
      capacity: 12,
    },

    // ----- 15 FRAMTIDA (efter 2025-11-05) -----
    {
      title: "Löpning",
      date: "2025-11-06T08:30:00.000Z",
      location: "Göteborg",
      description:
        "Gemensam distansrunda i lugnt tempo där alla nivåer är välkomna. Vi startar med en kort genomgång av dagens rutt och en lätt uppvärmning innan vi springer iväg tillsammans. Tempot anpassas så att gruppen kan hålla ihop, och vi lägger in korta gångpauser vid behov. Målet är att få en skön tur, kunna prata under tiden och kanske få med sig några tips om teknik, andning och återhämtning.",
      capacity: 30,
    },
    {
      title: "Matlagning",
      date: "2025-11-10T15:00:00.000Z",
      location: "Stockholm",
      description:
        "Vi lagar vegetarisk street food tillsammans och byter recept och idéer. Träffen inleds med att vi går igenom dagens rätter och fördelar uppgifterna i gruppen, så att alla får vara med i köket oavsett tidigare erfarenhet. Under tiden pratar vi om kryddor, smaksättning och hur man kan göra rätterna både enkla och vardagsvänliga. I slutet dukar vi upp en gemensam buffé och provar allt vi har lagat tillsammans.",
      capacity: 16,
    },
    {
      title: "Bokcirkel",
      date: "2025-11-15T18:30:00.000Z",
      location: "Umeå",
      description:
        "Vi diskuterar månadens bok över fika i en varm och avslappnad miljö. Träffen börjar med en kort runda där alla får dela sina spontana intryck, och sedan går vi djupare in på teman, karaktärer och favoritcitat. Det är helt okej att komma även om du inte hunnit läsa klart, men meddela gärna i början så slipper vi spoila alltför mycket. Ta gärna med egna läsförslag till framtida träffar.",
      capacity: 14,
    },
    {
      title: "Hackkväll",
      date: "2025-11-20T17:00:00.000Z",
      location: "Stockholm",
      description:
        "Bygg små side projects i grupp, dela idéer och demo i slutet av kvällen. Vi börjar med en kort presentationsrunda där alla berättar vad de vill jobba på eller lära sig mer om, och därefter hittar vi naturliga team. Du kan koda själv, para-programmera eller bara sitta bredvid och lära dig. Det finns plats för både nybörjare och mer erfarna utvecklare, och fokus ligger på att leka, testa och inspirera varandra.",
      capacity: 25,
    },
    {
      title: "Yoga i Parken",
      date: "2025-11-25T09:30:00.000Z",
      location: "Lund",
      description:
        "Mjukt vinyasa-pass utomhus där vi fokuserar på andning, närvaro och rörelseglädje. Klassen passar både dig som är nybörjare och dig som yogat tidigare, och instruktören ger alternativ för olika nivåer. Vi börjar med lugna uppvärmningsövningar, går vidare till enkla flöden och avslutar med en längre avslappning i savasana. Ta med egen matta eller handduk, en vattenflaska och gärna en extra tröja om det blåser.",
      capacity: 20,
    },
    {
      title: "Filmkväll",
      date: "2025-11-28T19:00:00.000Z",
      location: "Göteborg",
      description:
        "Vi ses för en avslappnad filmkväll med snacks och samtal efteråt. Gruppen röstar fram kvällens film på plats, och efter visningen pratar vi om favoritkaraktärer, scener och teman. Du behöver inte vara filmexpert, det räcker att du gillar att se film i gott sällskap.",
      capacity: 22,
    },
    {
      title: "Konstworkshop",
      date: "2025-12-02T18:00:00.000Z",
      location: "Stockholm",
      description:
        "En kreativ kväll där vi testar olika tekniker som akvarell, tusch och collage. Inga förkunskaper krävs och material finns på plats. Vi börjar med enkla övningar för att komma igång och avslutar med att alla får visa upp något de skapat om de vill.",
      capacity: 18,
    },
    {
      title: "Brunch & Nätverkande",
      date: "2025-12-05T11:00:00.000Z",
      location: "Malmö",
      description:
        "Vi möts över en avslappnad brunch och pratar om jobb, studier och sidoprojekt. Tanken är att skapa nya kontakter utan stel stämning eller säljsnack. Ta gärna med visitkort eller LinkedIn om du vill, men fokus ligger på nyfikenhet och ärliga samtal.",
      capacity: 30,
    },
    {
      title: "Coder Dojo",
      date: "2025-12-10T17:30:00.000Z",
      location: "Uppsala",
      description:
        "En kväll för alla som vill bli bättre på att koda, oavsett nivå. Vi börjar med en kort genomgång av kvällens tema och sedan jobbar vi i små grupper. Du kan ta med ett eget projekt eller hoppa in i någon annans. Mentorer finns på plats för att svara på frågor och ge tips.",
      capacity: 25,
    },
    {
      title: "Julpyssel",
      date: "2025-12-15T14:00:00.000Z",
      location: "Umeå",
      description:
        "Vi skapar egna julkort, dekorationer och små klappar i en mysig miljö med fika. Material finns att låna, men du får gärna ta med sådant du vill återanvända, som gamla tidningar eller band. Perfekt sätt att varva ner inför julen och samtidigt vara kreativ.",
      capacity: 20,
    },
    {
      title: "Nyårslöpningspass",
      date: "2025-12-29T10:00:00.000Z",
      location: "Stockholm",
      description:
        "Vi samlas för ett sista löppass innan året är slut och pratar om mål inför nästa år. Passet är lugnt och anpassas efter gruppen, med utrymme för både kortare och lite längre sträckor. Efteråt tar vi en kaffe för att summera året och peppa varandra inför nya utmaningar.",
      capacity: 35,
    },
    {
      title: "Meditation & Mindfulness",
      date: "2026-01-10T18:00:00.000Z",
      location: "Lund",
      description:
        "En stillsam kväll med guidande meditationer och enkla mindfulnessövningar. Vi går igenom tekniker för att hantera stress och skapa mer vardagsnärvaro. Du sitter på stol eller kudde, inga avancerade positioner krävs, och det finns tid för frågor efteråt.",
      capacity: 18,
    },
    {
      title: "Startup-frukost",
      date: "2026-01-20T08:00:00.000Z",
      location: "Göteborg",
      description:
        "En morgonträff för entreprenörssjälar där vi äter frukost tillsammans och delar erfarenheter från egna projekt. Några deltagare berättar kort om sina idéer, och sedan är det öppet för frågor och diskussion. Målet är att hitta samarbeten, få feedback och känna sig mindre ensam i sitt byggande.",
      capacity: 28,
    },
    {
      title: "Karaokekväll",
      date: "2026-01-24T20:00:00.000Z",
      location: "Stockholm",
      description:
        "En lättsam kväll där vi sjunger karaoke, hejar på varandra och skrattar mycket. Du bestämmer själv om du vill sjunga solo, i grupp eller bara lyssna. Ingen bedömning, bara glädje och en chans att släppa loss en stund mitt i vardagen.",
      capacity: 26,
    },
    {
      title: "Brädspelsmaraton",
      date: "2026-02-01T13:00:00.000Z",
      location: "Malmö",
      description:
        "En heldag med brädspel för dig som vill fördjupa dig i längre spel eller testa flera kortare på raken. Vi gör paus för gemensam lunch och fika under dagen. Det finns möjlighet att låna spel på plats, men ta gärna med egna favoriter som du vill lära ut till andra.",
      capacity: 24,
    },
  ];

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
