#!/usr/bin/env python3
import requests
import time
from datetime import datetime

BASE_URL = "http://localhost:5000/api"

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.tests = []
    
    def add(self, name, status, message=""):
        self.tests.append({'name': name, 'status': status, 'message': message})
        if status == 'PASS':
            self.passed += 1
        else:
            self.failed += 1
        print(f"{'✅' if status == 'PASS' else '❌'} {name}: {message}")
    
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"Total: {total} | Passed: {self.passed} | Failed: {self.failed}")
        print(f"{'='*60}\n")
        return self.failed == 0

results = TestResults()

def test_user_signup():
    try:
        payload = {'name': 'Test User', 'email': f'test_{int(time.time())}@test.com', 'provider': 'email'}
        response = requests.post(f"{BASE_URL}/auth/signup", json=payload, timeout=5)
        if response.status_code == 200 and response.json().get('success'):
            results.add("User Signup", "PASS", f"User: {response.json()['user']['id']}")
            return response.json()['user']
        else:
            results.add("User Signup", "FAIL", response.text)
    except Exception as e:
        results.add("User Signup", "FAIL", str(e))
    return None

def test_enrollment(user):
    if not user:
        results.add("Enrollment", "SKIP", "No user")
        return
    try:
        payload = {'user_id': user['id'], 'course_id': 'ai-ml', 'course_name': 'AI & ML', 'price': 7000, 'transaction_id': f'TXN_{int(time.time())}'}
        response = requests.post(f"{BASE_URL}/enroll", json=payload, timeout=5)
        if response.status_code == 200:
            results.add("Enrollment", "PASS", "Enrolled successfully")
        else:
            results.add("Enrollment", "FAIL", response.text)
    except Exception as e:
        results.add("Enrollment", "FAIL", str(e))

def test_analytics():
    try:
        response = requests.get(f"{BASE_URL}/admin/analytics", timeout=5)
        if response.status_code == 200:
            data = response.json()
            results.add("Analytics", "PASS", f"Users: {data.get('total_users', 0)}")
        else:
            results.add("Analytics", "FAIL", f"Status: {response.status_code}")
    except Exception as e:
        results.add("Analytics", "FAIL", str(e))

def run_tests():
    print(f"\n{'='*60}")
    print(f"AXONFLOW AUTOMATED TESTING - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}\n")
    
    user = test_user_signup()
    test_enrollment(user)
    test_analytics()
    
    results.summary()
    return 0 if results.failed == 0 else 1

if __name__ == '__main__':
    import sys
    sys.exit(run_tests())
