// Advanced AI Teacher with Coding, MCQs, and Illustrations
class AdvancedAITeacher {
    constructor() {
        this.currentCourse = null;
        this.chatHistory = [];
        this.userProgress = JSON.parse(localStorage.getItem('user_progress') || '{}');
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createTeacherInterface();
        this.setupEventListeners();
        this.loadChatHistory();
    }

    createTeacherInterface() {
        const container = document.getElementById('ai-teacher-container') || document.body;
        
        const teacherHTML = `
            <div id="ai-teacher-widget" class="fixed bottom-4 right-4 z-50">
                <!-- Teacher Toggle Button -->
                <button id="teacher-toggle" class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                    </svg>
                </button>

                <!-- Teacher Chat Interface -->
                <div id="teacher-chat" class="hidden absolute bottom-20 right-0 w-96 h-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 border-b border-slate-700">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span class="text-white font-bold">AI</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-white">AI Teacher</h3>
                                <p class="text-xs text-slate-400" id="teacher-status">Ready to help</p>
                            </div>
                        </div>
                        <button id="close-teacher" class="text-slate-400 hover:text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Chat Messages -->
                    <div id="chat-messages" class="flex-1 p-4 h-64 overflow-y-auto space-y-3">
                        <div class="ai-message">
                            <div class="bg-slate-800 rounded-lg p-3 text-sm text-white">
                                👋 Hi! I'm your AI teacher. I can help you with:
                                <ul class="mt-2 space-y-1 text-xs text-slate-300">
                                    <li>• Code explanations & debugging</li>
                                    <li>• Interactive MCQ quizzes</li>
                                    <li>• Visual illustrations</li>
                                    <li>• Step-by-step tutorials</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="px-4 py-2 border-t border-slate-700">
                        <div class="flex flex-wrap gap-2 mb-2">
                            <button class="quick-action text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full text-slate-300" data-action="explain-code">Explain Code</button>
                            <button class="quick-action text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full text-slate-300" data-action="quiz-me">Quiz Me</button>
                            <button class="quick-action text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full text-slate-300" data-action="show-example">Show Example</button>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="p-4 border-t border-slate-700">
                        <div class="flex space-x-2">
                            <input type="text" id="teacher-input" placeholder="Ask me anything..." class="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <button id="send-message" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (container.id === 'ai-teacher-container') {
            container.innerHTML = teacherHTML;
        } else {
            container.insertAdjacentHTML('beforeend', teacherHTML);
        }
    }

    setupEventListeners() {
        // Toggle teacher chat
        document.addEventListener('click', (e) => {
            if (e.target.matches('#teacher-toggle, #teacher-toggle *')) {
                this.toggleChat();
            }
            
            if (e.target.matches('#close-teacher, #close-teacher *')) {
                this.closeChat();
            }
            
            if (e.target.matches('#send-message, #send-message *')) {
                this.sendMessage();
            }
            
            if (e.target.matches('.quick-action')) {
                this.handleQuickAction(e.target.dataset.action);
            }
        });

        // Enter key to send message
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'teacher-input' && e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        const chat = document.getElementById('teacher-chat');
        if (chat.classList.contains('hidden')) {
            chat.classList.remove('hidden');
            chat.classList.add('animate-fade-in');
        } else {
            this.closeChat();
        }
    }

    closeChat() {
        const chat = document.getElementById('teacher-chat');
        chat.classList.add('hidden');
        chat.classList.remove('animate-fade-in');
    }

    async sendMessage() {
        const input = document.getElementById('teacher-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Get AI response
        const response = await this.getAIResponse(message);
        
        // Hide typing and show response
        this.hideTyping();
        this.addMessage(response.content, 'ai', response.type);
    }

    addMessage(content, sender, type = 'text') {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="bg-purple-500 rounded-lg p-3 text-sm text-white ml-8">
                    ${content}
                </div>
            `;
        } else {
            messageDiv.innerHTML = this.formatAIMessage(content, type);
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to history
        this.chatHistory.push({ content, sender, type, timestamp: Date.now() });
        this.saveChatHistory();
    }

