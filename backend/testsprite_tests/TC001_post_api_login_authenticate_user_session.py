import requests

def test_post_api_login_authenticate_user_session():
    base_url = "http://localhost:1999"
    login_url = f"{base_url}/api/login"
    user_url = f"{base_url}/api/user"
    logout_url = f"{base_url}/api/logout"
    credentials = {
        "username": "admin",
        "password": "1234"
    }
    timeout = 30

    session = requests.Session()
    try:
        # POST /api/login with valid credentials
        response = session.post(login_url, json=credentials, timeout=timeout)
        assert response.status_code == 200, f"Login failed with status code {response.status_code}"
        # Check if session cookie is set
        assert session.cookies, "Session cookie not found after login"
        
        # GET /api/user to verify authenticated user profile
        response_user = session.get(user_url, timeout=timeout)
        assert response_user.status_code == 200, f"Fetching user profile failed with status code {response_user.status_code}"
        user_data = response_user.json()
        assert "role" in user_data, "User role not present in user profile"
        assert user_data.get("username") == "admin", f"Logged in user is not 'admin', actual: {user_data.get('username')}"

    finally:
        # Terminate session
        try:
            response_logout = session.post(logout_url, timeout=timeout)
            assert response_logout.status_code == 200, f"Logout failed with status code {response_logout.status_code}"
        except Exception:
            pass
        session.close()

test_post_api_login_authenticate_user_session()