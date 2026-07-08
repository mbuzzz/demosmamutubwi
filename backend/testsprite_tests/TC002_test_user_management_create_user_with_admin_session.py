import requests

BASE_URL = "http://localhost:1999"
LOGIN_URL = f"{BASE_URL}/api/login"
LOGOUT_URL = f"{BASE_URL}/api/logout"
USERS_URL = f"{BASE_URL}/api/users"
USER_LIST_URL = USERS_URL

def test_user_management_create_user_with_admin_session():
    session = requests.Session()
    try:
        # Login as admin
        login_resp = session.post(
            LOGIN_URL,
            json={"username": "admin", "password": "1234"},
            timeout=30
        )
        assert login_resp.status_code == 200, f"Admin login failed: {login_resp.text}"

        # Create new user with role 'siswa' and username 'teststudent1'
        new_user_data = {
            "username": "teststudent1",
            "password": "Password123!",
            "name": "Test Student",
            "email": "teststudent1@example.com",
            "role": "siswa"
        }
        create_resp = session.post(
            USERS_URL,
            json=new_user_data,
            timeout=30
        )
        assert create_resp.status_code == 201, f"User creation failed: {create_resp.text}"
        create_resp_json = create_resp.json()
        assert "user" in create_resp_json, f"User key missing in response: {create_resp.text}"
        created_user = create_resp_json["user"]
        created_user_id = created_user.get("id")
        assert created_user_id is not None, f"Created user ID missing: {create_resp.text}"

        # Get user list and confirm the new user appears
        list_resp = session.get(
            USER_LIST_URL,
            timeout=30
        )
        assert list_resp.status_code == 200, f"User list retrieval failed: {list_resp.text}"
        list_json = list_resp.json()
        users = list_json if isinstance(list_json, list) else list_json.get("data") or list_json.get("users") or list_json.get("users_list") or []
        assert isinstance(users, list), f"Users list is not a list: {list_resp.text}"

        user_names = [user.get("username") for user in users if "username" in user]
        assert "teststudent1" in user_names, "Created user 'teststudent1' not found in user list"
    finally:
        # Clean up by deleting the created user if exists
        if 'created_user_id' in locals() and created_user_id:
            del_resp = session.delete(
                f"{USERS_URL}/{created_user_id}",
                timeout=30
            )
            assert del_resp.status_code == 200, f"User deletion failed: {del_resp.text}"

        # Logout admin
        logout_resp = session.post(LOGOUT_URL, timeout=30)
        assert logout_resp.status_code == 200, f"Admin logout failed: {logout_resp.text}"

test_user_management_create_user_with_admin_session()