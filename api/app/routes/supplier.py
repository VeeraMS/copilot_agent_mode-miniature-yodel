import logging
import time
import uuid
from fastapi import APIRouter, HTTPException, Request
from typing import List
from app.models.supplier import Supplier
from app.seed_data import suppliers as seed_suppliers

# ---------------------------------------------------------------------------
# TAO Observability – Structured Logging & Metrics
# Following TAO best practices: meaningful names, labels, trace-ID correlation
# ---------------------------------------------------------------------------

logger = logging.getLogger("tao.supplier")
logger.setLevel(logging.DEBUG)

# In-memory metric counters (TAO MetricRegistry pattern)
_metrics = {
    "supplier_requests_total": {},       # labels: {endpoint, method, status}
    "supplier_request_duration_seconds": [],  # histogram entries
    "supplier_errors_total": {},         # labels: {endpoint, method, error_type}
}


def _inc_counter(name: str, labels: dict) -> None:
    """Increment a labelled counter (TAO MetricRegistry.counter pattern)."""
    key = tuple(sorted(labels.items()))
    bucket = _metrics[name]
    bucket[key] = bucket.get(key, 0) + 1


def _record_duration(endpoint: str, method: str, duration: float, status: int) -> None:
    """Record request duration (TAO @Measure histogram pattern)."""
    _metrics["supplier_request_duration_seconds"].append({
        "endpoint": endpoint,
        "method": method,
        "duration": duration,
        "status": status,
    })


def _trace_context() -> str:
    """Generate a W3C-compatible trace ID (TAO getTraceContext pattern)."""
    return uuid.uuid4().hex


router = APIRouter()
suppliers = list(seed_suppliers)


# ---------------------------------------------------------------------------
# Routes – each annotated following TAO @Measure / @Trace / @Log decorators
# ---------------------------------------------------------------------------

@router.get(
    "/",
    response_model=List[Supplier],
    summary="Get all suppliers",
    description="Retrieve the complete list of suppliers.",
)
async def get_all_suppliers(request: Request):
    trace_id = _trace_context()
    start = time.perf_counter()
    logger.info(
        "Handling request",
        extra={"trace_id": trace_id, "endpoint": "/api/suppliers", "method": "GET"},
    )
    result = suppliers
    duration = time.perf_counter() - start
    _inc_counter("supplier_requests_total", {"endpoint": "/api/suppliers", "method": "GET", "status": "200"})
    _record_duration("/api/suppliers", "GET", duration, 200)
    logger.info(
        "Request completed",
        extra={"trace_id": trace_id, "endpoint": "/api/suppliers", "method": "GET", "status": 200, "duration": round(duration, 4)},
    )
    return result


@router.post(
    "/",
    response_model=Supplier,
    status_code=201,
    summary="Create a supplier",
    description="Add a new supplier to the catalogue.",
)
async def create_supplier(supplier: Supplier, request: Request):
    trace_id = _trace_context()
    start = time.perf_counter()
    logger.info(
        "Handling request",
        extra={"trace_id": trace_id, "endpoint": "/api/suppliers", "method": "POST", "supplier_id": supplier.supplierId},
    )
    suppliers.append(supplier)
    duration = time.perf_counter() - start
    _inc_counter("supplier_requests_total", {"endpoint": "/api/suppliers", "method": "POST", "status": "201"})
    _record_duration("/api/suppliers", "POST", duration, 201)
    logger.info(
        "Supplier created",
        extra={"trace_id": trace_id, "supplier_id": supplier.supplierId, "duration": round(duration, 4)},
    )
    return supplier


