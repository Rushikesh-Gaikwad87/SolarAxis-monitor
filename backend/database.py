"""
database.py — SQLite persistence layer for SolarAxis Monitor
Stores inverter telemetry readings with timestamps.
"""

import sqlite3
import json
from datetime import datetime

DB_PATH = "solar.db"

# ── Schema ────────────────────────────────────────────────────────────────────
CREATE_SQL = """
CREATE TABLE IF NOT EXISTS inverter_data (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP,
    brand       TEXT,
    model       TEXT,
    pv_voltage  REAL,
    pv_current  REAL,
    pv_power    REAL,
    grid_voltage REAL,
    grid_current REAL,
    frequency    REAL,
    today_energy REAL,
    total_energy REAL,
    temperature  REAL,
    status       TEXT,
    status_text  TEXT,
    raw_json     TEXT
);
"""

CREATE_IDX = """
CREATE INDEX IF NOT EXISTS idx_timestamp ON inverter_data (timestamp);
"""


def get_connection():
    """Return a SQLite connection with row_factory set to dict-like rows."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables and indexes if they don't already exist."""
    conn = get_connection()
    cur  = conn.cursor()
    cur.executescript(CREATE_SQL + CREATE_IDX)
    conn.commit()
    conn.close()


def save_data(data: dict):
    """
    Insert one telemetry snapshot into the database.

    Args:
        data (dict): Output from data_parser.parse_data().
    """
    conn = get_connection()
    cur  = conn.cursor()
    cur.execute(
        """
        INSERT INTO inverter_data
            (brand, model, pv_voltage, pv_current, pv_power,
             grid_voltage, grid_current, frequency,
             today_energy, total_energy, temperature,
             status, status_text, raw_json)
        VALUES
            (:brand, :model, :pv_voltage, :pv_current, :pv_power,
             :grid_voltage, :grid_current, :frequency,
             :today_energy, :total_energy, :temperature,
             :status, :status_text, :raw_json)
        """,
        {
            "brand":        data.get("brand"),
            "model":        data.get("model"),
            "pv_voltage":   data.get("pv_voltage"),
            "pv_current":   data.get("pv_current"),
            "pv_power":     data.get("pv_power"),
            "grid_voltage": data.get("grid_voltage"),
            "grid_current": data.get("grid_current"),
            "frequency":    data.get("frequency"),
            "today_energy": data.get("today_energy"),
            "total_energy": data.get("total_energy"),
            "temperature":  data.get("temperature"),
            "status":       str(data.get("status")),
            "status_text":  data.get("status_text"),
            "raw_json":     json.dumps(data),
        },
    )
    conn.commit()
    conn.close()


def get_latest(limit: int = 1) -> list[dict]:
    """Return the most recent `limit` rows as a list of dicts."""
    conn = get_connection()
    cur  = conn.cursor()
    cur.execute(
        "SELECT * FROM inverter_data ORDER BY timestamp DESC LIMIT ?",
        (limit,),
    )
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    return rows


def get_history(hours: int = 24) -> list[dict]:
    """Return all rows from the last `hours` hours."""
    conn = get_connection()
    cur  = conn.cursor()
    cur.execute(
        """
        SELECT * FROM inverter_data
        WHERE timestamp >= datetime('now', ?)
        ORDER BY timestamp ASC
        """,
        (f"-{hours} hours",),
    )
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    return rows
