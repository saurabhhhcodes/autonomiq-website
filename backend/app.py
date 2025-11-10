# AxonFlow Backend - Flask Application
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Serve static files from frontend
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('../frontend', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('../frontend/js', filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('../frontend/assets', filename)

# API Routes
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'AxonFlow Backend'
    })

@app.route('/api/contact', methods=['POST'])
def contact_form():
    data = request.get_json()
    # Process contact form
    return jsonify({'success': True, 'message': 'Contact form received'})

@app.route('/api/enrollment', methods=['POST'])
def course_enrollment():
    data = request.get_json()
    # Process course enrollment
    return jsonify({'success': True, 'message': 'Enrollment processed'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)