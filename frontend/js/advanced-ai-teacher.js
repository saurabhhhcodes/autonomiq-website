// Multi-Agent AI Teacher System
class MultiAgentAITeacher {
    constructor() {
        this.isOpen = false;
        this.currentAgent = 'general';
        this.chatHistory = [];
        this.apiBase = 'https://axonflow-backend.onrender.com';
        this.agents = {
            general: { name: 'Alex', emoji: '🤖', color: 'from-purple-500 to-cyan-500' },
            coding: { name: 'CodeMaster', emoji: '💻', color: 'from-green-500 to-blue-500' },
            visual: { name: 'GraphGuru', emoji: '📊', color: 'from-orange-500 to-red-500' },
            quiz: { name: 'QuizBot', emoji: '🧠', color: 'from-pink-500 to-purple-500' },
            slides: { name: 'SlideTeacher', emoji: '📚', color: 'from-indigo-500 to-purple-500' }
        };
        this.init();
    }

    init() {
        this.createTeacherInterface();
        this.loadCourses();
    }

    createTeacherInterface() {
        const teacherHTML = `
            <div id="ai-teacher-modal" class="hidden fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div class="bg-gray-900 rounded-2xl max-w-6xl w-full h-[90vh] border border-gray-700 flex flex-col">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-700">
                        <div class="flex items-center space-x-3">
                            <div id="current-agent-avatar" class="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <span class="text-2xl">🤖</span>
                            </div>
                            <div>
                                <h3 id="current-agent-name" class="text-xl font-bold text-white">AI Teacher - Alex</h3>
                                <p class="text-gray-400 text-sm">Multi-Agent Learning System</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="flex space-x-2">
                                ${Object.entries(this.agents).map(([key, agent]) => `
                                    <button onclick="aiTeacher.switchAgent('${key}')" 
                                            class="agent-btn w-10 h-10 bg-gradient-to-br ${agent.color} rounded-full flex items-center justify-center text-lg hover:scale-110 transition-transform ${key === 'general' ? 'ring-2 ring-cyan-400' : ''}" 
                                            data-agent="${key}" title="${agent.name}">
                                        ${agent.emoji}
                                    </button>
                                `).join('')}
                            </div>
                            <button onclick="aiTeacher.close()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                        </div>
                    </div>

                    <div class="flex flex-1 overflow-hidden">
                        <!-- Sidebar -->
                        <div class="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                            <!-- Agent Capabilities -->
                            <div class="p-4 border-b border-gray-700">
                                <h4 class="text-gray-300 font-medium mb-3">Agent Capabilities</h4>
                                <div id="agent-capabilities" class="space-y-2 text-sm">
                                    <div class="text-gray-400">• General Q&A</div>
                                    <div class="text-gray-400">• Course Guidance</div>
                                    <div class="text-gray-400">• Career Advice</div>
                                </div>
                            </div>

                            <!-- Quick Actions -->
                            <div class="p-4 border-b border-gray-700">
                                <h4 class="text-gray-300 font-medium mb-3">Quick Actions</h4>
                                <div id="quick-actions" class="space-y-2">
                                    <button onclick="aiTeacher.quickAction('explain')" class="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg text-sm">📖 Explain Concept</button>
                                    <button onclick="aiTeacher.quickAction('code')" class="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg text-sm">💻 Code Example</button>
                                    <button onclick="aiTeacher.quickAction('quiz')" class="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg text-sm">🧠 Take Quiz</button>
                                    <button onclick="aiTeacher.quickAction('graph')" class="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg text-sm">📊 Show Graph</button>
                                </div>
                            </div>

                            <!-- Learning Tools -->
                            <div class="p-4 flex-1">
                                <h4 class="text-gray-300 font-medium mb-3">Learning Tools</h4>
                                <div class="space-y-3">
                                    <button onclick="aiTeacher.openCodeEditor()" class="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700">Code Editor</button>
                                    <button onclick="aiTeacher.openSlideshow()" class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Slideshow</button>
                                    <button onclick="aiTeacher.openWhiteboard()" class="w-full bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700">Whiteboard</button>
                                </div>
                            </div>
                        </div>

                        <!-- Main Content Area -->
                        <div class="flex-1 flex flex-col">
                            <!-- Content Display Area -->
                            <div id="content-area" class="hidden bg-gray-850 border-b border-gray-700 p-4 max-h-64 overflow-y-auto">
                                <!-- Dynamic content like graphs, slides, code will appear here -->
                            </div>

                            <!-- Messages -->
                            <div id="chat-messages" class="flex-1 overflow-y-auto p-6 space-y-4">
                                <div class="flex items-start space-x-3">
                                    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span class="text-sm">🤖</span>
                                    </div>
                                    <div class="bg-gray-800 rounded-lg p-4 max-w-2xl">
                                        <p class="text-gray-100">Hello! I'm Alex, your multi-agent AI teacher. I can help with explanations, coding, quizzes, graphs, and slides. What would you like to learn today?</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Input Area -->
                            <div class="p-6 border-t border-gray-700">
                                <div class="flex space-x-3">
                                    <input 
                                        type="text" 
                                        id="chat-input" 
                                        placeholder="Ask for explanations, code examples, quizzes, graphs, or slides..."
                                        class="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-cyan-500 focus:outline-none"
                                        onkeypress="if(event.key==='Enter') aiTeacher.sendMessage()"
                                    >
                                    <button onclick="aiTeacher.sendMessage()" class="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors font-medium">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('ai-teacher-container') || document.body;
        container.insertAdjacentHTML('beforeend', teacherHTML);
    }

    switchAgent(agentKey) {
        this.currentAgent = agentKey;
        const agent = this.agents[agentKey];
        
        // Update UI
        document.getElementById('current-agent-name').textContent = `AI Teacher - ${agent.name}`;
        document.getElementById('current-agent-avatar').className = `w-12 h-12 bg-gradient-to-br ${agent.color} rounded-full flex items-center justify-center`;
        document.getElementById('current-agent-avatar').innerHTML = `<span class="text-2xl">${agent.emoji}</span>`;
        
        // Update agent buttons
        document.querySelectorAll('.agent-btn').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-cyan-400');
        });
        document.querySelector(`[data-agent="${agentKey}"]`).classList.add('ring-2', 'ring-cyan-400');
        
        // Update capabilities
        this.updateAgentCapabilities(agentKey);
        
        // Agent introduction
        this.addAgentIntroduction(agent);
    }

    updateAgentCapabilities(agentKey) {
        const capabilities = {
            general: ['• General Q&A', '• Course Guidance', '• Career Advice', '• Learning Path'],
            coding: ['• Code Examples', '• Code Review', '• Debugging Help', '• Best Practices'],
            visual: ['• Interactive Graphs', '• Data Visualization', '• Concept Diagrams', '• Flow Charts'],
            quiz: ['• MCQ Generation', '• Instant Feedback', '• Progress Tracking', '• Adaptive Testing'],
            slides: ['• Interactive Slides', '• Step-by-step Tutorials', '• Visual Learning', '• Presentations']
        };
        
        document.getElementById('agent-capabilities').innerHTML = capabilities[agentKey].map(cap => 
            `<div class="text-gray-400">${cap}</div>`
        ).join('');
    }

    addAgentIntroduction(agent) {
        const introductions = {
            general: "Hi! I'm Alex, your general learning assistant. I can help with course selection, career guidance, and answer any questions you have!",
            coding: "Hey there! I'm CodeMaster 💻. I specialize in code examples, reviews, debugging, and programming best practices. Show me your code!",
            visual: "Hello! I'm GraphGuru 📊. I create interactive graphs, diagrams, and visualizations to help you understand complex concepts better!",
            quiz: "Hi! I'm QuizBot 🧠. I generate personalized quizzes, provide instant feedback, and track your learning progress. Ready for a challenge?",
            slides: "Welcome! I'm SlideTeacher 📚. I create interactive presentations and step-by-step tutorials to make learning engaging and visual!"
        };
        
        this.addMessage(introductions[this.currentAgent], 'ai');
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';
        this.showTyping();

        // Determine response type based on message and current agent
        const responseType = this.analyzeMessage(message);
        
        setTimeout(() => {
            this.removeTyping();
            this.generateResponse(message, responseType);
        }, 1500);
    }

    analyzeMessage(message) {
        const lower = message.toLowerCase();
        
        if (lower.includes('code') || lower.includes('program') || lower.includes('function')) return 'code';
        if (lower.includes('quiz') || lower.includes('test') || lower.includes('mcq')) return 'quiz';
        if (lower.includes('graph') || lower.includes('chart') || lower.includes('visualize')) return 'graph';
        if (lower.includes('slide') || lower.includes('presentation') || lower.includes('tutorial')) return 'slides';
        if (lower.includes('explain') || lower.includes('what is') || lower.includes('how does')) return 'explanation';
        
        return 'general';
    }

    generateResponse(message, type) {
        switch (type) {
            case 'code':
                this.generateCodeResponse(message);
                break;
            case 'quiz':
                this.generateQuizResponse(message);
                break;
            case 'graph':
                this.generateGraphResponse(message);
                break;
            case 'slides':
                this.generateSlidesResponse(message);
                break;
            case 'explanation':
                this.generateExplanationResponse(message);
                break;
            default:
                this.generateGeneralResponse(message);
        }
    }

    generateCodeResponse(message) {
        const codeExamples = {
            'python': `# Python Example - Machine Learning
import numpy as np
from sklearn.linear_model import LinearRegression

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Make prediction
prediction = model.predict([[6]])
print(f"Prediction for 6: {prediction[0]}")`,
            
            'javascript': `// JavaScript Example - API Fetch
async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        
        return userData;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

// Usage
fetchUserData(123).then(user => {
    console.log('User data:', user);
});`,
            
            'react': `// React Component Example
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchUser(userId)
            .then(setUser)
            .finally(() => setLoading(false));
    }, [userId]);
    
    if (loading) return <div>Loading...</div>;
    
    return (
        <div className="user-profile">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}`
        };
        
        const lower = message.toLowerCase();
        let code = codeExamples.python;
        let language = 'Python';
        
        if (lower.includes('javascript') || lower.includes('js')) {
            code = codeExamples.javascript;
            language = 'JavaScript';
        } else if (lower.includes('react')) {
            code = codeExamples.react;
            language = 'React';
        }
        
        this.addMessage(`Here's a ${language} example for you:`, 'ai');
        this.showCodeBlock(code, language.toLowerCase());
    }

    generateQuizResponse(message) {
        const quizzes = {
            'ai': {
                question: "What is the main difference between supervised and unsupervised learning?",
                options: [
                    "Supervised uses labeled data, unsupervised doesn't",
                    "Supervised is faster than unsupervised",
                    "Supervised uses more data than unsupervised",
                    "There is no difference"
                ],
                correct: 0,
                explanation: "Supervised learning uses labeled training data to learn patterns, while unsupervised learning finds patterns in data without labels."
            },
            'programming': {
                question: "Which of the following is NOT a valid Python data type?",
                options: ["int", "float", "string", "char"],
                correct: 3,
                explanation: "Python doesn't have a 'char' data type. Single characters are just strings of length 1."
            }
        };
        
        const lower = message.toLowerCase();
        const quiz = lower.includes('ai') || lower.includes('machine') ? quizzes.ai : quizzes.programming;
        
        this.addMessage("Great! Here's a quiz question for you:", 'ai');
        this.showQuiz(quiz);
    }

    generateGraphResponse(message) {
        this.addMessage("I'll create a visualization for you!", 'ai');
        
        const graphTypes = ['line', 'bar', 'pie', 'scatter'];
        const randomType = graphTypes[Math.floor(Math.random() * graphTypes.length)];
        
        this.showGraph(randomType, message);
    }

    generateSlidesResponse(message) {
        this.addMessage("Let me create an interactive presentation for you!", 'ai');
        
        const slides = [
            {
                title: "Introduction to Machine Learning",
                content: "Machine Learning is a subset of AI that enables computers to learn without explicit programming.",
                points: ["Uses algorithms to find patterns", "Learns from data", "Makes predictions", "Improves over time"]
            },
            {
                title: "Types of Machine Learning",
                content: "There are three main types of machine learning approaches.",
                points: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Each has different use cases"]
            },
            {
                title: "Applications",
                content: "ML is used in many real-world applications.",
                points: ["Image Recognition", "Natural Language Processing", "Recommendation Systems", "Autonomous Vehicles"]
            }
        ];
        
        this.showSlideshow(slides);
    }

    generateExplanationResponse(message) {
        const explanations = {
            'ai': "Artificial Intelligence (AI) is the simulation of human intelligence in machines. It includes machine learning, where computers learn from data, and deep learning, which uses neural networks with multiple layers.",
            'programming': "Programming is the process of creating instructions for computers using programming languages. It involves problem-solving, logical thinking, and understanding algorithms and data structures.",
            'web development': "Web development involves creating websites and web applications. It includes frontend (user interface) and backend (server-side) development using various technologies and frameworks."
        };
        
        const lower = message.toLowerCase();
        let explanation = "That's a great question! ";
        
        if (lower.includes('ai') || lower.includes('artificial intelligence')) {
            explanation += explanations.ai;
        } else if (lower.includes('programming') || lower.includes('code')) {
            explanation += explanations.programming;
        } else if (lower.includes('web')) {
            explanation += explanations['web development'];
        } else {
            explanation += "I'd be happy to explain that concept. Could you be more specific about what you'd like to learn?";
        }
        
        this.addMessage(explanation, 'ai');
    }

    generateGeneralResponse(message) {
        const responses = [
            "That's an interesting question! Let me help you with that.",
            "I understand what you're asking. Here's what I can tell you:",
            "Great question! This is an important concept to understand.",
            "Let me break that down for you in a simple way."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage(randomResponse, 'ai');
    }

    showCodeBlock(code, language) {
        const contentArea = document.getElementById('content-area');
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-gray-400 text-sm">${language.toUpperCase()}</span>
                    <button onclick="aiTeacher.copyCode(this)" class="text-cyan-400 hover:text-cyan-300 text-sm">Copy</button>
                </div>
                <pre class="text-green-400 text-sm overflow-x-auto"><code>${code}</code></pre>
            </div>
        `;
    }

    showQuiz(quiz) {
        const contentArea = document.getElementById('content-area');
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-6">
                <h3 class="text-white font-bold mb-4">${quiz.question}</h3>
                <div class="space-y-2 mb-4">
                    ${quiz.options.map((option, index) => `
                        <button onclick="aiTeacher.selectQuizAnswer(${index}, ${quiz.correct})" 
                                class="quiz-option w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
                            ${String.fromCharCode(65 + index)}. ${option}
                        </button>
                    `).join('')}
                </div>
                <div id="quiz-result" class="hidden">
                    <p class="text-gray-300">${quiz.explanation}</p>
                </div>
            </div>
        `;
    }

    showGraph(type, context) {
        const contentArea = document.getElementById('content-area');
        contentArea.classList.remove('hidden');
        
        const graphData = this.generateGraphData(type);
        
        contentArea.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-4">
                <h3 class="text-white font-bold mb-4">Interactive ${type.charAt(0).toUpperCase() + type.slice(1)} Chart</h3>
                <div class="bg-gray-800 rounded p-4 h-48 flex items-center justify-center">
                    <canvas id="chart-canvas" width="400" height="200"></canvas>
                </div>
            </div>
        `;
        
        this.drawChart(type, graphData);
    }

    showSlideshow(slides) {
        const contentArea = document.getElementById('content-area');
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-6">
                <div id="slide-container">
                    <div class="slide-content">
                        <h2 class="text-2xl font-bold text-white mb-4">${slides[0].title}</h2>
                        <p class="text-gray-300 mb-4">${slides[0].content}</p>
                        <ul class="text-gray-400 space-y-2">
                            ${slides[0].points.map(point => `<li>• ${point}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="flex justify-between items-center mt-6">
                    <button onclick="aiTeacher.previousSlide()" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">Previous</button>
                    <span class="text-gray-400">1 / ${slides.length}</span>
                    <button onclick="aiTeacher.nextSlide()" class="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">Next</button>
                </div>
            </div>
        `;
        
        this.currentSlides = slides;
        this.currentSlideIndex = 0;
    }

    quickAction(action) {
        const actions = {
            explain: "Explain the concept of neural networks",
            code: "Show me a Python function example",
            quiz: "Give me a quiz on machine learning",
            graph: "Create a graph showing algorithm performance"
        };
        
        document.getElementById('chat-input').value = actions[action];
        this.sendMessage();
    }

    selectQuizAnswer(selected, correct) {
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((option, index) => {
            option.classList.remove('bg-gray-800', 'hover:bg-gray-700');
            if (index === correct) {
                option.classList.add('bg-green-600');
            } else if (index === selected && selected !== correct) {
                option.classList.add('bg-red-600');
            } else {
                option.classList.add('bg-gray-700');
            }
            option.disabled = true;
        });
        
        document.getElementById('quiz-result').classList.remove('hidden');
        
        const resultMessage = selected === correct ? 
            "🎉 Correct! Great job!" : 
            "❌ Not quite right, but keep learning!";
        
        this.addMessage(resultMessage, 'ai');
    }

    copyCode(button) {
        const code = button.parentElement.nextElementSibling.textContent;
        navigator.clipboard.writeText(code);
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = 'Copy', 2000);
    }

    generateGraphData(type) {
        switch (type) {
            case 'line':
                return {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    data: [65, 59, 80, 81, 56]
                };
            case 'bar':
                return {
                    labels: ['Python', 'JavaScript', 'Java', 'C++'],
                    data: [85, 75, 65, 55]
                };
            default:
                return {
                    labels: ['A', 'B', 'C', 'D'],
                    data: [30, 25, 25, 20]
                };
        }
    }

    drawChart(type, data) {
        const canvas = document.getElementById('chart-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple chart drawing
        ctx.fillStyle = '#06b6d4';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        
        if (type === 'bar') {
            const barWidth = canvas.width / data.data.length / 1.5;
            data.data.forEach((value, index) => {
                const height = (value / 100) * canvas.height * 0.8;
                const x = (index + 0.5) * (canvas.width / data.data.length) - barWidth / 2;
                const y = canvas.height - height - 20;
                
                ctx.fillRect(x, y, barWidth, height);
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.fillText(data.labels[index], x, canvas.height - 5);
                ctx.fillStyle = '#06b6d4';
            });
        }
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        
        if (sender === 'user') {
            messageDiv.className = 'flex items-start space-x-3 justify-end';
            messageDiv.innerHTML = `
                <div class="bg-cyan-600 rounded-lg p-4 max-w-2xl">
                    <p class="text-white">${content}</p>
                </div>
                <div class="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-sm">👤</span>
                </div>
            `;
        } else {
            const agent = this.agents[this.currentAgent];
            messageDiv.className = 'flex items-start space-x-3';
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-gradient-to-br ${agent.color} rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-sm">${agent.emoji}</span>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 max-w-2xl">
                    <p class="text-gray-100">${content.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
        const messagesContainer = document.getElementById('chat-messages');
        const agent = this.agents[this.currentAgent];
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex items-start space-x-3';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 bg-gradient-to-br ${agent.color} rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-sm">${agent.emoji}</span>
            </div>
            <div class="bg-gray-800 rounded-lg p-4">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    show() {
        this.isOpen = true;
        document.getElementById('ai-teacher-modal').classList.remove('hidden');
        document.getElementById('chat-input').focus();
    }

    close() {
        this.isOpen = false;
        document.getElementById('ai-teacher-modal').classList.add('hidden');
        document.getElementById('content-area').classList.add('hidden');
    }

    async loadCourses() {
        // Placeholder for course loading
    }
}

// Initialize Multi-Agent AI Teacher
const aiTeacher = new MultiAgentAITeacher();

// Global function
function showAITeacher() {
    aiTeacher.show();
}