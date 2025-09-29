"""
WebSocket consumers for real-time chat functionality.
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser


class GroupChatConsumer(AsyncWebsocketConsumer):
    """Consumer for group chat functionality."""
    
    async def connect(self):
        """Handle WebSocket connection."""
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.group_name = f'group_{self.group_id}'
        
        # Check authentication
        if self.scope["user"] == AnonymousUser():
            await self.close()
            return
        
        # Join group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        # Leave group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Handle incoming WebSocket message."""
        data = json.loads(text_data)
        message = data['message']
        
        # TODO: Save message to database
        # TODO: Moderate message content
        
        # Send message to group
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': self.scope["user"].full_name,
                'timestamp': '2024-01-01T00:00:00Z'  # TODO: Use actual timestamp
            }
        )
    
    async def chat_message(self, event):
        """Handle chat message event."""
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': event['user'],
            'timestamp': event['timestamp']
        }))


class PeerChatConsumer(AsyncWebsocketConsumer):
    """Consumer for peer-to-peer chat functionality."""
    
    async def connect(self):
        """Handle WebSocket connection."""
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_name = f'peer_{self.user_id}'
        
        # Check authentication
        if self.scope["user"] == AnonymousUser():
            await self.close()
            return
        
        # Join room
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        # Leave room
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Handle incoming WebSocket message."""
        data = json.loads(text_data)
        message = data['message']
        recipient_id = data.get('recipient_id')
        
        # TODO: Save message to database
        
        # Send message to recipient
        if recipient_id:
            await self.channel_layer.group_send(
                f'peer_{recipient_id}',
                {
                    'type': 'peer_message',
                    'message': message,
                    'sender': self.scope["user"].full_name,
                    'sender_id': str(self.scope["user"].id),
                    'timestamp': '2024-01-01T00:00:00Z'  # TODO: Use actual timestamp
                }
            )
    
    async def peer_message(self, event):
        """Handle peer message event."""
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'sender_id': event['sender_id'],
            'timestamp': event['timestamp']
        }))