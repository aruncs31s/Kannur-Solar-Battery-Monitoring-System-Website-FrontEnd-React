# Documentation Index

## Welcome to the Solar Battery Monitoring System Frontend Documentation

This documentation provides comprehensive information about the React frontend application for the Solar Battery Monitoring System.

## Quick Navigation

### 📁 [Project Structure](./project-structure.md)
Learn about the application architecture, directory structure, technology stack, and design patterns.

**Key Topics:**
- Clean Architecture layers
- Directory organization
- Technology stack
- Routing structure
- Development workflow
- Best practices

### 🔌 [API Documentation](./apis.md)
Complete reference for all API modules and endpoints.

**API Modules:**
- Authentication API
- Devices API
- Locations API
- Readings API
- Users API
- Audit Logs API
- Versions API

### 🧩 [Reusable Components](./components.md)
Catalog of 46+ reusable React components with usage examples.

**Component Categories:**
- Layout Components
- State Display Components
- Navigation Components
- Data Display Components
- Form Components
- Modal Components
- Action Components
- Feature Components
- Device-Specific Components

---

## Quick Start Guide

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd Kannur-Solar-Battery-Monitoring-System-Website-FrontEnd-React

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Setup

Create a `.env` file (optional):

```env
VITE_API_URL=http://localhost:8080/api
```

---

## Application Overview

### What is this application?

This is a web-based monitoring and management system for solar battery installations. It provides:

1. **Real-time Monitoring**: Track solar panel performance and battery status
2. **Device Management**: Manage IoT devices, microcontrollers, and sensors
3. **Location Tracking**: Organize devices by geographic location
4. **Data Visualization**: Charts, graphs, and maps for data analysis
5. **Firmware Management**: OTA updates and online firmware building
6. **User Management**: Multi-user support with role-based access
7. **Audit Logging**: Track all system changes

### Who is it for?

- **System Administrators**: Manage users, devices, and system configuration
- **Device Owners**: Monitor their solar installations and devices
- **Technicians**: Perform maintenance and firmware updates
- **Analysts**: View historical data and generate reports

---

## Architecture Overview

The application follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Components, Stores)            │
├─────────────────────────────────────────┤
│            API Layer                    │
│  (Facade over Use Cases)                │
├─────────────────────────────────────────┤
│         Application Layer               │
│  (Use Cases, DI Container)              │
├─────────────────────────────────────────┤
│          Domain Layer                   │
│  (Entities, Repository Interfaces)      │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│  (HTTP Client, Repository Impl)         │
└─────────────────────────────────────────┘
```

### Key Benefits

1. **Testability**: Business logic is isolated and easy to test
2. **Maintainability**: Clear boundaries between layers
3. **Flexibility**: Easy to swap implementations
4. **Type Safety**: Full TypeScript coverage
5. **Scalability**: Modular architecture supports growth

---

## Key Features

### 1. Authentication & Authorization
- JWT-based authentication
- Protected routes
- Role-based access control (admin, user)
- Secure token storage

### 2. Device Management
- Multiple device types (solar, sensor, microcontroller)
- Device lifecycle management (create, update, delete)
- Device state tracking
- Device control and automation

### 3. Real-time Monitoring
- Live sensor readings
- Auto-refresh capabilities
- WebSocket support (planned)
- Progressive data loading

### 4. Data Visualization
- Interactive charts (Recharts)
- Map views (Leaflet)
- Statistics dashboards
- Custom date range filtering

### 5. Firmware Management
- OTA (Over-The-Air) firmware updates
- Online firmware builder
- Build status monitoring
- Version tracking

### 6. Location Management
- Geographic organization
- Location-based device grouping
- Map visualization
- Location analytics

### 7. User Interface
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Smooth animations (Framer Motion)
- Intuitive navigation
- Accessible (WCAG compliant)

---

## Common Workflows

### User Journey: Monitoring Solar Panels

1. **Login** → User authenticates
2. **Dashboard** → View overview of all devices
3. **Select Device** → Click on a solar panel
4. **View Details** → See current readings, history, and charts
5. **Analyze Data** → Filter by date range, export data
6. **Control Device** → Send commands if needed

### Admin Journey: Adding New Device

1. **Login as Admin** → Authenticate with admin credentials
2. **Navigate to Devices** → Go to device management
3. **Click "Add Device"** → Open device creation modal
4. **Fill Form** → Enter device details (name, type, location)
5. **Submit** → Device is created and appears in list
6. **Configure** → Set up sensors, firmware, etc.
7. **Monitor** → View device data on dashboard

### Technician Journey: Firmware Update

1. **Navigate to Device** → Select device for update
2. **Open Firmware Manager** → Click firmware update button
3. **Choose Method**:
   - **Upload File** → Upload pre-compiled firmware
   - **Online Build** → Configure and build firmware online
4. **Monitor Progress** → Watch build/upload status
5. **Verify** → Check device is running new firmware

---

## Technology Stack

### Core Technologies
- **React** 18.2 - UI framework
- **TypeScript** 5.2 - Type safety
- **Vite** 7.3 - Build tool (fast!)
- **Tailwind CSS** 3.3 - Styling
- **React Router** 6.20 - Navigation

### State Management
- **Zustand** 4.4 - Lightweight state management

### HTTP & Data
- **Axios** 1.6 - HTTP client
- Custom Repository pattern

### UI Libraries
- **Recharts** 2.15 - Charts and graphs
- **Leaflet** 1.9 - Interactive maps
- **Lucide React** 0.294 - Icons
- **Framer Motion** 12.29 - Animations

---

## Development Guidelines

### Code Style

1. **Use TypeScript** for all new code
2. **Follow Clean Architecture** - respect layer boundaries
3. **Component Structure**: 
   - Functional components with hooks
   - Props interfaces at top of file
   - Exported component at bottom
4. **Naming Conventions**:
   - Components: PascalCase (e.g., `DeviceCard`)
   - Files: PascalCase for components (e.g., `DeviceCard.tsx`)
   - Functions: camelCase (e.g., `handleSubmit`)
   - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Component Guidelines

```typescript
// ✅ Good Component Structure
interface MyComponentProps {
  title: string;
  optional?: boolean;
}

