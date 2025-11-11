// AI Teacher System with Gemini Pro Integration
class AITeacher {
    constructor() {
        this.isOpen = false;
        this.currentCourse = null;
        this.chatHistory = [];
        this.geminiApiKey = 'AIzaSyD10WdBkvyLYTSp30wfD5ACJ-pu24LjWjU';
        this.useRealAI = true;
        this.codingChallenges = this.initCodingChallenges();
        this.userProgress = JSON.parse(localStorage.getItem('user_progress') || '{}');
        this.currentQuiz = null;
        this.quizScore = 0;
    }

    initCodingChallenges() {
        return [
            {
                id: 1,
                title: 'Two Sum',
                difficulty: 'Easy',
                description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
                example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
                hint: 'Use a hash map to store complements'
            },
            {
                id: 2,
                title: 'Valid Parentheses',
                difficulty: 'Easy',
                description: 'Given a string containing just the characters "(", ")", "{", "}", "[", "]", determine if the input string is valid.',
                example: 'Input: s = "()[]{}"\nOutput: true',
                hint: 'Use a stack data structure'
            },
            {
                id: 3,
                title: 'Reverse Linked List',
                difficulty: 'Medium',
                description: 'Reverse a singly linked list.',
                example: 'Input: 1->2->3->4->5\nOutput: 5->4->3->2->1',
                hint: 'Use three pointers: prev, current, next'
            },
            {
                id: 4,
                title: 'Binary Tree Level Order Traversal',
                difficulty: 'Medium',
                description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
                example: 'Input: [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]',
                hint: 'Use BFS with a queue'
            },
            {
                id: 5,
                title: 'Longest Substring Without Repeating',
                difficulty: 'Medium',
                description: 'Find the length of the longest substring without repeating characters.',
                example: 'Input: s = "abcabcbb"\nOutput: 3',
                hint: 'Use sliding window technique'
            },
            {
                id: 6,
                title: 'Merge K Sorted Lists',
                difficulty: 'Hard',
                description: 'Merge k sorted linked lists and return it as one sorted list.',
                example: 'Input: [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]',
                hint: 'Use min heap or divide and conquer'
            }
        ];
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
                            <p class="text-purple-100 text-sm">Powered by Gemini Pro • Real AI Responses</p>
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
                                <p class="text-white font-medium mb-2">Hello! I'm your AI Teacher powered by Gemini Pro! 👋</p>
                                <p class="text-gray-300 text-sm mb-3">I teach ALL subjects with REAL AI responses:</p>
                                <ul class="text-gray-300 text-sm space-y-1">
                                    <li>✅ All courses: Programming, AI, Design, Marketing, Biotech, Psychology, etc.</li>
                                    <li>✅ Visual learning: Diagrams, charts, and illustrations</li>
                                    <li>✅ Interactive quizzes and MCQs</li>
                                    <li>✅ Coding challenges and assignments</li>
                                    <li>✅ Progress tracking and scores</li>
                                    <li>✅ Certificates upon completion</li>
                                </ul>
                                <p class="text-purple-300 text-sm mt-3">🚀 Try: "quiz", "assignment", "coding challenge", "my progress", "certificate"</p>
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
                    <p class="text-gray-500 text-xs mt-2 text-center">Powered by Gemini Pro • Real AI • Instant responses</p>
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

    async sendMessage() {
        const input = document.getElementById('ai-teacher-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatHistory.push({ role: 'user', content: message });
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Check for special commands
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('coding challenge') || lowerMsg.includes('leetcode') || lowerMsg.includes('practice problem')) {
            this.hideTyping();
            this.showCodingChallenge();
            return;
        }
        if (lowerMsg.includes('quiz') || lowerMsg.includes('mcq') || lowerMsg.includes('test')) {
            this.hideTyping();
            this.showQuiz();
            return;
        }
        if (lowerMsg.includes('assignment') || lowerMsg.includes('homework')) {
            this.hideTyping();
            this.showAssignment();
            return;
        }
        if (lowerMsg.includes('progress') || lowerMsg.includes('score') || lowerMsg.includes('my stats')) {
            this.hideTyping();
            this.showProgress();
            return;
        }
        if (lowerMsg.includes('certificate') || lowerMsg.includes('certification')) {
            this.hideTyping();
            this.generateCertificate();
            return;
        }
        if (lowerMsg.includes('diagram') || lowerMsg.includes('chart') || lowerMsg.includes('visualize')) {
            this.hideTyping();
            this.showVisualization(message);
            return;
        }
        
        // Generate AI response
        try {
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage(response, 'ai');
            this.chatHistory.push({ role: 'assistant', content: response });
        } catch (error) {
            this.hideTyping();
            const fallbackResponse = this.generateResponse(message);
            this.addMessage(fallbackResponse, 'ai');
        }
    }

    async getAIResponse(message) {
        if (!this.useRealAI) {
            return this.generateResponse(message);
        }

        try {
            const courseContext = this.currentCourse ? `Current course: ${this.currentCourse.title}. ` : '';
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an expert AI teacher at AxonFlow Academy. You teach ALL subjects including: Programming, AI/ML, Data Science, Web Development, Mobile Development, Cloud Computing, DevOps, Cybersecurity, Digital Marketing, UI/UX Design, Biotechnology, Psychology, Pharmaceutical Sciences, Fashion Technology, and more.

${courseContext}Be helpful, encouraging, and provide detailed explanations with examples, diagrams descriptions, and step-by-step breakdowns.

Student question: ${message}

Provide a comprehensive answer. Use emojis, bullet points, and clear formatting. If explaining concepts, describe visual diagrams or charts that would help understanding.`
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }
            
            return this.generateResponse(message);
        } catch (error) {
            console.error('Gemini API error:', error);
            return this.generateResponse(message);
        }
    }

    showCodingChallenge() {
        const challenge = this.codingChallenges[Math.floor(Math.random() * this.codingChallenges.length)];
        
        const challengeHtml = `
🎯 **Coding Challenge: ${challenge.title}**
**Difficulty:** ${challenge.difficulty}

**Problem:**
${challenge.description}

**Example:**
${challenge.example}

**Hint:** ${challenge.hint}

💡 Try solving this and share your solution! I'll review it and provide feedback.

Type "show solution" to see the optimal approach, or "another challenge" for a different problem.`;
        
        this.addMessage(challengeHtml, 'ai');
    }

    showQuiz() {
        const quizzes = [
            {
                question: 'What is the time complexity of binary search?',
                options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
                correct: 1,
                explanation: 'Binary search divides the search space in half each time, resulting in O(log n) complexity.'
            },
            {
                question: 'Which data structure uses LIFO principle?',
                options: ['Queue', 'Stack', 'Array', 'Tree'],
                correct: 1,
                explanation: 'Stack follows Last-In-First-Out (LIFO) principle.'
            },
            {
                question: 'What does AI stand for?',
                options: ['Automated Intelligence', 'Artificial Intelligence', 'Advanced Integration', 'Algorithmic Interface'],
                correct: 1,
                explanation: 'AI stands for Artificial Intelligence - machines mimicking human intelligence.'
            },
            {
                question: 'Which HTTP method is used to update data?',
                options: ['GET', 'POST', 'PUT', 'DELETE'],
                correct: 2,
                explanation: 'PUT method is used to update existing resources in REST APIs.'
            }
        ];
        
        this.currentQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        
        const quizHtml = `
📝 **Quick Quiz**

**Question:** ${this.currentQuiz.question}

A) ${this.currentQuiz.options[0]}
B) ${this.currentQuiz.options[1]}
C) ${this.currentQuiz.options[2]}
D) ${this.currentQuiz.options[3]}

