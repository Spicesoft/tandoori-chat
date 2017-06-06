"""Tandoori chat utils."""

import json
import uuid

from django.conf import settings
from django.db import connection

from tandoori_admin import models as admin_models

from ... import models
from . import server


hipchat = server.Hipchat(settings.HIPCHAT_ADMIN_TOKEN)


def get_chat_name(user):
    """Return user first_name and last_name."""
    if hasattr(user, "account"):
        first_name = user.account.first_name.capitalize()
        last_name = user.account.last_name.capitalize()
        if not first_name or not last_name:
            first_name = "User"
            last_name = str(user.id)
    elif hasattr(user, "administrator"):
        first_name = user.administrator.first_name.capitalize()
        last_name = user.administrator.last_name.capitalize()
        if not first_name or not last_name:
            first_name = "Admin"
            last_name = str(user.id)
    else:
        raise NotImplementedError
    return u"{} {}".format(first_name, last_name)


def get_chat_email(user):
    """
    Return email registered for chat account.

    To avoid the risk that user email is already registered
    in one of the chatting backend, we create a custom email
    address from user email."""
    return "chat+{user_id}+{schema_name}+{generated_code}@tandoori.pro".format(
        user_id=user.id,
        schema_name=connection.schema_name,
        generated_code=uuid.uuid4().hex.upper()[0:8])


def create_hipchat_user(user):
    """
    Create hipchat user.

    If hipchat user alreay exist, we delete it and recreate a new one.
    We do that to be sure to register hipchat user password.
    """
    email = get_chat_email(user)
    name = get_chat_name(user)
    response = hipchat.create_user(email=email, name=name)
    creation_response = json.loads(response["data"])
    if creation_response.get("error"):
        if (creation_response["error"].get("message") ==
                u"Email already in use by another user"):
            hipchat.delete_user(email=email)
            create_hipchat_user(user)
        # TODO: cheum, faire mieux
        elif (creation_response["error"].get("message") ==
                u"The mention name is already in use"):
            counter = 1
            while True:
                name_with_counter = u"{} #{}".format(name, counter)
                response = hipchat.create_user(
                    email=email, name=name_with_counter)
                creation_response = json.loads(response["data"])
                if "error" not in creation_response:
                    break
    details_response = hipchat.get_user_details(
        user_id=creation_response["id"])["data"]
    return {
        "creation": creation_response,
        "details": details_response
    }


def register_user_to_chat(user):
    """Create an hipchat account for user and store parameters."""
    # TO DO !!!
    # Log errors in sentry and check response status
    # We should use a custom user.email to avoic the case where
    # a user has already registered his email on hipchat.
    if hasattr(user, "chat"):
        # User already registered
        return
    user_data = create_hipchat_user(user)
    token_data = hipchat.generate_token(
        username=user_data["details"]["email"],
        password=user_data["creation"]["password"],
        grant_type="password")["data"]
    return models.ChatParams.objects.create(
        user=user,
        userid=user_data["details"]["id"],
        xmpp_jid=user_data["details"]["xmpp_jid"],
        password=user_data["creation"]["password"],
        email=user_data["details"]["email"],
        access_token=token_data["access_token"]
    )


def remove_user_from_chat(user):
    """Delete user hipchat account."""
    chat_email = get_chat_email(user)
    hipchat.delete_user(email=chat_email)


def get_user_chat_params(user):
    """Return a dictionnary containing all user chat parameters."""
    return {
        "id": user.chat.userid,
        "xmpp_jid": user.chat.xmpp_jid,
        "hipchat_name": get_chat_name(user),
        "hipchat_password": user.chat.password,
        "hipchat_email": user.chat.email,
        "hipchat_access_token": user.chat.access_token
    }


def get_admin_chat_params(user):
    """Return a dictionnary containing admin chat parameters."""
    return {
        "id": user.chat.userid,
        "xmpp_jid": user.chat.xmpp_jid,
        "hipchat_name": get_chat_name(user),
    }


def get_administrators_chat_params():
    """Return a list containing dictionnary with admin chat parameters."""
    return [get_admin_chat_params(admin.user) for admin in
            admin_models.Administrator.objects.all() if
            not admin.user.is_superadministrator and
            hasattr(admin.user, "chat")]


def get_chat_params(user):
    """Return user hipchat params to activate chat."""
    return {
        "bosh_url": settings.TANDOORI_BOSH_URL,
        "admins": get_administrators_chat_params(),
        "user": get_user_chat_params(user),
    }
