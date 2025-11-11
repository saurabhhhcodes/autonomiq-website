// Simple AI Teacher System for AxonFlow Academy
class AITeacher {
    constructor() {
        this.isOpen = false;
        this.currentCourse = null;
        this.chatHistory = [];
    }

    show() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        const modal = document.createElement('div');
        modal.id = 'ai-teacher-modal';
        modal.className = 'fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-purple-500/30 shadow-2xl">
                <!-- Header -->
                <div class="bg-gradient-to-r from-purple-600 to-cyan-600 p-6 rounded-t-2xl flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center animate-pulse">
                            <span class="text-3xl">🤖</span>
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-white">AI Teacher</h3>
                            <p class="text-purple-100 text-sm">Your personal learning assistant</p>
                        </div>
                    </div>
                    <button onclick="window.aiTeacher.close()" class="text-white hover:text-gray-200 text-3xl font-bold">&times;</button>
                </div>

                <!-- Chat Area -->
                <div id="ai-chat-area" class="flex-1 overflow-y-auto p-6 space-y-4">
                    <div class="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
                        <div class="flex items-start space-x-3">
                            <span class="text-2xl">🤖</span>
                            <div>
                                <p class="text-white font-medium mb-2">Hello! I'm your AI Teacher! 👋</p>
                                <p class="text-gray-300 text-sm mb-3">I can help you with:</p>
                                <ul class="text-gray-300 text-sm space-y-1">
                                    <li>✅ Explaining programming concepts</li>
                                    <li>✅ Debugging code</li>
                                    <li>✅ Course recommendations</li>
                                    <li>✅ Learning roadmaps</li>
                                    <li>✅ Practice problems</li>
                                </ul>
                                <p class="text-purple-300 text-sm mt-3">Ask me anything about AI, programming, or our courses!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-6 border-t border-slate-700">
                    <div class="flex space-x-3">
                        <input 
                            type="text" 
                            id="ai-teacher-input" 
                            placeholder="Ask me anything about AI, programming, or courses..."
                            class="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-600 focus:border-purple-500 focus:outline-none"
                            onkeypress="if(event.key==='Enter') window.aiTeacher.sendMessage()"
                        >
                        <button 
                            onclick="window.aiTeacher.sendMessage()"
                            class="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all"
                        >
                            Send
                        </button>
                    </div>
                    <p class="text-gray-500 text-xs mt-2 text-center">Powered by AI • Instant responses</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('ai-teacher-input').focus();
    }

    close() {
        const modal = document.getElementById('ai-teacher-modal');
        if (modal) modal.remove();
        this.isOpen = false;
    }

    sendMessage() {
        const input = document.getElementById('ai-teacher-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Generate AI response
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addMessage(response, 'ai');
        }, 1000);
    }

    addMessage(text, sender) {
        const chatArea = document.getElementById('ai-chat-area');
        const messageDiv = document.createElement('div');
        
        if (sender === 'user') {
            messageDiv.className = 'flex justify-end';
            messageDiv.innerHTML = `
                <div class="bg-cyan-500 text-white rounded-xl px-4 py-3 max-w-[70%]">
                    <p class="text-sm">${this.escapeHtml(text)}</p>
                </div>
            `;
        } else {
            messageDiv.className = 'flex justify-start';
            messageDiv.innerHTML = `
                <div class="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 max-w-[80%]">
                    <div class="flex items-start space-x-3">
                        <span class="text-xl">🤖</span>
                        <div class="text-gray-200 text-sm whitespace-pre-line">${this.escapeHtml(text)}</div>
                    </div>
                </div>
            `;
        }
        
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    showTyping() {
        const chatArea = document.getElementById('ai-chat-area');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex justify-start';
        typingDiv.innerHTML = `
            <div class="bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-3">
                <div class="flex items-center space-x-2">
                    <span class="text-xl">🤖</span>
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                </div>
            </div>
        `;
        chatArea.appendChild(typingDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    generateResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Course recommendations
        if (lowerMsg.includes('course') || lowerMsg.includes('learn') || lowerMsg.includes('recommend')) {
            return `🎓 Great question! Here are my recommendations:

For Beginners:
• Python Basics (₹800) - Perfect starting point
• Web Development (₹500) - HTML, CSS, JavaScript
• AI Fundamentals (Free) - Introduction to AI

For Intermediate:
• Full-Stack Development (₹18,000) - Complete web dev
• Data Science (₹4,500) - Python, ML, Analytics
• React.js (₹2,500) - Modern frontend

For Advanced:
• AI Agent Development (₹25,000) - LLMs, RAG systems
• Cloud Architecture (₹8,000) - AWS, Azure, GCP
• Biotech & AI (₹7,500) - AI in biotechnology

What's your current skill level?`;
        }
        
        // AI/ML questions
        if (lowerMsg.includes('ai') || lowerMsg.includes('machine learning') || lowerMsg.includes('ml')) {
            return `🤖 AI & Machine Learning Explained:

AI is teaching computers to think and learn like humans!

Key Concepts:
• Machine Learning - Computers learn from data
• Deep Learning - Neural networks (like brain)
• NLP - Understanding human language
• Computer Vision - Understanding images

Our AI Courses:
1. AI Fundamentals (Free) - Start here!
2. AI Agent Development (₹25,000) - Build AI systems
3. Data Science (₹4,500) - ML with Python

Want to start with a free AI course?`;
        }
        
        // Programming help
        if (lowerMsg.includes('python') || lowerMsg.includes('javascript') || lowerMsg.includes('code')) {
            return `💻 Programming Help:

Python:
• Easy to learn, powerful for AI/ML
• Great for beginners
• Used in data science, web dev, automation

JavaScript:
• Essential for web development
• Frontend & backend (Node.js)
• Most popular programming language

Learning Path:
1. Start with Python Basics (₹800)
2. Build projects
3. Learn frameworks (Django/Flask)
4. Master AI/ML libraries

Need help with specific code? Share it!`;
        }
        
        // Career guidance
        if (lowerMsg.includes('career') || lowerMsg.includes('job') || lowerMsg.includes('salary')) {
            return `💼 Career Guidance:

Top Tech Careers 2025:
• AI/ML Engineer - ₹8-25 LPA
• Full-Stack Developer - ₹6-18 LPA
• Data Scientist - ₹7-20 LPA
• DevOps Engineer - ₹8-22 LPA
• Cloud Architect - ₹12-30 LPA

Our Career Tracks:
1. AI Agent Development → AI Engineer
2. Full-Stack Course → Web Developer
3. Data Science → Data Scientist
4. DevOps Course → DevOps Engineer

All courses include job placement assistance!`;
        }
        
        // Pricing questions
        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('fee')) {
            return `💰 Course Pricing:

Budget Friendly (₹300-₹2,000):
• HTML/CSS - ₹300
• JavaScript - ₹500
• Python Basics - ₹800

Intermediate (₹2,000-₹5,000):
• React.js - ₹2,500
• Node.js - ₹3,000
• Data Science - ₹4,500

Advanced (₹5,000-₹25,000):
• Full-Stack - ₹18,000
• AI Agents - ₹25,000
• Cloud Architect - ₹8,000

💡 Earn 10% lifetime commission on referrals!
💡 7 referrals = Free ₹25k course!`;
        }
        
        // Default response
        return `I'm here to help! I can assist with:

📚 Course Selection - Find the perfect course
💻 Programming Help - Code explanations & debugging
🎯 Career Guidance - Tech career paths
🤖 AI Concepts - Machine learning explained
💰 Pricing Info - Course fees & payment

Try asking:
• "Which course should I take?"
• "Explain machine learning"
• "How to become a developer?"
• "What are your course prices?"

What would you like to know?`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    startCourse(course) {
        this.currentCourse = course;
        this.show();
        setTimeout(() => {
            this.addMessage(`🎉 Welcome to ${course.title}!\n\nI'll be your AI teacher for this course. Let's start learning!\n\nWhat would you like to learn first?`, 'ai');
        }, 500);
    }
}

// Initialize AI Teacher
window.aiTeacher = new AITeacher();

// Make it globally accessible
window.showAITeacher = function() {
    const user = JSON.parse(localStorage.getItem('axonflow_user') || 'null');
    if (!user && typeof globalAuth !== 'undefined') {
        globalAuth.showAuthModal();
        return;
    }
    window.aiTeacher.show();
};
