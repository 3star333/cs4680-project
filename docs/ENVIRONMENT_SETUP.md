# Environment Variables Setup Guide

## 🔒 Securing Your API Keys

This project uses environment variables to keep sensitive information (like API keys) secure and out of version control.

## Setup Instructions

### 1. Create Your Environment File

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 2. Add Your OpenAI API Key

Open `.env.local` and replace the placeholder with your actual API key:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**Get your API key from:** https://platform.openai.com/api-keys

### 3. Verify Setup

Your `.env.local` file should look like this:

```env
OPENAI_API_KEY=sk-proj-AbCdEf123456...your-actual-key-here
```

## 🚨 Important Security Notes

### ✅ DO:
- Keep `.env.local` file on your local machine only
- Add `.env.local` to `.gitignore` (already done ✓)
- Use `.env.example` as a template for other developers
- Rotate your API keys if they're accidentally exposed

### ❌ DON'T:
- Never commit `.env.local` to git
- Never share your `.env.local` file
- Never hardcode API keys in your code
- Never upload `.env.local` to GitHub, Discord, etc.

## 🔍 How It Works

The application reads environment variables using Next.js's built-in support:

```typescript
// In API routes only (server-side)
const apiKey = process.env.OPENAI_API_KEY
```

**Note:** Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser. Never use this prefix for sensitive keys!

## 🛠️ For New Contributors

If you're setting up this project for the first time:

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your OpenAI API key to `.env.local`
5. Run `npm run dev`

## 🔄 Different Environments

- `.env.local` - Your personal local development (not committed)
- `.env.example` - Template file (committed to git)
- Production deployments use their own environment variables

## 📚 Additional Resources

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [How to Secure API Keys](https://blog.gitguardian.com/secrets-api-management/)

## ❓ Troubleshooting

**"API key is undefined"**
- Make sure `.env.local` exists in the project root
- Restart your development server after creating/editing `.env.local`
- Check that the key name matches exactly: `OPENAI_API_KEY`

**"Invalid API key"**
- Verify your key at https://platform.openai.com/api-keys
- Make sure you copied the entire key (starts with `sk-`)
- Check for extra spaces or newlines in your `.env.local`

---

**Remember:** Your `.env.local` file is gitignored and will never be committed to the repository! 🔒
