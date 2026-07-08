import requests

BASE_URL = "http://localhost:1999"
TIMEOUT = 30

def test_lms_assignments_submit_and_grade_homework():
    session_student = requests.Session()
    session_teacher = requests.Session()

    try:
        # Student login Agus
        resp = session_student.post(f"{BASE_URL}/api/login", json={"username": "agus", "password": "1234"}, timeout=TIMEOUT)
        assert resp.status_code == 200, "Student login failed"
        
        # Get student profile to retrieve student id
        resp = session_student.get(f"{BASE_URL}/api/user", timeout=TIMEOUT)
        assert resp.status_code == 200, "Failed to get student profile"
        user_data = resp.json()
        siswa_id = user_data.get("id")
        assert siswa_id is not None, "Student user ID not found"

        # Submit homework for assignment id 1
        submit_payload = {"catatan_siswa": "Finished"}
        resp = session_student.post(f"{BASE_URL}/api/lms/tugas/1/submit", json=submit_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, "Homework submission failed"

        # Student logout
        resp = session_student.post(f"{BASE_URL}/api/logout", timeout=TIMEOUT)
        assert resp.status_code == 200, "Student logout failed"

        # Teacher login Rina (assuming teacher username is 'rina' with password '1234' as per description)
        resp = session_teacher.post(f"{BASE_URL}/api/login", json={"username": "rina", "password": "1234"}, timeout=TIMEOUT)
        assert resp.status_code == 200, "Teacher login failed"

        # Grade the student's submission
        grade_payload = {"nilai": 90, "feedback_guru": "Great"}
        resp = session_teacher.post(f"{BASE_URL}/api/lms/tugas/1/grade/{siswa_id}", json=grade_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Grading failed: {resp.text}"
        grade_response = resp.json()
        assert "data" in grade_response, "Grade response missing 'data'"
        data = grade_response["data"]
        assert data.get("nilai") == 90, "Returned grade value mismatch"
        assert data.get("feedback_guru") == "Great", "Returned feedback mismatch"

        # Attempt to grade with invalid score (out of valid range)
        invalid_grade_payload = {"nilai": 150}
        resp_invalid = session_teacher.post(f"{BASE_URL}/api/lms/tugas/1/grade/{siswa_id}", json=invalid_grade_payload, timeout=TIMEOUT)
        assert resp_invalid.status_code in (400, 422), "Invalid grade should return 400 or 422 status"

        # Teacher logout
        resp = session_teacher.post(f"{BASE_URL}/api/logout", timeout=TIMEOUT)
        assert resp.status_code == 200, "Teacher logout failed"

    finally:
        try:
            session_student.post(f"{BASE_URL}/api/logout", timeout=TIMEOUT)
        except Exception:
            pass
        try:
            session_teacher.post(f"{BASE_URL}/api/logout", timeout=TIMEOUT)
        except Exception:
            pass


test_lms_assignments_submit_and_grade_homework()