# Clara - Your Tidy Life Coach

A React Native mobile application that helps users maintain organized spaces through daily check-ins, habit tracking, and motivational insights. Clara acts as a personal tidiness coach, providing gentle reminders and celebrating progress through streak tracking and data visualization.

## Project Overview

Clara is built as a mobile-first AI companion designed to help users develop consistent tidiness habits. The application focuses on simplicity, user engagement, and data-driven insights to make room organization an enjoyable daily practice.

## Technical Stack

### Core Framework
- **React Native with Expo SDK 53** - Cross-platform mobile development
- **TypeScript** - Type-safe development with enhanced IDE support
- **Expo Router** - File-based navigation system

### State Management & Data
- **Zustand** - Lightweight state management for React
- **Expo SQLite** - Local database for persistent data storage
- **Async/Await Patterns** - Modern asynchronous data handling

### User Interface
- **NativeWind** - Tailwind CSS for React Native styling
- **Custom Design System** - Consistent colors, typography, spacing, and shadows
- **React Native Reanimated** - Smooth animations and micro-interactions
- **Expo Haptics** - Tactile feedback for enhanced user experience

### Voice & Notifications
- **expo-speech** - Text-to-speech functionality
- **react-native-voice** - Speech-to-text input (development build only)
- **expo-notifications** - Local daily reminder notifications

### Forms & Validation
- **react-hook-form** - Performant form handling
- **zod** - Runtime type validation and schema definition
- **@hookform/resolvers** - Integration between react-hook-form and zod

### Development Tools
- **ESLint & TypeScript** - Code quality and type checking
- **Metro Bundler** - Fast refresh and hot reloading
- **Expo Go** - Rapid development and testing

## Architecture

### Database Schema

**Rooms Table**
```sql
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  is_archived INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
```

**Check-ins Table**
```sql
CREATE TABLE checkins (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  date TEXT NOT NULL,
  is_tidy INTEGER NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);
```

**App Settings Table**
```sql
CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY,
  notify_hour INTEGER DEFAULT 20,
  notify_min INTEGER DEFAULT 0,
  voice_enabled INTEGER DEFAULT 1,
  stt_enabled INTEGER DEFAULT 0
);
```

### State Management Structure

**Rooms Store (`useRoomsStore`)**
- CRUD operations for room management
- Archive/unarchive functionality
- Drag-and-drop reordering
- Real-time synchronization with SQLite

**Check-ins Store (`useCheckinsStore`)**
- Daily check-in creation and retrieval
- Date-based filtering and queries
- Integration with streak calculation

**Settings Store (`useSettingsStore`)**
- Notification preferences
- Voice/TTS toggle states
- Data export functionality

## Core Features

### Onboarding System
- First-time user setup flow
- Initial room creation with emoji selection
- Notification permission requests
- Seamless transition to main application

### Room Management
- Add, rename, and archive rooms
- Custom emoji assignment for visual identification
- Drag-and-drop reordering for personalization
- Archive system to hide unused rooms without data loss

### Daily Check-in Flow
- Sequential room-by-room check-in process
- Yes/No tidy status with visual feedback
- Reason capture for "No" responses with predefined chips
- Voice interaction support (TTS/STT)
- Progress indicators and motivational messaging

### Dashboard & Analytics
- Real-time streak calculations for each room
- Total active streaks aggregation
- Completion rate analytics (7-day rolling average)
- Visual room cards with current status
- Pull-to-refresh data synchronization

### Streak Calculation System
- Current streak: consecutive tidy days from most recent check-in
- Best streak: longest historical consecutive tidy period
- Real-time updates based on check-in data
- Color-coded streak displays for quick visual feedback

### Notification System
- Customizable daily reminder times with AM/PM selection
- Local notification scheduling
- Permission handling and graceful fallbacks
- Time picker with intuitive 12-hour format

### Voice Integration
- Text-to-speech for question prompts
- Speech-to-text for hands-free responses
- Fallback to manual input when STT unavailable
- Voice settings management in preferences

