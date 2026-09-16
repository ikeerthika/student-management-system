from django import forms
from .models import Student


class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['name', 'email', 'phone', 'course', 'joining_date', 'fees_status']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter full name'}),
            'email': forms.EmailInput(attrs={'class': 'form-input', 'placeholder': 'Enter email address'}),
            'phone': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter phone number'}),
            'course': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter enrolled course'}),
            'joining_date': forms.DateInput(attrs={'class': 'form-input', 'type': 'date'}),
            'fees_status': forms.Select(attrs={'class': 'form-input'}),
        }
