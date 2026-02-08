import os
import sys
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Starting application...")

# Add current directory to path
current_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(current_dir))

try:
    from main import app
    logger.info("Successfully imported FastAPI 'app' from main.py")
except ImportError as e:
    logger.error(f"Failed to import 'app' from main.py: {e}")
    logger.info(f"Current directory contents: {os.listdir(current_dir)}")
    sys.exit(1)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    logger.info(f"Running Uvicorn on port {port}")
    
    # Run uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