    formatAIMessage(content, type) {
        switch (type) {
            case 'code':
                return `
                    <div class="bg-slate-800 rounded-lg p-3 text-sm text-white">
                        <div class="flex items-center mb-2">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                            </svg>
                            <span class="text-green-400 font-medium">Code Example</span>
                        </div>
                        <pre class="bg-slate-900 p-3 rounded text-xs overflow-x-auto"><code>${content}</code></pre>
                        <button class="copy-code mt-2 text-xs text-purple-400 hover:text-purple-300">Copy Code</button>
                    </div>
                `;
            
            case 'mcq':
                return `
                    <div class="bg-slate-800 rounded-lg p-3 text-sm text-white">
                        <div class="flex items-center mb-3">
                            <svg class="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-400 font-medium">Quiz Question</span>
                        </div>
                        ${content}
                    </div>
                `;
            
            case 'illustration':
                return `
                    <div class="bg-slate-800 rounded-lg p-3 text-sm text-white">
                        <div class="flex items-center mb-2">
                            <svg class="w-4 h-4 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span class="text-yellow-400 font-medium">Visual Explanation</span>
                        </div>
                        ${content}
                    </div>
                `;
            
            default:
                return `
                    <div class="bg-slate-800 rounded-lg p-3 text-sm text-white">
                        ${content}
                    </div>
                `;
        }
    }

