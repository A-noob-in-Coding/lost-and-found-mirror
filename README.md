# Lost and Found - FAST NUCES

## Project Overview
Lost and Found is a centralized digital platform designed specifically for the FAST NUCES campus community. This platform helps students report lost items and post found items, making it easier to reconnect lost belongings with their rightful owners through a secure and efficient system.

## University Details
**University:** FAST National University of Computer and Emerging Sciences  
**Semester:** 4th Semester, BS Software Engineering  
**Course:** Database Lab  
**Instructor:** Hira Tayyab  

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Image Storage:** Cloudinary
- **Authentication:** JWT
- **Styling:** Tailwind CSS

## Features
- **User Authentication**
  - Secure registration and login using email addresses and student IDs
  - OTP verification system
  - Password recovery and reset functionality

- **Post Management**
  - Create lost item posts with detailed descriptions and images
  - Create found item posts with item information and images
  - Search and filter posts by various criteria

- **Comment System**
  - Interactive commenting on posts
  - Comment verification system

- **Admin Dashboard**
  - Post verification and moderation
  - Comment moderation
  - Category management

- **Profile Management**
  - Update profile information
  - Change profile picture
  - Change password
  - View personal post history

## Contributors
- **Abd ur Rehman**
  - **Roll Number:** 23L-3105
  - **GitHub:** [A-noob-in-coding](https://github.com/A-noob-in-Coding)

- **Muhammad Ahmad Butt**
  - **Roll Number:** 23L-3059
  - **GitHub:** [muhammadahmad0313](https://github.com/muhammadahmad0313)

- **Muhammad Armgan**
  - **Roll Number:** 23L-3076
  - **GitHub:** [armgan](https://github.com)


## How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/A-noob-in-Coding/lost-and-found.git
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     DATABASE_URL=your_postgres_connection_string
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_secret
     ```

4. Start the development servers:
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend development server (from frontend directory)
   npm run dev
   ```

© 2025 Lost & Found - FAST NUCES. All rights reserved.