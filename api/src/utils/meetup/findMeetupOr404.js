const Meetup = require("../../models/Meetup");

async function findMeetupOr404(id, res, query = null) {
  const base = query || Meetup;
  const meetup = await base.findById(id);
  if (!meetup) {
    res.status(404).json({ error: "Meetup not found" });
    return null;
  }
  return meetup;
}

module.exports = findMeetupOr404;
