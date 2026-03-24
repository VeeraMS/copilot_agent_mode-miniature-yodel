import pytest
from fastapi import status
from app.seed_data import products as seed_products


def test_get_all_products(client):
    response = client.get("/api/products")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == len(seed_products)


def test_get_all_products_returns_list(client):
    response = client.get("/api/products")
    assert isinstance(response.json(), list)


def test_create_product(client, test_product):
    response = client.post("/api/products", json=test_product)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json() == test_product


def test_create_product_appears_in_list(client, test_product):
    client.post("/api/products", json=test_product)
    response = client.get("/api/products")
    ids = [p["productId"] for p in response.json()]
    assert test_product["productId"] in ids


def test_get_product(client):
    first_product = seed_products[0]
    response = client.get(f"/api/products/{first_product.productId}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["productId"] == first_product.productId
    assert response.json()["name"] == first_product.name


def test_get_product_not_found(client):
    response = client.get("/api/products/99999")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_product_returns_all_fields(client):
    first_product = seed_products[0]
    response = client.get(f"/api/products/{first_product.productId}")
    data = response.json()
    for field in ["productId", "supplierId", "name", "description", "price", "sku", "unit", "imgName"]:
        assert field in data


def test_update_product(client, test_product):
    # Create product first
    client.post("/api/products", json=test_product)

    # Update it
    updated = test_product.copy()
    updated["name"] = "Updated Widget"
    updated["price"] = 19.99
    response = client.put(f"/api/products/{test_product['productId']}", json=updated)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["name"] == "Updated Widget"
    assert response.json()["price"] == 19.99


def test_update_product_not_found(client, test_product):
    response = client.put("/api/products/99999", json=test_product)
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_product(client, test_product):
    # Create product first
    client.post("/api/products", json=test_product)

    # Delete it
    response = client.delete(f"/api/products/{test_product['productId']}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Verify deleted
    get_response = client.get(f"/api/products/{test_product['productId']}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_product_not_found(client):
    response = client.delete("/api/products/99999")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_create_product_invalid_payload(client):
    # Missing required fields
    response = client.post("/api/products", json={"name": "Incomplete"})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_product_invalid_price_type(client, test_product):
    invalid = test_product.copy()
    invalid["price"] = "not-a-number"
    response = client.post("/api/products", json=invalid)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_product_empty_body(client):
    response = client.post("/api/products", json={})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_update_product_invalid_payload(client):
    response = client.put("/api/products/1", json={"name": "Incomplete"})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_product_with_discount(client, test_product):
    product_with_discount = test_product.copy()
    product_with_discount["discount"] = 0.15
    response = client.post("/api/products", json=product_with_discount)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["discount"] == 0.15


def test_create_product_without_discount(client, test_product):
    # discount is optional, should default to None
    product_no_discount = test_product.copy()
    product_no_discount.pop("discount", None)
    response = client.post("/api/products", json=product_no_discount)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["discount"] is None


def test_get_product_malformed_id(client):
    response = client.get("/api/products/abc")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
