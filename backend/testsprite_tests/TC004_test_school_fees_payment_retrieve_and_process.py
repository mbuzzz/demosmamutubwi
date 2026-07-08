import requests

BASE_URL = "http://localhost:1999"
TIMEOUT = 30


def test_school_fees_payment_retrieve_and_process():
    session_student = requests.Session()
    session_admin = requests.Session()
    try:
        # Student login ('budi'/'1234')
        resp = session_student.post(
            f"{BASE_URL}/api/login",
            json={"username": "budi", "password": "1234"},
            timeout=TIMEOUT,
        )
        assert resp.status_code == 200, f"Student login failed: {resp.text}"

        # Get outstanding bills
        resp = session_student.get(f"{BASE_URL}/api/pembayaran/tagihan", timeout=TIMEOUT)
        assert resp.status_code == 200, f"Failed to get bills: {resp.text}"
        resp_json = resp.json()
        assert "data" in resp_json, "'data' key missing in bills response"
        bills = resp_json["data"]
        assert isinstance(bills, list), "'data' should be a list of bills"
        assert len(bills) > 0, "No outstanding bills found"

        first_bill = bills[0]
        tagihan_id = first_bill.get("id") or first_bill.get("tagihan_id")
        nominal_tagihan = first_bill.get("nominal_tagihan")
        assert tagihan_id is not None, "tagihan_id not found in bill"
        assert nominal_tagihan is not None, "nominal_tagihan not found in bill"

        # Student logout
        resp = session_student.post(f"{BASE_URL}/api/logout", timeout=TIMEOUT)
        assert resp.status_code == 200, f"Student logout failed: {resp.text}"

        # Admin login ('admin'/'1234')
        resp = session_admin.post(
            f"{BASE_URL}/api/login",
            json={"username": "admin", "password": "1234"},
            timeout=TIMEOUT,
        )
        assert resp.status_code == 200, f"Admin login failed: {resp.text}"

        nominal_float = float(nominal_tagihan)
        assert nominal_float > 0, "Nominal bill amount must be greater than 0"

        # Process valid payment as admin
        payment_payload = {
            "tagihan_id": tagihan_id,
            "jumlah_bayar": nominal_float,
            "metode": "tunai",
            "catatan": "test"
        }
        resp_valid = session_admin.post(
            f"{BASE_URL}/api/pembayaran/proses",
            json=payment_payload,
            timeout=TIMEOUT,
        )
        assert resp_valid.status_code == 200, f"Payment processing failed: {resp_valid.text}"
        resp_valid_json = resp_valid.json()
        assert resp_valid_json.get("status") == "success", f"Unexpected payment response status: {resp_valid_json}"

        # Attempt invalid payment with negative amount
        invalid_payment_payload = {
            "tagihan_id": tagihan_id,
            "jumlah_bayar": -100,
            "metode": "tunai"
        }
        resp_invalid = session_admin.post(
            f"{BASE_URL}/api/pembayaran/proses",
            json=invalid_payment_payload,
            timeout=TIMEOUT,
        )
        assert resp_invalid.status_code in (400, 422), f"Invalid payment accepted: {resp_invalid.text}"

    finally:
        # Admin logout
        try:
            resp_logout_admin = session_admin.post(f"{BASE_URL}/api/logout", timeout=TIMEOUT)
            assert resp_logout_admin.status_code == 200, "Admin logout failed"
        except Exception:
            pass
        # Student logout if not logged out
        try:
            resp_logout_student = session_student.post(f"{BASE_URL}/api/logout", timeout=TIMEOUT)
        except Exception:
            pass


test_school_fees_payment_retrieve_and_process()
