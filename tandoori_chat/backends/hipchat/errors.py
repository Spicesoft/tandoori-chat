"""Manage api call errors."""

from . import api


def error_handler(fn):
    """Decorator for hipchat api call."""
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except Exception as e:
            print(e)
    wrapper.__name__ = fn.__name__
    return wrapper


@error_handler
def check_arguments(fn_name, *args, **kwargs):
    """Check if required params are set and there is no illegal params."""
    params = {}
    if args:
        for x in args:
            if isinstance(x, dict):
                raise TypeError(
                    "Illegal argument {0}: Only named arguments or"
                    " dictionary allowed".format(x))
                return False
            params.update(x)
    if kwargs:
        params.update(kwargs)
    _illegal = [x for x in params.keys()
                if x not in api.SUPPORTED_CALL[fn_name]['params']]
    _missed = [x for x in api.SUPPORTED_CALL[fn_name]['params']
               if (x not in params.keys() and
                   x in api.SUPPORTED_CALL[fn_name]['required'])]
    if _illegal or _missed:
        raise ArgumentError(fn_name, _illegal, _missed)

    if 'sender' in params:
        _keys = [(lambda x: x if x is not 'sender' else 'from')(x)
                 for x in params.keys()]
        _val = params.values()
        params = dict(zip(_keys, _val))
    return (lambda: params if params else {'format': 'json'})()


class ArgumentError(Exception):
    """Custom exception to manage argument errors."""

    def __init__(self, name, illegal, missed):
        """Argument Error init func."""
        self.illegal = illegal
        self.missed = missed
        self._name = name

    def __str__(self):
        """Render exception."""
        return repr(
            "ArgumentError: In function {0}: {1} {2})"
            .format(
                self._name,
                (lambda: 'illegal arguments: {0},'
                    .format(self.illegal) if self.illegal else '')(),
                (lambda: 'you miss required arguments: {0}'
                    .format(self.missed) if self.missed else '')()))


class ConnectionError(Exception):
    """Custom exception to manage connection errors."""

    def __init__(self, e):
        """Argument Error init func."""
        self.e = e

    def __str__(self):
        """Render exception."""
        return repr(
            "Error: can't established connection with api.hipchat.com | {0}"
            .format(self.e))