Type A, B, C, or D to answer!`;
        
        this.addMessage(quizHtml, 'ai');
    }

    checkQuizAnswer(answer) {
        if (!this.currentQuiz) return null;
        
        const answerMap = {'a': 0, 'b': 1, 'c': 2, 'd': 3};
        const userAnswer = answerMap[answer.toLowerCase()];
        
        if (userAnswer === this.currentQuiz.correct) {
            this.quizScore++;
            this.updateProgress('quiz', 1);
            return `✅ **Correct!**\n\n${this.currentQuiz.explanation}\n\n🎉 Your score: ${this.quizScore}\n\nType "quiz" for another question!`;
        } else {
            return `❌ **Incorrect!**\n\nThe correct answer is: **${String.fromCharCode(65 + this.currentQuiz.correct)}) ${this.currentQuiz.options[this.currentQuiz.correct]}**\n\n${this.currentQuiz.explanation}\n\nType "quiz" to try another question!`;
        }
    }

    showAssignment() {
        const assignments = [
            {
                title: 'Build a Todo App',
                description: 'Create a fully functional todo application with add, delete, and mark complete features.',
                requirements: ['HTML/CSS UI', 'JavaScript logic', 'Local storage', 'Responsive design'],
                deadline: '7 days'
            },
            {
                title: 'Data Analysis Project',
                description: 'Analyze a dataset and create visualizations showing key insights.',
                requirements: ['Python/Pandas', 'Data cleaning', 'Visualizations', 'Report'],
                deadline: '10 days'
            },
            {
                title: 'Machine Learning Model',
                description: 'Build and train a classification model on a real dataset.',
                requirements: ['Data preprocessing', 'Model training', 'Evaluation metrics', 'Documentation'],
                deadline: '14 days'
            }
        ];
        
        const assignment = assignments[Math.floor(Math.random() * assignments.length)];
        
        const assignmentHtml = `
