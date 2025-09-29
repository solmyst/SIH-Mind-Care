// Debug Gemini mood extraction for all possible JSON keys and values
import { extractSupportedMood } from './aiGemini';

const testCases = [
  { input: '{"user_mood_analysis": "Neutral"}', expected: 'neutral' },
  { input: '{"user_mood_analysis": "neutral"}', expected: 'neutral' },
  { input: '{"user_mood_analysis": "NEUTRAL"}', expected: 'neutral' },
  { input: '{"user_mood_analysis": "Stressed"}', expected: 'stressed' },
  { input: '{"user_mood_analysis": "Happy"}', expected: 'happy' },
  { input: '{"user_mood_analysis": "Calm"}', expected: 'calm' },
  { input: '{"user_mood_analysis": "Sad"}', expected: 'sad' },
  { input: '{"user_mood_analysis": "Anxious"}', expected: 'anxious' },
  { input: '{"mental_state_detected": "Neutral"}', expected: 'neutral' },
  { input: '{"mental_state_detected": "Stressed"}', expected: 'stressed' },
  { input: '{"mental_state_detected": "Happy"}', expected: 'happy' },
  { input: '{"mental_state_detected": "Calm"}', expected: 'calm' },
  { input: '{"mental_state_detected": "Sad"}', expected: 'sad' },
  { input: '{"mental_state_detected": "Anxious"}', expected: 'anxious' },
  { input: 'I am feeling very stressed and overwhelmed.', expected: 'stressed' },
  { input: 'Today I am happy!', expected: 'happy' },
  { input: 'I feel neutral.', expected: 'neutral' },
  { input: 'I am calm.', expected: 'calm' },
  { input: 'I am anxious about exams.', expected: 'anxious' },
  { input: 'I am sad.', expected: 'sad' },
  { input: 'No mood detected here.', expected: null },
];

testCases.forEach(({ input, expected }, i) => {
  const result = extractSupportedMood(input);
  console.log(`Test ${i + 1}:`, result === expected ? 'PASS' : 'FAIL', '| Detected:', result, '| Expected:', expected);
});
