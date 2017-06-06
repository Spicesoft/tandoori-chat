# -*- coding: utf-8 -*-
"""Chat commands."""
import logging
import time

from tandoori_account import models as account_models
from tandoori_admin import models as admin_models
from tandoori_library.management.base import TenantCommand

from ... import backends

logger = logging.getLogger(__name__)


class Command(TenantCommand):
    """Command that generate chat params for existing users."""

    help = "Command that generate chat params for existing users."

    def handle_by_tenant(self, _, *dummy_args, **dummy_options):
        """
        Handle generate_chat params management command.

        To avoid hitting the hipchat api rate limit, we wait
        30 seconds between 2 accounts or admins.
        """
        for account in account_models.Account.objects.select_related("user"):
            if not hasattr(account.user, "chat"):
                logger.info("Register account {}.".format(account))
                backends.register_user_to_chat(account.user)
                time.sleep(30)
        for admin in admin_models.Administrator.objects.select_related("user"):
            if not hasattr(admin.user, "chat"):
                logger.info("Register admin {}.".format(admin))
                backends.register_user_to_chat(admin.user)
                time.sleep(30)
