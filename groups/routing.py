"""
WebSocket routing for groups app.
"""

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/groups/(?P<group_id>\w+)/$', consumers.GroupChatConsumer.as_asgi()),
    re_path(r'ws/peer-chat/(?P<user_id>\w+)/$', consumers.PeerChatConsumer.as_asgi()),
]