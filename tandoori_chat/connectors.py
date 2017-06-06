# -*- coding: utf-8 -*-
# pylint: disable=unused-argument
"""Tandoori Chat signals handling."""

from django.db import connection
from django.dispatch import receiver

from tandoori_account import signals as account_signals

from . import backends


@receiver(account_signals.account_created)
def register_account_to_chat(sender, account, **kwargs):
    """Create and save user chat parameters."""
    if connection.tenant.enable_chat:
        backends.register_user_to_chat(account.user)
