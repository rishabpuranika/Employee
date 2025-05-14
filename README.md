# Employee Work Update Dashboard

A modern web application for tracking employee work updates, built with React, TypeScript, Tailwind CSS, and Supabase.

![Employee Work Tracker Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1800&ixlib=rb-4.0.3)

## Features

- 🔒 **Secure Authentication**: Email/password authentication powered by Supabase
- 👤 **User Roles**: Support for both regular users and administrators
- 📝 **Work Entry Management**: Track lesson numbers, proposed dates/times, actual dates/times, and more
- 📊 **Flexible Reporting**: View data by day, week, bi-weekly, month, quarter, or year
- 📄 **PDF Export**: Generate and download PDF reports of your work entries
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 🔄 **Real-time Updates**: Immediate updates when adding new entries

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React (icons)
- **Backend**: Supabase (Authentication, Database, Row-Level Security)
- **PDF Generation**: jsPDF, jsPDF-autotable
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (version 18.x, 20.x, or 22.x)
- npm or yarn
- Supabase account and project

### Environment Setup

1. Clone the repository
2. Create a `.env` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

The application requires the following tables in your Supabase database:

1. **profiles**
   - id (UUID, references auth.users)
   - role (text, 'user' or 'admin')
   - created_at (timestamp)
   - updated_at (timestamp)

2. **work_entries**
   - id (UUID)
   - user_id (UUID, references profiles)
   - date (date)
   - lesson_no (number)
   - proposed_date (date)
   - proposed_time (time)
   - reasons (text, nullable)
   - actual_date (date, nullable)
   - actual_time (time, nullable)
   - remarks (text, nullable)
   - created_at (timestamp)

All required SQL migrations are included in the `supabase/migrations` directory.

### Installation and Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## User Guide

### Authentication

- New users can sign up with email and password
- Existing users can log in with their credentials
- User profiles are automatically created upon signup

### Adding Work Entries

1. Fill in the required fields (Lesson Number, Proposed Date, Proposed Time)
2. Optional fields include Reasons (if not taken), Actual Date, Actual Time, and Remarks
3. Click "Add Entry" to save your work update

### Viewing Reports

1. All entries are displayed in the Report View section
2. Use the period selector buttons to filter entries by timeframe:
   - Daily: Entries from today
   - Weekly: Entries from the past 7 days
   - Biweekly: Entries from the past 15 days
   - Monthly: Entries from the current month
   - Quarterly: Entries from the current quarter
   - Yearly: Entries from the current year

### Exporting Reports

- Click the "Download PDF" button in the header to generate a PDF report of the currently displayed entries

### Admin Features

Administrators have access to:
- View all user entries
- Generate reports across all users

## Security

This application implements row-level security (RLS) policies in Supabase to ensure:

- Users can only access their own work entries
- Admins can view entries from all users
- Profiles have appropriate access controls

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

*Employee Work Update Dashboard is designed to help educators and professionals track their work effectively.*