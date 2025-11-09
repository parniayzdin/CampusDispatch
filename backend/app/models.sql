CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('DISPATCH','UNIT','REPORTER'))
);

CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  kind  TEXT NOT NULL CHECK (kind IN ('SECURITY','MAINT','FIRST_AID')),
  status TEXT NOT NULL DEFAULT 'AVAILABLE'
     CHECK (status IN ('AVAILABLE','BUSY','OFFLINE')),
  geom geometry(Point, 4326),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id),
  title TEXT,
  type  TEXT,                   
  severity INT NOT NULL DEFAULT 1 CHECK (severity BETWEEN 0 AND 4),
  status TEXT NOT NULL DEFAULT 'OPEN'
     CHECK (status IN ('OPEN','ASSIGNED','EN_ROUTE','ON_SCENE','RESOLVED','CLOSED')),
  location_text TEXT,
  geom geometry(Point, 4326),   -- mapped coordinate
  ai_summary TEXT,
  ai_entities JSONB            
);

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  unit_id     UUID NOT NULL REFERENCES units(id)     ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  arrived_at  TIMESTAMPTZ,
  cleared_at  TIMESTAMPTZ
);

CREATE TABLE incident_events (
  id BIGSERIAL PRIMARY KEY,
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  at TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor UUID,
  kind TEXT NOT NULL,   
  payload JSONB
);

--useful indexes
CREATE INDEX ON incidents USING GIST (geom);
CREATE INDEX ON units     USING GIST (geom);
CREATE INDEX events_incident_time ON incident_events(incident_id, at DESC);
