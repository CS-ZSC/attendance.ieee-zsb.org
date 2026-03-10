// mock/sessions.ts
// TODO: remove this file when API is ready

export const mockSessions = [
  {
    id: "1",
    title: "Intro to Media Production",
    created_at: "2025-01-10T10:00:00Z",
  },
  { id: "2", title: "Photography Basics", created_at: "2025-01-17T10:00:00Z" },
  {
    id: "3",
    title: "Video Editing Workshop",
    created_at: "2025-01-24T10:00:00Z",
  },
  {
    id: "4",
    title: "Social Media Strategy",
    created_at: "2025-02-01T10:00:00Z",
  },
];

export const mockSessionDetails = {
  id: "1",
  title: "Intro to Media Production",
  created_at: "2025-01-10T10:00:00Z",
  qr_token: "abc123token",
  team_id: "media",
  created_by: "user_1",
};

export const mockAttendance = [
  {
    id: "1",
    user_id: "1",
    session_id: "1",
    attended: true,
    scanned_at: "2025-01-10T10:05:00Z",
    name: "Ahmed Ali",
    email: "ahmed@ieee.com",
  },
  {
    id: "2",
    user_id: "2",
    session_id: "1",
    attended: false,
    scanned_at: null,
    name: "Sara Mohamed",
    email: "sara@ieee.com",
  },
  {
    id: "3",
    user_id: "3",
    session_id: "1",
    attended: true,
    scanned_at: "2025-01-10T10:07:00Z",
    name: "Omar Hassan",
    email: "omar@ieee.com",
  },
  {
    id: "4",
    user_id: "4",
    session_id: "1",
    attended: false,
    scanned_at: null,
    name: "Nour Ibrahim",
    email: "nour@ieee.com",
  },
  {
    id: "5",
    user_id: "5",
    session_id: "1",
    attended: true,
    scanned_at: "2025-01-10T10:10:00Z",
    name: "Youssef Kamal",
    email: "youssef@ieee.com",
  },
];
