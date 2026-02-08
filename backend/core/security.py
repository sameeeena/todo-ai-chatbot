from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt # PyJWT
from jwt import PyJWKClient
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Configuration
# IN DOCKER/HUGGINGFACE, BETTER_AUTH_URL must be your Vercel URL
BETTER_AUTH_URL = os.getenv("BETTER_AUTH_URL", "http://localhost:3000")
JWKS_URL = f"{BETTER_AUTH_URL}/api/auth/jwks"

print(f"Security: JWKS URL configured as {JWKS_URL}")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

# Initialize PyJWKClient
try:
    jwks_client = PyJWKClient(JWKS_URL)
except Exception as e:
    print(f"Warning: Failed to initialize JWKS client: {e}")
    jwks_client = None

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Token",
        )

    if not jwks_client:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Auth system not properly initialized (JWKS)",
        )

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA", "HS256", "RS256"],
            options={"verify_aud": False}
        )
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing 'sub' claim",
            )
        return user_id

    except Exception as e:
        print(f"Auth Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid credentials: {str(e)}",
        )