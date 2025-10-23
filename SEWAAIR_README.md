# SewaAir - Passenger Consent Form System

A professional consent form management system inspired by Air India's design aesthetics, featuring browser-based data persistence.

## Features

### 🎨 Design
- **Air India-Inspired Theme**: Deep red, aubergine, rose gold, and amber color scheme
- **Professional UI**: Clean, modern interface with gradient backgrounds
- **Responsive Layout**: Works seamlessly across all devices
- **Smooth Animations**: Micro-interactions and transitions throughout

### 📋 Consent Form
- **Complete Form Fields**:
  - Full Name (text input)
  - Phone Number (validated format)
  - Residential Address (textarea)
  - Passport Number (validated format, auto-uppercase)
  - Date of Birth (calendar picker with date restrictions)
  
- **Mandatory Disclaimer**: Comprehensive terms and conditions with checkbox acceptance
- **Real-time Validation**: Field-level validation with helpful error messages
- **Success Notifications**: Toast messages confirming successful submissions
- **Unique Submission IDs**: Auto-generated IDs with timestamp (format: SEWA-{timestamp})

### 💾 Data Storage
- **localStorage Implementation**: All submissions stored in browser's localStorage
- **Persistent Data**: Survives page refreshes and browser sessions
- **No Backend Required**: Fully client-side data management
- **Privacy-Focused**: Data stays on user's device

### 👨‍💼 Admin Dashboard
- **Statistics Cards**:
  - Total Submissions count
  - Today's Submissions count
  - Data Storage status indicator
  
- **Submission Management**:
  - Searchable table (by name, phone, passport, or submission ID)
  - View all submission details
  - Individual record deletion
  - Bulk delete (Clear All) functionality
  
- **Data Export**:
  - Export to CSV format
  - Includes all submission fields
  - Timestamped filenames

## Usage

### Access the Application
1. **Consent Form**: Navigate to `/` (home page)
2. **Admin Dashboard**: Navigate to `/admin` or click "Admin Access" in header

### Submitting a Consent Form
1. Fill in all required fields
2. Select date of birth from calendar picker
3. Read the disclaimer terms
4. Check the "I have read and agree" checkbox
5. Click "Submit Consent Form"
6. Note your submission ID for reference

### Managing Submissions (Admin)
1. Navigate to `/admin`
2. View statistics in the dashboard cards
3. Search for specific submissions using the search bar
4. Export all data as CSV using "Export CSV" button
5. Delete individual submissions using trash icon
6. Clear all data using "Clear All" button (requires confirmation)

## Technical Stack

- **React 19** with React Router
- **Tailwind CSS** for styling
- **shadcn/ui Components** for professional UI
- **Lucide React** for icons
- **date-fns** for date handling
- **localStorage** for data persistence

## Design Guidelines Followed

✅ Air India-inspired color scheme (deep red, aubergine, gold)
✅ Shadcn components for all UI elements
✅ Lucide icons (no emojis)
✅ Subtle gradients (avoiding dark button gradients)
✅ Smooth transitions and micro-animations
✅ Professional, modern layout

---

Built for SewaAir - Your Journey, Our Commitment
