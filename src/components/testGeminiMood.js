// Test Gemini mood extraction utility
import { extractSupportedMood } from './aiGemini';

const testCases = [
  { input: '{"user_mood_analysis": "Happy"}', expected: 'happy' },
  { input: '{"user_mood_analysis": "Calm"}', expected: 'calm' },
  { input: '{"user_mood_analysis": "Neutral"}', expected: 'neutral' },
  { input: '{"user_mood_analysis": "Anxious"}', expected: 'anxious' },
  { input: '{"user_mood_analysis": "Sad"}', expected: 'sad' },
  { input: '{"user_mood_analysis": "Stressed"}', expected: 'stressed' },
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
