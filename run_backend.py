import os
import sys
import uvicorn

# Ensure the backend directory is in the import path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    print("=" * 60)
    print("  RESEARCHGAP AI - ACADEMIC INTELLIGENCE ENGINE")
    print("  Backend running on: http://127.0.0.1:8000")
    print("  API Docs available at: http://127.0.0.1:8000/docs")
    print("=" * 60)
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, app_dir=backend_dir)
