function formatMeetup(meetup) {
  return {
    ...meetup,
    host: meetup.host?.name || null,
    registeredUsers: (meetup.registeredUsers || []).map((u) => u.name),
  };
}

function formatMeetups(meetups) {
  return meetups.map(formatMeetup);
}

module.exports = { formatMeetup, formatMeetups };
