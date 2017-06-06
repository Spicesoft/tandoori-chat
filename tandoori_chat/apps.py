"""Tandoori chat app configuration file."""
from django.apps import AppConfig


class TandooriChatConfig(AppConfig):
    """Tandoori chat App Config."""

    name = "tandoori_chat"

    def ready(self):
        """Import connectors."""
        from . import connectors  # NOQA
