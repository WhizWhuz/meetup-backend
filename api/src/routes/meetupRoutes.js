const express = require("express");
const router = express.Router();
const {
  createMeetup,
  getAllMeetups,
  searchMeetups,
  getMeetupDetails,
  registerForMeetup,
  unregisterFromMeetup,
  getMyMeetups,
} = require("../controllers/meetupController");
const auth = require("../middlewares/authMiddleware");

router.route("/").get(auth, getAllMeetups).post(auth, createMeetup);

router.get("/search", searchMeetups);

router.get("/my-meetups", getMyMeetups);
router.post("/:meetupId/register", auth, registerForMeetup);
router.delete("/:meetupId/unregister", auth, unregisterFromMeetup);

router.get("/:meetupId", getMeetupDetails);

module.exports = router;
