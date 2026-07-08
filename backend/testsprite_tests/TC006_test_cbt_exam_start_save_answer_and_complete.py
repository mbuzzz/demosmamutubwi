import requests

BASE_URL = "http://localhost:1999"
TIMEOUT = 30

def test_cbt_exam_start_save_answer_and_complete():
    session = requests.Session()
    try:
        # Login as student 'agus'
        login_payload = {'username': 'agus', 'password': '1234'}
        resp = session.post(f"{BASE_URL}/api/login", json=login_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, "Login failed for user 'agus'"
        
        # Get active CBT exam sessions
        resp = session.get(f"{BASE_URL}/api/cbt/ujian/sesi-aktif", timeout=TIMEOUT)
        assert resp.status_code == 200, "Failed to fetch active CBT exam sessions"
        active_sesi_json = resp.json()
        assert isinstance(active_sesi_json, list), "Response of active sessions is not a list"
        assert len(active_sesi_json) > 0, "No active CBT exam sessions available"
        sesi_ujian_id = active_sesi_json[0].get('id')
        assert sesi_ujian_id is not None, "Session 'id' not found in active sessions"

        # Start exam with token 'LOG123'
        start_payload = {'sesi_ujian_id': sesi_ujian_id, 'token': 'LOG123'}
        resp = session.post(f"{BASE_URL}/api/cbt/ujian/mulai", json=start_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, "Failed to start CBT exam session"
        start_json = resp.json()
        hasil_ujian_id = start_json.get('hasil_ujian_id')
        soals = start_json.get('soals')
        assert hasil_ujian_id is not None, "'hasil_ujian_id' not found in start exam response"
        assert isinstance(soals, list) and len(soals) > 0, "'soals' missing or empty in start exam response"

        # Extract first question and answer option IDs
        first_soal = soals[0]
        soal_id = first_soal.get('id')
        opsi_jawabans = first_soal.get('opsi_jawabans')
        assert soal_id is not None, "'id' missing in first question"
        assert isinstance(opsi_jawabans, list) and len(opsi_jawabans) > 0, "No answer options in first question"
        opsi_jawaban_id = opsi_jawabans[0].get('id')
        assert opsi_jawaban_id is not None, "Option answer 'id' missing"

        # Save answer
        save_payload = {
            'hasil_ujian_id': hasil_ujian_id,
            'soal_id': soal_id,
            'opsi_jawaban_id': opsi_jawaban_id
        }
        resp = session.post(f"{BASE_URL}/api/cbt/ujian/simpan-jawaban", json=save_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, "Failed to save CBT exam answer"

        # Complete exam
        complete_payload = {'hasil_ujian_id': hasil_ujian_id}
        resp = session.post(f"{BASE_URL}/api/cbt/ujian/selesai", json=complete_payload, timeout=TIMEOUT)
        assert resp.status_code == 200, "Failed to complete CBT exam session"

    finally:
        # Logout
        session.post(f"{BASE_URL}/api/logout", timeout=TIMEOUT)

test_cbt_exam_start_save_answer_and_complete()