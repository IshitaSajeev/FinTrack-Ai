from django.contrib import admin
from .models import Category, Transaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'icon')
    list_filter = ('user',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    # This makes the dashboard look professional with columns
    list_display = ('title', 'amount', 'transaction_type', 'category', 'user', 'date')
    # This adds a sidebar to filter by type or date
    list_filter = ('transaction_type', 'date', 'user')
    # This adds a search bar
    search_fields = ('title', 'description')