export const MyComponent = ({ title, optional = false }: MyComponentProps) => {
  const [state, setState] = useState<string>('');
  
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, []);
  
  const handleAction = () => {
    // Handler logic
  };
  
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

### State Management

- **Local state**: Use `useState` for component-specific UI state
- **Shared state**: Use Zustand stores for cross-component state
- **Server state**: Fetch via API, store in component state or store
- **Avoid prop drilling**: Use stores or context for deep passing

### Error Handling

Always handle errors gracefully:

```typescript
try {
  const data = await someAPI.getData();
  setData(data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    setError(error.response?.data?.message || 'API Error');
  } else {
    setError('An unexpected error occurred');
  }
} finally {
  setLoading(false);
}
```

---

## Testing Strategy

### Unit Tests (Planned)
- Test components in isolation
- Test utility functions
- Test custom hooks

### Integration Tests (Planned)
- Test API integration
- Test user flows
- Test state management

### E2E Tests (Planned)
- Test critical user journeys
- Test authentication flow
- Test device management flow

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Environment Variables

Set these in production:
- `VITE_API_URL` - Backend API URL

---

## Common Issues & Solutions

### Issue: API requests failing

**Solution**: Check that backend is running on `http://localhost:8080` or update `VITE_API_URL`.

### Issue: Authentication not working

**Solution**: Check localStorage for token. Clear and re-login if corrupted.

### Issue: Components not rendering

**Solution**: Check console for errors. Verify imports are correct.

### Issue: Dark mode not working

**Solution**: Theme store should persist to localStorage. Check browser storage.

---

## Performance Optimization

### Current Optimizations
1. Code splitting by route
2. Lazy loading of heavy components
3. Debounced search inputs
4. Memoized expensive calculations
5. Optimized re-renders with React.memo

### Future Optimizations
1. Virtual scrolling for large lists
2. Service worker for offline support
3. Image optimization and lazy loading
4. Bundle size reduction
5. Implement React Server Components (when stable)

---

## Security Considerations

### Implemented
- JWT token authentication
- Protected routes
- Input validation
- HTTPS in production
- Secure token storage

### Best Practices
- Never commit secrets to git
- Use environment variables for config
- Validate all user inputs
- Sanitize data before rendering
- Regular dependency updates

---

## Contributing Guidelines

### Before Making Changes
1. Read this documentation
2. Understand the architecture
3. Check existing components before creating new ones
4. Follow the code style guide

### Making Changes
1. Create a feature branch
2. Write clear commit messages
3. Test your changes
4. Update documentation if needed
5. Submit PR with description

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] TypeScript types are correct
- [ ] Components are reusable
- [ ] No console.log statements
- [ ] Error handling is present
- [ ] Loading states are handled
- [ ] Responsive design works
- [ ] Dark mode works

---

## Roadmap & Future Features

### Planned Features
- [ ] WebSocket for real-time updates
- [ ] Advanced analytics dashboard
- [ ] Data export (CSV, PDF)
- [ ] Mobile app (React Native)
- [ ] Notification system
- [ ] Multi-language support
- [ ] Advanced charting options
- [ ] Automated reports
- [ ] API documentation generator
- [ ] Component library documentation

### Technical Improvements
- [ ] Unit test coverage
- [ ] E2E test suite
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics integration
- [ ] PWA support

---

## Support & Resources

### Internal Documentation
- [Project Structure](./project-structure.md) - Architecture and organization
- [API Documentation](./apis.md) - Complete API reference
- [Components](./components.md) - Reusable components catalog

### External Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Router](https://reactrouter.com/)

### Getting Help
1. Check this documentation first
2. Search issues in the repository
3. Ask team members
4. Create a detailed issue if bug found

---

## Changelog

### Version 0.0.0 (Current)
- Initial release
- Core features implemented
- Clean architecture setup
- Comprehensive component library
- API integration complete

---

## License & Credits

This project is part of the Kannur Solar Battery Monitoring System.

**Contributors:**
- Project maintainers
- Open source community

**Special Thanks:**
- React team for amazing framework
- All open source library authors

---

## Appendix

### Glossary

- **OTA**: Over-The-Air (firmware updates)
- **JWT**: JSON Web Token (authentication)
- **DTO**: Data Transfer Object
- **API**: Application Programming Interface
- **UI**: User Interface
- **UX**: User Experience
- **PWA**: Progressive Web App
- **WCAG**: Web Content Accessibility Guidelines

### Keyboard Shortcuts (Planned)

- `Ctrl/Cmd + K` - Open search
- `Esc` - Close modals
- `Ctrl/Cmd + ,` - Open settings

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No IE support

---

**Last Updated**: 2026-02-14

**Documentation Version**: 1.0.0

**Application Version**: 0.0.0
