"""
modbus_client.py — Universal Modbus Reader for SolarAxis Monitor
Supports both Modbus TCP (WiFi dongles) and Modbus RTU (RS485 serial).
"""

import json
import struct
from pymodbus.client import ModbusTcpClient, ModbusSerialClient
from pymodbus.exceptions import ModbusException


def read_register(client, addr, dtype, slave_id=1):
    """
    Read one or two consecutive input registers and decode them
    according to the given data type.

    Supported dtypes:
        uint16  – unsigned 16-bit integer
        int16   – signed 16-bit integer (two's complement)
        uint32  – unsigned 32-bit integer (high word first)
        int32   – signed 32-bit integer  (high word first)
        float   – IEEE 754 32-bit float  (high word first)
    """
    # Modbus addresses in the driver JSON are 1-based (Modicon notation).
    # pymodbus uses 0-based addresses for the protocol frame, so subtract 1.
    zero_addr = addr - 1

    if dtype in ("uint16", "int16"):
        rr = client.read_input_registers(zero_addr, count=1, slave=slave_id)
        if rr.isError():
            raise ModbusException(f"Error reading register {addr}: {rr}")
        raw = rr.registers[0]

        if dtype == "int16":
            # Interpret as signed using two's complement
            raw = struct.unpack(">h", struct.pack(">H", raw))[0]
        return raw

    elif dtype in ("uint32", "int32", "float"):
        rr = client.read_input_registers(zero_addr, count=2, slave=slave_id)
        if rr.isError():
            raise ModbusException(f"Error reading registers {addr}-{addr+1}: {rr}")
        high = rr.registers[0]
        low  = rr.registers[1]

        combined = (high << 16) | low

        if dtype == "float":
            return struct.unpack(">f", struct.pack(">I", combined))[0]
        elif dtype == "int32":
            return struct.unpack(">i", struct.pack(">I", combined))[0]
        return combined

    else:
        raise ValueError(f"Unknown dtype '{dtype}' for register {addr}")


def connect_driver(driver, ip=None, com=None):
    """
    Create and connect a Modbus client based on the driver config.

    Args:
        driver (dict): Parsed driver JSON (must contain 'protocol').
        ip     (str):  IP address for TCP connections.
        com    (str):  COM port path for RTU connections (e.g. 'COM3' or '/dev/ttyUSB0').

    Returns:
        Connected pymodbus client instance (TCP or Serial).
    """
    protocol = driver.get("protocol", "tcp").lower()

    if protocol == "tcp":
        if not ip:
            raise ValueError("An IP address is required for Modbus TCP connections.")
        client = ModbusTcpClient(
            host=ip,
            port=driver.get("ip_port", 502),
            timeout=5,
        )
        if not client.connect():
            raise ConnectionError(
                f"Could not connect to {ip}:{driver.get('ip_port', 502)}. "
                "Check IP, port, and that the device is reachable."
            )
        return client

    elif protocol == "rtu":
        if not com:
            raise ValueError("A COM port is required for Modbus RTU connections.")
        client = ModbusSerialClient(
            port=com,
            baudrate=driver.get("baud_rate", 9600),
            bytesize=8,
            stopbits=1,
            parity="N",
            timeout=1,
        )
        if not client.connect():
            raise ConnectionError(
                f"Could not open serial port {com}. "
                "Check that the device is plugged in and the port is correct."
            )
        return client

    else:
        raise ValueError(f"Unsupported protocol '{protocol}'. Choose 'tcp' or 'rtu'.")


def load_driver(brand_name):
    """
    Load a driver JSON file by brand name from the 'drivers/' folder.

    Args:
        brand_name (str): e.g. 'growatt', 'sungrow', 'solis'

    Returns:
        dict: Parsed driver configuration.
    """
    import os
    driver_path = os.path.join(
        os.path.dirname(__file__), "drivers", f"{brand_name.lower()}.json"
    )
    if not os.path.exists(driver_path):
        available = [
            f.replace(".json", "")
            for f in os.listdir(os.path.join(os.path.dirname(__file__), "drivers"))
            if f.endswith(".json")
        ]
        raise FileNotFoundError(
            f"No driver found for '{brand_name}'. "
            f"Available drivers: {available}"
        )
    with open(driver_path, "r") as f:
        return json.load(f)