    async getAIResponse(message) {
        // Determine response type based on message content
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('code') || lowerMessage.includes('program') || lowerMessage.includes('function')) {
            return this.generateCodeResponse(message);
        } else if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('mcq')) {
            return this.generateMCQResponse(message);
        } else if (lowerMessage.includes('explain') || lowerMessage.includes('show') || lowerMessage.includes('example')) {
            return this.generateIllustrationResponse(message);
        } else {
            return this.generateTextResponse(message);
        }
    }

    generateCodeResponse(message) {
        const codeExamples = {
            'javascript function': `// JavaScript Function Example
function calculateSum(a, b) {
    return a + b;
}

// Usage
const result = calculateSum(5, 3);
console.log(result); // Output: 8

// Arrow function version
const calculateSum = (a, b) => a + b;`,

            'python function': `# Python Function Example
def calculate_sum(a, b):
    """Calculate the sum of two numbers"""
    return a + b

# Usage
result = calculate_sum(5, 3)
print(result)  # Output: 8

# Lambda function version
calculate_sum = lambda a, b: a + b`,

            'html structure': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
    </header>
    <main>
        <p>This is the main content area.</p>
    </main>
</body>
</html>`,

            'css styling': `.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.button:hover {
    transform: translateY(-2px);
}`
        };

        // Find matching code example
        let code = codeExamples['javascript function']; // default
        for (const [key, value] of Object.entries(codeExamples)) {
            if (message.toLowerCase().includes(key)) {
                code = value;
                break;
            }
        }

        return {
            content: code,
            type: 'code'
        };
    }

    generateMCQResponse(message) {
        const quizzes = [
            {
                question: "What does HTML stand for?",
                options: [
                    "A) Hyper Text Markup Language",
                    "B) High Tech Modern Language", 
                    "C) Home Tool Markup Language",
                    "D) Hyperlink and Text Markup Language"
                ],
                correct: "A",
                explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
            },
            {
                question: "Which of the following is NOT a JavaScript data type?",
                options: [
                    "A) String",
                    "B) Boolean",
                    "C) Float",
                    "D) Undefined"
                ],
                correct: "C",
                explanation: "JavaScript doesn't have a specific 'Float' data type. Numbers in JavaScript are all of type 'Number'."
            },
            {
                question: "What is the correct way to declare a variable in Python?",
                options: [
                    "A) var name = 'John'",
                    "B) name = 'John'",
                    "C) let name = 'John'",
                    "D) string name = 'John'"
                ],
                correct: "B",
                explanation: "In Python, you simply assign a value to a variable name without any declaration keyword."
            }
        ];

        const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        
        const quizHTML = `
            <div class="quiz-question">
                <h4 class="mb-3">${randomQuiz.question}</h4>
                <div class="space-y-2">
                    ${randomQuiz.options.map((option, index) => `
                        <button class="quiz-option w-full text-left p-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors" 
                                data-option="${option.charAt(0)}" data-correct="${randomQuiz.correct}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
                <div class="quiz-explanation hidden mt-3 p-3 bg-slate-700 rounded">
                    <strong>Explanation:</strong> ${randomQuiz.explanation}
                </div>
            </div>
        `;

        // Add event listeners for quiz options
        setTimeout(() => {
            document.querySelectorAll('.quiz-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const selected = e.target.dataset.option;
                    const correct = e.target.dataset.correct;
                    const explanation = e.target.closest('.quiz-question').querySelector('.quiz-explanation');
                    
                    // Disable all options
                    document.querySelectorAll('.quiz-option').forEach(opt => {
                        opt.disabled = true;
                        if (opt.dataset.option === correct) {
                            opt.classList.add('bg-green-600');
                        } else if (opt.dataset.option === selected && selected !== correct) {
                            opt.classList.add('bg-red-600');
                        }
                    });
                    
                    // Show explanation
                    explanation.classList.remove('hidden');
                });
            });
        }, 100);

        return {
            content: quizHTML,
            type: 'mcq'
        };
    }

    generateIllustrationResponse(message) {
        const illustrations = {
            'how web works': `
                <div class="illustration">
                    <h4 class="mb-3">How the Web Works</h4>
                    <div class="flex items-center justify-between mb-4">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                                💻
                            </div>
                            <span class="text-xs">Your Browser</span>
                        </div>
                        <div class="flex-1 mx-4">
                            <div class="border-t-2 border-dashed border-gray-400 relative">
                                <span class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-800 px-2 text-xs">HTTP Request</span>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                                🖥️
                            </div>
                            <span class="text-xs">Web Server</span>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300">
                        1. You type a URL in your browser<br>
                        2. Browser sends HTTP request to server<br>
                        3. Server processes request and sends back HTML/CSS/JS<br>
                        4. Browser renders the webpage
                    </p>
                </div>
            `,
            
            'javascript variables': `
                <div class="illustration">
                    <h4 class="mb-3">JavaScript Variables</h4>
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <div class="w-20 h-8 bg-yellow-500 rounded flex items-center justify-center text-xs font-bold text-black mr-3">
                                let name
                            </div>
                            <span class="text-xs">📦 Container that can change</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-20 h-8 bg-red-500 rounded flex items-center justify-center text-xs font-bold text-white mr-3">
                                const age
                            </div>
                            <span class="text-xs">🔒 Container that cannot change</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-20 h-8 bg-gray-500 rounded flex items-center justify-center text-xs font-bold text-white mr-3">
                                var old
                            </div>
                            <span class="text-xs">⚠️ Old way (avoid using)</span>
                        </div>
                    </div>
                </div>
            `,
            
            'css box model': `
                <div class="illustration">
                    <h4 class="mb-3">CSS Box Model</h4>
                    <div class="relative">
                        <div class="border-4 border-red-500 p-4">
                            <div class="border-4 border-yellow-500 p-4">
                                <div class="border-4 border-green-500 p-4">
                                    <div class="bg-blue-500 p-4 text-center text-white text-xs">
                                        Content
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="absolute top-0 left-0 text-xs space-y-1 mt-2">
                            <div class="text-red-400">🔴 Margin</div>
                            <div class="text-yellow-400">🟡 Border</div>
                            <div class="text-green-400">🟢 Padding</div>
                            <div class="text-blue-400">🔵 Content</div>
                        </div>
                    </div>
                </div>
            `
        };

        // Find matching illustration
        let illustration = illustrations['how web works']; // default
        for (const [key, value] of Object.entries(illustrations)) {
            if (message.toLowerCase().includes(key.split(' ').join(' '))) {
                illustration = value;
                break;
            }
        }

        return {
            content: illustration,
            type: 'illustration'
        };
    }

    generateTextResponse(message) {
        const responses = [
            "Great question! Let me help you understand this concept step by step.",
            "I'd be happy to explain that! Here's what you need to know:",
            "That's an excellent topic to learn about. Let me break it down for you:",
            "Perfect! This is a fundamental concept in programming. Here's the explanation:",
            "Good thinking! Let me guide you through this:"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add some contextual help based on keywords
        let contextualHelp = "";
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('html')) {
            contextualHelp = " HTML is the backbone of web development. It structures content using elements and tags.";
        } else if (lowerMessage.includes('css')) {
            contextualHelp = " CSS controls the visual presentation of HTML elements. It handles colors, layouts, animations, and responsive design.";
        } else if (lowerMessage.includes('javascript')) {
            contextualHelp = " JavaScript adds interactivity to websites. It can manipulate HTML elements, handle user events, and communicate with servers.";
        } else if (lowerMessage.includes('python')) {
            contextualHelp = " Python is known for its simple, readable syntax. It's great for beginners and powerful for advanced applications.";
        }

        return {
            content: randomResponse + contextualHelp + " Would you like me to show you some code examples or create a quiz to test your understanding?",
            type: 'text'
        };
    }

    handleQuickAction(action) {
        switch (action) {
            case 'explain-code':
                this.addMessage("Can you explain how JavaScript functions work?", 'user');
                setTimeout(() => {
                    const response = this.generateCodeResponse("javascript function");
                    this.addMessage(response.content, 'ai', response.type);
                }, 500);
                break;
                
            case 'quiz-me':
                this.addMessage("Give me a quiz question", 'user');
                setTimeout(() => {
                    const response = this.generateMCQResponse("quiz");
                    this.addMessage(response.content, 'ai', response.type);
                }, 500);
                break;
                
            case 'show-example':
                this.addMessage("Show me how the web works", 'user');
                setTimeout(() => {
                    const response = this.generateIllustrationResponse("how web works");
                    this.addMessage(response.content, 'ai', response.type);
                }, 500);
                break;
        }
    }

    showTyping() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'ai-message';
        typingDiv.innerHTML = `
            <div class="bg-slate-800 rounded-lg p-3 text-sm text-white">
                <div class="flex items-center space-x-2">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                    <span class="text-slate-400">AI is thinking...</span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        document.getElementById('teacher-status').textContent = 'Thinking...';
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        document.getElementById('teacher-status').textContent = 'Online';
    }

    startCourse(course) {
        this.currentCourse = course;
        const welcomeMessage = `🎉 Welcome to ${course.title}! I'm excited to be your AI teacher for this course. I can help you with coding examples, quizzes, and visual explanations. What would you like to start with?`;
        
        this.addMessage(welcomeMessage, 'ai');
        this.toggleChat(); // Open chat automatically
    }

    saveChatHistory() {
        localStorage.setItem('ai_teacher_history', JSON.stringify(this.chatHistory));
    }

    loadChatHistory() {
        const history = localStorage.getItem('ai_teacher_history');
        if (history) {
            this.chatHistory = JSON.parse(history);
            // Optionally restore recent messages
        }
    }
}

// Initialize Advanced AI Teacher
document.addEventListener('DOMContentLoaded', () => {
    window.aiTeacher = new AdvancedAITeacher();
});

// Add CSS animations
const teacherStyles = document.createElement('style');
teacherStyles.textContent = `
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
        animation: fade-in 0.3s ease-out;
    }
    
    .quiz-option:disabled {
        cursor: not-allowed;
        opacity: 0.8;
    }
    
    #teacher-chat {
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }
    
    .copy-code {
        cursor: pointer;
        transition: color 0.2s ease;
    }
    
    .copy-code:hover {
        color: #a855f7 !important;
    }
`;
document.head.appendChild(teacherStyles);