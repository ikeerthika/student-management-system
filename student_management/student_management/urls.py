"""
URL configuration for student_management project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include students app URLs at the root
    path('', include('students.urls')),
]
