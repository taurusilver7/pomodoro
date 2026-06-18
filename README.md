# Pomofocus - Pomodoro Timer

A beautiful and fully functional Pomodoro timer application built with React, TypeScript, and Vite. This app helps you stay focused and productive using the Pomodoro Technique.

![Pomodoro Timer](./screenshot.png)

## Features

- ⏰ **Pomodoro Timer** - 25-minute focus sessions with automatic breaks
- 🔄 **Multiple Modes** - Pomodoro (25min), Short Break (5min), Long Break (15min)
- 🔔 **Notifications** - Audio and browser notifications when sessions complete
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance
- 🧪 **Well Tested** - Comprehensive test suite with Vitest
- 🎯 **Custom Presets** - Add and save custom timer presets
- 🌗 **Theme Support** - Light and dark mode support
- 📝 **Task Management** - Add, edit, and track tasks alongside the timer

## Technologies Used

- **React 19** - Latest React with modern hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **CSS3** - Modern styling with gradients and animations
- **Vitest** - Fast unit testing framework
- **Testing Library** - React component testing utilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pomodoro-timer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code with ESLint

## How to Use

### Timer Functions

1. **Start a Session**: Click the START button to begin a 25-minute Pomodoro session
2. **Pause/Resume**: Click PAUSE to pause the timer, then START to resume
3. **Reset**: Click Reset to restart the current session
4. **Skip**: Click Skip to move to the next session type
5. **Switch Modes**: Click on Pomodoro, Short Break, or Long Break tabs

### Task Management

1. **Add Tasks**: Click "➕ Add Task" and enter your task description
2. **Complete Tasks**: Click the circle next to a task to mark it complete
3. **Edit Tasks**: Click on the task text to edit it
4. **Delete Tasks**: Click the × button to delete a task
5. **Clear Completed**: Use the Clear button to remove all completed tasks

### Customization

1. **Custom Presets**: Open the dialog (FAB button) to add and save custom timer presets
2. **Theme Switch**: Toggle between light and dark mode using the theme button in the dialog
3. **Preset Selection**: Choose from built-in presets or your custom presets

### Notifications

The app will request notification permissions on first load. Grant permissions to receive:

- Browser notifications when sessions complete
- Audio beep sounds at the end of each session

## Project Structure

<!-- ```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with navigation
│   ├── Timer.tsx       # Main timer component
│   └── Tasks.tsx       # Task management component
├── hooks/              # Custom React hooks
│   ├── useTimer.ts     # Timer state management
│   └── useTasks.ts     # Task state management
├── types.ts            # TypeScript type definitions
├── utils.ts            # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
``` -->

## Testing

The project includes comprehensive tests for:

- ✅ Utility functions (time formatting, mode switching, etc.)
- ✅ Timer component functionality
- ✅ App integration
- ✅ Component rendering and interactions
- ✅ Dialog and preset management
- ✅ Theme switching functionality

Run tests with:

```bash
npm run test
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Features in Detail

### Timer Logic

- Automatic progression: Pomodoro → Short Break → Pomodoro → Long Break
- Customizable session lengths (default: 25/5/15 minutes)
- Session counter tracking
- Progress visualization

### Accessibility

- Keyboard navigation support
- Screen reader friendly
- ARIA labels and roles
- High contrast design

### Performance

- Optimized React rendering with useCallback and useMemo
- Minimal re-renders
- Efficient timer implementation
- Small bundle size

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `npm run test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the Pomodoro Technique by Francesco Cirillo
- Design inspired by modern productivity apps
- Built with modern React and TypeScript best practices
