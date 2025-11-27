from django.db import models


class Transaction(models.Model):
  
    transaction_type = models.CharField(max_length=32)

    
    transaction_number = models.CharField(max_length=64)

    
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    
    status = models.CharField(max_length=32)

    
    year = models.IntegerField()

    def __str__(self):
        return f"{self.transaction_type} {self.transaction_number}"
