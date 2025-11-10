// Enhanced AI Teacher System for AxonFlow Academy
class EnhancedAITeacher {
    constructor() {
        this.apiUrl = CONFIG?.API_BASE_URL || 'http://localhost:8001';
        this.currentCourse = null;
        this.conversationHistory = [];
        this.isActive = false;
        this.init();
    }

    init() {
        console.log('🤖 Enhanced AI Teacher System Initialized');
        this.createTeacherInterface();
    }

    createTeacherInterface() {
        const teacherModal = document.createElement('div');
        teacherModal.id = 'ai-teacher-modal';
        teacherModal.className = 'hidden fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        
        teacherModal.innerHTML = `
            <div class="bg-gray-900 rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col border border-gray-700">
                <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b border-gray-700">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full flex items-center justify-center">
                            <span class="text-2xl">🤖</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white">AI Teacher</h3>
                            <p class="text-sm text-gray-400" id="teacher-course-name">General Assistant</p>
                        </div>
                    </div>
                    <button onclick="aiTeacher.closeTeacher()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <!-- Chat Area -->
                <div class="flex-1 overflow-hidden flex">
                    <!-- Conversation -->
                    <div class="flex-1 flex flex-col">
                        <div id="chat-messages" class="flex-1 overflow-y-auto p-6 space-y-4">
                            <div class="ai-message">
                                <div class="flex items-start space-x-3">
                                    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full flex items-center justify-center">
                                        <span class="text-sm">🤖</span>
                                    </div>
                                    <div class="bg-gray-800 rounded-lg p-4 max-w-md">
                                        <p class="text-white">Hello! I'm your AI teacher. I can help you learn AI, programming, and answer any questions you have. What would you like to learn today?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Input Area -->
                        <div class="p-6 border-t border-gray-700">
                            <div class="flex space-x-3">
                                <input type="text" id="teacher-input" placeholder="Ask me anything..." 
                                       class="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-cyan-400 focus:outline-none"
                                       onkeypress="if(event.key==='Enter') aiTeacher.sendMessage()">
                                <button onclick="aiTeacher.sendMessage()" 
                                        class="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="w-80 border-l border-gray-700 p-6">
                        <h4 class="text-white font-semibold mb-4">Quick Topics</h4>
                        <div class="space-y-2">
                            <button onclick="aiTeacher.askQuestion('What is artificial intelligence?')" 
                                    class="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                                🧠 What is AI?
                            </button>
                            <button onclick="aiTeacher.askQuestion('How do I start learning Python?')" 
                                    class="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                                🐍 Learn Python
                            </button>
                            <button onclick="aiTeacher.askQuestion('Explain machine learning basics')" 
                                    class="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                                🤖 Machine Learning
                            </button>
                            <button onclick="aiTeacher.askQuestion('What are neural networks?')" 
                                    class="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                                🧠 Neural Networks
                            </button>
                            <button onclick="aiTeacher.askQuestion('How to build a web application?')" 
                                    class="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                                🌐 Web Development
                            </button>
                        </div>
                        
                        <div class="mt-6">
                            <h4 class="text-white font-semibold mb-4">Course Enrollment</h4>
                            <div class="space-y-2">
                                <button onclick="window.location.href='#courses'" 
                                        class="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors">
                                    📚 View All Courses
                                </button>
                                <button onclick="auth.showAuthModal()" 
                                        class="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors">
                                    💰 Start Earning
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(teacherModal);
    }

    showTeacher(courseId = 'general') {
        this.currentCourse = courseId;
        this.isActive = true;
        
        const modal = document.getElementById('ai-teacher-modal');
        const courseName = document.getElementById('teacher-course-name');
        
        if (courseId !== 'general') {
            const course = CONFIG?.COURSES?.[courseId];
            courseName.textContent = course ? course.title : 'Specialized Course';
        } else {
            courseName.textContent = 'General Assistant';
        }
        
        modal.classList.remove('hidden');
        document.getElementById('teacher-input').focus();
    }

    closeTeacher() {
        this.isActive = false;
        document.getElementById('ai-teacher-modal').classList.add('hidden');
    }

    async sendMessage() {
        const input = document.getElementById('teacher-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        this.addMessageToChat(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send to AI teacher API
            const response = await this.callAITeacher(message);
            this.hideTypingIndicator();
            this.addMessageToChat(response, 'ai');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
        }
    }

    async callAITeacher(message) {
        try {
            const response = await fetch(`${this.apiUrl}/ai-teacher/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    course_id: this.currentCourse || 'general'
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.response;
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('AI Teacher API error:', error);
            return this.getOfflineResponse(message);
        }
    }

    getOfflineResponse(message) {
        const responses = {
            'hello': "Hello! I'm your AI teacher. I'm here to help you learn and grow. What would you like to explore today?",
            'ai': "Artificial Intelligence is the simulation of human intelligence in machines. It includes machine learning, deep learning, natural language processing, and computer vision. Would you like to dive deeper into any specific area?",
            'python': "Python is an excellent programming language for beginners and professionals alike. It's widely used in AI, web development, data science, and automation. I can help you start with the basics or advance your skills!",
            'machine learning': "Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It includes supervised, unsupervised, and reinforcement learning. What aspect interests you most?",
            'web development': "Web development involves creating websites and web applications. It includes frontend (HTML, CSS, JavaScript) and backend (servers, databases, APIs) development. Our Full-Stack course covers everything you need!",
            'course': "We offer amazing courses in AI Agent Development, Full-Stack Development, N8N Automation, Data Analysis, and more! Each course includes 1:1 mentorship and real projects. Which area interests you?",
            'default': `That's a great question about "${message}"! I'd love to help you understand this better. In our courses, we cover topics like this in detail with hands-on projects and personalized guidance. Would you like to know more about our learning approach?`
        };
        
        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }

    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-3 justify-end">
                    <div class="bg-cyan-600 rounded-lg p-4 max-w-md">
                        <p class="text-white">${message}</p>
                    </div>
                    <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span class="text-sm">👤</span>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full flex items-center justify-center">
                        <span class="text-sm">🤖</span>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-4 max-w-md">
                        <p class="text-white">${message}</p>
                    </div>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Store in conversation history
        this.conversationHistory.push({ message, sender, timestamp: new Date() });
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <span class="text-sm">🤖</span>
                </div>
                <div class="bg-gray-800 rounded-lg p-4">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    askQuestion(question) {
        document.getElementById('teacher-input').value = question;
        this.sendMessage();
    }

    clearConversation() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = `
            <div class="ai-message">
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full flex items-center justify-center">
                        <span class="text-sm">🤖</span>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-4 max-w-md">
                        <p class="text-white">Hello! I'm your AI teacher. How can I help you learn today?</p>
                    </div>
                </div>
            </div>
        `;
        this.conversationHistory = [];
    }
}

// Initialize AI Teacher
window.aiTeacher = new EnhancedAITeacher();

// Global function for easy access
window.showAITeacher = function(courseId = 'general') {
    window.aiTeacher.showTeacher(courseId);
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedAITeacher;
}