📋 **Assignment: ${assignment.title}**

**Description:**
${assignment.description}

**Requirements:**
${assignment.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

⏰ **Deadline:** ${assignment.deadline}

💡 Submit your work by sharing the code or project link. I'll review and provide detailed feedback!

Type "submit assignment" when ready!`;
        
        this.addMessage(assignmentHtml, 'ai');
    }

    showProgress() {
        const progress = this.userProgress;
        const totalQuizzes = progress.quizzes || 0;
        const totalAssignments = progress.assignments || 0;
        const totalChallenges = progress.challenges || 0;
        const totalScore = totalQuizzes * 10 + totalAssignments * 50 + totalChallenges * 20;
        
        const progressHtml = `
📊 **Your Learning Progress**

🎯 **Overall Score:** ${totalScore} points

**Activity Breakdown:**
✅ Quizzes Completed: ${totalQuizzes}
📋 Assignments Submitted: ${totalAssignments}
💻 Coding Challenges Solved: ${totalChallenges}

**Performance Chart:**
${'█'.repeat(Math.min(totalQuizzes, 10))}${'░'.repeat(Math.max(0, 10 - totalQuizzes))} Quizzes
${'█'.repeat(Math.min(totalAssignments * 2, 10))}${'░'.repeat(Math.max(0, 10 - totalAssignments * 2))} Assignments
${'█'.repeat(Math.min(totalChallenges, 10))}${'░'.repeat(Math.max(0, 10 - totalChallenges))} Challenges

${totalScore >= 500 ? '🏆 **Eligible for Certificate!** Type "certificate" to generate.' : `📈 Keep learning! ${500 - totalScore} more points for certification.`}`;
        
        this.addMessage(progressHtml, 'ai');
    }

    generateCertificate() {
        const progress = this.userProgress;
        const totalScore = (progress.quizzes || 0) * 10 + (progress.assignments || 0) * 50 + (progress.challenges || 0) * 20;
        
        if (totalScore < 500) {
            this.addMessage(`❌ **Certificate Not Available Yet**\n\nYou need 500 points to earn a certificate.\nCurrent score: ${totalScore} points\n\nKeep learning! Complete more quizzes, assignments, and challenges.`, 'ai');
            return;
        }
        
        const user = JSON.parse(localStorage.getItem('axonflow_user') || '{}');
        const userName = user.name || 'Student';
        const courseName = this.currentCourse?.title || 'AxonFlow Academy';
        const date = new Date().toLocaleDateString();
        
        const certificateHtml = `
🎓 **CERTIFICATE OF COMPLETION**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

           AxonFlow Academy
        🏆 Official Certificate 🏆

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This certifies that

**${userName}**

has successfully completed

**${courseName}**

with a score of **${totalScore} points**

Date: ${date}
Certificate ID: AXON-${Date.now().toString(36).toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Verified by AxonFlow Academy
🔗 Share on LinkedIn to showcase your achievement!

📥 Download full certificate from your dashboard.`;
        
        this.addMessage(certificateHtml, 'ai');
        this.updateProgress('certificate', 1);
    }

    showVisualization(message) {
        const visualizationHtml = `
📊 **Visual Learning Aid**

Here's a conceptual diagram for your topic:

┌─────────────────────────────────┐
│     CONCEPT VISUALIZATION       │
├─────────────────────────────────┤
│                                 │
│    Input → Process → Output     │
│      ↓        ↓         ↓       │
│    Data → Algorithm → Result    │
│                                 │
└─────────────────────────────────┘

**Flow Chart:**
Start → Analyze → Learn → Practice → Master
  ↓       ↓        ↓        ↓         ↓
 Goal → Study → Apply → Test → Succeed

💡 For detailed visual explanations, ask me to explain specific concepts!

Example: "Explain how neural networks work" or "Show me data structures"`;
        
        this.addMessage(visualizationHtml, 'ai');
    }

    updateProgress(type, count) {
        if (!this.userProgress[type + 's']) {
            this.userProgress[type + 's'] = 0;
        }
        this.userProgress[type + 's'] += count;
        localStorage.setItem('user_progress', JSON.stringify(this.userProgress));
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
        
        // Check quiz answer
        if (this.currentQuiz && (lowerMsg === 'a' || lowerMsg === 'b' || lowerMsg === 'c' || lowerMsg === 'd')) {
            return this.checkQuizAnswer(lowerMsg);
        }
        
        // Coding challenge responses
        if (lowerMsg.includes('show solution') || lowerMsg.includes('solution')) {
            return `💡 **Solution Approach:**

I'll guide you through the optimal solution:

1. **Understand the problem** - Break it down into smaller parts
2. **Choose the right data structure** - Arrays, Hash Maps, Trees, etc.
3. **Optimize time complexity** - Aim for O(n) or O(log n)
4. **Test edge cases** - Empty inputs, single elements, duplicates

Want me to explain a specific algorithm or data structure? Just ask!

🚀 **Pro Tip:** Practice on LeetCode, HackerRank, and CodeForces daily!`;
        }
        
        if (lowerMsg.includes('another challenge')) {
            this.showCodingChallenge();
            return '';
        }
        
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
        return `🤖 **I'm your Complete AI Learning Assistant!**

I teach ALL subjects at AxonFlow Academy:

📚 **All Courses** - Programming, AI/ML, Web Dev, Mobile, Cloud, DevOps, Cybersecurity, Data Science, Digital Marketing, UI/UX, Biotech, Psychology, Pharma, Fashion Tech, and more!

🎓 **Interactive Learning:**
• 📊 **Diagrams & Charts** - Visual explanations
• 📝 **Quizzes & MCQs** - Test your knowledge
• 💻 **Coding Challenges** - LeetCode-level problems
• 📋 **Assignments** - Hands-on projects
• 📈 **Progress Tracking** - Monitor your scores
• 🎓 **Certificates** - Earn verified credentials

**Quick Commands:**
• "quiz" - Take a quick test
• "assignment" - Get homework
• "coding challenge" - Practice problems
• "my progress" - View your stats
• "certificate" - Generate certificate
• "diagram" - Visual explanations
• "explain [topic]" - Learn anything

**What would you like to learn today?** 🚀`;
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
            this.addMessage(`🎉 **Welcome to ${course.title}!**\n\nI'm your personal AI teacher powered by Gemini Pro. Here's what we'll do:\n\n📚 **Interactive Learning:**\n• Visual diagrams and charts\n• Step-by-step explanations\n• Real-world examples\n\n🎯 **Practice & Assessment:**\n• Quizzes and MCQs\n• Assignments and projects\n• Coding challenges\n\n📊 **Track Progress:**\n• Score tracking\n• Performance analytics\n• Certificate upon completion\n\n**Let's start!** What would you like to learn first?\n\nOr try: "quiz", "assignment", "my progress"`, 'ai');
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
