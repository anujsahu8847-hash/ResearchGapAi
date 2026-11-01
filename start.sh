
#!/bin/bash

echo "========================================================"
echo "  Launching ResearchGap AI (Backend + Frontend)"
echo "========================================================"

# Start FastAPI Backend
osascript -e 'tell application "Terminal" to do script "cd \"'$(pwd)'/backend\" && python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"'

sleep 2

# Start React Frontend
osascript -e 'tell application "Terminal" to do script "cd \"'$(pwd)'/frontend\" && npm run dev"'

echo "Backend running at:  http://127.0.0.1:8000"
echo "Frontend running at: http://localhost:3000"
echo "Swagger Docs at:     http://127.0.0.1:8000/docs"
