const Meetup = require("../models/Meetup");
const User = require("../models/User");

const createMeetup = async (req, res) => {
  try {
    const { title, date, location, description, capacity } = req.body;

    if (!req.user?.id && !req.user?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!title || !date || !location || !description || !capacity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hostId = req.user.id || req.user.userId;

    const meetup = new Meetup({
      title,
      date,
      location,
      description,
      host: hostId,
      capacity: Number(capacity),
      registeredUsers: [],
    });

    await meetup.save();
    return res.status(201).json(meetup);
  } catch (err) {
    console.error("createMeetup error:", err);

    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Could not create meetup" });
  }
};

const getAllMeetups = async (req, res) => {
  try {
    console.log(`getAllMeetups request by user=${req.user?.userId || "anon"}`);

    const meetups = await Meetup.find()
      .sort({ date: 1 })
      .select("title date location description host capacity registeredUsers")
      .populate("host", "name -_id")
      .populate("registeredUsers", "name -_id");

    return res.status(200).json(meetups);
  } catch (err) {
    console.error("getAllMeetups error:", err);
    return res.status(500).json({ error: "Could not fetch meetups" });
  }
};

const searchMeetups = async (req, res) => {
  try {
    const { keyword } = req.query;
    console.log(
      `searchMeetups keyword=${keyword || "(none)"} user=${
        req.user?.userId || "anon"
      }`
    );

    if (!keyword) {
      return res.status(400).json({ error: "Keyword required" });
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

    const meetups = meetupsRaw.map((m) => ({
      ...m,
      host: m.host?.name || null,
      registeredUsers: m.registeredUsers.map((u) => u.name),
    }));

    return res.status(200).json(meetups);
  } catch (err) {
    console.error("searchMeetups error:", err);
    return res.status(500).json({ error: "Search failed" });
  }
};

const getMeetupDetails = async (req, res) => {
  try {
    const { meetupId } = req.params;
    console.log(
      `........getMeetupDetails: id=${meetupId} requested by user=${
        req.user?.userId || "anon"
      }`
    );

    const meetup = await Meetup.findById(meetupId);
    if (!meetup) return res.status(404).json({ error: "Meetup not found" });

    const host = meetup.host ? await User.findById(meetup.host) : null;

    const registeredUsers =
      meetup.registeredUsers && meetup.registeredUsers.length > 0
        ? await User.find(
            { _id: { $in: meetup.registeredUsers } },
            "name email"
          )
        : [];

    console.log(
      `getMeetupDetails: meetup=${meetupId} host=${
        host?._id || "unknown"
      } registered=${registeredUsers.length}`
    );

    return res.status(200).json({
      _id: meetup._id,
      title: meetup.title,
      date: meetup.date,
      location: meetup.location,
      description: meetup.description,
      host: {
        name: host?.name || null,
        email: host?.email || null,
      },
      capacity: meetup.capacity,
      registeredCount: meetup.registeredUsers.length,
      registeredUsers,
    });
  } catch (error) {
    console.error("getMeetupDetails error:", error);
    return res.status(500).json({ error: "Error fetching meetup details" });
  }
};

const registerForMeetup = async (req, res) => {
  try {
    console.log(
      `registerForMeetup meetupId=${req.params.meetupId} user=${
        req.user?.userId || "anon"
      }`
    );
    const meetup = await Meetup.findById(req.params.meetupId);
    if (!meetup) return res.status(404).json({ error: "Meetup not found." });

    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    if (meetup.registeredUsers.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You are already registered to meeting." });
    }

    if (meetup.registeredUsers.length >= meetup.capacity) {
      return res.status(400).json({ error: "Meetup is full" });
    }

    meetup.registeredUsers.push(userId);
    await meetup.save();
    return res.status(200).json({
      message: "Registered",
      title: meetup.title,
      date: meetup.date,
      location: meetup.location,
      description: meetup.description,
    });
  } catch (err) {
    console.error("registerForMeetup error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
};

const unregisterFromMeetup = async (req, res) => {
  try {
    console.log(
      `unregisterFromMeetup meetupId=${req.params.meetupId} requestedBy=${
        req.user?.userId || "anon"
      }`
    );
    const meetup = await Meetup.findById(req.params.meetupId);
    if (!meetup) return res.status(404).json({ error: "Meetup not found" });

    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const idx = meetup.registeredUsers.indexOf(userId);
    if (idx === -1) return res.status(400).json({ error: "Not registered" });

    meetup.registeredUsers.splice(idx, 1);
    await meetup.save();
    return res.status(200).json({
      message: "Unregistered",
      title: meetup.title,
      date: meetup.date,
      location: meetup.location,
      description: meetup.description,
    });
  } catch (err) {
    console.error("unregisterFromMeetup error:", err);
    return res.status(500).json({ error: "Unregistration failed" });
  }
};

module.exports = {
  createMeetup,
  getAllMeetups,
  searchMeetups,
  getMeetupDetails,
  registerForMeetup,
  unregisterFromMeetup,
};
