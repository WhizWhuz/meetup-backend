module.exports = function splitMeetupsByDate(meetups, now = new Date()) {
  const upcoming = [];
  const past = [];

  for (const m of meetups) {
    if (m.date >= now) upcoming.push(m);
    else past.push(m);
  }

  past.sort((a, b) => b.date - a.date);

  return { upcomingMeetups: upcoming, pastMeetups: past };
};
