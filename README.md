# ResultHub Public Web

## 🌍 Complete Project Overview
**ResultHub** is a comprehensive, multi-platform social and organizational ecosystem designed to bridge the gap between institutions, data, and the community. It allows organizations (like sports leagues, educational institutions, or event organizers) to securely upload and manage complex datasets. Simultaneously, it provides end-users with an engaging, modern social network to view these results, interact with posts, customize their profiles, and stay connected with real-time feeds.

The platform is decoupled into four codebases:
1. **Backend API**
2. **Public Web (This repository)**
3. **Business Web** (Enterprise dashboard)
4. **Mobile App** (Flagship Flutter app)

---

## 🎯 Purpose of This Repository
The Public Web platform is the browser-based social experience for the end-users of ResultHub. It provides a rich, dynamic interface where users can view their feeds, search for results, view public profiles, and interact with community content without needing to download the mobile app.

## 🔌 How It Integrates with the Backend
This frontend is completely stateless and contains no database of its own. It relies entirely on the Node.js backend (`backend-mern`) to function:

1. **Data Fetching:** The Next.js React components utilize standard fetch APIs (both Server-Side and Client-Side) to request data from the backend's REST endpoints (e.g., `/api/social/feed`).
2. **Authentication Flow:** When a user logs in via this website, the form data is sent to the backend. The backend verifies the credentials and returns a secure JWT (JSON Web Token). This website stores that token (typically in local storage or secure cookies) and attaches it to the `Authorization` header of all subsequent API requests.
3. **State Reflection:** If a user likes a post on this website, it sends a `POST` request to the backend. The backend updates the MongoDB database, and the frontend state is updated to reflect the new like count.

## 📦 What It Has
- **Social Feed & Interaction:** A dynamic feed interface featuring posts, likes, and comments.
- **Search & Discovery:** Robust search capabilities for finding other users, public results, and sports data.
- **User Authentication:** Complete login, signup, and forgotten password workflows.
- **Public Profiles:** Viewable profiles displaying user stats and activity.

## 🛠️ How It Is Built
### Tech Stack
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** React 19
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** Framer Motion

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- A running instance of the `backend-mern` API.

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file pointing to your backend API:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Start the Server**
   ```bash
   npm run dev
   ```
