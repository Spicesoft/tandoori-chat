"""Template tags givin full uri to static dependencies."""

import json

from django import template
from django.conf import settings
from django.core.urlresolvers import reverse
from django.db import connection
from django.utils.html import escape

from .. import backends


register = template.Library()


@register.simple_tag
def chat_css(user):
    """Return chat css."""
    if (connection.tenant.enable_chat and
            user.is_authenticated() and hasattr(user, "chat")):
        url = settings.STATIC_URL + "tandoori_chat/css/converse.css"
        return '<link rel="stylesheet" href="{}">'.format(url)
    return escape("")


@register.simple_tag
def chat_js(user):
    """Return chat js."""
    if (connection.tenant.enable_chat and
            user.is_authenticated() and
            hasattr(user, "chat")):
        url = settings.STATIC_URL + "tandoori_chat/js/tandoori-chat.min.js"
        params = backends.get_chat_params(user)
        js = ('<script type="text/javascript">'
              'var chat_api_url="{}";'
              '</script>'.format(reverse("chat_params")))
        js += ('<script src="{}" data-initial-parameters="{}"'
               ' id="tandoori-chat-script"></script>'.format(
                   url, escape(json.dumps(params))))
        return js
    return escape("")
