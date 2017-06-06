""" Tandoori Chat url conf."""

from django.conf.urls import url

from . import views


urlpatterns = [
    url(r"^chat/params/",
        views.ChatParamsView.as_view(),
        name="chat_params"),
]
