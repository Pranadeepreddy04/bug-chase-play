# Test Duel - Educational Software Testing Game

A competitive educational platform that gamifies software testing through head-to-head competition between two players.

## 🎮 Game Overview

**Test Duel** transforms software testing education into an engaging competitive experience where strategy and skill determine victory.

### Player Roles

- **🧪 Tester (Player 1)**: Creates initial program and test suite, then writes new tests to catch bugs introduced by the Saboteur
- **🐛 Saboteur (Player 2)**: Introduces subtle bugs that existing tests won't detect, trying to outsmart the Tester

### How to Win

- **Tester Wins**: Successfully catches all bugs within 5 rounds OR Saboteur cannot create an undetectable bug when challenged
- **Saboteur Wins**: Creates a bug that the Tester cannot catch with any test

## 🚀 Features

- **Professional Code Editor**: Monaco Editor with JavaScript syntax highlighting
- **Real-time Test Execution**: Instant feedback on test results
- **Turn-based Gameplay**: Strategic 5-round competition format
- **Gaming Experience**: Dark theme with purple gradients and animations
- **Test Suite Export**: Download complete test history as JSON
- **Educational Focus**: Learn testing strategies, bug detection, and code quality

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom gaming theme
- **Code Editor**: Monaco Editor
- **Build Tool**: Vite
- **UI Components**: Radix UI + shadcn/ui
- **Routing**: React Router DOM

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd test-duel

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Game Flow

1. **Setup Phase**: Player 1 provides initial code and test suite
2. **Round 1-5**: Alternating turns between Tester and Saboteur
3. **Results**: Final scoring and downloadable test suite

## 🎨 Design System

The application uses a comprehensive design system with:
- Gaming-inspired color palette
- Semantic color tokens (HSL-based)
- Custom gradients and shadows
- Smooth animations and transitions
- Responsive design principles

## 📚 Educational Value

- **Testing Strategies**: Learn different approaches to test design
- **Bug Detection**: Develop skills in identifying code vulnerabilities  
- **Code Quality**: Understand the relationship between tests and robust code
- **Competitive Learning**: Engage through gamification

## 🔧 Development

- Built with modern React patterns and TypeScript
- Modular component architecture
- Custom hooks for game logic
- Semantic design tokens for consistent theming

## 📄 License

This project is designed for educational purposes in software testing education.