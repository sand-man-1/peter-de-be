from rest_framework import generics
from rest_framework.request import Request
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        queryset = Transaction.objects.all()
        request: Request = self.request
        params = request.query_params  

        transaction_type = params.get("transaction_type")
        status = params.get("status")
        year = params.get("year")

        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type)

        if status:
            queryset = queryset.filter(status=status)

        if year:
            queryset = queryset.filter(year=year)

        return queryset
