from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import random
from datetime import datetime

app = Flask(__name__)

# CORS configuration
allowed_origins = os.getenv('CORS_ORIGINS', 'https://axonflow-platform.onrender.com').split(',')
CORS(app, origins=allowed_origins)

# AI Teacher Knowledge Base
AI_TEACHER_KNOWLEDGE = {
    "ai_fundamentals": {
        "topics": ["Machine Learning", "Neural Networks", "Deep Learning", "NLP", "Computer Vision"],
        "responses": {
            "what is ai": "AI (Artificial Intelligence) is the simulation of human intelligence in machines. It includes machine learning, where computers learn from data without explicit programming.",
            "machine learning": "Machine Learning is a subset of AI where algorithms learn patterns from data to make predictions or decisions. There are three main types: supervised, unsupervised, and reinforcement learning.",
            "neural networks": "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information through weighted connections.",
            "deep learning": "Deep Learning uses neural networks with multiple layers to learn complex patterns. It's particularly effective for image recognition, natural language processing, and speech recognition."
        }
    },
    "programming": {
        "topics": ["Python", "JavaScript", "React", "Node.js", "APIs", "Databases"],
        "responses": {
            "python basics": "Python is a high-level programming language known for its simplicity. Key concepts include variables, functions, loops, and object-oriented programming.",
            "javascript": "JavaScript is the language of the web. It runs in browsers and servers (Node.js). Essential concepts include variables, functions, DOM manipulation, and asynchronous programming.",
            "react": "React is a JavaScript library for building user interfaces. It uses components, state management, and a virtual DOM for efficient updates.",
            "apis": "APIs (Application Programming Interfaces) allow different software applications to communicate. REST APIs use HTTP methods like GET, POST, PUT, DELETE."
        }
    },
    "web_development": {
        "topics": ["HTML", "CSS", "JavaScript", "Frontend", "Backend", "Full-Stack"],
        "responses": {
            "html": "HTML (HyperText Markup Language) structures web content using elements like headings, paragraphs, links, and images.",
            "css": "CSS (Cascading Style Sheets) styles HTML elements. It controls layout, colors, fonts, and responsive design.",
            "frontend": "Frontend development focuses on user interfaces using HTML, CSS, JavaScript, and frameworks like React, Vue, or Angular.",
            "backend": "Backend development handles server-side logic, databases, APIs, and authentication using languages like Python, Node.js, or Java."
        }
    }
}

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    try:
        return send_from_directory('../frontend', filename)
    except:
        return send_from_directory('../frontend', 'index.html')

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
        'service': 'AxonFlow Backend',
        'features': ['AI Teacher', 'Course Management', 'Authentication']
    })

@app.route('/api/ai-teacher/chat', methods=['POST'])
def ai_teacher_chat():
    data = request.get_json()
    user_message = data.get('message', '').lower().strip()
    course_context = data.get('course', 'general')
    
    if not user_message:
        return jsonify({'error': 'Message is required'}), 400
    
    # Generate AI response
    response = generate_ai_response(user_message, course_context)
    
    return jsonify({
        'response': response,
        'timestamp': datetime.utcnow().isoformat(),
        'course_context': course_context,
        'suggestions': get_follow_up_suggestions(user_message, course_context)
    })

@app.route('/api/ai-teacher/courses')
def get_ai_courses():
    courses = [
        {
            'id': 'ai_fundamentals',
            'name': 'AI Fundamentals',
            'description': 'Learn the basics of Artificial Intelligence',
            'topics': AI_TEACHER_KNOWLEDGE['ai_fundamentals']['topics'],
            'difficulty': 'Beginner',
            'duration': '2 weeks'
        },
        {
            'id': 'programming',
            'name': 'Programming Essentials',
            'description': 'Master programming concepts and languages',
            'topics': AI_TEACHER_KNOWLEDGE['programming']['topics'],
            'difficulty': 'Beginner to Intermediate',
            'duration': '4 weeks'
        },
        {
            'id': 'web_development',
            'name': 'Web Development',
            'description': 'Build modern web applications',
            'topics': AI_TEACHER_KNOWLEDGE['web_development']['topics'],
            'difficulty': 'Intermediate',
            'duration': '6 weeks'
        }
    ]
    return jsonify({'courses': courses})

