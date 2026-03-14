from fastapi import APIRouter
from db import get_session
from pydantic import BaseModel
from typing import List

router = APIRouter()

class UserCreate(BaseModel):
    id: str
    name: str
    email: str
    current_title: str
    skills: List[str]  # list of skill IDs

@router.post("/create")
def create_user(user: UserCreate):
    with get_session() as session:
        # Create the person node
        session.run("""
            MERGE (p:Person {id: $id})
            SET p.name = $name,
                p.email = $email,
                p.current_title = $current_title
        """, id=user.id, name=user.name,
             email=user.email, current_title=user.current_title)

        # Link person to each skill
        for skill_id in user.skills:
            session.run("""
                MATCH (p:Person {id: $uid}), (s:Skill {id: $sid})
                MERGE (p)-[:HAS_SKILL]->(s)
            """, uid=user.id, sid=skill_id)

    return {"status": "user created", "id": user.id}

@router.get("/{user_id}")
def get_user(user_id: str):
    with get_session() as session:
        result = session.run("""
            MATCH (p:Person {id: $uid})
            OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)
            RETURN p.id AS id, p.name AS name,
                   p.email AS email,
                   p.current_title AS title,
                   collect(s.name) AS skills
        """, uid=user_id)
        record = result.single()
        if not record:
            return {"error": "user not found"}
        return dict(record)