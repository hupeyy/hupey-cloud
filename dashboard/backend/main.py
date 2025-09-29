import psutil
import asyncio
import time
import json
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def cpu_metrics():
    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_freq = psutil.cpu_freq().current
    return {"cpu_percent": cpu_percent, "cpu_freq": cpu_freq}

def memory_metrics():
    mem = psutil.virtual_memory()
    return {"total_memory": mem.total, "used_memory": mem.used, "memory_percent": mem.percent}

def network_metrics():
    net_io = psutil.net_io_counters()
    return {"bytes_sent": net_io.bytes_sent, "bytes_recv": net_io.bytes_recv}

def disk_metrics():
    disk = psutil.disk_usage('/')
    return {"total_disk": disk.total, "used_disk": disk.used, "disk_percent": disk.percent}

def get_system_metrics():
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "memory_used": psutil.virtual_memory().used / (1024 ** 3),  # GB
        "memory_total": psutil.virtual_memory().total / (1024 ** 3),  # GB
        "disk_usage": psutil.disk_usage('/').percent,
        "timestamp": asyncio.get_event_loop().time()
    }

@app.websocket("/ws/metrics")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            metrics = get_system_metrics()
            await websocket.send_json(metrics)
            await asyncio.sleep(2)
    except Exception as e:
        print(f"WebSocket connection closed: {e}")
    finally:
        await websocket.close()