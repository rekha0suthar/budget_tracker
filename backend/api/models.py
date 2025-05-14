from django.db import models
from django.contrib.auth.models import User

# Create your models here.
CATEGORY_CHOICES = [
    ('SALARY', 'Salary'),
    ('GROCERY', 'Grocery'),
    ('ENTERTAINMENT', 'Entertainment'),
    ('TRAVEL', 'Travel'),
    ('OTHERS', 'Others')
]

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    date = models.DateField()
    type = models.CharField(max_length=10, choices=[("INCOME", "Income"), ("EXPENSE", "Expense")])

    def __str__(self):
        return f"{self.title} - {self.amount}"