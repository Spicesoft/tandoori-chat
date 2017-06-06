# -*- coding: utf-8 -*-
"""Tandoori Chat models."""

from django.db import models

from tandoori_authentication.models import User


class ChatParams(models.Model):
    """Hipchat user parameters."""

    user = models.OneToOneField(User, related_name="chat")
    userid = models.PositiveIntegerField()
    xmpp_jid = models.EmailField()
    password = models.CharField(max_length=50)
    email = models.EmailField()
    access_token = models.CharField(max_length=40)