@router.get(
    "/{id}",
    response_model=Supplier,
    summary="Get a supplier by ID",
    description="Retrieve a single supplier by its unique identifier.",
)
async def get_supplier(id: int, request: Request):
    trace_id = _trace_context()
    start = time.perf_counter()
    logger.info(
        "Handling request",
        extra={"trace_id": trace_id, "endpoint": f"/api/suppliers/{id}", "method": "GET"},
    )
    supplier = next((s for s in suppliers if s.supplierId == id), None)
    if supplier:
        duration = time.perf_counter() - start
        _inc_counter("supplier_requests_total", {"endpoint": "/api/suppliers/{id}", "method": "GET", "status": "200"})
        _record_duration("/api/suppliers/{id}", "GET", duration, 200)
        logger.info(
            "Supplier found",
            extra={"trace_id": trace_id, "supplier_id": id, "duration": round(duration, 4)},
        )
        return supplier
    duration = time.perf_counter() - start
    _inc_counter("supplier_requests_total", {"endpoint": "/api/suppliers/{id}", "method": "GET", "status": "404"})
    _inc_counter("supplier_errors_total", {"endpoint": "/api/suppliers/{id}", "method": "GET", "error_type": "not_found"})
    _record_duration("/api/suppliers/{id}", "GET", duration, 404)
    logger.warning(
        "Supplier not found",
        extra={"trace_id": trace_id, "supplier_id": id, "duration": round(duration, 4)},
    )
    raise HTTPException(status_code=404, detail="Supplier not found")


@router.put(
    "/{id}",
    response_model=Supplier,
    summary="Update a supplier",
    description="Replace an existing supplier's data by its unique identifier.",
)
async def update_supplier(id: int, supplier: Supplier, request: Request):
    trace_id = _trace_context()
    start = time.perf_counter()
    logger.info(
        "Handling request",
        extra={"trace_id": trace_id, "endpoint": f"/api/suppliers/{id}", "method": "PUT", "supplier_id": id},
    )
    index = next((i for i, s in enumerate(suppliers) if s.supplierId == id), -1)
    if index != -1:
        suppliers[index] = supplier
        duration = time.perf_counter() - start
        _inc_counter("supplier_requests_total", {"endpoint": "/api/suppliers/{id}", "method": "PUT", "status": "200"})
        _record_duration("/api/suppliers/{id}", "PUT", duration, 200)
        logger.info(
            "Supplier updated",
            extra={"trace_id": trace_id, "supplier_id": id, "duration": round(duration, 4)},
        )
        return supplier
    duration = time.perf_counter() - start
    _inc_counter("supplier_requests_total", {"endpoint": "/api/suppliers/{id}", "method": "PUT", "status": "404"})
    _inc_counter("supplier_errors_total", {"endpoint": "/api/suppliers/{id}", "method": "PUT", "error_type": "not_found"})
    _record_duration("/api/suppliers/{id}", "PUT", duration, 404)
    logger.warning(
        "Supplier not found for update",
        extra={"trace_id": trace_id, "supplier_id": id, "duration": round(duration, 4)},
    )
    raise HTTPException(status_code=404, detail="Supplier not found")


@router.delete(
    "/{id}",
    status_code=204,
    summary="Delete a supplier",
    description="Remove a supplier by its unique identifier.",
)
async def delete_supplier(id: int, request: Request):
    trace_id = _trace_context()
    start = time.perf_counter()
    logger.info(
        "Handling request",
        extra={"trace_id": trace_id, "endpoint": f"/api/suppliers/{id}", "method": "DELETE", "supplier_id": id},
    )
    index = next((i for i, s in enumerate(suppliers) if s.supplierId == id), -1)
    if index != -1:
        suppliers.pop(index)
        duration = time.perf_counter() - start
        _inc_counter("supplier_requests_total", {"endpoint": "/api/suppliers/{id}", "method": "DELETE", "status": "204"})
        _record_duration("/api/suppliers/{id}", "DELETE", duration, 204)
        logger.info(
            "Supplier deleted",
            extra={"trace_id": trace_id, "supplier_id": id, "duration": round(duration, 4)},
        )
        return
    duration = time.perf_counter() - start
    _inc_counter("supplier_requests_total", {"endpoint": "/api/suppliers/{id}", "method": "DELETE", "status": "404"})
    _inc_counter("supplier_errors_total", {"endpoint": "/api/suppliers/{id}", "method": "DELETE", "error_type": "not_found"})
    _record_duration("/api/suppliers/{id}", "DELETE", duration, 404)
    logger.warning(
        "Supplier not found for deletion",
        extra={"trace_id": trace_id, "supplier_id": id, "duration": round(duration, 4)},
    )
    raise HTTPException(status_code=404, detail="Supplier not found")