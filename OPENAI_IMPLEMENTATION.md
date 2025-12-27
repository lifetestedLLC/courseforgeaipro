# OpenAI Integration Guide

## Overview
This document describes the OpenAI API integration implemented for CourseForge AI to enable AI-powered content generation.

## What Was Implemented

### 1. OpenAI SDK Integration
- **Package**: `openai` (official SDK)
- **Configuration**: `lib/openai.ts`
- **API Key**: Environment variable `OPENAI_API_KEY`

### 2. AI Generation Endpoints

#### Course Generation (`/api/ai/generate-course`)
Generates comprehensive course outlines with:
- Course title and description
- Target audience
- 5-7 learning objectives
- 4-6 modules with lessons
- Key takeaways per module

**Request Body:**
```json
{
  "topic": "Introduction to Machine Learning",
  "level": "Intermediate",
  "duration": "4 weeks"
}
```

**Response:**
```json
{
  "success": true,
  "course": {
    "title": "Course Title",
    "description": "...",
    "targetAudience": "...",
    "learningObjectives": ["..."],
    "modules": [...]
  },
  "tokens": {...}
}
```

#### Video Script Generation (`/api/ai/generate-video`)
Generates video scripts with:
- Engaging hook (first 15 seconds)
- Structured content sections
- Voiceover text
- Visual suggestions
- Call to action

**Request Body:**
```json
{
  "topic": "How Neural Networks Work",
  "duration": "5 minutes",
  "style": "Professional and engaging"
}
```

**Response:**
```json
{
  "success": true,
  "video": {
    "title": "Video Title",
    "hook": {...},
    "sections": [...],
    "callToAction": {...}
  },
  "tokens": {...}
}
```

#### Quiz Generation (`/api/ai/generate-quiz`)
Generates educational quizzes with:
- Multiple choice questions
- 4 answer options per question
- Correct answer identification
- Explanations for answers
- Mix of knowledge types (recall, comprehension, application)

**Request Body:**
```json
{
  "topic": "JavaScript Fundamentals",
  "difficulty": "Intermediate",
  "questionCount": 10
}
```

**Response:**
```json
{
  "success": true,
  "quiz": {
    "title": "Quiz Title",
    "difficulty": "Intermediate",
    "questions": [...]
  },
  "tokens": {...}
}
```

### 3. UI Components

#### AI Generator Page (`/dashboard/generate`)
Interactive interface with three tabs:
- **Course Generator**: Create course outlines
- **Video Generator**: Generate video scripts
- **Quiz Generator**: Build assessment questions

Features:
- Tab-based navigation
- Form validation
- Loading states
- Error handling
- JSON result display
- Save/Export buttons

## Setup Instructions

### 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (you won't see it again!)

### 2. Configure Environment Variable

Add to `.env.local`:
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Restart Development Server

```bash
npm run dev
```

## Usage

### From the Dashboard

1. Log in to your account
2. Click any "Quick Actions" button (Generate Course, Create Video, Build Quiz)
3. Or navigate directly to `/dashboard/generate`
4. Select the type of content you want to generate
5. Fill in the required fields
6. Click the generate button
7. Wait for AI to process (typically 5-15 seconds)
8. Review the generated content
9. Save or export as needed

### API Usage (Programmatic)

```typescript
// Generate a course
const response = await fetch('/api/ai/generate-course', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: 'React Hooks',
    level: 'Intermediate',
    duration: '4 weeks'
  })
});

const data = await response.json();
console.log(data.course);
```

## Security & Authentication

### Protected Endpoints
All AI generation endpoints require authentication:
- User must be logged in (valid NextAuth session)
- Unauthorized requests return 401 status

### Rate Limiting
Currently no rate limiting implemented. Recommended additions:
- Per-user request limits
- Cost tracking
- Usage quotas based on subscription tier

## Model Configuration

### Current Settings
- **Model**: GPT-4
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Max Tokens**: 
  - Course: 2000 tokens
  - Video: 1500 tokens
  - Quiz: 2000 tokens

