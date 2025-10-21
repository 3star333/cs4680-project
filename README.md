# Stadium Overwatch Web App 🎮

A web application for building and optimizing Overwatch 2 Stadium game mode team compositions with AI-powered strategy suggestions.

## 📚 Documentation

- **[Prompt Engineering Techniques](./docs/PROMPT_ENGINEERING.md)** - Detailed documentation of 5 prompt patterns used
- **[Anti-Hallucination Strategies](./docs/ANTI_HALLUCINATION.md)** - How we prevent AI from inventing fake items
- **[Project Requirements Analysis](./docs/PROJECT_REQUIREMENTS_ANALYSIS.md)** - CS4680 requirements breakdown
- **[Environment Setup Guide](./docs/ENVIRONMENT_SETUP.md)** - Detailed setup instructions
- **[Hero Filtering & Strategy](./docs/HERO_FILTERING_AND_STRATEGY.md)** - Hero-specific powers and items
- **[Budget Feature Guide](./docs/BUDGET_FEATURE.md)** - Budget tracking implementation

## ✨ Features

- **Team Composition Builder**: Create 5v5 team compositions with visual hero selection
- **Hero Customization**: Select up to 4 powers and 6 items per hero
- **Budget Tracker**: Track your credit budget and item costs
- **AI Strategy Plan**: Get GPT-4o-mini powered strategy recommendations
- **AI Build Suggestions**: Receive budget-aware build optimization suggestions
- **Real-time Cost Calculation**: See total item costs and remaining budget
- **Dark Theme**: Professional gunmetal color scheme optimized for readability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/3star333/cs4680-project.git
   cd cs4680-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your OpenAI API key**
   
   Open `.env.local` and add your API key:
   ```env
   OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000/editor](http://localhost:3000/editor)

## 🔒 Security Note

**IMPORTANT:** Never commit your `.env.local` file! Your OpenAI API key should remain private.

- ✅ `.env.local` is already in `.gitignore`
- ✅ Use `.env.example` as a template
- ❌ Never share your actual API key

See [ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for detailed security guidelines.

## 📖 How to Use

### Building a Team Composition

1. **Add Heroes**: Click "+ Add Ally" or "+ Add Enemy" to select heroes
2. **Mark Yourself**: Click "Mark as You" on your hero to enable budget tracking
3. **Edit Builds**: Click "Edit" to select powers (max 4) and items (max 6)
4. **Set Budget**: Adjust your credit budget (default: 10,000)
5. **Get AI Help**: Use "Generate Strategy Plan" or "Suggest Build (Budget)"

### AI Features

- **🎯 Generate Strategy Plan**: Analyzes your team composition and provides:
  - Team strengths and weaknesses
  - Recommended strategy
  - Counter-strategies for enemies
  - Win conditions

- **💡 Suggest Build (Budget)**: Provides budget-aware recommendations:
  - Current build assessment
  - Item recommendations within your budget
  - Priority items for your hero
  - Synergy tips

## 🎨 Features Overview

### Budget Tracking
- Set custom credit budgets
- Real-time cost calculation
- Over-budget warnings
- Cost display per hero

### Hero Customization
- 28 Overwatch heroes available
- 342 unique hero powers
- 915+ items with costs
- Hero-specific powers and items

### AI Output Panel
- Professional formatting with bold headers
- Bullet-point structure for easy scanning
- Clear GPT-4o-mini attribution
- Scrollable, persistent display

## 📁 Project Structure

```
StadiumOW-Web-App/
├── app/
│   ├── editor/           # Main composition editor page
│   └── api/              # API routes for AI features
├── components/
│   ├── editor/           # Editor components
│   └── stadium/          # Shared components
├── data/
│   └── stadium/          # Hero, power, and item data
├── docs/                 # Documentation
├── lib/                  # Utility functions
├── public/
│   └── assets/           # Hero portraits, item icons
└── types/                # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o-mini
- **State**: React Hooks (useState, useMemo, useEffect)

## 📚 Documentation

- [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md) - Detailed security and setup instructions
- [Budget Feature](docs/BUDGET_FEATURE.md) - Budget tracking documentation
- [AI Output Panel](docs/AI_OUTPUT_PANEL.md) - AI panel implementation details
- [Selection Limits](docs/SELECTION_LIMITS.md) - Power and item limit documentation

## 🤝 Contributing

This is an MVP (Minimum Viable Product) for a class project. Contributions are welcome!

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## ⚠️ Known Limitations

- AI responses are for guidance only and may not be 100% accurate
- Requires active OpenAI API key (costs apply based on usage)
- Data is based on Overwatch 2 Stadium game mode

## 📄 License

This project is for educational purposes as part of CS 4680.

## 🙏 Acknowledgments

- Overwatch 2 and Stadium game mode data
- OpenAI for GPT-4o-mini API
- Next.js and React teams

## 📞 Support

For issues or questions:
- Check the [docs/](docs/) folder for detailed guides
- Review [ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for API key issues
- Ensure all dependencies are installed with `npm install`

---

**Made with ❤️ for CS 4680**
