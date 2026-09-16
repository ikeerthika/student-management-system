from django.db import models


class Student(models.Model):
    FEES_CHOICES = [
        ('Paid', 'Paid'),
        ('Pending', 'Pending'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    course = models.CharField(max_length=100)
    joining_date = models.DateField()
    fees_status = models.CharField(
        max_length=10,
        choices=FEES_CHOICES,
        default='Pending'
    )

    def __str__(self):
        return f"{self.name} ({self.course})"
