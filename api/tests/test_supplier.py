import pytest
from fastapi import status
from app.seed_data import suppliers as seed_suppliers


def test_get_all_suppliers(client):
    response = client.get("/api/suppliers")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == len(seed_suppliers)


def test_get_all_suppliers_returns_list(client):
    response = client.get("/api/suppliers")
    assert isinstance(response.json(), list)


def test_create_supplier(client, test_supplier):
    response = client.post("/api/suppliers", json=test_supplier)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json() == test_supplier


def test_create_supplier_appears_in_list(client, test_supplier):
    client.post("/api/suppliers", json=test_supplier)
    response = client.get("/api/suppliers")
    ids = [s["supplierId"] for s in response.json()]
    assert test_supplier["supplierId"] in ids


def test_get_supplier(client):
    first_supplier = seed_suppliers[0]
    response = client.get(f"/api/suppliers/{first_supplier.supplierId}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["supplierId"] == first_supplier.supplierId
    assert response.json()["name"] == first_supplier.name


def test_get_supplier_not_found(client):
    response = client.get("/api/suppliers/99999")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_supplier_returns_all_fields(client):
    first_supplier = seed_suppliers[0]
    response = client.get(f"/api/suppliers/{first_supplier.supplierId}")
    data = response.json()
    for field in ["supplierId", "name", "description", "contactPerson", "email", "phone"]:
        assert field in data


def test_update_supplier(client, test_supplier):
    # Create supplier first
    client.post("/api/suppliers", json=test_supplier)

    # Update it
    updated = test_supplier.copy()
    updated["name"] = "Updated Supplier Inc"
    updated["phone"] = "555-9999"
    response = client.put(f"/api/suppliers/{test_supplier['supplierId']}", json=updated)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["name"] == "Updated Supplier Inc"
    assert response.json()["phone"] == "555-9999"


def test_update_supplier_not_found(client, test_supplier):
    response = client.put("/api/suppliers/99999", json=test_supplier)
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_supplier(client, test_supplier):
    # Create supplier first
    client.post("/api/suppliers", json=test_supplier)

    # Delete it
    response = client.delete(f"/api/suppliers/{test_supplier['supplierId']}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Verify deleted
    get_response = client.get(f"/api/suppliers/{test_supplier['supplierId']}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_supplier_not_found(client):
    response = client.delete("/api/suppliers/99999")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_create_supplier_invalid_payload(client):
    # Missing required fields
    response = client.post("/api/suppliers", json={"name": "Incomplete"})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_supplier_empty_body(client):
    response = client.post("/api/suppliers", json={})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_update_supplier_invalid_payload(client):
    response = client.put("/api/suppliers/1", json={"name": "Incomplete"})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_supplier_invalid_id_type(client, test_supplier):
    invalid = test_supplier.copy()
    invalid["supplierId"] = "not-an-int"
    response = client.post("/api/suppliers", json=invalid)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_supplier_malformed_id(client):
    response = client.get("/api/suppliers/abc")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
