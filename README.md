# SalonBook – Client

SalonBook is a modern salon appointment booking platform that allows customers to explore salon services, book appointments, manage bookings, and make secure online payments.

The platform provides separate dashboards for Admins and Customers, with role-based access control and a responsive user interface.

## Live Website

https://salon-book-client-zeta.vercel.app

## Server API

https://salonbook-server-teal.vercel.app

## Important Features

- User Registration and Authentication
- Google Sign In
- Role-Based Access Control (Admin and Customer)
- Responsive User Interface
- Browse and Explore Salon Services
- Service Details
- Appointment Booking
- Customer Appointment Management
- Appointment Cancellation
- Appointment Status Tracking
- Stripe Online Payment Integration
- Payment Success and Cancel Pages
- Customer Dashboard
- Admin Dashboard
- Profile Management
- Protected Dashboard Routes
- Loading States and Error Handling
- Custom 404 Not Found Page
- Search and Status-Based Appointment Filtering

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Better Auth
- React Toastify
- React Hook Form
- Zod
- Stripe

## Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/samiulalamsayed/SalonBook-client
```

### 2. Navigate to the Project Directory

```bash
cd salonbook-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 5. Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

http://localhost:3000

## Required Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API Base URL |

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Repository Links

- Client Repository: [CLIENT_REPOSITORY_URL](https://github.com/samiulalamsayed/SalonBook-client)
- Server Repository: [SERVER_REPOSITORY_URL](https://github.com/samiulalamsayed/SalonBook-server)
