# FROM python:3.10-slim

# WORKDIR /app

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libpq-dev \
#     && rm -rf /var/lib/apt/lists/*

# # Install python dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy application code
# COPY . .

# # Hugging Face Spaces environment variables
# ENV PORT=7860
# ENV PYTHONUNBUFFERED=1

# # Expose the port
# EXPOSE 7860

# # Use uvicorn directly to ensure the process stays in the foreground
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

    FROM python:3.10-slim
     
    WORKDIR /app
 
    # Install system dependencies
    RUN apt-get update && apt-get install -y \
        build-essential \
        libpq-dev \
        && rm -rf /var/lib/apt/lists/*        
     
    # Copy requirements first to leverage Docker layer caching
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
      
     # Copy application code (this should overwrite any old versions)
    COPY . .
     
    # Clean up any Python cache files that might cause issues
    RUN find . -type f -name "*.pyc" -delete
    RUN find . -type d -name "__pycache__" -delete
     
    # Hugging Face Spaces environment variables
    ENV PORT=7860
    ENV PYTHONUNBUFFERED=1
 
    # Expose the port
    EXPOSE 7860
      
    # Use uvicorn directly to ensure the process stays in the foreground
    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]