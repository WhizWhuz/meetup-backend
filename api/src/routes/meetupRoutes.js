const express = require("express");
const router = express.Router();
const {
  createMeetup,
  getAllMeetups,
  searchMeetups,
  getMeetupDetails,
  registerForMeetup,
  unregisterFromMeetup,
} = require("../controllers/meetupController");
const auth = require("../middlewares/authMiddleware");

router.route("/").get(getAllMeetups).post(auth, createMeetup);
router.get("/search", searchMeetups);
router.get("/:meetupId", getMeetupDetails);

router.use(auth);

router.post("/:meetupId/register", registerForMeetup);
router.delete("/:meetupId/unregister", unregisterFromMeetup);

module.exports = router;
