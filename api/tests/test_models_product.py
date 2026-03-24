import pytest
from pydantic import ValidationError
from app.models.product import Product


class TestProductModelValid:
    def test_create_product_all_fields(self):
        product = Product(
            productId=1,
            supplierId=1,
            name="Widget",
            description="A test widget",
            price=9.99,
            sku="WDG-001",
            unit="piece",
            imgName="widget.png",
            discount=0.10,
        )
        assert product.productId == 1
        assert product.supplierId == 1
        assert product.name == "Widget"
        assert product.description == "A test widget"
        assert product.price == 9.99
        assert product.sku == "WDG-001"
        assert product.unit == "piece"
        assert product.imgName == "widget.png"
        assert product.discount == 0.10

    def test_create_product_without_discount(self):
        product = Product(
            productId=2,
            supplierId=1,
            name="Gadget",
            description="A test gadget",
            price=19.99,
            sku="GDG-001",
            unit="piece",
            imgName="gadget.png",
        )
        assert product.discount is None

    def test_discount_default_none(self):
        product = Product(
            productId=3,
            supplierId=1,
            name="Thing",
            description="A thing",
            price=5.00,
            sku="THG-001",
            unit="piece",
            imgName="thing.png",
        )
        assert product.discount is None

    def test_product_json_serialization(self):
        product = Product(
            productId=1,
            supplierId=1,
            name="Widget",
            description="A widget",
            price=9.99,
            sku="WDG-001",
            unit="piece",
            imgName="widget.png",
            discount=0.25,
        )
        data = product.model_dump()
        assert data["productId"] == 1
        assert data["name"] == "Widget"
        assert data["discount"] == 0.25
        assert isinstance(data, dict)

    def test_product_json_round_trip(self):
        product = Product(
            productId=1,
            supplierId=1,
            name="Widget",
            description="A widget",
            price=9.99,
            sku="WDG-001",
            unit="piece",
            imgName="widget.png",
        )
        json_str = product.model_dump_json()
        restored = Product.model_validate_json(json_str)
        assert restored == product

    def test_product_from_dict(self):
        data = {
            "productId": 10,
            "supplierId": 2,
            "name": "From Dict",
            "description": "Created from dict",
            "price": 15.50,
            "sku": "FD-001",
            "unit": "box",
            "imgName": "from-dict.png",
        }
        product = Product(**data)
        assert product.name == "From Dict"
        assert product.price == 15.50


class TestProductModelValidation:
    def test_missing_product_id(self):
        with pytest.raises(ValidationError):
            Product(
                supplierId=1,
                name="Widget",
                description="A widget",
                price=9.99,
                sku="WDG-001",
                unit="piece",
                imgName="widget.png",
            )

    def test_missing_name(self):
        with pytest.raises(ValidationError):
            Product(
                productId=1,
                supplierId=1,
                description="A widget",
                price=9.99,
                sku="WDG-001",
                unit="piece",
                imgName="widget.png",
            )

    def test_missing_price(self):
        with pytest.raises(ValidationError):
            Product(
                productId=1,
                supplierId=1,
                name="Widget",
                description="A widget",
                sku="WDG-001",
                unit="piece",
                imgName="widget.png",
            )

    def test_invalid_price_type(self):
        with pytest.raises(ValidationError):
            Product(
                productId=1,
                supplierId=1,
                name="Widget",
                description="A widget",
                price="not-a-float",
                sku="WDG-001",
                unit="piece",
                imgName="widget.png",
            )

    def test_invalid_product_id_type(self):
        with pytest.raises(ValidationError):
            Product(
                productId="abc",
                supplierId=1,
                name="Widget",
                description="A widget",
                price=9.99,
                sku="WDG-001",
                unit="piece",
                imgName="widget.png",
            )

    def test_missing_all_required_fields(self):
        with pytest.raises(ValidationError):
            Product()

    def test_missing_sku(self):
        with pytest.raises(ValidationError):
            Product(
                productId=1,
                supplierId=1,
                name="Widget",
                description="A widget",
                price=9.99,
                unit="piece",
                imgName="widget.png",
            )

    def test_missing_supplier_id(self):
        with pytest.raises(ValidationError):
            Product(
                productId=1,
                name="Widget",
                description="A widget",
                price=9.99,
                sku="WDG-001",
                unit="piece",
                imgName="widget.png",
            )
