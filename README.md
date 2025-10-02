# Arcana - Documentation Wizard

A modern React TypeScript application for creating professional specification and memory documentation with an intuitive step-by-step wizard interface. Arcana helps teams and individuals create comprehensive, well-structured documentation efficiently.

## ✨ Features

### Document Types
- **Specification Documents**: Technical and functional requirements documentation
  - Project Overview
  - Functional Requirements  
  - Technical Architecture
  - API Documentation
  - Non-Functional Requirements
  - Project Roadmap

- **Memory Documents**: Organizational knowledge and decision documentation
  - Decision Log
  - Glossary & Terms
  - Meeting Notes
  - Lessons Learned
  - Onboarding Guide

### Core Features
- 🎯 **Step-by-step wizard interface** - Guided documentation creation process
- 💾 **Auto-save functionality** - Progress is automatically saved to localStorage
- 📤 **Markdown export** - Export completed documents as professional markdown files
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🔄 **Resume sessions** - Continue where you left off with saved progress
- 📱 **Responsive design** - Works seamlessly on desktop and mobile devices
- 🔗 **Embeddable** - Designed to be embedded in other applications with CSS isolation
- 🎭 **Host page integration** - Can control elements on the host page when embedded

### Technical Features
- ⚡ **Fast development** - Built with Vite for lightning-fast development experience
- 🛡️ **Type safety** - Full TypeScript support with strict type checking
- 🎪 **CSS isolation** - Input field styling isolated from host page interference
- 🏗️ **Component architecture** - Modular, reusable React components
- 📋 **Form validation** - Comprehensive form validation and error handling
- 🗂️ **State management** - Centralized state management with React Context

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd arcana
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 🎯 Usage

1. **Choose Document Type**: Select either Specification or Memory document
2. **Follow the Wizard**: Complete each step of the guided process
3. **Auto-save**: Your progress is automatically saved as you work
4. **Export**: Download your completed document as a markdown file
5. **Resume**: Return later to continue where you left off

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── memory-steps/    # Memory document wizard steps
│   ├── spec-steps/      # Specification document wizard steps
│   ├── DocumentTypeSelector.tsx
│   ├── DocumentWizard.tsx
│   ├── ImportModal.tsx
│   └── ...
├── contexts/            # React context providers
│   └── WizardContext.tsx
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── markdownParser.ts
│   └── hostPageUtils.ts
└── styles/              # CSS files
    └── input-isolation.css
```

## 🛠️ Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **ESLint** - Code linting and formatting

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### ESLint Configuration

For production applications, you may want to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 🔗 Embedding Arcana

Arcana is designed to be embeddable in other applications. It includes:

- **CSS Isolation**: Input fields are protected from host page CSS interference
- **Unique Root Element**: Uses `#arcana-app-root` for scoped styling
- **Host Page Control**: Can hide/show elements on the host page with specific IDs
- **Auto-restoration**: Automatically restores host page elements when the wizard is reset

### Host Page Integration

The app can automatically hide elements on the host page:
- Elements with ID `arcana-info-box` are hidden when the wizard starts
- Elements are restored when the wizard is reset or completed

## 📝 Data Persistence

- **Auto-save**: All form data is automatically saved to localStorage as `arcana-state`
- **Session Recovery**: Users can resume their progress after closing and reopening the app
- **Export Ready**: Completed documents can be exported as properly formatted markdown files

## 🎨 Customization

### Branding
- Logo: Uses `https://impressto.ca/images/arcana.png` for branding
- Favicon: Custom arcana.png favicon
- Colors: Utilizes Tailwind's primary color scheme (customizable via Tailwind config)

### Styling
- **Tailwind CSS**: Easy to customize via `tailwind.config.js`
- **Component Isolation**: Individual components have scoped styling
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙋‍♂️ Support

For support, please contact the development team or create an issue in the repository.

---

Built with ❤️ using React, TypeScript, and Vite.
