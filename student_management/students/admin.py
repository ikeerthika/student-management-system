from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'course', 'joining_date', 'fees_status')
    list_filter = ('fees_status', 'course')
    search_fields = ('name', 'email', 'course')
