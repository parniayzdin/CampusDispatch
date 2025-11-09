from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
import datetime as dt
from .db import get_conn

app = FastAPI(title="CampusDispatch Lite API")

@app.get("/")
def root():
    return {"message": "CampusDispatch Lite API is running"}

class GeoPoint(BaseModel):
    lon: float
    lat: float

class IncidentIn(BaseModel):
    title: str
    type: str = "maintenance.other"
    severity: int = Field(1, ge=0, le=4)
    location_text: Optional[str] = None
    point: Optional[GeoPoint] = None
    ai_summary: Optional[str] = None
    ai_entities: Optional[dict] = None

class IncidentOut(BaseModel):
    id: UUID
    created_at: dt.datetime
    title: Optional[str]
    type: Optional[str]
    severity: int
    status: str
    location_text: Optional[str]
    ai_summary: Optional[str]

class AssignIn(BaseModel):
    unit_id: str

@app.post("/incidents", response_model=IncidentOut)
async def create_incident(payload: IncidentIn):
    #Single SQL shape; uses CASE to build geom when point is provided.
    sql = """
      INSERT INTO incidents (title, type, severity, location_text, ai_summary, ai_entities, geom)
      VALUES (%s, %s, %s, %s, %s, %s,
              CASE WHEN %s IS NOT NULL AND %s IS NOT NULL
                   THEN ST_SetSRID(ST_MakePoint(%s, %s), 4326)
                   ELSE NULL END)
      RETURNING id, created_at, title, type, severity, status, location_text, ai_summary;
    """
    p = payload.point
    params = [
        payload.title,
        payload.type,
        payload.severity,
        payload.location_text,
        payload.ai_summary,
        payload.ai_entities,
        (p.lon if p else None),
        (p.lat if p else None),
        (p.lon if p else None),
        (p.lat if p else None),
    ]

    async with get_conn() as conn:
        async with conn.cursor() as cur:
            await cur.execute(sql, params)
            row = await cur.fetchone()
            await conn.commit()

    return IncidentOut(**dict(zip(
        ["id","created_at","title","type","severity","status","location_text","ai_summary"],
        row
    )))

@app.get("/incidents/open", response_model=List[IncidentOut])
async def list_open_incidents():
    sql = """
      SELECT id, created_at, title, type, severity, status, location_text, ai_summary
      FROM incidents
      WHERE status IN ('OPEN','ASSIGNED','EN_ROUTE','ON_SCENE')
      ORDER BY created_at DESC
      LIMIT 100;
    """
    async with get_conn() as conn:
        async with conn.cursor() as cur:
            await cur.execute(sql)
            rows = await cur.fetchall()

    return [IncidentOut(**dict(zip(
        ["id","created_at","title","type","severity","status","location_text","ai_summary"],
        r
    ))) for r in rows]

@app.post("/incidents/{incident_id}/assign")
async def assign_unit(incident_id: str = Path(...), body: AssignIn = ...):
    async with get_conn() as conn:
        async with conn.cursor() as cur:
            #Validate incident exists
            await cur.execute("SELECT 1 FROM incidents WHERE id=%s;", (incident_id,))
            if not await cur.fetchone():
                raise HTTPException(status_code=404, detail="Incident not found")

            #Validate unit exists & is not OFFLINE
            await cur.execute("SELECT status FROM units WHERE id=%s;", (body.unit_id,))
            unit = await cur.fetchone()
            if not unit:
                raise HTTPException(status_code=404, detail="Unit not found")
            if unit[0] == "OFFLINE":
                raise HTTPException(status_code=400, detail="Unit is OFFLINE")

            #Create assignment
            await cur.execute(
                "INSERT INTO assignments (incident_id, unit_id) VALUES (%s, %s) RETURNING id, assigned_at;",
                (incident_id, body.unit_id)
            )
            assignment_id, assigned_at = await cur.fetchone()

            #Update status & add event
            await cur.execute("UPDATE incidents SET status='ASSIGNED' WHERE id=%s;", (incident_id,))
            await cur.execute(
                "INSERT INTO incident_events (incident_id, kind, payload) VALUES (%s, 'ASSIGNED', jsonb_build_object('unit_id', %s));",
                (incident_id, body.unit_id)
            )

            await conn.commit()
            return {"assignment_id": str(assignment_id), "assigned_at": assigned_at.isoformat()}