@app.route('/api/ai-teacher/lesson', methods=['POST'])
def get_lesson():
    data = request.get_json()
    course_id = data.get('course_id')
    topic = data.get('topic', '').lower()
    
    if course_id not in AI_TEACHER_KNOWLEDGE:
        return jsonify({'error': 'Course not found'}), 404
    
    lesson_content = generate_lesson_content(course_id, topic)
    
    return jsonify({
        'lesson': lesson_content,
        'course_id': course_id,
        'topic': topic,
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/enrollment', methods=['POST'])
def course_enrollment():
    data = request.get_json()
    
    enrollment = {
        'id': f"enroll_{datetime.now().timestamp()}",
        'course_id': data.get('course_id'),
        'course_name': data.get('course_name'),
        'user_name': data.get('user_name'),
        'user_email': data.get('user_email'),
        'phone': data.get('phone'),
        'price': data.get('price'),
        'transaction_id': data.get('transaction_id'),
        'status': 'pending_verification',
        'enrolled_at': datetime.utcnow().isoformat()
    }
    
    return jsonify({
        'success': True,
        'message': 'Enrollment submitted successfully',
        'enrollment_id': enrollment['id'],
        'status': enrollment['status']
    })

@app.route('/api/contact', methods=['POST'])
def contact_form():
    data = request.get_json()
    
    contact = {
        'id': f"contact_{datetime.now().timestamp()}",
        'name': data.get('name'),
        'email': data.get('email'),
        'message': data.get('message'),
        'type': data.get('type', 'general'),
        'submitted_at': datetime.utcnow().isoformat()
    }
    
    return jsonify({
        'success': True,
        'message': 'Contact form submitted successfully',
        'contact_id': contact['id']
    })

def generate_ai_response(user_message, course_context):
    """Generate contextual AI teacher responses"""
    
    # Greeting responses
    greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
    if any(greeting in user_message for greeting in greetings):
        return "Hello! I'm your AI teacher. I'm here to help you learn AI, programming, and web development. What would you like to explore today?"
    
    # Help responses
    if 'help' in user_message or 'what can you do' in user_message:
        return "I can help you with:\n• AI and Machine Learning concepts\n• Programming in Python and JavaScript\n• Web development (HTML, CSS, React)\n• Course recommendations\n• Interactive lessons\n\nJust ask me anything you'd like to learn!"
    
    # Course-specific responses
    if course_context in AI_TEACHER_KNOWLEDGE:
        knowledge_base = AI_TEACHER_KNOWLEDGE[course_context]['responses']
        
        # Find matching response
        for key, response in knowledge_base.items():
            if any(word in user_message for word in key.split()):
                return f"{response}\n\nWould you like me to explain this further or move to a related topic?"
    
    # General AI responses
    ai_keywords = {
        'learn': "Learning is a journey! I recommend starting with fundamentals and building up. What specific topic interests you most?",
        'course': "We offer courses in AI Development (₹25,000), Full-Stack Development (₹18,000), and Testing & QA (₹12,000). Each includes 1:1 mentorship. Which interests you?",
        'career': "Tech careers are booming! AI/ML engineers, full-stack developers, and QA specialists are in high demand. I can help you choose the right path.",
        'project': "Hands-on projects are the best way to learn! I can guide you through building real applications step by step.",
        'difficulty': "Don't worry about difficulty! I adapt to your pace. We'll start with basics and gradually build complexity. Everyone learns differently.",
        'time': "Learning time varies by person and topic. Our courses range from 2-3 months with flexible scheduling. Consistency matters more than speed!",
        'job': "Our courses include job placement assistance! We help with resume building, interview prep, and connecting with hiring partners."
    }
    
    for keyword, response in ai_keywords.items():
        if keyword in user_message:
            return response
    
    # Default response with suggestions
    return "That's an interesting question! I'd love to help you explore that topic. Could you be more specific? For example:\n• Ask about AI concepts\n• Request a programming tutorial\n• Inquire about our courses\n• Get career advice"

def get_follow_up_suggestions(user_message, course_context):
    """Generate contextual follow-up suggestions"""
    
    suggestions = []
    
    if 'ai' in user_message or 'machine learning' in user_message:
        suggestions = [
            "What are neural networks?",
            "Explain deep learning",
            "How does machine learning work?",
            "Show me AI applications"
        ]
    elif 'programming' in user_message or 'code' in user_message:
        suggestions = [
            "Teach me Python basics",
            "How to start coding?",
            "Explain functions in programming",
            "What is object-oriented programming?"
        ]
    elif 'web' in user_message or 'website' in user_message:
        suggestions = [
            "How to build a website?",
            "What is React?",
            "Explain HTML and CSS",
            "Backend vs Frontend development"
        ]
    elif 'course' in user_message or 'learn' in user_message:
        suggestions = [
            "Which course should I choose?",
            "How long does it take to learn?",
            "Do you provide certificates?",
            "What about job placement?"
        ]
    else:
        suggestions = [
            "Tell me about AI fundamentals",
            "How to start programming?",
            "What courses do you offer?",
            "Help me choose a career path"
        ]
    
    return suggestions[:3]  # Return top 3 suggestions

def generate_lesson_content(course_id, topic):
    """Generate structured lesson content"""
    
    if course_id == 'ai_fundamentals' and 'machine learning' in topic:
        return {
            'title': 'Introduction to Machine Learning',
            'duration': '30 minutes',
            'sections': [
                {
                    'title': 'What is Machine Learning?',
                    'content': 'Machine Learning is a method of data analysis that automates analytical model building. It uses algorithms that iteratively learn from data.',
                    'examples': ['Email spam detection', 'Recommendation systems', 'Image recognition']
                },
                {
                    'title': 'Types of Machine Learning',
                    'content': 'There are three main types: Supervised Learning (with labeled data), Unsupervised Learning (finding patterns), and Reinforcement Learning (learning through rewards).',
                    'examples': ['Classification', 'Clustering', 'Game playing AI']
                },
                {
                    'title': 'Getting Started',
                    'content': 'Start with Python and libraries like scikit-learn. Practice with simple datasets and gradually work on complex problems.',
                    'examples': ['Iris flower classification', 'House price prediction', 'Customer segmentation']
                }
            ],
            'quiz': [
                {
                    'question': 'What type of ML uses labeled training data?',
                    'options': ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning'],
                    'correct': 0
                }
            ],
            'next_topics': ['Neural Networks', 'Deep Learning', 'Natural Language Processing']
        }
    
    # Default lesson structure
    return {
        'title': f'Introduction to {topic.title()}',
        'duration': '20 minutes',
        'sections': [
            {
                'title': 'Overview',
                'content': f'This lesson covers the fundamentals of {topic}.',
                'examples': ['Basic concepts', 'Real-world applications', 'Best practices']
            }
        ],
        'quiz': [],
        'next_topics': ['Advanced concepts', 'Practical applications', 'Industry use cases']
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)