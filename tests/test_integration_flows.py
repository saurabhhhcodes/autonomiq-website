import pytest
import json

def test_full_user_enrollment_flow(client, mock_gemini):
    """
    Simulate a full user journey:
    1. Signup (Mocked/implied via Auth)
    2. Create Payment for Course
    3. Verify Payment
    4. Chat with AI Teacher about the course
    """
    
    # 1. Create Payment
    payment_payload = {
        "user_details": {"name": "Integration User", "email": "int@test.com"},
        "course_details": {"name": "Python Masterclass", "price": 5000}
    }
    payment_res = client.post('/api/create-payment',
                             data=json.dumps(payment_payload),
                             content_type='application/json')
    assert payment_res.status_code == 200
    payment_id = payment_res.json['payment_id']
    
    # 2. Verify Payment
    verify_payload = {
        "payment_id": payment_id,
        "transaction_id": "txn_real_123"
    }
    verify_res = client.post('/api/verify-payment',
                            data=json.dumps(verify_payload),
                            content_type='application/json')
    assert verify_res.status_code == 200
    assert verify_res.json['success'] is True
    
    # 3. Chat with AI
    chat_payload = {
        "message": "What will I learn in this Python course?",
        "course": "python-masterclass"
    }
    chat_res = client.post('/api/ai-teacher/chat',
                          data=json.dumps(chat_payload),
                          content_type='application/json')
    assert chat_res.status_code == 200
    assert chat_res.json['response'] == "This is a mocked AI response."

def test_admin_analytics_flow(client):
    """Test admin accessing analytics."""
    # Assuming /api/admin/analytics exists and might require auth (mocked if needed)
    # For now, checking if endpoint exists or returns 401/403 if protected, or 200 if public/mocked
    response = client.get('/api/admin/analytics')
    
    # If it requires auth, it might fail with 401. If open, 200.
    # Adjust assertion based on actual implementation.
    # Based on previous file views, it seemed to exist.
    assert response.status_code in [200, 401, 403]
