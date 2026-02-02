# PlaceIQ

AI-Powered Placement Intelligence Platform (Frontend Only).

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router 7
- Lucide React Icons
- Framer Motion (ready for advanced animations)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure
- `src/layouts`: 
  - `PublicLayout`: For Landing, About, Contact pages.
  - `DashboardLayout`: Authenticated layout with Sidebar and TopBar.
- `src/pages`: 
  - `public`: Landing Page, etc.
  - `auth`: Student/Mentor Login & Registration.
  - `student`: Student Dashboard and features.
  - `mentor`: Mentor Dashboard (Structure ready).
- `src/components`: 
  - `ui`: Reusable atomic components (Button, Input, etc).
  - `layout`: Navbar, Sidebar, Footer.
  - `landing`: Components specific to landing page sections.

## Key Features Implemented
- **Modern UI/UX**: Glassmorphism, Gradients, and Animations.
- **Responsive Design**: Mobile-first approach for all pages.
- **Theme System**: Centralized design system using Tailwind v4 CSS variables.
- **Navigation**: Fully functional routing for public and authenticated areas.
