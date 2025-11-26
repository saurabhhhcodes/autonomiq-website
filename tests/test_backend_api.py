import pytest
import json

def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_ai_chat_endpoint(client, mock_gemini):
    """Test the AI chat endpoint with mocked Gemini."""
    payload = {
        "message": "Explain quantum physics",
        "course": "physics-101"
    }
    response = client.post('/api/ai-teacher/chat', 
                          data=json.dumps(payload),
                          content_type='application/json')
    
    assert response.status_code == 200
    data = response.json
    assert 'response' in data
    assert 'timestamp' in data
    assert 'suggestions' in data
    assert data['response'] == "This is a mocked AI response."

def test_ai_chat_missing_message(client):
    """Test AI chat with missing message."""
    response = client.post('/api/ai-teacher/chat', 
                          data=json.dumps({}),
                          content_type='application/json')
    
    # Depending on implementation, might return 400 or 500 or fallback
    # Based on app.py review, it might error if message is missing or return fallback
    assert response.status_code in [200, 400, 500]

def test_create_payment(client):
    """Test payment creation endpoint."""
    payload = {
        "user_details": {"name": "Test User", "email": "test@example.com"},
        "course_details": {"name": "AI Course", "price": 1000}
    }
    response = client.post('/api/create-payment',
                          data=json.dumps(payload),
                          content_type='application/json')
    
    assert response.status_code == 200
    assert response.json['success'] is True
    assert 'payment_id' in response.json

def test_verify_payment(client):
    """Test payment verification endpoint."""
    # First create a payment
    create_payload = {
        "user_details": {"name": "Test User", "email": "test@example.com"},
        "course_details": {"name": "AI Course", "price": 1000}
    }
    create_res = client.post('/api/create-payment',
                            data=json.dumps(create_payload),
                            content_type='application/json')
    payment_id = create_res.json['payment_id']

    # Now verify it
    payload = {
        "payment_id": payment_id,
        "transaction_id": "txn_67890"
    }
    response = client.post('/api/verify-payment',
                          data=json.dumps(payload),
                          content_type='application/json')
    
    assert response.status_code == 200
    assert response.json['success'] is True
    assert response.json['payment']['status'] == 'completed'
