"""
Security module for password hashing and JWT token management.

Password Hashing Strategy:
-------------------------
We use SHA-256 pre-hashing before bcrypt to overcome bcrypt's 72-byte limitation.

Why SHA-256 Pre-hashing?
- bcrypt has a hard 72-byte input limit; longer passwords are silently truncated
- SHA-256 converts any password length to a fixed 64-character hex string
- This allows secure handling of long passwords and special characters
- The bcrypt hash of the SHA-256 digest provides the same security level

Flow:
1. User password → SHA-256 → 64-char hex digest (always < 72 bytes)
2. SHA-256 digest → bcrypt → stored hash
3. Verification: password → SHA-256 → bcrypt verify against stored hash
"""
from datetime import datetime, timedelta, timezone
from typing import Any
import hashlib
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _prehash_password(password: str) -> str:
    """
    Pre-hash password using SHA-256 to ensure it fits within bcrypt's 72-byte limit.
    
    Args:
        password: Plain text password of any length
        
    Returns:
        64-character hex string (SHA-256 digest)
    """
    # Encode password to bytes and create SHA-256 digest
    password_bytes = password.encode('utf-8')
    sha256_hash = hashlib.sha256(password_bytes).hexdigest()
    return sha256_hash


def hash_password(password: str) -> str:
    """
    Hash a password using SHA-256 pre-hashing + bcrypt.
    
    This function safely handles passwords of any length by first applying
    SHA-256 to overcome bcrypt's 72-byte limitation.
    
    Args:
        password: Plain text password (any length, minimum 6 chars recommended)
        
    Returns:
        str: bcrypt hash of the SHA-256 digest
    """
    prehashed = _prehash_password(password)
    return pwd_context.hash(prehashed)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    
    Uses the same SHA-256 pre-hashing approach as hash_password() for consistency.
    
    Args:
        plain_password: Plain text password provided by user
        hashed_password: Stored bcrypt hash from hash_password()
        
    Returns:
        bool: True if password matches, False otherwise
    """
    prehashed = _prehash_password(plain_password)
    return pwd_context.verify(prehashed, hashed_password)


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
