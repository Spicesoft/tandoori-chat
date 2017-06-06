"""List all supported hipchat api calls with their parameters."""

SUPPORTED_CALL = {
    "create_user": {
        "params": [
            "email",
            "name",
            "title",
            "password",
            "timezone",
            "mention_name",
            "is_group_admin"],
        "required": [
            "email",
            "name",
        ],
        "method": "POST",
        "API_url": "user"
    },
    "generate_token": {
        "params": [
            "username",
            "grant_type",
            "password"],
        "required": [
            "username",
            "password",
        ],
        "method": "POST",
        "API_url": "oauth/token"
    },
    "delete_user": {
        "params": [
            "email",
        ],
        "required": [
            "email",
        ],
        "method": "DELETE",
        "API_url": "user"
    },
    "get_user_details": {
        "params": [
            "user_id",
        ],
        "required": [
            "user_id",
        ],
        "method": "GET",
        "API_url": "user"
    },
}
