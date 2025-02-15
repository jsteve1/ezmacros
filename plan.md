# Macro Tracking App Development Plan

## Tech Stack
- Preact (for lightweight React-compatible UI)
- Supabase (authentication, database)
- TailwindCSS (styling)
- Vite (build tool)
- TypeScript (type safety)
- Open Food Facts API (for barcode scanning)

## Project Structure
```
src/
  ├── components/         # Reusable UI components
  │   ├── layout/        # Layout components (navbar, etc)
  │   ├── forms/         # Form components
  │   └── ui/            # Basic UI components
  ├── hooks/             # Custom hooks
  ├── lib/               # Utility functions and configs
  │   ├── supabase.ts    # Supabase client config
  │   └── theme.ts       # Theme configuration
  ├── pages/             # Page components
  ├── types/             # TypeScript types/interfaces
  └── styles/            # Global styles
```

## Database Schema (Supabase)
Note: To be verified with existing tables

### Tables

#### macro_entries
- id (uuid, primary key)
- user_id (uuid, foreign key)
- date (date)
- carbs (integer)
- protein (integer)
- fat (integer)
- created_at (timestamp)

## Features Implementation Plan

### Phase 1: Project Setup & Theme
1. Initialize Preact project with Vite
2. Set up TailwindCSS with dark/light theme support
3. Configure Supabase client
4. Implement theme switching (dark/light/system)
   - Persistent theme preference
   - System theme detection
   - Theme-aware components

### Phase 2: Authentication & Layout
1. Create top navigation bar
   - Login/Logout buttons
   - Theme switcher
2. Implement authentication flow
   - Login page
   - Sign up page
   - Protected routes
3. Create bottom navigation bar
   - Date selector
   - Add entry button
   - View entries button

### Phase 3: Core Features
1. Implement date range selector (Shopify Admin style)
   - Today
   - Yesterday
   - Last 7 days
   - Custom range (with date picker)
2. Create macro entry form
   - Integer-only validation
   - No negative numbers
   - Simple form submission
3. Implement entries view
   - List view for selected date range
   - Edit/delete functionality

### Phase 4: Barcode Scanner Integration
1. Integrate Open Food Facts API
   - Set up API client
   - Create type definitions for responses
   - Implement error handling for API failures
2. Implement camera interface
   - Create camera viewport with guide overlay
   - Add barcode alignment box/guides
   - Implement real-time barcode detection
   - Add visual feedback for successful scan
   - Handle camera permissions and errors
3. Create confirmation modal
   - Display scanned product name and details
   - Show extracted macros with units
   - Implement serving size adjustment with macro recalculation
   - Add loading states during API calls
   - Error handling for invalid/missing product data
   - Confirmation button to add entry
4. Error handling
   - Camera not available
   - Permission denied
   - Product not found
   - Invalid barcode
   - Network issues
   - API failures

### Phase 5: Home Page
1. Implement macro summary boxes
   - Carbs (red)
   - Fat (brown)
   - Protein (green)
2. Add date range context
3. Ensure responsive design

## Validation Rules
- All macro inputs must be integers
- No negative numbers allowed
- No decimal places

## Theme Implementation
- Dark mode based on Vercel's website
- Light mode with appropriate contrast
- System theme detection and sync
- Consistent component theming

## Next Steps
1. Verify existing Supabase tables and adjust schema if needed
2. Set up initial project structure
3. Begin Phase 1 implementation

Would you like me to proceed with verifying the Supabase tables and then start the implementation?
