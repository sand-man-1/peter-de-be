from decimal import Decimal
from django.urls import reverse
from rest_framework.test import APITestCase
from transactions.models import Transaction


class TransactionAPITests(APITestCase):
    def setUp(self):
        Transaction.objects.create(
            transaction_type="invoice",
            transaction_number="INV-1",
            amount=Decimal("100.00"),
            status="paid",
            year=2024,
        )
        Transaction.objects.create(
            transaction_type="bill",
            transaction_number="BILL-1",
            amount=Decimal("50.00"),
            status="unpaid",
            year=2023,
        )

    def test_list_transactions(self):
        url = reverse("transaction-list")  # name from transactions/urls.py
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_filter_by_status(self):
        url = reverse("transaction-list")
        response = self.client.get(url, {"status": "paid"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["status"], "paid")
        self.assertEqual(response.data[0]["transaction_type"], "invoice")
