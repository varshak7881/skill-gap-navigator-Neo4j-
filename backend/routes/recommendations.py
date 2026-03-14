from fastapi import APIRouter
from db import get_session

router = APIRouter()

# 1. Find missing skills
@router.get("/gap")
def skill_gap(user_id: str, job_id: str):
    with get_session() as session:
        result = session.run("""
            MATCH (j:JobRole {id: $job_id})-[r:REQUIRES_SKILL]->(s:Skill)
            WHERE NOT EXISTS {
                MATCH (p:Person {id: $user_id})-[:HAS_SKILL]->(s)
            }
            RETURN s.name AS missing_skill,
                   s.category AS category,
                   r.importance AS importance
        """, user_id=user_id, job_id=job_id)
        return [dict(record) for record in result]


# 2. Recommend courses that cover missing skills
@router.get("/courses")
def recommend_courses(user_id: str, job_id: str):
    with get_session() as session:
        result = session.run("""
            MATCH (j:JobRole {id: $job_id})-[:REQUIRES_SKILL]->(s:Skill)
            WHERE NOT EXISTS {
                MATCH (p:Person {id: $user_id})-[:HAS_SKILL]->(s)
            }
            MATCH (c:Course)-[:TEACHES_SKILL]->(s)
            RETURN c.title AS course,
                   c.platform AS platform,
                   c.url AS url,
                   c.duration_hours AS duration_hours,
                   c.price AS price,
                   collect(s.name) AS skills_covered
            ORDER BY size(collect(s.name)) DESC
        """, user_id=user_id, job_id=job_id)
        return [dict(record) for record in result]


# 3. Shortest path from user to job
@router.get("/path")
def learning_path(user_id: str, job_id: str):
    with get_session() as session:
        result = session.run("""
            MATCH (p:Person {id: $user_id}),
                  (j:JobRole {id: $job_id})
            MATCH path = shortestPath((p)-[*..6]-(j))
            UNWIND nodes(path) AS node
            RETURN DISTINCT
                labels(node)[0] AS type,
                coalesce(node.name, node.title) AS name,
                node.id AS id
        """, user_id=user_id, job_id=job_id)
        return [dict(record) for record in result]