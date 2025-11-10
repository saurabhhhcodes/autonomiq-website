"""
Enhanced Database Management for AxonFlow Platform
Production-ready database operations with MongoDB and Redis
"""

import os
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import json
import logging

# Database imports
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    import redis.asyncio as redis
except ImportError:
    # Fallback for environments without async drivers
    import pymongo
    import redis as redis_sync

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.mongodb_client = None
        self.redis_client = None
        self.database = None
        self.is_connected = False
        
        # Configuration
        self.mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.database_name = "axonflow"
    
    async def connect(self):
        """Initialize database connections"""
        try:
            # MongoDB connection
            self.mongodb_client = AsyncIOMotorClient(self.mongodb_url)
            self.database = self.mongodb_client[self.database_name]
            
            # Test MongoDB connection
            await self.database.command("ping")
            
            # Redis connection
            self.redis_client = redis.from_url(self.redis_url)
            await self.redis_client.ping()
            
            self.is_connected = True
            logger.info("Database connections established successfully")
            
            # Initialize collections and indexes
            await self._create_indexes()
            
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            self.is_connected = False
            raise
    
    async def disconnect(self):
        """Close database connections"""
        if self.mongodb_client:
            self.mongodb_client.close()
        if self.redis_client:
            await self.redis_client.close()
        self.is_connected = False
        logger.info("Database connections closed")
    
    async def _create_indexes(self):
        """Create database indexes for optimal performance"""
        try:
            # User indexes
            await self.database.users.create_index("email", unique=True)
            await self.database.users.create_index("referral_code", unique=True)
            await self.database.users.create_index("created_at")
            
            # Course indexes
            await self.database.courses.create_index("category")
            await self.database.courses.create_index("level")
            await self.database.courses.create_index("is_published")
            await self.database.courses.create_index("created_at")
            
            # Enrollment indexes
            await self.database.enrollments.create_index([("user_id", 1), ("course_id", 1)], unique=True)
            await self.database.enrollments.create_index("enrollment_date")
            await self.database.enrollments.create_index("status")
            
            # Payment indexes
            await self.database.payments.create_index("user_id")
            await self.database.payments.create_index("status")
            await self.database.payments.create_index("created_at")
            await self.database.payments.create_index("gateway_payment_id")
            
            # AI conversation indexes
            await self.database.conversations.create_index([("user_id", 1), ("course_id", 1)])
            await self.database.conversations.create_index("timestamp")
            
            logger.info("Database indexes created successfully")
            
        except Exception as e:
            logger.error(f"Failed to create indexes: {e}")
    
    # User operations
    async def create_user(self, user_data: Dict[str, Any]) -> str:
        """Create a new user"""
        try:
            user_id = f"user_{int(datetime.utcnow().timestamp() * 1000)}"
            user_doc = {
                "_id": user_id,
                "created_at": datetime.utcnow(),
                "is_active": True,
                "total_earnings": 0.0,
                "total_referrals": 0,
                **user_data
            }
            
            await self.database.users.insert_one(user_doc)
            logger.info(f"User created: {user_id}")
            return user_id
            
        except Exception as e:
            logger.error(f"Failed to create user: {e}")
            raise
    
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            user = await self.database.users.find_one({"_id": user_id})
            return user
        except Exception as e:
            logger.error(f"Failed to get user {user_id}: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        try:
            user = await self.database.users.find_one({"email": email})
            return user
        except Exception as e:
            logger.error(f"Failed to get user by email {email}: {e}")
            return None
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        """Update user data"""
        try:
            update_data["updated_at"] = datetime.utcnow()
            result = await self.database.users.update_one(
                {"_id": user_id},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Failed to update user {user_id}: {e}")
            return False
    
    # Course operations
    async def create_course(self, course_data: Dict[str, Any]) -> str:
        """Create a new course"""
        try:
            course_id = f"course_{int(datetime.utcnow().timestamp() * 1000)}"
            course_doc = {
                "_id": course_id,
                "created_at": datetime.utcnow(),
                "enrolled_count": 0,
                "rating": 0.0,
                "review_count": 0,
                "is_published": False,
                **course_data
            }
            
            await self.database.courses.insert_one(course_doc)
            logger.info(f"Course created: {course_id}")
            return course_id
            
        except Exception as e:
            logger.error(f"Failed to create course: {e}")
            raise
    
    async def get_courses(self, filters: Dict[str, Any] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get courses with optional filters"""
        try:
            query = filters or {}
            courses = await self.database.courses.find(query).limit(limit).to_list(length=None)
            return courses
        except Exception as e:
            logger.error(f"Failed to get courses: {e}")
            return []
    
    async def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        """Get course by ID"""
        try:
            course = await self.database.courses.find_one({"_id": course_id})
            return course
        except Exception as e:
            logger.error(f"Failed to get course {course_id}: {e}")
            return None
    
    # Enrollment operations
    async def create_enrollment(self, enrollment_data: Dict[str, Any]) -> str:
        """Create a new enrollment"""
        try:
            enrollment_id = f"enroll_{int(datetime.utcnow().timestamp() * 1000)}"
            enrollment_doc = {
                "_id": enrollment_id,
                "enrollment_date": datetime.utcnow(),
                "progress_percentage": 0.0,
                "completed_modules": [],
                "time_spent_minutes": 0,
                "status": "active",
                **enrollment_data
            }
            
            await self.database.enrollments.insert_one(enrollment_doc)
            
            # Update course enrollment count
            await self.database.courses.update_one(
                {"_id": enrollment_data["course_id"]},
                {"$inc": {"enrolled_count": 1}}
            )
            
            logger.info(f"Enrollment created: {enrollment_id}")
            return enrollment_id
            
        except Exception as e:
            logger.error(f"Failed to create enrollment: {e}")
            raise
    
    async def get_user_enrollments(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all enrollments for a user"""
        try:
            enrollments = await self.database.enrollments.find({"user_id": user_id}).to_list(length=None)
            return enrollments
        except Exception as e:
            logger.error(f"Failed to get enrollments for user {user_id}: {e}")
            return []
    
    async def update_enrollment_progress(self, enrollment_id: str, progress_data: Dict[str, Any]) -> bool:
        """Update enrollment progress"""
        try:
            result = await self.database.enrollments.update_one(
                {"_id": enrollment_id},
                {"$set": progress_data}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Failed to update enrollment progress {enrollment_id}: {e}")
            return False
    
    # Payment operations
    async def create_payment(self, payment_data: Dict[str, Any]) -> str:
        """Create a new payment record"""
        try:
            payment_id = f"pay_{int(datetime.utcnow().timestamp() * 1000)}"
            payment_doc = {
                "_id": payment_id,
                "created_at": datetime.utcnow(),
                "status": "pending",
                **payment_data
            }
            
            await self.database.payments.insert_one(payment_doc)
            logger.info(f"Payment created: {payment_id}")
            return payment_id
            
        except Exception as e:
            logger.error(f"Failed to create payment: {e}")
            raise
    
    async def update_payment_status(self, payment_id: str, status: str, metadata: Dict[str, Any] = None) -> bool:
        """Update payment status"""
        try:
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow()
            }
            
            if status == "completed":
                update_data["completed_at"] = datetime.utcnow()
            
            if metadata:
                update_data.update(metadata)
            
            result = await self.database.payments.update_one(
                {"_id": payment_id},
                {"$set": update_data}
            )
            
            # Process referral commission if payment completed
            if status == "completed":
                await self._process_referral_commission(payment_id)
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Failed to update payment status {payment_id}: {e}")
            return False
    
    async def _process_referral_commission(self, payment_id: str):
        """Process referral commission for completed payment"""
        try:
            payment = await self.database.payments.find_one({"_id": payment_id})
            if not payment or not payment.get("referral_code_used"):
                return
            
            # Find referrer
            referrer = await self.database.users.find_one({"referral_code": payment["referral_code_used"]})
            if not referrer:
                return
            
            commission_amount = payment["final_amount"] * (payment.get("commission_percentage", 10) / 100)
            
            # Update referrer earnings
            await self.database.users.update_one(
                {"_id": referrer["_id"]},
                {
                    "$inc": {
                        "total_earnings": commission_amount,
                        "total_referrals": 1
                    }
                }
            )
            
            # Create earning record
            earning_doc = {
                "_id": f"earn_{int(datetime.utcnow().timestamp() * 1000)}",
                "referrer_user_id": referrer["_id"],
                "referred_user_id": payment["user_id"],
                "payment_id": payment_id,
                "commission_amount": commission_amount,
                "commission_percentage": payment.get("commission_percentage", 10),
                "payment_amount": payment["final_amount"],
                "status": "pending",
                "earned_at": datetime.utcnow()
            }
            
            await self.database.referral_earnings.insert_one(earning_doc)
            logger.info(f"Referral commission processed: {commission_amount} for {referrer['_id']}")
            
        except Exception as e:
            logger.error(f"Failed to process referral commission: {e}")
    
    # AI conversation operations
    async def save_ai_conversation(self, conversation_data: Dict[str, Any]) -> str:
        """Save AI teacher conversation"""
        try:
            conversation_id = f"conv_{int(datetime.utcnow().timestamp() * 1000)}"
            conversation_doc = {
                "_id": conversation_id,
                "timestamp": datetime.utcnow(),
                **conversation_data
            }
            
            await self.database.conversations.insert_one(conversation_doc)
            return conversation_id
            
        except Exception as e:
            logger.error(f"Failed to save AI conversation: {e}")
            raise
    
    async def get_user_conversations(self, user_id: str, course_id: str = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get user's AI conversations"""
        try:
            query = {"user_id": user_id}
            if course_id:
                query["course_id"] = course_id
            
            conversations = await self.database.conversations.find(query).sort("timestamp", -1).limit(limit).to_list(length=None)
            return conversations
            
        except Exception as e:
            logger.error(f"Failed to get conversations for user {user_id}: {e}")
            return []
    
    # Analytics operations
    async def get_user_analytics(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive user analytics"""
        try:
            # Get enrollments
            enrollments = await self.get_user_enrollments(user_id)
            
            # Get payments
            payments = await self.database.payments.find({"user_id": user_id}).to_list(length=None)
            
            # Get referral earnings
            earnings = await self.database.referral_earnings.find({"referrer_user_id": user_id}).to_list(length=None)
            
            # Calculate metrics
            total_spent = sum(p["final_amount"] for p in payments if p["status"] == "completed")
            total_earned = sum(e["commission_amount"] for e in earnings)
            
            analytics = {
                "total_courses": len(enrollments),
                "completed_courses": len([e for e in enrollments if e["status"] == "completed"]),
                "total_spent": total_spent,
                "total_earned": total_earned,
                "referral_count": len(earnings),
                "avg_progress": sum(e["progress_percentage"] for e in enrollments) / len(enrollments) if enrollments else 0
            }
            
            return analytics
            
        except Exception as e:
            logger.error(f"Failed to get analytics for user {user_id}: {e}")
            return {}
    
    # Cache operations using Redis
    async def cache_set(self, key: str, value: Any, expire_seconds: int = 3600):
        """Set cache value"""
        try:
            if self.redis_client:
                await self.redis_client.setex(key, expire_seconds, json.dumps(value, default=str))
        except Exception as e:
            logger.error(f"Failed to set cache {key}: {e}")
    
    async def cache_get(self, key: str) -> Any:
        """Get cache value"""
        try:
            if self.redis_client:
                value = await self.redis_client.get(key)
                if value:
                    return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Failed to get cache {key}: {e}")
            return None
    
    async def cache_delete(self, key: str):
        """Delete cache value"""
        try:
            if self.redis_client:
                await self.redis_client.delete(key)
        except Exception as e:
            logger.error(f"Failed to delete cache {key}: {e}")

# Global database manager instance
db_manager = DatabaseManager()

# Convenience functions for backward compatibility
async def init_database():
    """Initialize database connections"""
    await db_manager.connect()

async def close_database():
    """Close database connections"""
    await db_manager.disconnect()

# Export commonly used functions
create_user = db_manager.create_user
get_user = db_manager.get_user
get_user_by_email = db_manager.get_user_by_email
update_user = db_manager.update_user
create_course = db_manager.create_course
get_courses = db_manager.get_courses
get_course = db_manager.get_course
create_enrollment = db_manager.create_enrollment
get_user_enrollments = db_manager.get_user_enrollments
create_payment = db_manager.create_payment
update_payment_status = db_manager.update_payment_status
save_ai_conversation = db_manager.save_ai_conversation
get_user_conversations = db_manager.get_user_conversations
get_user_analytics = db_manager.get_user_analytics