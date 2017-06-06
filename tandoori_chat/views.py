# coding: utf-8
"""Tandoori chat related views."""

from django import http
from django.core.exceptions import PermissionDenied
from django.db import connection
from django.utils.translation import ugettext_lazy as _
from django.views import generic

from . import backends


class ChatParamsView(generic.View):
    """Return json with user chat params."""

    http_method_names = [u"get"]

    def dispatch(self, request, *args, **kwargs):
        """Return user chat parameters in json."""
        if not connection.tenant.enable_chat:
            raise PermissionDenied(_("This feature is not activated."))
        params = backends.get_chat_params(request.user)
        return http.JsonResponse(params)
