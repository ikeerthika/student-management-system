from django.shortcuts import render, redirect, get_object_or_404
from .models import Student
from .forms import StudentForm


def home(request):
    """Home view showing brief statistics and navigation."""
    total_students = Student.objects.count()
    paid_students = Student.objects.filter(fees_status='Paid').count()
    pending_students = Student.objects.filter(fees_status='Pending').count()
    
    context = {
        'total_students': total_students,
        'paid_students': paid_students,
        'pending_students': pending_students,
    }
    return render(request, 'students/home.html', context)


def student_list(request):
    """View to list all students retrieved from SQLite database."""
    students = Student.objects.all().order_by('-id')
    return render(request, 'students/student_list.html', {'students': students})


def student_detail(request, pk):
    """View to display detailed profile of a single student."""
    student = get_object_or_404(Student, pk=pk)
    return render(request, 'students/student_detail.html', {'student': student})


def add_student(request):
    """View to handle adding a new student record."""
    if request.method == 'POST':
        form = StudentForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('student_list')
    else:
        form = StudentForm()
    return render(request, 'students/student_form.html', {'form': form, 'title': 'Add New Student'})


def edit_student(request, pk):
    """View to handle editing an existing student record."""
    student = get_object_or_404(Student, pk=pk)
    if request.method == 'POST':
        form = StudentForm(request.POST, instance=student)
        if form.is_valid():
            form.save()
            return redirect('student_detail', pk=student.pk)
    else:
        form = StudentForm(instance=student)
    return render(request, 'students/student_form.html', {'form': form, 'title': 'Edit Student', 'student': student})


def delete_student(request, pk):
    """View to confirm and delete a student record."""
    student = get_object_or_404(Student, pk=pk)
    if request.method == 'POST':
        student.delete()
        return redirect('student_list')
    return render(request, 'students/student_confirm_delete.html', {'student': student})
