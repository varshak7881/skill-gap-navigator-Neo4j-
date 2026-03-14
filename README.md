Skill Gap Navigator
A career intelligence tool that uses a Neo4j graph database to map skills, job roles, and learning paths. Users input their current skills, select a dream job, and the app finds the shortest path to get there — recommending exact courses to fill the gap.

Features

Skill gap detection using graph traversal
Course recommendations ranked by skills covered
Interactive force-directed graph visualization
Shortest path from user to dream job role


Tech Stack
LayerTechnologyDatabaseNeo4j (Graph Database)BackendFastAPI (Python)FrontendReact.jsGraph Vizreact-force-graph-2dAPI Driverneo4j Python driver

Graph Schema
Nodes: Person · Skill · JobRole · Course · Company
Relationships:

(Person)-[:HAS_SKILL]->(Skill)
(JobRole)-[:REQUIRES_SKILL]->(Skill)
(Course)-[:TEACHES_SKILL]->(Skill)


How to Run Locally
1. Start Neo4j Desktop and create a local database instance.
2. Backend
bashcd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
3. Frontend
bashcd frontend
npm install
npm start
4. Open http://localhost:3000

API Endpoints
MethodEndpointDescriptionPOST/users/createCreate user with skillsGET/jobs/List all job rolesGET/recommend/gapGet missing skillsGET/recommend/coursesGet course recommendationsGET/recommend/pathGet shortest graph path

Key Cypher Query
cypherMATCH (j:JobRole {id: $job_id})-[:REQUIRES_SKILL]->(s:Skill)
WHERE NOT EXISTS {
  MATCH (p:Person {id: $user_id})-[:HAS_SKILL]->(s)
}
RETURN s.name AS missing_skill, s.category AS category

Built with Neo4j · FastAPI · React
