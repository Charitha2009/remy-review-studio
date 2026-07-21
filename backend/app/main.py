from fastapi import FastAPI

app = FastAPI(
    title="Remy Review Studio API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "status": "healthy",
        "message": "Remy Review Studio API"
    }
