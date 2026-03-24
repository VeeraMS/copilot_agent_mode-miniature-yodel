import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.routes import branch, product, supplier  # Import route modules to access state

@pytest.fixture(autouse=True)
def reset_data():
    # Reset data before each test
    branch.branches = branch.branches.copy()
    product.products = product.products.copy()
    supplier.suppliers = supplier.suppliers.copy()
    yield
    # Reset after test
    branch.branches = list(branch.seed_branches)
    product.products = list(product.seed_products)
    supplier.suppliers = list(supplier.seed_suppliers)

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_branch():
    return {
        "branchId": 999,
        "headquartersId": 1,
        "name": "Test Branch",
        "description": "Test branch for unit tests",
        "address": "123 Test St",
        "contactPerson": "Test Person",
        "email": "test@example.com",
        "phone": "555-0123"
    }

@pytest.fixture
def test_product():
    return {
        "productId": 999,
        "supplierId": 1,
        "name": "Test Widget",
        "description": "A test product for unit tests",
        "price": 29.99,
        "sku": "TEST-001",
        "unit": "piece",
        "imgName": "test-widget.png",
        "discount": None
    }

@pytest.fixture
def test_supplier():
    return {
        "supplierId": 999,
        "name": "Test Supplier Inc",
        "description": "A test supplier for unit tests",
        "contactPerson": "Test Contact",
        "email": "test@supplier.com",
        "phone": "555-9999"
    }