### Cost Estimates (GPT-4)
- Course generation: ~$0.04-0.08 per request
- Video script: ~$0.03-0.06 per request
- Quiz: ~$0.04-0.08 per request

*Prices vary based on actual token usage*

## Error Handling

### Common Errors

**"OpenAI API key not configured"**
- Solution: Add `OPENAI_API_KEY` to `.env.local`

**"Unauthorized"**
- Solution: Ensure user is logged in

**"Failed to generate [content]"**
- Check OpenAI API key is valid
- Check OpenAI account has credits
- Check topic is not empty
- Check network connection

**"No response from OpenAI"**
- OpenAI API may be experiencing issues
- Try again or check [OpenAI Status](https://status.openai.com)

## Prompt Engineering

### System Prompts
Each endpoint uses carefully crafted system prompts:

**Course Generation:**
> "You are an expert course creator. Generate comprehensive, well-structured course outlines..."

**Video Generation:**
> "You are an expert video scriptwriter for educational content. Create engaging, clear, and well-paced scripts..."

**Quiz Generation:**
> "You are an expert quiz creator for educational content. Create well-crafted, challenging, and fair assessment questions..."

### Output Format
All prompts request JSON-formatted responses for:
- Consistent parsing
- Structured data
- Easy frontend integration

## Future Enhancements

### Phase 3.1: Advanced Features
- [ ] Content refinement/editing
- [ ] Multiple language support
- [ ] Custom templates
- [ ] Batch generation

### Phase 3.2: AI Models
- [ ] Support for other models (GPT-3.5-turbo for cost savings)
- [ ] Claude integration (Anthropic)
- [ ] Model selection in UI

### Phase 3.3: Content Management
- [ ] Save generated content to database
- [ ] Version history
- [ ] Content library
- [ ] Search and filter

### Phase 3.4: Collaboration
- [ ] Share generated content
- [ ] Team workspaces
- [ ] Comments and feedback
- [ ] Approval workflows

## Testing

### Manual Testing

1. **Course Generation:**
   ```
   Topic: "Introduction to Python"
   Level: Beginner
   Duration: 4 weeks
   Expected: 4-6 modules with lessons
   ```

2. **Video Script:**
   ```
   Topic: "Variables in Python"
   Duration: 5 minutes
   Style: Professional and engaging
   Expected: Hook + 3-4 sections + CTA
   ```

3. **Quiz:**
   ```
   Topic: "Python Data Types"
   Difficulty: Beginner
   Questions: 10
   Expected: 10 MC questions with explanations
   ```

### Expected Response Times
- Course generation: 10-20 seconds
- Video script: 8-15 seconds
- Quiz generation: 10-18 seconds

*Times vary based on OpenAI API load*

## Monitoring & Optimization

### Token Usage Tracking
Each response includes token usage:
```json
{
  "tokens": {
    "prompt_tokens": 150,
    "completion_tokens": 850,
    "total_tokens": 1000
  }
}
```

### Cost Optimization Tips
1. Use GPT-3.5-turbo for simpler content
2. Reduce max_tokens for shorter responses
3. Cache common requests
4. Implement request deduplication

## Troubleshooting

### Debug Mode
Add to API endpoints for detailed logging:
```typescript
console.log('Request:', { topic, level, duration });
console.log('OpenAI Response:', completion);
```

### Testing Without API Key
The system gracefully handles missing API keys:
- Returns clear error message
- Shows setup instructions
- Doesn't crash the application

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GPT-4 Model Overview](https://platform.openai.com/docs/models/gpt-4)
- [OpenAI Pricing](https://openai.com/pricing)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

## Summary

✅ **Completed**: Phase 3 - OpenAI API Integration
- Course generation with structured outlines
- Video script generation with scenes
- Quiz generation with MC questions
- Protected API endpoints
- User-friendly generation interface
- Error handling and validation

⏭️ **Next**: Phase 4 - Stripe Payment Processing
- Subscription management
- Payment processing
- Usage limits based on plan
- Billing portal
