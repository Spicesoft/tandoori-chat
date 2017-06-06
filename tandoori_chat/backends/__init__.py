# -*- coding: utf-8 -*-
"""
Hipchat backend.

Every Tandoori Chat backend must provide a function get_chat_params
and register_user_to_chat.
"""

from importlib import import_module

from django.conf import settings
from django.db import connection


def get_backend():
    """Return appropriate backend."""
    if not connection.tenant.enable_chat:
        raise NotImplementedError
    return import_module(settings.TANDOORI_CHAT_BACKEND)


def get_chat_params(user):
    """Return user chat parameters."""
    return get_backend().get_chat_params(user)


def register_user_to_chat(user):
    """Set up user chat parameters."""
    return get_backend().register_user_to_chat(user)


def remove_user_from_chat(user):
    """Delete chat user."""
    return get_backend().remove_user_from_chat(user)
