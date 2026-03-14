from fastapi import APIRouter
from db import get_session

router = APIRouter()

@router.get("/")
def get_all_jobs():
    with get_session() as session:
        result = session.run("""
            MATCH (j:JobRole)
            OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(s:Skill)
            RETURN j.id AS id,
                   j.title AS title,
                   j.level AS level,
                   j.avg_salary AS avg_salary,
                   collect({name: s.name, importance: s.category}) AS skills
        """)
        return [dict(record) for record in result]

@router.get("/{job_id}")
def get_job(job_id: str):
    with get_session() as session:
        result = session.run("""
            MATCH (j:JobRole {id: $jid})
            OPTIONAL MATCH (j)-[r:REQUIRES_SKILL]->(s:Skill)
            RETURN j.id AS id,
                   j.title AS title,
                   j.level AS level,
                   j.avg_salary AS avg_salary,
                   collect({
                       name: s.name,
                       category: s.category,
                       importance: r.importance
                   }) AS skills
        """, jid=job_id)
        record = result.single()
        if not record:
            return {"error": "job not found"}
        return dict(record)