### Data Export & Backup
- Complete data export to JSON format
- Share functionality through device share sheet
- All tables included: rooms, check-ins, settings
- Privacy-focused local-only data handling

## User Interface Design

### Design System
- **Colors**: Comprehensive light/dark mode palette
- **Typography**: Scalable text system (xs to 4xl)
- **Spacing**: Consistent 4px-based spacing scale
- **Shadows**: Layered depth with subtle elevation
- **Border Radius**: Rounded corners for modern aesthetic

### Components
- **PrimaryButton**: Animated button with haptic feedback and multiple variants
- **RoomCard**: Streak display with color-coded status indicators
- **ScreenWrapper**: Consistent safe area handling and pull-to-refresh
- **TimePicker**: Intuitive AM/PM time selection interface
- **ReasonChips**: Quick-select predefined reasons with visual feedback

### Animations & Interactions
- **Entrance Animations**: Staggered FadeInDown effects
- **Press Feedback**: Scale and opacity animations on touch
- **Haptic Feedback**: Tactile responses for all interactive elements
- **Loading States**: Visual feedback during async operations

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Expo CLI
- iOS Simulator or Android Emulator (optional)
- Physical iOS/Android device with Expo Go

### Installation
```bash
# Clone repository
git clone <repository-url>
cd Clara

# Install dependencies
npm install

# Start development server
npx expo start
```

### Testing
```bash
# Type checking
npx tsc --noEmit

# Start with cache clearing
npx expo start --clear

# Platform-specific builds
npx expo run:ios
npx expo run:android
```

## Database Operations

### Initialization
- Automatic database creation on first launch
- Migration system for schema updates
- Foreign key constraint enforcement
- Index creation for optimized queries

### Data Flow
1. User interactions trigger Zustand store actions
2. Store actions perform async SQLite operations
3. Database results update store state
4. React components re-render with new data
5. UI reflects changes with smooth animations

## Security & Privacy

### Data Storage
- All data stored locally using SQLite
- No external data transmission
- User controls data export and sharing
- Automatic data persistence across app sessions

### Permissions
- Notification permissions for daily reminders
- Microphone access for speech-to-text (optional)
- No camera, location, or contact access required

## Performance Optimizations

### Database
- Indexed queries for efficient data retrieval
- Async operations to prevent UI blocking
- Batch operations for multiple updates
- Connection pooling through Expo SQLite

### UI Rendering
- Lazy loading of heavy components
- Optimized FlatList usage for large datasets
- Memoized calculations for streak data
- Efficient state updates with Zustand

### Memory Management
- Automatic cleanup of event listeners
- Proper async operation cancellation
- Minimal re-renders through selective subscriptions

## Build & Deployment

### Development Build
```bash
# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build
```bash
# Create production build
eas build --profile production --platform ios
eas build --profile production --platform android
```

### App Store Deployment
- iOS: Apple App Store submission ready
- Android: Google Play Store submission ready
- Automated version management through EAS

## Future Enhancements

### Planned Features
- Cloud backup integration (iCloud/Google Drive)
- Advanced analytics with trend visualization
- Custom habit categories beyond rooms
- Social features for accountability partners
- Widget support for quick check-ins
- Apple Watch companion app

### Technical Improvements
- LLM integration for personalized coaching
- Advanced voice recognition accuracy
- Offline-first synchronization
- Performance monitoring and analytics
- Automated testing suite expansion

## Contributing

### Development Guidelines
- Follow TypeScript strict mode requirements
- Maintain 100% type coverage
- Use conventional commit messages
- Ensure all features work in Expo Go
- Test on both iOS and Android platforms

### Code Style
- ESLint configuration enforcement
- Prettier for code formatting
- Consistent component structure
- Proper error handling and logging
- Comprehensive inline documentation

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For technical issues or feature requests, please create an issue in the project repository. Include device information, Expo version, and detailed reproduction steps for fastest resolution.