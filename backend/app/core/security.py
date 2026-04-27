"""
Security module for password hashing and JWT token management.

Password Hashing Strategy:
-------------------------
We use Argon2 for password hashing - a modern, memory-hard password hashing
algorithm that won the Password Hashing Competition (PHC) in 2015.

Why Argon2?
- No password length limitations (unlike bcrypt's 72-byte limit)
- Memory-hard design resistant to GPU/ASIC attacks
- Configurable time, memory, and parallelism costs
- Recommended by OWASP and NIST
- Winner of the Password Hashing Competition (PHC)

Configuration:
- Type: Argon2id (hybrid mode - resistant to both side-channel and GPU attacks)
- Memory: 64 MB (default)
- Iterations: 3 (default)
- Parallelism: 1 (default)
"""
from datetime import datetime, timedelta, timezone
from typing import Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

# Use Argon2id - the recommended variant that combines Argon2i and Argon2d
# Argon2id is resistant to both side-channel attacks and GPU cracking
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__type="ID",  # Argon2id variant
    argon2__memory_cost=65536,  # 64 MB
    argon2__time_cost=3,        # 3 iterations
    argon2__parallelism=1,    # 1 parallel thread
)


def hash_password(password: str) -> str:
    """
    Hash a password using Argon2id.
    
    Argon2id is a memory-hard password hashing algorithm with no length
    limitations. It provides strong resistance against GPU and ASIC attacks.
    
    Args:
        password: Plain text password (any length, minimum 6 chars recommended)
        
    Returns:
        str: Argon2id hash string
        
    Example:
        >>> hash_password("my_password")
        '$argon2id$v=19$m=65536,t=3,p=1$...'
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against an Argon2id hashed password.
    
    Args:
        plain_password: Plain text password provided by user
        hashed_password: Stored Argon2id hash
        
    Returns:
        bool: True if password matches, False otherwise
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Return False for any verification errors (invalid hash format, etc.)
        return False


# Keep backward compatibility alias
get_password_hash = hash_password


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
