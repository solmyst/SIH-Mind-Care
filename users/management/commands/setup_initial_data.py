"""
Management command to set up initial data for the SIH backend.
"""

from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from journals.models import JournalPrompt
from chat.models import ChatTemplate
from users.models import User


class Command(BaseCommand):
    help = 'Set up initial data for SIH backend'
    
    def handle(self, *args, **options):
        self.stdout.write('Setting up initial data...')
        
        # Update site configuration
        site = Site.objects.get_current()
        site.domain = 'localhost:8000'
        site.name = 'SIH Backend'
        site.save()
        self.stdout.write(f'✓ Updated site configuration')
        
        # Create journal prompts
        prompts = [
            {
                'title': 'Daily Gratitude',
                'prompt_text': 'What are three things you\'re grateful for today?',
                'category': 'gratitude',
                'target_mood_levels': [1, 2, 3, 4, 5]
            },
            {
                'title': 'Stress Check-in',
                'prompt_text': 'What\'s causing you stress today, and how are you managing it?',
                'category': 'stress',
                'target_mood_levels': [1, 2, 3]
            },
            {
                'title': 'Academic Reflection',
                'prompt_text': 'How did your studies go today? What went well and what was challenging?',
                'category': 'general',
                'target_mood_levels': [1, 2, 3, 4, 5]
            },
            {
                'title': 'Relationship Thoughts',
                'prompt_text': 'How are your relationships with friends and family affecting your mood?',
                'category': 'relationships',
                'target_mood_levels': [1, 2, 3]
            },
            {
                'title': 'Future Goals',
                'prompt_text': 'What\'s one goal you\'re working towards, and what step can you take today?',
                'category': 'goals',
                'target_mood_levels': [3, 4, 5]
            }
        ]
        
        created_prompts = 0
        for prompt_data in prompts:
            prompt, created = JournalPrompt.objects.get_or_create(
                title=prompt_data['title'],
                defaults=prompt_data
            )
            if created:
                created_prompts += 1
        
        self.stdout.write(f'✓ Created {created_prompts} journal prompts')
        
        # Create chat templates
        templates = [
            {
                'name': 'Anxiety Support',
                'category': 'anxiety',
                'system_prompt': '''You are a compassionate AI assistant specializing in anxiety support for students. 
Your role is to:
1. Listen empathetically to anxiety concerns
2. Provide evidence-based coping techniques (breathing exercises, grounding techniques)
3. Help identify anxiety triggers
4. Suggest lifestyle changes that can reduce anxiety
5. Recognize when professional help is needed

Always maintain a calm, reassuring tone and validate the user's feelings.''',
                'welcome_message': 'I\'m here to help you work through any anxiety you\'re experiencing. What\'s on your mind today?'
            },
            {
                'name': 'Academic Stress',
                'category': 'stress',
                'system_prompt': '''You are an AI assistant focused on helping students manage academic stress.
Your role is to:
1. Help break down overwhelming tasks into manageable steps
2. Suggest effective study strategies and time management techniques
3. Provide stress relief methods
4. Help set realistic academic goals
5. Recognize signs of academic burnout

Be practical and solution-oriented while remaining supportive.''',
                'welcome_message': 'Let\'s work together to tackle your academic stress. What\'s feeling overwhelming right now?'
            },
            {
                'name': 'Crisis Support',
                'category': 'crisis',
                'system_prompt': '''You are an AI crisis support assistant. Your primary goals are:
1. Ensure immediate safety
2. Provide emotional support and validation
3. Help develop safety plans
4. Connect users with professional resources
5. IMMEDIATELY escalate if there are signs of self-harm or suicidal ideation

Always prioritize safety and encourage professional help for serious concerns.''',
                'welcome_message': 'I\'m here to provide support during difficult times. Your safety and wellbeing are my priority.',
                'requires_escalation_review': True,
                'max_messages': 10
            }
        ]
        
        created_templates = 0
        for template_data in templates:
            template, created = ChatTemplate.objects.get_or_create(
                name=template_data['name'],
                defaults=template_data
            )
            if created:
                created_templates += 1
        
        self.stdout.write(f'✓ Created {created_templates} chat templates')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully set up initial data!')
        )