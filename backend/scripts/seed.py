"""
Seeds the 3 demo projects that the frontend's workspace shell, breadcrumbs,
and project switcher have been navigating to since the placeholder-data
milestones (frontend/lib/placeholder-projects.ts) — using the same ids, so
every existing hardcoded route keeps working once Documents reads from this
database instead of static fixture data. Idempotent: safe to re-run.

Run from backend/: venv/bin/python scripts/seed.py
"""

import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database.session import SessionLocal  # noqa: E402
from app.models.project import Project, ProjectStatus  # noqa: E402

SEED_PROJECTS = [
    {
        "id": "hospital-expansion",
        "name": "Hospital Expansion",
        "project_number": "PRJ-2026-001",
        "client": "City Medical Center",
        "location": "Orlando, FL",
        "building_type": "Hospital",
        "description": (
            "Modernization of the east patient wing and expansion of emergency facilities."
        ),
        "status": ProjectStatus.active,
        "created_at": datetime.fromisoformat("2026-01-14T00:00:00.000Z"),
        "updated_at": datetime.fromisoformat("2026-06-30T00:00:00.000Z"),
    },
    {
        "id": "airport-renovation",
        "name": "Airport Renovation",
        "project_number": "PRJ-2026-014",
        "client": "Metro Aviation Authority",
        "location": "Charlotte, NC",
        "building_type": "Airport",
        "description": (
            "Terminal B renovation, including updated baggage handling and new "
            "passenger boarding bridges."
        ),
        "status": ProjectStatus.active,
        "created_at": datetime.fromisoformat("2026-02-03T00:00:00.000Z"),
        "updated_at": datetime.fromisoformat("2026-07-10T00:00:00.000Z"),
    },
    {
        "id": "office-tower",
        "name": "Office Tower",
        "project_number": "PRJ-2025-087",
        "client": "Beacon Development Group",
        "location": "Austin, TX",
        "building_type": "Office",
        "description": (
            "Ground-up construction of a 22-story Class A office tower with ground-floor retail."
        ),
        "status": ProjectStatus.active,
        "created_at": datetime.fromisoformat("2025-11-18T00:00:00.000Z"),
        "updated_at": datetime.fromisoformat("2026-07-02T00:00:00.000Z"),
    },
]


def seed() -> None:
    db = SessionLocal()
    try:
        created = 0
        for fields in SEED_PROJECTS:
            if db.get(Project, fields["id"]) is not None:
                continue
            db.add(Project(**fields))
            created += 1
        db.commit()
        print(f"Seeded {created} project(s); {len(SEED_PROJECTS) - created} already present.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
