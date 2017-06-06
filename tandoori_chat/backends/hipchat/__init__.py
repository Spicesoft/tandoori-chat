# -*- coding: utf-8 -*-
"""Chat backends."""

from django.conf import settings

from . import utils

required_settings = [
    "HIPCHAT_ADMIN_TOKEN", "HIPCHAT_ADMIN_EMAIL", "HIPCHAT_ADMIN_PASSWORD"
]

for setting in required_settings:
    if not hasattr(settings, setting):
        raise AttributeError(
            "Setting named {} is required for Hipchat backend".format(setting))


def get_chat_params(user):
    """Return user chat parameters."""
    return utils.get_chat_params(user)


def register_user_to_chat(user):
    """Set up user chat parameters."""
    return utils.register_user_to_chat(user)


def remove_user_from_chat(user):
    """Delete hipchat user."""
    return utils.remove_user_from_chat(user)
