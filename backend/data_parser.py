"""
data_parser.py — Register data converter for SolarAxis Monitor
Reads registers using the driver config and applies scaling + status mapping.
"""

from modbus_client import read_register

# ── STATUS CODE → TEXT MAPPING ────────────────────────────────────────────────
STATUS_MAP = {
    0: "Offline",
    1: "Running",
    2: "Fault",
    3: "Standby",
}


def parse_data(driver, client):
    """
    Poll every register defined in the driver JSON,
    apply the scale factor, and return a structured dict.

    Args:
        driver (dict): Loaded driver configuration (from JSON file).
        client:        Connected pymodbus client instance.

    Returns:
        dict: All register values with human-readable keys + status text.
    """
    slave_id = driver.get("slave_id", 1)
    data = {}

    for name, reg in driver["registers"].items():
        try:
            raw = read_register(client, reg["addr"], reg["type"], slave_id)
            value = round(raw * reg["scale"], 4)
            data[name] = value
        except Exception as e:
            # Record errors per register so one bad register doesn't abort all.
            data[name] = None
            data[f"{name}_error"] = str(e)

    # ── Add human-readable status text ────────────────────────────────────────
    if "status" in data and data["status"] is not None:
        data["status_text"] = STATUS_MAP.get(int(data["status"]), "Unknown")
    else:
        data["status_text"] = "No Data"

    # ── Attach driver metadata ─────────────────────────────────────────────────
    data["brand"]  = driver.get("brand", "Unknown")
    data["model"]  = driver.get("model", "Unknown")

    return data
