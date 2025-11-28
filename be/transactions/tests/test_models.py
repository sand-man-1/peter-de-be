from django.test import TestCase
from decimal import Decimal
from transactions.models import Transaction


class TransactionModelTests(TestCase):
    def test_create_transaction(self):
        tx = Transaction.objects.create(
            transaction_type="invoice",
            transaction_number="TEST-001",
            amount=Decimal("123.45"),
            status="paid",
            year=2025,
        )

        self.assertEqual(tx.transaction_type, "invoice")
        self.assertEqual(tx.transaction_number, "TEST-001")
        self.assertEqual(tx.amount, Decimal("123.45"))
        self.assertEqual(tx.status, "paid")
        self.assertEqual(tx.year, 2025)

    def test_str_representation(self):
        tx = Transaction.objects.create(
            transaction_type="bill",
            transaction_number="B-10",
            amount=Decimal("10.00"),
            status="unpaid",
            year=2024,
        )

        # __str__ defined in models.py
        self.assertEqual(str(tx), "bill B-10")
