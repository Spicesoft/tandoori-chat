# pylint: disable=C0103

"""Tandoori Chat in-app settings."""


class ChatConf(object):
    """Wrapper class around tandoori_chat related settings."""

    TANDOORI_CHAT_BACKEND = "tandoori_chat.backends.hipchat"
    TANDOORI_BOSH_URL = "https://platform.tandoori.pro/http-bind/"
