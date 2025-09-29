// Test file to verify mood detection from Gemini API responses
import { extractSupportedMood } from './aiGemini';

// Test cases with sample Gemini responses
const testResponses = [
  {
    name: 'Happy mood response',
    response: `I'm glad to hear you're feeling positive! That's wonderful. 

{
  "mental_state_detected": "Happy",
  "user_mood_analysis": "Happy",
  "sentiment_emotion_analysis": {
    "tone": "Positive",
    "stress_level": "Low"
  },
  "crisis_detected": "false"
}`
  },
  {
    name: 'Anxious mood response',
    response: `I understand you're feeling worried about your exams. That's completely normal.

{
  "mental_state_detected": "Anxious",
  "user_mood_analysis": "Anxious",
  "sentiment_emotion_analysis": {
    "tone": "Negative",
    "stress_level": "High"
  },
  "crisis_detected": "false"
}`
  },
  {
    name: 'Stressed mood response',
    response: `It sounds like you're under a lot of pressure right now. Let's work through this together.

{
  "mental_state_detected": "Stressed",
  "user_mood_analysis": "Stressed",
  "sentiment_emotion_analysis": {
    "tone": "Negative",
    "stress_level": "High"
  },
  "crisis_detected": "false"
}`
  },
  {
    name: 'Crisis response',
    response: `I'm very concerned about what you're sharing. Please reach out to a crisis helpline immediately.

{
  "mental_state_detected": "Sad",
  "user_mood_analysis": "Depressed",
  "sentiment_emotion_analysis": {
    "tone": "Negative",
    "stress_level": "High"
  },
  "crisis_detected": "true"
}`
  }
];

// Run tests
console.log('🧪 Testing Mood Detection from Gemini Responses\n');

testResponses.forEach((test, index) => {
  console.log(`Test ${index + 1}: ${test.name}`);
  const detectedMood = extractSupportedMood(test.response);
  console.log(`Detected mood: ${detectedMood}`);
  console.log('---');
});

export { testResponses };