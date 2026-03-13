from rest_framework import serializers
from .models import Category, Transaction

class CategorySerializer(serializers.ModelSerializer):
    """
    Translates Category SQL rows into JSON format.
    """
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon']

class TransactionSerializer(serializers.ModelSerializer):
    """
    Translates Transaction SQL rows into JSON.
    Also handles converting JSON back into SQL when a user creates a transaction.
    """
    # We want to see the category name, not just its ID number
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Transaction
        fields = [
            'id', 'title', 'amount', 'transaction_type', 
            'category', 'category_name', 'date', 'description'
        ]

    def validate_amount(self, value):
        """
        Custom validation: Ensure no one tries to enter a 0 or negative amount.
        """
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value