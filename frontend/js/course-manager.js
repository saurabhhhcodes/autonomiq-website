// Complete Course Management System
class CourseManager {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        if (!window.userStorage) {
            console.error('UserStorage not initialized');
            return;
        }
    }

    // Enroll in course with payment
    enrollCourse(courseId, courseName, price, paymentData) {
        const enrollment = {
            id: courseId,
            name: courseName,
            price: price,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            status: 'active',
            payment: {
                transactionId: paymentData.transactionId,
                method: paymentData.method,
                amount: price,
                date: new Date().toISOString(),
                status: 'completed'
            },
            modules: this.getCourseModules(courseId),
            completedModules: [],
            assignments: [],
            quizScores: []
        };

        window.userStorage.addEnrolledCourse(courseId, enrollment);
        this.savePaymentRecord(paymentData, courseId, courseName, price);
        return enrollment;
    }

    // Get course modules/curriculum
    getCourseModules(courseId) {
        const modules = {
            'ai-agent': [
                {id: 1, title: 'Introduction to AI Agents', duration: '2 hours', type: 'video'},
                {id: 2, title: 'LLM Fundamentals', duration: '3 hours', type: 'video'},
                {id: 3, title: 'RAG Systems', duration: '4 hours', type: 'video'},
                {id: 4, title: 'Building Autonomous Agents', duration: '5 hours', type: 'project'},
                {id: 5, title: 'Deployment & Scaling', duration: '3 hours', type: 'video'}
            ],
            'fullstack': [
                {id: 1, title: 'HTML/CSS Mastery', duration: '3 hours', type: 'video'},
                {id: 2, title: 'JavaScript Advanced', duration: '4 hours', type: 'video'},
                {id: 3, title: 'React.js Complete', duration: '6 hours', type: 'video'},
                {id: 4, title: 'Node.js & Express', duration: '5 hours', type: 'video'},
                {id: 5, title: 'Full-Stack Project', duration: '10 hours', type: 'project'}
            ],
            'default': [
                {id: 1, title: 'Course Introduction', duration: '1 hour', type: 'video'},
                {id: 2, title: 'Core Concepts', duration: '3 hours', type: 'video'},
                {id: 3, title: 'Practical Applications', duration: '4 hours', type: 'video'},
                {id: 4, title: 'Final Project', duration: '5 hours', type: 'project'}
            ]
        };
        return modules[courseId] || modules['default'];
    }

    // Save payment record
    savePaymentRecord(paymentData, courseId, courseName, amount) {
        const payments = JSON.parse(localStorage.getItem(window.userStorage.getUserKey('payments')) || '[]');
        payments.push({
            id: 'PAY_' + Date.now(),
            courseId: courseId,
            courseName: courseName,
            amount: amount,
            transactionId: paymentData.transactionId,
            method: paymentData.method,
            status: 'completed',
            date: new Date().toISOString(),
            userDetails: paymentData.userDetails
        });
        localStorage.setItem(window.userStorage.getUserKey('payments'), JSON.stringify(payments));
    }

    // Get all payments
    getPaymentHistory() {
        return JSON.parse(localStorage.getItem(window.userStorage.getUserKey('payments')) || '[]');
    }

    // Update course progress
    updateProgress(courseId, moduleId) {
        const courses = window.userStorage.getEnrolledCourses();
        const course = courses.find(c => c.id === courseId);
        if (course) {
            if (!course.completedModules.includes(moduleId)) {
                course.completedModules.push(moduleId);
                course.progress = Math.round((course.completedModules.length / course.modules.length) * 100);
            }
            localStorage.setItem(window.userStorage.getUserKey('enrolled_courses'), JSON.stringify(courses));
        }
    }

    // Submit assignment
    submitAssignment(courseId, assignmentData) {
        const assignments = JSON.parse(localStorage.getItem(window.userStorage.getUserKey('assignments')) || '[]');
        assignments.push({
            id: 'ASG_' + Date.now(),
            courseId: courseId,
            ...assignmentData,
            submittedAt: new Date().toISOString(),
            status: 'submitted'
        });
        localStorage.setItem(window.userStorage.getUserKey('assignments'), JSON.stringify(assignments));
    }

    // Get course by ID
    getCourse(courseId) {
        const courses = window.userStorage.getEnrolledCourses();
        return courses.find(c => c.id === courseId);
    }
}

window.courseManager = new CourseManager();
