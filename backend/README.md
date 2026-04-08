# SolarAxis Monitor — Python Modbus Backend

Universal Modbus polling service + REST API for solar inverter telemetry.

## Architecture

```
Inverter → Modbus RTU/TCP → modbus_client.py → data_parser.py → database.py → app.py (Flask API) → React Frontend
```

## Quick Start

### 1. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Poll an inverter (CLI)
```bash
# Growatt via TCP
python main.py --brand growatt --ip 192.168.1.25

# Sungrow via TCP on a custom port
python main.py --brand sungrow --ip 192.168.1.50 --port 502

# Any brand — interactive prompt
python main.py

# Override poll interval (seconds)
python main.py --brand solis --ip 192.168.1.100 --interval 10
```

### 3. Start the REST API
```bash
python app.py
# → http://localhost:5000
```

### 4. Auto-poll via environment variables
```bash
set SOLAR_BRAND=growatt
set SOLAR_IP=192.168.1.25
set SOLAR_INTERVAL=30
python app.py
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Service health check |
| GET | `/brands` | List all available driver brands |
| GET | `/data` | Latest telemetry snapshot |
| GET | `/history?hours=24` | Historical data (last N hours) |
| POST | `/poll` | On-demand poll `{"brand":"growatt","ip":"192.168.1.25"}` |

### Sample `/data` Response
```json
{
  "brand": "Growatt",
  "model": "MIN",
  "pv_voltage": 350.5,
  "pv_current": 5.2,
  "pv_power": 1820.0,
  "grid_voltage": 230.4,
  "grid_current": 7.9,
  "frequency": 50.01,
  "today_energy": 8.5,
  "total_energy": 1250.3,
  "temperature": 42.1,
  "status": 1.0,
  "status_text": "Running",
  "timestamp": "2026-04-07 14:30:00"
}
```

## Available Drivers

| File | Brand | Protocol | Default Port | Slave ID |
|------|-------|----------|--------------|----------|
| `growatt.json` | Growatt MIN | TCP | 502 | 1 |
| `sungrow.json` | Sungrow SG Series | TCP | 502 | 1 |
| `solis.json` | Solis S6 Series | TCP | 502 | 1 |
| `polycab.json` | Polycab PCB Series | TCP | 502 | 1 |
| `waaree.json` | Waaree WRS Series | TCP | 502 | 1 |
| `solaria.json` | Solaria SPower | TCP | 502 | 1 |

## Status Codes
| Code | Meaning |
|------|---------|
| 0 | Offline |
| 1 | Running |
| 2 | Fault |
| 3 | Standby |

## Adding a New Driver
Create `drivers/<brandname>.json`:
```json
{
  "brand": "MyBrand",
  "model": "Model X",
  "protocol": "tcp",
  "ip_port": 502,
  "slave_id": 1,
  "poll_interval": 5,
  "registers": {
    "pv_voltage":   {"addr": 30001, "type": "uint16", "scale": 0.1},
    "pv_current":   {"addr": 30002, "type": "uint16", "scale": 0.1},
    "pv_power":     {"addr": 30003, "type": "uint32", "scale": 1},
    "grid_voltage": {"addr": 30007, "type": "uint16", "scale": 0.1},
    "grid_current": {"addr": 30008, "type": "uint16", "scale": 0.1},
    "frequency":    {"addr": 30009, "type": "uint16", "scale": 0.01},
    "today_energy": {"addr": 30013, "type": "uint16", "scale": 0.1},
    "total_energy": {"addr": 30015, "type": "uint32", "scale": 0.1},
    "temperature":  {"addr": 30017, "type": "int16",  "scale": 0.1},
    "status":       {"addr": 30025, "type": "uint16", "scale": 1}
  }
}
```
Then run: `python main.py --brand mybrand --ip 192.168.1.x`
