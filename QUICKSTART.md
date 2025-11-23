# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- Backend running on `http://localhost:8080`

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Step 3: Create Test Account or Login

**Option A: Create New Account**
1. Click "Sign up here" on login page
2. Enter name, email, password
3. You're automatically logged in!

**Option B: Login with Existing Account**
1. Enter email and password
2. Click "Sign In"

## 📋 What You Can Do

### Dashboard (`/`)
- View voltage readings in real-time chart
- See device statistics
- Monitor device status

### Devices (`/devices`)
- Add new ESP32 device with coordinates
- View all devices
- Delete devices

### Map (`/map`)
- See device locations on interactive map
- View device details by clicking markers
- Get Google Maps links

### Admin (`/admin`)
- View system health
- See device status overview
- Manage all devices
- Export data

### Profile (`/profile`)
- Edit user information
- Change password
- View account details

## 🔧 Configuration

Environment variables are in `.env`:
```env
VITE_API_URL=http://localhost:8080/api/v1
```

Change this if your backend is on a different URL.

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/api/client.ts` | HTTP client setup |
| `src/store/*.ts` | Global state (auth, devices) |
| `src/pages/*.tsx` | Page components |
| `src/components/*.tsx` | Reusable components |
| `src/App.tsx` | Routes and layout |
| `.env` | Environment config |

## 🎯 Common Tasks

### Add a New Device
1. Go to `/devices`
2. Click "Add Device"
3. Fill in device details:
   - Name: `ESP-001`
   - MAC: `AA:BB:CC:DD:EE:FF`
   - Location: `Solar Panel 1`
   - Status: `Active`
4. Click "Add Device"

### View Voltage Readings
1. Go to `/` (Dashboard)
2. Select device from dropdown
3. View real-time chart

### Change Password
1. Go to `/profile`
2. Click "Edit Profile"
3. Scroll to "Change Password"
4. Enter current and new password
5. Click "Save Changes"

## 🐛 Troubleshooting

### "Cannot connect to API"
```bash
# Check if backend is running
curl http://localhost:8080/api/v1/auth/validate?token=test

# If not, start backend on port 8080
```

### "Login not working"
- Clear browser cookies: `Ctrl+Shift+Delete`
- Clear localStorage: Open DevTools → Application → Clear Storage
- Try again

### "Styles look wrong"
```bash
# Rebuild Tailwind CSS
npm run build

# Or restart dev server
npm run dev
```

## 📝 Development Tips

### Hot Reload
Changes to code automatically reload in browser

### Debug
Open DevTools: `F12` or `Right-click → Inspect`

### API Requests
Check DevTools → Network tab to see all API calls

## 🚢 Production Build

```bash
# Build for production
npm run build

# Test production build
npm run preview

# Output in dist/ folder
```

Deploy the `dist` folder to your hosting service.

## 📚 Documentation Files

- **FRONTEND_README.md** - Full documentation
- **IMPLEMENTATION_SUMMARY.md** - What was built
- **API_DOCS.md** - Backend API reference (provided)

## 🎓 Learn More

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org)
- [Leaflet](https://leafletjs.com)

## 💡 Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint check (if configured)
npm run lint

# Format code (if configured)
npm run format
```

## 🎨 Design System

### Colors
- Primary: Blue (`#3b82f6`)
- Success: Green (`#10b981`)
- Warning: Yellow (`#f59e0b`)
- Error: Red (`#ef4444`)
- Neutral: Gray (`#6b7280`)

### Spacing
- Uses Tailwind's 4px base unit
- Responsive classes: `sm:`, `md:`, `lg:`

### Components
All components use consistent styling with:
- Rounded corners (`rounded-lg`)
- Shadow effects (`shadow-md`)
- Hover states
- Transition animations

## 🔐 Security Notes

✅ Passwords are never logged or exposed
✅ JWT tokens stored securely
✅ HTTPS should be used in production
✅ Form validation prevents invalid data
✅ Automatic logout on authentication errors

## ⚡ Performance

- Fast load times with Vite
- Optimized bundle size
- Efficient rendering
- Real-time updates
- No unnecessary re-renders

## 🤝 Need Help?

Check these in order:
1. Browser console for errors (`F12`)
2. Network tab for API issues
3. Check `.env` configuration
4. Verify backend is running
5. Check FRONTEND_README.md

## ✨ You're All Set!

Everything is ready to use. Start with:
```bash
npm run dev
```

Then open `http://localhost:5173` and enjoy! 🎉
