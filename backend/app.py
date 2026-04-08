"""
app.py — SolarAxis Monitor: Flask REST API
Exposes inverter telemetry stored in SQLite over HTTP.

Endpoints:
    GET  /data              — Latest telemetry snapshot (JSON)
    GET  /history?hours=24  — Historical data (last N hours)
    GET  /brands            — List of available inverter drivers
    POST /poll              — Trigger an on-demand poll (body: {brand, ip})
    GET  /health            — Service health check
"""

import json
import os
import threading
import time
from datetime import datetime

from flask import Flask, jsonify, request, abort
from flask_cors import CORS

from database import get_latest, get_history, init_db, save_data
from data_parser import parse_data
from modbus_client import connect_driver, load_driver

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the React frontend

# ── DB initialisation ─────────────────────────────────────────────────────────
init_db()

# ── Shared state for the background poller ───────────────────────────────────
_poller_thread = None
_poller_stop   = threading.Event()


# ══════════════════════════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/health")
def health():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat()})


@app.route("/brands")
def list_brands():
    """Return all available driver names."""
    drivers_dir = os.path.join(os.path.dirname(__file__), "drivers")
    brands = [
        f.replace(".json", "")
        for f in os.listdir(drivers_dir)
        if f.endswith(".json")
    ]
    return jsonify({"brands": sorted(brands)})


@app.route("/data")
def get_data():
    """Latest telemetry snapshot from the database."""
    rows = get_latest(limit=1)
    if not rows:
        return jsonify({"error": "No data available yet. Start the polling service."}), 404
    return jsonify(rows[0])


@app.route("/history")
def get_history_data():
    """Historical data for the last N hours (default 24)."""
    try:
        hours = int(request.args.get("hours", 24))
    except ValueError:
        abort(400, "Parameter 'hours' must be an integer.")
    rows = get_history(hours=hours)
    return jsonify({"count": len(rows), "data": rows})


@app.route("/poll", methods=["POST"])
def on_demand_poll():
    """
    Trigger a single on-demand Modbus poll.
    Request body (JSON):
        {
          "brand": "growatt",
          "ip":    "192.168.1.25",
          "com":   null           // optional, for RTU
        }
    """
    body  = request.get_json(silent=True) or {}
    brand = body.get("brand")
    ip    = body.get("ip")
    com   = body.get("com")

    if not brand:
        abort(400, "Field 'brand' is required.")

    try:
        driver = load_driver(brand)
    except FileNotFoundError as e:
        abort(404, str(e))

    try:
        client = connect_driver(driver, ip=ip, com=com)
        data   = parse_data(driver, client)
        client.close()
    except (ConnectionError, ValueError) as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Poll failed: {e}"}), 500

    save_data(data)
    return jsonify(data)


# ══════════════════════════════════════════════════════════════════════════════
# BACKGROUND AUTO-POLLER  (optional — starts when env vars are set)
# ══════════════════════════════════════════════════════════════════════════════

def _background_poll(brand: str, ip: str, com: str, interval: int):
    """Thread target: polls continuously until _poller_stop is set."""
    try:
        driver = load_driver(brand)
        client = connect_driver(driver, ip=ip, com=com)
    except Exception as e:
        app.logger.error(f"Background poller failed to connect: {e}")
        return

    while not _poller_stop.is_set():
        try:
            data = parse_data(driver, client)
            save_data(data)
            app.logger.info(f"[auto-poll] {data.get('brand')} | {data.get('status_text')}")
        except Exception as e:
            app.logger.warning(f"[auto-poll] error: {e}")
        _poller_stop.wait(interval)

    client.close()


def start_background_poller():
    """Start the auto-poller if SOLAR_BRAND and SOLAR_IP are set in env."""
    global _poller_thread
    brand    = os.environ.get("SOLAR_BRAND")
    ip       = os.environ.get("SOLAR_IP")
    com      = os.environ.get("SOLAR_COM")
    interval = int(os.environ.get("SOLAR_INTERVAL", "30"))

    if brand and (ip or com):
        _poller_stop.clear()
        _poller_thread = threading.Thread(
            target=_background_poll,
            args=(brand, ip, com, interval),
            daemon=True,
        )
        _poller_thread.start()
        app.logger.info(f"Auto-poller started: brand={brand}, ip={ip}, interval={interval}s")


# ══════════════════════════════════════════════════════════════════════════════
# ENTRY POINT
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    start_background_poller()
    app.run(host="0.0.0.0", port=5000, debug=False)
