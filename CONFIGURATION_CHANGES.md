# Configuration Changes Made

This document outlines the changes made to the AI Chatbot to support OpenRouter.ai and disable public access.

## Changes Made

### 1. OpenRouter.ai Integration

- **Added OpenAI SDK**: Installed `@ai-sdk/openai` package to support OpenRouter
- **Updated Provider Configuration** (`lib/ai/providers.ts`):
  - Configured OpenRouter as the AI provider using OpenAI SDK
  - Set base URL to `https://openrouter.ai/api/v1`
  - Updated models to use GPT-4o via OpenRouter
  - Uses `openai/gpt-4o` for chat and `openai/gpt-3.5-turbo` for titles
- **Environment Variables** (`.env.example`):
  - Added `OPENROUTER_API_KEY` environment variable
  - Updated documentation to reference OpenRouter API key setup
- **Model Names** (`lib/ai/models.ts`):
  - Updated model names to reflect OpenRouter/GPT-4o usage

### 2. Disabled User Registration

- **Register Page** (`app/(auth)/register/page.tsx`):
  - Replaced registration form with redirect to login page
  - Shows "Registration Disabled" message
- **Register Action** (`app/(auth)/actions.ts`):
  - Disabled the register function to always return failure
- **Login Page** (`app/(auth)/login/page.tsx`):
  - Removed "Sign up" link
  - Added message about contacting administrator for access

### 3. Disabled Guest/Public Access

- **Middleware** (`middleware.ts`):
  - Removed guest user creation redirect
  - Blocked guest users from accessing the application
  - All unauthenticated users are redirected to login
- **Authentication** (`app/(auth)/auth.ts`):
  - Removed guest authentication provider
  - Only credentials-based authentication is available
- **Guest API Route** (`app/(auth)/api/auth/guest/route.ts`):
  - Disabled guest session creation
  - Redirects to login page instead
- **Visibility Selector** (`components/visibility-selector.tsx`):
  - Removed "public" chat option
  - Only "private" chats are available

## Required Setup

1. **OpenRouter API Key**: 
   - Sign up at https://openrouter.ai/
   - Get your API key from https://openrouter.ai/keys
   - Add it to your environment as `OPENROUTER_API_KEY`

2. **User Management**:
   - Users must be created manually in the database
   - No self-registration is available
   - All chats are private to the authenticated user

3. **Authentication**:
   - Username/password authentication only
   - No guest access allowed
   - Users must log in to access the chatbot

## OpenRouter Models Used

- **Chat Model**: `openai/gpt-4o` - Main conversation model
- **Reasoning Model**: `openai/gpt-4o` - Enhanced reasoning capabilities  
- **Title Model**: `openai/gpt-3.5-turbo` - Generates chat titles
- **Artifact Model**: `openai/gpt-4o` - Handles code/document generation

You can change these models in `lib/ai/providers.ts` to use other models available through OpenRouter.
