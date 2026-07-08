import requests

BASE_URL = "http://localhost:1999"
TIMEOUT = 30

def test_rfid_attendance_logging_with_valid_and_invalid_uid():
    headers = {'Content-Type': 'application/json'}
    valid_uid_payload = {'uid': 'RF:AB:12:CD:34'}
    invalid_uid_payload = {'uid': 'RF:00:00:00:00'}

    # Test with valid UID
    resp_valid = requests.post(f"{BASE_URL}/api/absensi/tap", json=valid_uid_payload, headers=headers, timeout=TIMEOUT)
    assert resp_valid.status_code in (200, 400), f"Expected 200 or 400, got {resp_valid.status_code}"
    try:
        json_valid = resp_valid.json()
    except Exception:
        assert False, "Response is not valid JSON"
    assert 'siswa' in json_valid, "'siswa' key not found in response JSON for valid UID"

    # Test with invalid UID (unregistered)
    resp_invalid = requests.post(f"{BASE_URL}/api/absensi/tap", json=invalid_uid_payload, headers=headers, timeout=TIMEOUT)
    assert resp_invalid.status_code == 404, f"Expected 404 for invalid UID, got {resp_invalid.status_code}"

test_rfid_attendance_logging_with_valid_and_invalid_uid()