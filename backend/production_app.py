from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# In-memory database (use PostgreSQL/MongoDB in production)
DB = {
    'users': {},
    'enrollments': {},
    'analytics': {
        'total_users': 0,
        'total_enrollments': 0,
        'total_revenue': 0,
        'daily_signups': [],
        'course_popularity': {}
    }
}

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    user_id = f"user_{len(DB['users']) + 1}"
    DB['users'][user_id] = {
        'id': user_id,
        'name': data['name'],
        'email': data['email'],
        'provider': data.get('provider', 'email'),
        'created_at': datetime.now().isoformat(),
        'enrollments': []
    }
    DB['analytics']['total_users'] += 1
    DB['analytics']['daily_signups'].append({'date': datetime.now().date().isoformat(), 'count': 1})
    return jsonify({'success': True, 'user': DB['users'][user_id]})

@app.route('/api/enroll', methods=['POST'])
def enroll():
    data = request.json
    enroll_id = f"enroll_{len(DB['enrollments']) + 1}"
    DB['enrollments'][enroll_id] = {
        'id': enroll_id,
        'user_id': data['user_id'],
        'course_id': data['course_id'],
        'course_name': data['course_name'],
        'price': data['price'],
        'transaction_id': data['transaction_id'],
        'enrolled_at': datetime.now().isoformat(),
        'progress': 0
    }
    DB['analytics']['total_enrollments'] += 1
    DB['analytics']['total_revenue'] += data['price']
    course = data['course_id']
    DB['analytics']['course_popularity'][course] = DB['analytics']['course_popularity'].get(course, 0) + 1
    return jsonify({'success': True, 'enrollment': DB['enrollments'][enroll_id]})

@app.route('/api/admin/analytics', methods=['GET'])
def get_analytics():
    return jsonify(DB['analytics'])

@app.route('/api/admin/users', methods=['GET'])
def get_users():
    return jsonify({'users': list(DB['users'].values())})

@app.route('/api/admin/enrollments', methods=['GET'])
def get_enrollments():
    return jsonify({'enrollments': list(DB['enrollments'].values())})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
