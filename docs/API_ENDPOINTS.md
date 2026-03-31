# API Endpoints Documentation

This document describes the available API endpoints for the IEEE ZSB Attendance System.

## Base URL
`/api`

## Authentication
Most endpoints require a valid session token (managed by Next-Auth).

---

## 1. User Endpoints

### GET `/api/user/me`
Retrieves details for the currently authenticated user.
- **Response:**
  - `user`: Object containing name, email, position, teams, and managed tracks.
  - `attendance`: Statistics (total, attended, rate).
  - `sessions`: Array of recent sessions with attendance status.

---

## 2. Team Endpoints

### GET `/api/teams`
Lists teams the user is assigned to.
- **Access Control:** 
  - Regular members see only their assigned teams.
  - Talent & Tech (T&T) Board/Heads see **all** teams.
- **Response:** Categorized objects: `chapters`, `committees`, `tracks`.

---

## 3. Session Endpoints

### GET `/api/sessions/[team_slug]`
Lists all sessions for a specific team.
- **Access Control:** User must be in the team or a Board member.

### POST `/api/sessions/[team_slug]`
Creates a new session for a team.
- **Body:** `{ "title": "Session Title", "track": "Optional Track Name" }`
- **Access Control:** User must be in the team or a Board member.

### GET `/api/sessions/[team_slug]/[session_id]`
Retrieves details for a specific session, including the member attendance list.
- **Access Control:** User must be in the team or a Board member.
- **Note:** "Board" and "Internal Board" members are excluded from the attendance list return.

---

## 4. Attendance Endpoints

### POST `/api/attendance/scan/[session_id]?token=[qr_token]`
Records attendance for a session.
- **Access Control:** User must be authenticated.
- **Action:** Validates the QR token and creates/updates an attendance record.

---

## 5. Auth Endpoints

### GET `/api/auth/session`
Standard Next-Auth endpoint to retrieve the current session.
