import requests

BASE_URL = "http://localhost:1999"
TIMEOUT = 30

def test_user_authentication_login_profile_logout_flow():
    session = requests.Session()
    try:
        # Login with admin user
        login_payload = {'username': 'admin', 'password': '1234'}
        resp_login = session.post(f"{BASE_URL}/api/login", json=login_payload, timeout=TIMEOUT)
        assert resp_login.status_code == 200, f"Login failed: {resp_login.text}"

        # Get authenticated user profile
        resp_user = session.get(f"{BASE_URL}/api/user", timeout=TIMEOUT)
        assert resp_user.status_code == 200, f"Get user profile failed: {resp_user.text}"
        user_data = resp_user.json()
        assert 'username' in user_data or 'id' in user_data, "User profile response missing expected keys"

        # Logout user
        resp_logout = session.post(f"{BASE_URL}/api/logout", timeout=TIMEOUT)
        assert resp_logout.status_code == 200, f"Logout failed: {resp_logout.text}"

        # After logout, fetching user profile should return 401 Unauthorized
        resp_user_after_logout = session.get(f"{BASE_URL}/api/user", timeout=TIMEOUT)
        assert resp_user_after_logout.status_code == 401, f"Expected 401 after logout but got {resp_user_after_logout.status_code}"

    finally:
        session.close()

test_user_authentication_login_profile_logout_flow()