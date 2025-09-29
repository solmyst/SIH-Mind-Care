# AI Mood Detection & Dynamic Theme System

## Overview
This system automatically detects user mood from their chat messages using Google's Gemini AI and dynamically changes the UI theme to match their emotional state.

## How It Works

### 1. User Interaction
- User types a message in QuickChat
- Message is sent to Gemini AI with a specialized mental health prompt

### 2. AI Analysis
- Gemini analyzes the message for emotional content
- Returns both a helpful response AND a JSON object containing:
  - `mental_state_detected`: User's current mental state
  - `user_mood_analysis`: Primary mood analysis
  - `sentiment_emotion_analysis`: Tone and stress level
  - `crisis_detected`: Whether crisis intervention is needed

### 3. Mood Extraction
- `extractSupportedMood()` function parses the JSON response
- Maps Gemini's mood analysis to our supported moods:
  - `happy` - Joy, excitement, positive feelings
  - `calm` - Peaceful, relaxed, centered
  - `sad` - Down, melancholy, depressed
  - `anxious` - Worried, nervous, fearful
  - `stressed` - Overwhelmed, pressured, tense
  - `neutral` - Balanced, normal, okay

### 4. Theme Update
- If mood changes, a `moodChange` event is dispatched
- App component listens for this event and updates `currentMood`
- CSS variables are updated to reflect the new mood theme
- Visual transition notification appears

### 5. Visual Feedback
- Theme colors smoothly transition (1 second duration)
- MoodCard shows "AI detected mood change" indicator
- MoodTransition component shows emoji transition
- Chat includes a subtle message about theme adjustment

## Components Involved

### `aiGemini.tsx`
- Contains the Gemini API integration
- `SYSTEM_PROMPT` - Specialized mental health companion prompt
- `extractSupportedMood()` - Parses mood from AI response
- `generateGeminiContent()` - Main API call function

### `QuickChat.tsx`
- Handles user messages and AI responses
- Detects mood changes and dispatches events
- Shows mood-aware chat interface

### `App.tsx`
- Manages global mood state
- Applies theme CSS variables
- Listens for mood change events

### `MoodCard.tsx`
- Displays current mood with visual indicator
- Shows when AI detects mood changes

### `MoodTransition.tsx`
- Animated notification for mood changes
- Shows emoji transition from old to new mood

## Theme System

Each mood has its own color palette:

```typescript
const moodThemes: Record<MoodType, MoodTheme> = {
  happy: {
    primary: 'rgb(255, 193, 7)',     // Warm yellow
    gradient: 'linear-gradient(135deg, rgb(255, 193, 7) 0%, rgb(255, 152, 0) 100%)',
    background: 'linear-gradient(135deg, rgb(255, 248, 225) 0%, rgb(255, 243, 205) 100%)'
  },
  calm: {
    primary: 'rgb(33, 150, 243)',    // Peaceful blue
    // ... etc
  }
  // ... other moods
};
```

## Crisis Detection

The system includes crisis detection for mental health safety:
- If `crisis_detected: "true"` in Gemini response
- Special crisis support messages are shown
- Theme may adjust to provide calming colors
- User is directed to professional help resources

## Testing

Use `testMoodDetection.js` to verify mood extraction:

```javascript
import { extractSupportedMood } from './aiGemini';

const response = `I understand you're feeling anxious...
{
  "mental_state_detected": "Anxious",
  "user_mood_analysis": "Anxious",
  "crisis_detected": "false"
}`;

const mood = extractSupportedMood(response); // Returns 'anxious'
```

## Configuration

### Environment Variables
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Supported Languages
The system works in multiple languages:
- English
- Hindi/Hinglish
- Spanish
- French

## Benefits

1. **Personalized Experience** - UI adapts to user's emotional state
2. **Mental Health Awareness** - Helps users recognize their moods
3. **Therapeutic Value** - Color psychology supports emotional well-being
4. **Crisis Prevention** - Automatic detection of concerning messages
5. **Seamless Integration** - Works transparently in the background

## Future Enhancements

- Mood history tracking
- Personalized color preferences
- Advanced emotion recognition
- Integration with wearable devices
- Mood-based content recommendations