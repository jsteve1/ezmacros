# 🍔 EZ Macros

<div align="center">

[![Deploy to GitHub Pages](https://github.com/jsteve1/ezmacros/actions/workflows/deploy.yml/badge.svg)](https://github.com/jsteve1/ezmacros/actions/workflows/deploy.yml)

A sleek, modern macro tracking app that makes nutrition tracking actually enjoyable.  
Built with Preact + Supabase. Deployed with ❤️ on GitHub Pages.

[Live Demo](https://jsteve1.github.io/ezmacros/) • [Report Bug](https://github.com/jsteve1/ezmacros/issues) • [Request Feature](https://github.com/jsteve1/ezmacros/issues)

![Dark Mode Screenshot](screenshots/dark.png)
![Light Mode Screenshot](screenshots/light.png)

</div>

## ✨ Features

- 🎯 **Simple & Intuitive** - Track your macros with minimal friction
- 📱 **Responsive Design** - Works beautifully on all devices
- 🔄 **Real-time Updates** - See your nutrition data update instantly
- 📊 **Smart Analytics** - Track your macros and calories over time
- 🌙 **Dark Mode** - Easy on the eyes, with system theme detection
- 📷 **Barcode Scanner** - Scan products for instant macro data
- 🔐 **Secure Auth** - Powered by Supabase authentication
- ⚡ **Lightning Fast** - Built with performance in mind

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/ezmacros.git
   cd ezmacros
   npm install
   ```

2. **Set Up Environment**
   ```bash
   # Create .env file
   cp .env.example .env
   # Add your Supabase credentials
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` 🎉

## 🛠️ Tech Stack

- **Frontend**
  - [Preact](https://preactjs.com/) - 3kB React alternative
  - [Vite](https://vitejs.dev/) - Next-gen frontend tooling
  - [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
  - [TypeScript](https://www.typescriptlang.org/) - Type safety

- **Backend**
  - [Supabase](https://supabase.com/) - Open source Firebase alternative
  - PostgreSQL - Rock-solid database

- **Integrations**
  - [Open Food Facts](https://world.openfoodfacts.org/) - Product database
  - [ZXing](https://github.com/zxing-js/library) - Barcode scanning

## 📦 Database Schema

```sql
create table macro_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date default current_date,
  carbs integer not null,
  fat integer not null,
  protein integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table macro_entries enable row level security;

-- Set up access policy
create policy "Users can only see their own entries" 
  on macro_entries for all 
  using (auth.uid() = user_id);
```

## 🎨 Key Features in Detail

### 📊 Macro Tracking
- Simple, intuitive entry of carbs, fat, and protein
- Automatic calorie calculation
- Daily and custom date range totals
- Visual macro distribution

### 📷 Barcode Scanner
- Instant product lookup
- Automatic macro data population
- Fallback to manual entry
- Camera permission handling

### 🎭 Theme System
- Automatic system theme detection
- Manual theme toggle
- Persistent preferences
- Smooth transitions

## 🤝 Contributing

1. Fork it
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Open Food Facts](https://world.openfoodfacts.org/) for their comprehensive API
- [Heroicons](https://heroicons.com/) for the beautiful icons
- [Preact](https://preactjs.com/) for the amazing framework
- [Supabase](https://supabase.com/) for the powerful backend platform

---

<div align="center">
Made with ❤️ by <a href="https://github.com/jsteve1">jsteve1</a>
</div> 