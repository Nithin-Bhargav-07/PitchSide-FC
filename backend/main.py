import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

from routes import matches, granite, ifab

app = FastAPI(title="PitchSide Backend")

# Allow all origins for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(matches.router)
app.include_router(granite.router)
app.include_router(ifab.router)

@app.get("/")
def read_root():
    return {"message": "PitchSide API is running. See /docs for the API documentation."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
