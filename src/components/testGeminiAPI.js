// Simple test to verify Gemini API is working and returning expected format
import { generateGeminiContent } from './aiGemini';

export async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...');
  
  try {
    const testMessage = "I'm feeling really stressed about my upcoming exams";
    console.log('📤 Test message:', testMessage);
    
    const result = await generateGeminiContent(testMessage);
    console.log('📥 Full result:', result);
    
    console.log('✅ API Test Results:');
    console.log('- Text response:', result.text.substring(0, 100) + '...');
    console.log('- Detected mood:', result.mood);
    console.log('- Crisis detected:', result.isCrisis);
    
    return result;
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    return null;
  }
}

// Auto-run test when imported
if (typeof window !== 'undefined') {
  window.testGeminiAPI = testGeminiAPI;
  console.log('🔧 Test function available as window.testGeminiAPI()');
}