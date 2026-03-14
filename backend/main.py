from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import get_session
from routes import users, jobs, recommendations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(users.router, prefix="/users")
app.include_router(jobs.router, prefix="/jobs")
app.include_router(recommendations.router, prefix="/recommend")

@app.get("/test")
def test_connection():
    with get_session() as session:
        result = session.run("MATCH (n) RETURN count(n) AS total")
        total = result.single()["total"]
        return {"status": "connected", "total_nodes": total}