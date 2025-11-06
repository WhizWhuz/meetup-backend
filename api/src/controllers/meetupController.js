const Meetup = require("../models/Meetup");

//! Utils

const asyncHandler = require("../utils/http/asyncHandler");
const requireAuth = require("../utils/http/requireAuth");
const validateRequired = require("../utils/common/validateRequired");
const { formatMeetups } = require("../utils/meetup/formatMeetup");
const splitMeetupsByDate = require("../utils/meetup/splitMeetupsByDate");
const findMeetupOr404 = require("../utils/meetup/findMeetupOr404");
const { badRequest } = require("../utils/http/httpResponses");

//? Controllers

const createMeetup = asyncHandler(async (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const { title, date, location, description, capacity } = req.body || {};

  const missing = validateRequired(
    ["title", "date", "location", "description", "capacity"],
    req.body
  );
  if (missing.length > 0) {
    return badRequest(res, `Följande fält saknas: ${missing.join(", ")}`);
  }

  const meetup = await Meetup.create({
    title,
    date,
    location,
    description,
    host: userId,
    capacity: Number(capacity),
    registeredUsers: [],
  });

  return res.status(201).json(meetup);
});

const getAllMeetups = asyncHandler(async (req, res) => {
  console.log(`getAllMeetups request by user=${req.user?.name}`);

  const meetups = await Meetup.find()
    .sort({ date: 1 })
    .select("title date location description host capacity registeredUsers")
    .populate("host", "name -_id")
    .populate("registeredUsers", "name -_id");

  return res.status(200).json(meetups);
});

const searchMeetups = asyncHandler(async (req, res) => {
  const { keyword } = req.query || {};
  console.log(
    `searchMeetups keyword=${keyword || "(none)"} user=${req.user?.id}`
  );

  if (!keyword) {
    return badRequest(res, "Nyckelord behövs.");
  }

  const meetupsRaw = await Meetup.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  })
    .sort({ date: 1 })
    .select("title date location description host capacity registeredUsers")
    .populate("host", "name")
    .populate("registeredUsers", "name")
    .lean();

  const meetups = formatMeetups(meetupsRaw);
  return res.status(200).json(meetups);
});

const getMeetupDetails = asyncHandler(async (req, res) => {
  const { meetupId } = req.params;
  console.log(
    `........getMeetupDetails: id=${meetupId} requested by user=${req.user?.id}`
  );

  const meetup = await Meetup.findById(meetupId)
    .populate("host", "name email")
    .populate("registeredUsers", "name email")
    .lean();

  if (!meetup) {
    return res.status(404).json({ error: "Meetupen hittades inte." });
  }

  return res.status(200).json({
    _id: meetup._id,
    title: meetup.title,
    date: meetup.date,
    location: meetup.location,
    description: meetup.description,
    host: {
      name: meetup.host?.name || null,
      email: meetup.host?.email || null,
    },
    capacity: meetup.capacity,
    registeredCount: (meetup.registeredUsers || []).length,
    registeredUsers: meetup.registeredUsers || [],
  });
});

const registerForMeetup = asyncHandler(async (req, res) => {
  const userId = requireAuth(req, res);
  console.log(
    `registerForMeetup meetupId=${req.params.meetupId} user=${userId}`
  );
  if (!userId) return;

  const meetup = await findMeetupOr404(req.params.meetupId, res);
  if (!meetup) return;

  const alreadyRegistered = meetup.registeredUsers.some(
    (u) => u.toString() === userId
  );
  if (alreadyRegistered) {
    return badRequest(res, "Du är redan registrerad till Meetup.");
  }

  if (meetup.registeredUsers.length >= meetup.capacity) {
    return badRequest(res, "Meetupen är full.");
  }

  meetup.registeredUsers.push(userId);
  await meetup.save();

  return res.status(200).json({
    message: "Registrerad.",
    title: meetup.title,
    date: meetup.date,
    location: meetup.location,
    description: meetup.description,
  });
});

const unregisterFromMeetup = asyncHandler(async (req, res) => {
  const userId = requireAuth(req, res);
  console.log(
    `unregisterFromMeetup meetupId=${req.params.meetupId} requestedBy=${userId}`
  );
  if (!userId) return;

  const meetup = await findMeetupOr404(req.params.meetupId, res);
  if (!meetup) return;

  const idx = meetup.registeredUsers.findIndex((u) => u.toString() === userId);
  if (idx === -1) {
    return badRequest(res, "Inte registrerad.");
  }

  meetup.registeredUsers.splice(idx, 1);
  await meetup.save();

  return res.status(200).json({
    message: "Avregisterad.",
    title: meetup.title,
    date: meetup.date,
    location: meetup.location,
    description: meetup.description,
  });
});

const getMyMeetups = asyncHandler(async (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const meetupsRaw = await Meetup.find({
    registeredUsers: userId,
  })
    .sort({ date: 1 })
    .select("title date location description host capacity registeredUsers")
    .populate("host", "name")
    .populate("registeredUsers", "name")
    .lean();

  const formatted = formatMeetups(meetupsRaw);
  const { upcomingMeetups, pastMeetups } = splitMeetupsByDate(formatted);

  return res.status(200).json({
    upcomingMeetups,
    pastMeetups,
  });
});

module.exports = {
  createMeetup,
  getAllMeetups,
  searchMeetups,
  getMeetupDetails,
  registerForMeetup,
  unregisterFromMeetup,
  getMyMeetups,
};
