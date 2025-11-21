import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from agents.curator import CuratorAgent

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agents
# We initialize it once at startup
curator_agent = CuratorAgent()

class GenerateRequest(BaseModel):
    interests: str

@app.post("/generate")
async def generate_content(request: GenerateRequest):
    try:
        # The process method is now synchronous or async depending on ADK implementation
        # If ADK run() is sync, we can just call it. If async, we await.
        # For safety in FastAPI, if it's sync, it blocks the thread, but for this prototype it's fine.
        # If ADK supports async, we should await. Assuming sync for now based on typical ADK patterns,
        # but wrapping in try/except to catch any integration issues.
        result = await curator_agent.process(request.interests)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
