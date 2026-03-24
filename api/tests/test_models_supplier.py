import pytest
from pydantic import ValidationError
from app.models.supplier import Supplier


class TestSupplierModelValid:
    def test_create_supplier_all_fields(self):
        supplier = Supplier(
            supplierId=1,
            name="Test Supplier",
            description="A test supplier",
            contactPerson="John Doe",
            email="john@test.com",
            phone="555-0100",
        )
        assert supplier.supplierId == 1
        assert supplier.name == "Test Supplier"
        assert supplier.description == "A test supplier"
        assert supplier.contactPerson == "John Doe"
        assert supplier.email == "john@test.com"
        assert supplier.phone == "555-0100"

    def test_supplier_json_serialization(self):
        supplier = Supplier(
            supplierId=1,
            name="Test Supplier",
            description="A test supplier",
            contactPerson="John Doe",
            email="john@test.com",
            phone="555-0100",
        )
        data = supplier.model_dump()
        assert data["supplierId"] == 1
        assert data["name"] == "Test Supplier"
        assert isinstance(data, dict)

    def test_supplier_json_round_trip(self):
        supplier = Supplier(
            supplierId=1,
            name="Test Supplier",
            description="A test supplier",
            contactPerson="John Doe",
            email="john@test.com",
            phone="555-0100",
        )
        json_str = supplier.model_dump_json()
        restored = Supplier.model_validate_json(json_str)
        assert restored == supplier

    def test_supplier_from_dict(self):
        data = {
            "supplierId": 10,
            "name": "Dict Supplier",
            "description": "Created from dict",
            "contactPerson": "Jane Doe",
            "email": "jane@dict.com",
            "phone": "555-0200",
        }
        supplier = Supplier(**data)
        assert supplier.name == "Dict Supplier"
        assert supplier.email == "jane@dict.com"

    def test_supplier_field_types(self):
        supplier = Supplier(
            supplierId=1,
            name="Test",
            description="Desc",
            contactPerson="Person",
            email="test@test.com",
            phone="555-0000",
        )
        assert isinstance(supplier.supplierId, int)
        assert isinstance(supplier.name, str)
        assert isinstance(supplier.description, str)
        assert isinstance(supplier.contactPerson, str)
        assert isinstance(supplier.email, str)
        assert isinstance(supplier.phone, str)


class TestSupplierModelValidation:
    def test_missing_supplier_id(self):
        with pytest.raises(ValidationError):
            Supplier(
                name="Test",
                description="Desc",
                contactPerson="Person",
                email="test@test.com",
                phone="555-0000",
            )

    def test_missing_name(self):
        with pytest.raises(ValidationError):
            Supplier(
                supplierId=1,
                description="Desc",
                contactPerson="Person",
                email="test@test.com",
                phone="555-0000",
            )

    def test_missing_description(self):
        with pytest.raises(ValidationError):
            Supplier(
                supplierId=1,
                name="Test",
                contactPerson="Person",
                email="test@test.com",
                phone="555-0000",
            )

    def test_missing_contact_person(self):
        with pytest.raises(ValidationError):
            Supplier(
                supplierId=1,
                name="Test",
                description="Desc",
                email="test@test.com",
                phone="555-0000",
            )

    def test_missing_email(self):
        with pytest.raises(ValidationError):
            Supplier(
                supplierId=1,
                name="Test",
                description="Desc",
                contactPerson="Person",
                phone="555-0000",
            )

    def test_missing_phone(self):
        with pytest.raises(ValidationError):
            Supplier(
                supplierId=1,
                name="Test",
                description="Desc",
                contactPerson="Person",
                email="test@test.com",
            )

    def test_missing_all_fields(self):
        with pytest.raises(ValidationError):
            Supplier()

    def test_invalid_supplier_id_type(self):
        with pytest.raises(ValidationError):
            Supplier(
                supplierId="abc",
                name="Test",
                description="Desc",
                contactPerson="Person",
                email="test@test.com",
                phone="555-0000",
            )
