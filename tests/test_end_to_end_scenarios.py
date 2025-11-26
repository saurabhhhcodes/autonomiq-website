import pytest
import json

def test_full_student_lifecycle(client, mock_gemini):
    """
    Scenario: A new student joins, enrolls, pays, and learns.
    1. SSO Login
    2. Enroll in Course
    3. Make Payment
    4. Verify Payment
    5. Access Course Content
    6. Chat with AI Teacher
    """
    
    # 1. SSO Login
    # ---------------------------------------------------------
    login_payload = {
        "provider": "google",
        "userData": {
            "email": "e2e_student@test.com",
            "displayName": "E2E Student",
            "uid": "google_123456"
        }
    }
    login_res = client.post('/api/auth/sso',
                           data=json.dumps(login_payload),
                           content_type='application/json')
    
    assert login_res.status_code == 200
    login_data = login_res.json
    assert login_data['success'] is True
    session_id = login_data['session_id']
    user_id = login_data['user_id']
    print(f"\n[Step 1] Logged in. Session ID: {session_id}")

    # 2. Enroll in Course
    # ---------------------------------------------------------
    course_id = "ai-agent"
    enroll_payload = {
        "sessionId": session_id,
        "courseId": course_id
    }
    enroll_res = client.post('/api/courses/enroll',
                            data=json.dumps(enroll_payload),
                            content_type='application/json')
    
    assert enroll_res.status_code == 200
    assert enroll_res.json['success'] is True
    print(f"[Step 2] Enrolled in {course_id}")

    # 3. Make Payment
    # ---------------------------------------------------------
    # Note: In a real app, enrollment might trigger payment flow. 
    # Here we simulate the payment request explicitly as per our API design.
    payment_payload = {
        "user_details": {"name": "E2E Student", "email": "e2e_student@test.com"},
        "course_details": {"name": "AI Agent Development", "price": 25000}
    }
    payment_res = client.post('/api/create-payment',
                             data=json.dumps(payment_payload),
                             content_type='application/json')
    
    assert payment_res.status_code == 200
    payment_data = payment_res.json
    assert payment_data['success'] is True
    payment_id = payment_data['payment_id']
    print(f"[Step 3] Created Payment. ID: {payment_id}")

    # 4. Verify Payment
    # ---------------------------------------------------------
    verify_payload = {
        "payment_id": payment_id,
        "transaction_id": "upi_txn_987654321"
    }
    verify_res = client.post('/api/verify-payment',
                            data=json.dumps(verify_payload),
                            content_type='application/json')
    
    assert verify_res.status_code == 200
    assert verify_res.json['success'] is True
    assert verify_res.json['payment']['status'] == 'completed'
    print(f"[Step 4] Verified Payment.")

    # 5. Access Course Content (My Courses)
    # ---------------------------------------------------------
    my_courses_payload = {
        "sessionId": session_id
    }
    courses_res = client.post('/api/courses/my-courses',
                             data=json.dumps(my_courses_payload),
                             content_type='application/json')
    
    assert courses_res.status_code == 200
    courses_data = courses_res.json
    assert courses_data['success'] is True
    
    # Verify the enrolled course is in the list
    enrolled_courses = [c['course_id'] for c in courses_data['courses']]
    assert course_id in enrolled_courses
    print(f"[Step 5] Verified Course Access. Courses: {enrolled_courses}")

    # 6. Chat with AI Teacher
    # ---------------------------------------------------------
    chat_payload = {
        "message": "How do I build an AI agent?",
        "course": course_id
    }
    chat_res = client.post('/api/ai-teacher/chat',
                          data=json.dumps(chat_payload),
                          content_type='application/json')
    
    assert chat_res.status_code == 200
    chat_data = chat_res.json
    assert 'response' in chat_data
    assert len(chat_data['response']) > 0
    print(f"[Step 6] Chatted with AI. Response: {chat_data['response'][:50]}...")

def test_unauthorized_access(client):
    """
    Scenario: User tries to access protected resources without login.
    """
    # Try to enroll without session
    enroll_payload = {
        "sessionId": "fake_session_123",
        "courseId": "ai-agent"
    }
    enroll_res = client.post('/api/courses/enroll',
                            data=json.dumps(enroll_payload),
                            content_type='application/json')
    
    # Should fail or return error
    assert enroll_res.json['success'] is False
    assert enroll_res.json['error'] == 'Invalid session'
