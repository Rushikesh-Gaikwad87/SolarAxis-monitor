"""
main.py — SolarAxis Monitor: Universal Modbus Polling Service
Connects to an inverter, polls telemetry, saves to DB, and prints live data.

Usage:
    python main.py --brand growatt --ip 192.168.1.25
    python main.py --brand sungrow --ip 192.168.1.50
    python main.py --brand solis   --ip 192.168.1.100 --port 502
    python main.py --brand goodwe  --ip 192.168.1.60 --com COM3   (RTU via serial)
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime

from database import init_db, save_data
from data_parser import parse_data
from modbus_client import connect_driver, load_driver

# ── STATUS MAP (also referenced by data_parser) ────────────────────────────────
STATUS_MAP = {0: "Offline", 1: "Running", 2: "Fault", 3: "Standby"}

# ── ANSI colour helpers ────────────────────────────────────────────────────────
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"


def colour_status(status_text: str) -> str:
    colours = {"Running": GREEN, "Offline": RED, "Fault": RED, "Standby": YELLOW}
    c = colours.get(status_text, CYAN)
    return f"{BOLD}{c}{status_text}{RESET}"


def print_banner(driver: dict, ip: str):
    brand = driver.get("brand", "Unknown")
    model = driver.get("model", "Unknown")
    port  = driver.get("ip_port", 502)
    print(f"{BOLD}{CYAN}")
    print("╔══════════════════════════════════════════╗")
    print(f"║  SolarAxis Modbus Service — {brand:<13}║")
    print(f"║  Model: {model:<33}║")
    print(f"║  Target: {ip}:{port:<26}║")
    print("╚══════════════════════════════════════════╝")
    print(RESET)


def print_data(data: dict):
    ts       = datetime.now().strftime("%H:%M:%S")
    status   = colour_status(data.get("status_text", "No Data"))

    print(f"\n{BOLD}[{ts}]{RESET} {data.get('brand', '')} | Status: {status}")
    print(f"  PV   Voltage : {data.get('pv_voltage', '—')} V  |  Current: {data.get('pv_current', '—')} A  |  Power: {data.get('pv_power', '—')} W")
    print(f"  Grid Voltage : {data.get('grid_voltage', '—')} V  |  Current: {data.get('grid_current', '—')} A  |  Freq: {data.get('frequency', '—')} Hz")
    print(f"  Energy Today : {data.get('today_energy', '—')} kWh  |  Total: {data.get('total_energy', '—')} kWh")
    print(f"  Temperature  : {data.get('temperature', '—')} °C")


def run_poll_loop(driver: dict, client, interval: int):
    """Main polling loop — reads data, saves to DB, prints to console."""
    print(f"{GREEN}✓ Connected. Polling every {interval}s — press Ctrl+C to stop.{RESET}\n")

    while True:
        try:
            data = parse_data(driver, client)
            print_data(data)
            save_data(data)
        except KeyboardInterrupt:
            raise
        except Exception as e:
            print(f"{RED}  ⚠ Poll error: {e}{RESET}")
        time.sleep(interval)


def main():
    parser = argparse.ArgumentParser(
        description="SolarAxis Universal Modbus Polling Service"
    )
    parser.add_argument(
        "--brand", "-b",
        help="Inverter brand (e.g. growatt, sungrow, solis, polycab, waaree, solaria). "
             "Leave blank to be prompted interactively.",
    )
    parser.add_argument("--ip",  "-i", help="IP address of the inverter / WiFi dongle.")
    parser.add_argument("--com", "-c", help="COM port for Modbus RTU (e.g. COM3).")
    parser.add_argument(
        "--port", "-p", type=int, default=None,
        help="Override the Modbus TCP port (default from driver JSON).",
    )
    parser.add_argument(
        "--interval", "-t", type=int, default=None,
        help="Override the poll interval in seconds (default from driver JSON).",
    )
    args = parser.parse_args()

    # ── Interactive brand selection if not provided ────────────────────────────
    brand = args.brand
    if not brand:
        drivers_dir = os.path.join(os.path.dirname(__file__), "drivers")
        available   = [f.replace(".json", "") for f in os.listdir(drivers_dir) if f.endswith(".json")]
        print(f"Available drivers: {', '.join(sorted(available))}")
        brand = input("Enter inverter brand: ").strip()

    # ── Load driver ────────────────────────────────────────────────────────────
    try:
        driver = load_driver(brand)
    except FileNotFoundError as e:
        print(f"{RED}{e}{RESET}")
        sys.exit(1)

    # Apply CLI overrides
    if args.port:
        driver["ip_port"] = args.port

    interval = args.interval or driver.get("poll_interval", 5)

    # ── IP / COM prompt if needed ──────────────────────────────────────────────
    ip  = args.ip
    com = args.com

    if driver.get("protocol", "tcp") == "tcp" and not ip:
        ip = input("Enter inverter IP address: ").strip()

    if driver.get("protocol", "rtu") == "rtu" and not com:
        com = input("Enter COM port (e.g. COM3 or /dev/ttyUSB0): ").strip()

    # ── Init DB ────────────────────────────────────────────────────────────────
    init_db()

    # ── Connect ────────────────────────────────────────────────────────────────
    print_banner(driver, ip or com)

    try:
        client = connect_driver(driver, ip=ip, com=com)
    except (ConnectionError, ValueError) as e:
        print(f"{RED}✗ {e}{RESET}")
        sys.exit(1)

    # ── Poll ───────────────────────────────────────────────────────────────────
    try:
        run_poll_loop(driver, client, interval)
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Polling stopped by user.{RESET}")
    finally:
        client.close()
        print("Connection closed.")


if __name__ == "__main__":
    main()
