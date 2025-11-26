import pytest
from datetime import datetime
from agents.ai_agent_system import (
    AuthenticationAgent, 
    CourseAgent, 
    SupportAgent, 
    AdminAgent, 
    TestingAgent,
    AxonFlowAgentSystem
)

# --- Fixtures ---
@pytest.fixture
def auth_agent():
    return AuthenticationAgent()

@pytest.fixture
def course_agent():
    return CourseAgent()

@pytest.fixture
def support_agent():
    return SupportAgent()

@pytest.fixture
def admin_agent():
    return AdminAgent()

@pytest.fixture
def testing_agent():
    return TestingAgent()

# --- Authentication Agent Tests ---
def test_auth_otp_generation(auth_agent):
    email = "test@example.com"
    otp = auth_agent.generate_otp(email)
    assert len(otp) == 6
    assert otp.isdigit()
    assert email in auth_agent.otp_store

def test_auth_otp_verification_success(auth_agent):
    email = "test@example.com"
    otp = auth_agent.generate_otp(email)
    result = auth_agent.verify_otp(email, otp)
    assert result['success'] is True
    assert 'session_id' in result
    assert auth_agent.active_sessions[result['session_id']]['user_id'] == email

def test_auth_otp_verification_failure(auth_agent):
    email = "test@example.com"
    auth_agent.generate_otp(email)
    result = auth_agent.verify_otp(email, "000000")
    assert result['success'] is False
    assert result['error'] == 'Invalid OTP'

def test_auth_sso(auth_agent):
    user_data = {'email': 'sso@test.com', 'displayName': 'SSO User'}
    result = auth_agent.authenticate_sso('google', user_data)
    assert result['success'] is True
    assert result['user_id'] == 'sso@test.com'
    assert 'sso@test.com' in auth_agent.user_profiles

# --- Course Agent Tests ---
def test_course_enrollment(course_agent):
    user_id = "student@test.com"
    course_id = "ai-agent"
    result = course_agent.enroll_user(user_id, course_id)
    assert result['success'] is True
    assert result['enrollment']['course_id'] == course_id
    assert result['enrollment']['user_id'] == user_id
    
    # Verify retrieval
    user_courses = course_agent.get_user_courses(user_id)
    assert len(user_courses) == 1
    assert user_courses[0]['course_id'] == course_id

def test_course_enrollment_invalid(course_agent):
    result = course_agent.enroll_user("user", "invalid-course")
    assert result['success'] is False
    assert result['error'] == 'Course not found'

# --- Support Agent Tests ---
def test_support_ticket_creation(support_agent):
    user_data = {'email': 'user@test.com'}
    ticket = support_agent.create_ticket(user_data, 'technical', 'Help me')
    assert ticket['status'] == 'open'
    assert ticket['issue_type'] == 'technical'
    assert ticket['ticket_id'] in support_agent.support_tickets

# --- Admin Agent Tests ---
def test_admin_auth_success(admin_agent):
    result = admin_agent.authenticate_admin('admin@axonflow.in', 'AxonFlow2025!Admin')
    assert result['success'] is True
    assert 'session_id' in result

def test_admin_auth_failure(admin_agent):
    result = admin_agent.authenticate_admin('admin@axonflow.in', 'wrongpass')
    assert result['success'] is False

def test_admin_system_status(admin_agent):
    status = admin_agent.get_system_status()
    assert status['database']['status'] == 'working'
    assert status['ai_teacher']['status'] == 'working'

# --- Testing Agent Tests ---
def test_testing_agent_run(testing_agent):
    results = testing_agent.run_tests()
    assert 'test_id' in results
    assert results['summary']['passed'] > 0
