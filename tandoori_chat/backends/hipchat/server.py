"""Manage api call."""

import json
import logging
import urllib3

from django.db import connection

from tandoori_library.raven import extra_logging

from . import api
from . import errors

API_URL = 'https://api.hipchat.com/v2'
logger = logging.getLogger(__name__)


@errors.error_handler
def singleton_with_methods(class_):
    """
    Decorator to manage Hipchat instance.

    Read all the SUPPORTED_CALL listed in api file and
    implement every SUPPORTED_CALL a callable method."""
    instances = {}

    def getinstance(*args, **kwargs):
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
            instances[class_].__init__(args[0])
            for key in api.SUPPORTED_CALL:
                _temp = (lambda **kwrgs: kwrgs)
                _temp.__name__ = key
                class_.__dict__[_temp.__name__] = call_api(
                    api.SUPPORTED_CALL[key]['method'],
                    api.SUPPORTED_CALL[key]['API_url'])(_temp)
        return instances[class_]
    return getinstance


def call_api(method, dest):
    """Proceed to the api call."""
    def decorator(fn):
        @errors.error_handler
        def wrapper(self, *args, **kwargs):
            params = errors.check_arguments(fn.__name__, *args, **kwargs)
            if params:
                if method == "POST":
                    url = "{0}/{1}?auth_token={2}".format(
                        API_URL, dest, self.AUTH_TOKEN)
                else:
                    url = "{0}/{1}/{2}?auth_token={3}".format(
                        API_URL, dest, params.values()[0], self.AUTH_TOKEN)
                try:
                    response = urllib3.PoolManager().urlopen(
                        method, url,
                        headers={'Content-Type': 'application/json'},
                        body=json.dumps(params))
                    if response.status >= 400:
                        msg = "Hipchat API error: {}.".format(response.data)
                        extra = extra_logging(connection.tenant)
                        logger.error(msg, extra=extra)
                    return {
                        'status': response.status,
                        'data': (json.loads(response.data)
                                 if response.status == 200
                                 else response.data)
                    }
                except Exception as e:
                    raise errors.ConnectionError(e)
            wrapper.__name__ = fn.__name__
        return wrapper
    return decorator


@singleton_with_methods
class Hipchat():
    def __init__(self, token):
        self.AUTH_TOKEN = token
