from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal

class Category(models.Model):
    """
    Groups transactions like 'Food', 'Rent', 'Salary'.
    Demonstrates: One-to-Many relationship basics.
    """
    name = models.CharField(max_length=100)
    # Each user can have their own custom categories
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    icon = models.CharField(max_length=20, default="💰")

    class Meta:
        # Prevents the same user from having two 'Food' categories
        unique_together = ('name', 'user')
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Transaction(models.Model):
    """
    The core data table. 
    Demonstrates: Choices, Foreign Keys, and Validations.
    """
    TRANSACTION_TYPES = (
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='transactions')
    title = models.CharField(max_length=255)
    amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPES)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date'] # Show newest transactions first

    def __str__(self):
        return f"{self.title} - {self.amount} ({self.transaction_type})"