/// <reference types="vite/client" />

// Simple test prompt first - let's get basic API working
export const SIMPLE_PROMPT = `You are a helpful assistant. Just respond normally to the user's message.`;

// More focused system prompt for mood detection
export const SYSTEM_PROMPT = `You are a mental health companion. Respond helpfully to the user's message.

CRITICAL: You MUST end every response with a JSON object. No exceptions.

Format:
1. Write your helpful response
2. Add a blank line
3. Add ONLY this JSON (no markdown, no code blocks):
{"user_mood_analysis": "Mood", "crisis_detected": "false"}

Mood options: Happy, Calm, Sad, Anxious, Stressed, Neutral

Example:
I understand you're feeling stressed. Try deep breathing exercises.

{"user_mood_analysis": "Stressed", "crisis_detected": "false"}`;

// List of supported moods
const SUPPORTED_MOODS = ['happy', 'calm', 'neutral', 'anxious', 'sad', 'stressed'] as const;
export type SupportedMood = typeof SUPPORTED_MOODS[number];

// Extract mood from Gemini response (text or JSON)
export function extractSupportedMood(response: string): SupportedMood | null {
  console.log('🔍 Full Gemini response for mood extraction:', response);
  
  // Try to find a JSON block
  const jsonMatch = response.match(/\{[\s\S]*?\}/);
  console.log('🔍 JSON match found:', jsonMatch ? jsonMatch[0] : 'No JSON found');
  
  if (jsonMatch) {
    try {
      const json = JSON.parse(jsonMatch[0]);
      console.log('🔍 Parsed Gemini JSON:', json);
      
      // Get mood from user_mood_analysis or mental_state_detected
      let mood = (json.user_mood_analysis || json.mental_state_detected || '').toLowerCase();
      console.log('🎭 Raw mood from Gemini:', mood);
      
      // Map Gemini's mood to our supported moods
      let mappedMood: SupportedMood | null = null;
      if (mood.includes('stressed') || mood.includes('stress')) mappedMood = 'stressed';
      else if (mood.includes('calm') || mood.includes('peaceful') || mood.includes('relaxed')) mappedMood = 'calm';
      else if (mood.includes('sad') || mood.includes('depressed') || mood.includes('down')) mappedMood = 'sad';
      else if (mood.includes('anxious') || mood.includes('anxiety') || mood.includes('worried') || mood.includes('nervous')) mappedMood = 'anxious';
      else if (mood.includes('happy') || mood.includes('joy') || mood.includes('excited') || mood.includes('positive')) mappedMood = 'happy';
      else if (mood.includes('neutral') || mood.includes('normal') || mood.includes('okay')) mappedMood = 'neutral';
      
      console.log('🎯 Mapped mood:', mappedMood);
      return mappedMood;
    } catch (error) {
      console.warn('Failed to parse mood from Gemini JSON:', error);
    }
  } else {
    console.warn('No JSON block found in Gemini response');
    
    // Fallback: try to detect mood from the text itself
    const text = response.toLowerCase();
    console.log('🔍 Trying text-based mood detection...');
    
    if (text.includes('stressed') || text.includes('stress') || text.includes('overwhelmed')) return 'stressed';
    if (text.includes('anxious') || text.includes('anxiety') || text.includes('worried') || text.includes('nervous')) return 'anxious';
    if (text.includes('sad') || text.includes('depressed') || text.includes('down') || text.includes('upset')) return 'sad';
    if (text.includes('happy') || text.includes('joy') || text.includes('excited') || text.includes('great')) return 'happy';
    if (text.includes('calm') || text.includes('peaceful') || text.includes('relaxed')) return 'calm';
    
    console.log('🔍 No mood detected from text');
  }
  return null;
}

// Helper function to detect crisis from Gemini response
function isCrisisDetected(response: string): boolean {
  try {
    const jsonMatch = response.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const json = JSON.parse(jsonMatch[0]);
      return json.crisis_detected === 'true' || json.crisis_detected === true;
    }
  } catch {
    console.warn('Failed to parse crisis status from Gemini JSON');
  }
  return false;
}

export async function generateGeminiContent(prompt: string, systemPrompt: string = SYSTEM_PROMPT): Promise<{ text: string, mood: SupportedMood | null, isCrisis: boolean }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please check your .env file.');
  }
  
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  const body = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: prompt }
        ]
      }
    ]
  };

  console.log('🚀 Calling Gemini API with prompt:', prompt);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Gemini API error:', res.status, errorText);
    throw new Error(`Gemini API error: ${res.status} - ${errorText}`);
  }
  
  const data = await res.json();
  console.log('📥 Raw Gemini API response:', data);
  
  const fullText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[No response]";
  console.log('📄 Full text from Gemini:', fullText);
  
  let text = fullText;
  
  // Clean up the text by removing JSON and any weird formatting
  const jsonStart = text.indexOf('{');
  if (jsonStart > 0) {
    text = text.slice(0, jsonStart).trim();
  } else {
    text = text.split('```json')[0].trim();
  }
  
  // Remove any timestamp-like patterns (e.g., "04:06")
  text = text.replace(/\d{2}:\d{2}\s*\w+/g, '').trim();
  
  // Remove any standalone words at the end that might be labels
  text = text.replace(/\s+(emotional|practical|crisis)\s*$/gi, '').trim();
  
  const mood = extractSupportedMood(fullText);
  const isCrisis = isCrisisDetected(fullText);
  
  console.log('✅ Final processed result:', { text: text.substring(0, 100) + '...', mood, isCrisis });
  
  return { text, mood, isCrisis };
}