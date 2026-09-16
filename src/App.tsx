import React, { useState } from 'react';
import {
  GraduationCap,
  Home,
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  FileCode,
  Terminal,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  Monitor
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  joining_date: string;
  fees_status: 'Paid' | 'Pending';
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '+1 555-0192',
    course: 'Computer Science',
    joining_date: '2025-01-15',
    fees_status: 'Paid',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 555-0188',
    course: 'Data Science',
    joining_date: '2025-02-01',
    fees_status: 'Pending',
  },
  {
    id: 3,
    name: 'Amina Al-Mansoor',
    email: 'amina.m@example.com',
    phone: '+1 555-0144',
    course: 'Web Development',
    joining_date: '2025-02-10',
    fees_status: 'Paid',
  },
];

const CODE_FILES: Record<string, { path: string; language: string; description: string; code: string }> = {
  'models.py': {
    path: 'students/models.py',
    language: 'python',
    description: 'Defines the database schema for students using Django ORM.',
    code: `from django.db import models

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
        return f"{self.name} ({self.course})"`,
  },
  'forms.py': {
    path: 'students/forms.py',
    language: 'python',
    description: 'ModelForm that automatically generates HTML form inputs and validations.',
    code: `from django import forms
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
        }`,
  },
  'views.py': {
    path: 'students/views.py',
    language: 'python',
    description: 'Function-based views handling HTTP requests, CRUD database operations, and template rendering.',
    code: `from django.shortcuts import render, redirect, get_object_or_404
from .models import Student
from .forms import StudentForm

def home(request):
    """Home view showing statistics and overview."""
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
    """List all students from SQLite."""
    students = Student.objects.all().order_by('-id')
    return render(request, 'students/student_list.html', {'students': students})

def student_detail(request, pk):
    """Display complete details of a single student."""
    student = get_object_or_404(Student, pk=pk)
    return render(request, 'students/student_detail.html', {'student': student})

def add_student(request):
    """Add a new student using Django ModelForm."""
    if request.method == 'POST':
        form = StudentForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('student_list')
    else:
        form = StudentForm()
    return render(request, 'students/student_form.html', {'form': form, 'title': 'Add New Student'})

def edit_student(request, pk):
    """Update student record."""
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
    """Confirm and delete a student record."""
    student = get_object_or_404(Student, pk=pk)
    if request.method == 'POST':
        student.delete()
        return redirect('student_list')
    return render(request, 'students/student_confirm_delete.html', {'student': student})`,
  },
  'students/urls.py': {
    path: 'students/urls.py',
    language: 'python',
    description: 'Routes URL endpoints to views inside the students app.',
    code: `from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('students/', views.student_list, name='student_list'),
    path('students/add/', views.add_student, name='add_student'),
    path('students/<int:pk>/', views.student_detail, name='student_detail'),
    path('students/<int:pk>/edit/', views.edit_student, name='edit_student'),
    path('students/<int:pk>/delete/', views.delete_student, name='delete_student'),
]`,
  },
  'student_management/urls.py': {
    path: 'student_management/urls.py',
    language: 'python',
    description: 'Root project URL routing table that includes students app URLs.',
    code: `from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('students.urls')),
]`,
  },
  'settings.py': {
    path: 'student_management/settings.py',
    language: 'python',
    description: 'Project configuration: installed apps, templates, SQLite database, static files.',
    code: `INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Custom Application
    'students',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

STATIC_URL = 'static/'`,
  },
  'base.html': {
    path: 'students/templates/students/base.html',
    language: 'html',
    description: 'Main parent template inherited by all child pages with {% block content %}.',
    code: `{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Student Management System{% endblock %}</title>
    <link rel="stylesheet" href="{% static 'students/style.css' %}">
</head>
<body>
    <nav class="navbar">
        <div class="logo">
            <a href="{% url 'home' %}">🎓 Student Management</a>
        </div>
        <ul class="nav-links">
            <li><a href="{% url 'home' %}">Home</a></li>
            <li><a href="{% url 'student_list' %}">All Students</a></li>
            <li><a href="{% url 'add_student' %}">+ Add Student</a></li>
        </ul>
    </nav>

    <main class="container">
        {% block content %}
        {% endblock %}
    </main>

    <footer>
        <p>&copy; Student Management System - Built with Python & Django</p>
    </footer>
</body>
</html>`,
  },
  'student_list.html': {
    path: 'students/templates/students/student_list.html',
    language: 'html',
    description: 'Displays the table of all students with CRUD action buttons.',
    code: `{% extends 'students/base.html' %}

{% block title %}All Students - Student Management System{% endblock %}

{% block content %}
<div class="card">
    <div class="card-header">
        <h1 class="card-title">Student Directory</h1>
        <a href="{% url 'add_student' %}" class="btn btn-success">+ Add Student</a>
    </div>

    {% if students %}
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>Joining Date</th>
                    <th>Fees Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {% for student in students %}
                <tr>
                    <td>{{ forloop.counter }}</td>
                    <td><strong>{{ student.name }}</strong></td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.phone }}</td>
                    <td>{{ student.course }}</td>
                    <td>{{ student.joining_date }}</td>
                    <td>
                        {% if student.fees_status == 'Paid' %}
                            <span class="badge badge-paid">Paid</span>
                        {% else %}
                            <span class="badge badge-pending">Pending</span>
                        {% endif %}
                    </td>
                    <td>
                        <div class="action-buttons">
                            <a href="{% url 'student_detail' student.pk %}" class="btn btn-secondary btn-sm">View</a>
                            <a href="{% url 'edit_student' student.pk %}" class="btn btn-warning btn-sm">Edit</a>
                            <a href="{% url 'delete_student' student.pk %}" class="btn btn-danger btn-sm">Delete</a>
                        </div>
                    </td>
                </tr>
                {% endfor %}
            </tbody>
        </table>
    </div>
    {% else %}
    <p>No students found. Click "+ Add Student" to create your first record!</p>
    {% endif %}
</div>
{% endblock %}`,
  },
  'student_form.html': {
    path: 'students/templates/students/student_form.html',
    language: 'html',
    description: 'HTML Form used for both Adding and Editing students, with CSRF protection.',
    code: `{% extends 'students/base.html' %}

{% block title %}{{ title }} - Student Management System{% endblock %}

{% block content %}
<div class="card" style="max-width: 650px; margin: 0 auto;">
    <div class="card-header">
        <h1 class="card-title">{{ title }}</h1>
        <a href="{% url 'student_list' %}" class="btn btn-secondary btn-sm">&larr; Back to List</a>
    </div>

    <form method="POST" novalidate>
        {% csrf_token %}

        <div class="form-group">
            <label for="{{ form.name.id_for_label }}">Full Name</label>
            {{ form.name }}
        </div>

        <div class="form-group">
            <label for="{{ form.email.id_for_label }}">Email Address</label>
            {{ form.email }}
        </div>

        <div class="form-group">
            <label for="{{ form.phone.id_for_label }}">Phone Number</label>
            {{ form.phone }}
        </div>

        <div class="form-group">
            <label for="{{ form.course.id_for_label }}">Enrolled Course</label>
            {{ form.course }}
        </div>

        <div class="form-group">
            <label for="{{ form.joining_date.id_for_label }}">Joining Date</label>
            {{ form.joining_date }}
        </div>

        <div class="form-group">
            <label for="{{ form.fees_status.id_for_label }}">Fees Status</label>
            {{ form.fees_status }}
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save Student</button>
            <a href="{% url 'student_list' %}" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>
{% endblock %}`,
  },
  'style.css': {
    path: 'students/static/students/style.css',
    language: 'css',
    description: 'Pure custom CSS styling for navbar, tables, forms, badges, and buttons without Bootstrap.',
    code: `/* Pure custom CSS (No Bootstrap) */
.navbar {
    background-color: #0f172a;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
}
.card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 2rem;
}
.badge-paid {
    background-color: #dcfce7;
    color: #15803d;
}
.badge-pending {
    background-color: #fef3c7;
    color: #b45309;
}`,
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'guide'>('preview');
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activeCodeFile, setActiveCodeFile] = useState<string>('models.py');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    course: string;
    joining_date: string;
    fees_status: 'Paid' | 'Pending';
  }>({
    name: '',
    email: '',
    phone: '',
    course: '',
    joining_date: new Date().toISOString().split('T')[0],
    fees_status: 'Pending',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navigateTo = (route: string, studentId: number | null = null) => {
    setCurrentRoute(route);
    setSelectedStudentId(studentId);
    setFormError(null);

    if (route === '/students/add/') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        joining_date: new Date().toISOString().split('T')[0],
        fees_status: 'Pending',
      });
    } else if (route.includes('/edit/') && studentId) {
      const student = students.find((s) => s.id === studentId);
      if (student) {
        setFormData({
          name: student.name,
          email: student.email,
          phone: student.phone,
          course: student.course,
          joining_date: student.joining_date,
          fees_status: student.fees_status,
        });
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.course.trim()) {
      setFormError('Please fill in all required fields (Name, Email, and Course).');
      return;
    }

    if (currentRoute === '/students/add/') {
      const newStudent: Student = {
        id: students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1,
        ...formData,
      };
      setStudents([newStudent, ...students]);
      navigateTo('/students/');
    } else if (selectedStudentId) {
      setStudents(
        students.map((s) => (s.id === selectedStudentId ? { ...s, ...formData } : s))
      );
      navigateTo(`/students/${selectedStudentId}/`, selectedStudentId);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedStudentId) {
      setStudents(students.filter((s) => s.id !== selectedStudentId));
      navigateTo('/students/');
    }
  };

  const currentStudent = students.find((s) => s.id === selectedStudentId);

  const totalStudents = students.length;
  const paidStudents = students.filter((s) => s.fees_status === 'Paid').length;
  const pendingStudents = students.filter((s) => s.fees_status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Banner with Modes */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-4 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-white leading-tight">Student Management System</h1>
            <p className="text-xs text-slate-400">Pure Python &bull; Django &bull; SQLite &bull; Django Templates</p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-sm">
          <button
            id="tab-preview-btn"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Live App Preview
          </button>
          <button
            id="tab-code-btn"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Django Project Files
          </button>
          <button
            id="tab-guide-btn"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'guide'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            PowerShell & Architecture
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* ================= MODE 1: LIVE APP PREVIEW ================= */}
        {activeTab === 'preview' && (
          <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full flex flex-col">
            {/* Simulated Browser Frame */}
            <div className="bg-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden text-slate-800 flex flex-col flex-1 min-h-[620px]">
              {/* Browser Address Bar */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                </div>
                <div className="flex-1 bg-white border border-slate-300 rounded px-3 py-1 flex items-center justify-between text-slate-700 font-mono">
                  <span>http://127.0.0.1:8000{currentRoute}</span>
                  <span className="text-[10px] uppercase font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Django Server: Running
                  </span>
                </div>
              </div>

              {/* Django Navbar (Matching base.html & style.css) */}
              <nav className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between shadow-sm">
                <div
                  onClick={() => navigateTo('/')}
                  className="text-sky-400 text-lg font-bold cursor-pointer hover:text-sky-300 transition-colors"
                >
                  🎓 Student Management
                </div>
                <ul className="flex items-center gap-5 text-sm font-medium">
                  <li>
                    <button
                      id="nav-home-btn"
                      onClick={() => navigateTo('/')}
                      className={`px-3 py-1 rounded transition-colors ${
                        currentRoute === '/'
                          ? 'text-white bg-slate-800'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      id="nav-list-btn"
                      onClick={() => navigateTo('/students/')}
                      className={`px-3 py-1 rounded transition-colors ${
                        currentRoute === '/students/'
                          ? 'text-white bg-slate-800'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      All Students
                    </button>
                  </li>
                  <li>
                    <button
                      id="nav-add-btn"
                      onClick={() => navigateTo('/students/add/')}
                      className={`px-3 py-1 rounded transition-colors ${
                        currentRoute === '/students/add/'
                          ? 'text-white bg-slate-800'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      + Add Student
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Page Content Render Area (Matching Django Templates) */}
              <div className="flex-1 p-6 md:p-8 bg-slate-50 overflow-y-auto">
                {/* 1. HOME VIEW (home.html) */}
                {currentRoute === '/' && (
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
                      <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900">
                          Welcome to Student Management System
                        </h2>
                      </div>
                      <p className="text-slate-600 mb-6">
                        This is a simple Django web application designed to manage student records,
                        track course enrollment, and monitor fee payment status using Django ORM and SQLite.
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center">
                          <h3 className="text-sm font-semibold text-slate-600">Total Students</h3>
                          <p className="text-3xl font-bold text-sky-600 mt-2">{totalStudents}</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center">
                          <h3 className="text-sm font-semibold text-slate-600">Fees Paid</h3>
                          <p className="text-3xl font-bold text-emerald-600 mt-2">{paidStudents}</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center">
                          <h3 className="text-sm font-semibold text-slate-600">Fees Pending</h3>
                          <p className="text-3xl font-bold text-amber-600 mt-2">{pendingStudents}</p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-4">
                        <button
                          id="home-view-students-btn"
                          onClick={() => navigateTo('/students/')}
                          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-sm transition-colors"
                        >
                          View Student List
                        </button>
                        <button
                          id="home-add-student-btn"
                          onClick={() => navigateTo('/students/add/')}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-sm transition-colors"
                        >
                          + Add New Student
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. STUDENT LIST VIEW (student_list.html) */}
                {currentRoute === '/students/' && (
                  <div className="max-w-5xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b-2 border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
                        <button
                          id="list-add-student-btn"
                          onClick={() => navigateTo('/students/add/')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-md shadow-sm transition-colors"
                        >
                          + Add Student
                        </button>
                      </div>

                      {students.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                                <th className="py-3 px-4">#</th>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Phone</th>
                                <th className="py-3 px-4">Course</th>
                                <th className="py-3 px-4">Joining Date</th>
                                <th className="py-3 px-4">Fees Status</th>
                                <th className="py-3 px-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                              {students.map((student, index) => (
                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-3 px-4 text-slate-500">{index + 1}</td>
                                  <td className="py-3 px-4 font-semibold text-slate-900">
                                    {student.name}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600">{student.email}</td>
                                  <td className="py-3 px-4 text-slate-600">{student.phone}</td>
                                  <td className="py-3 px-4 text-slate-700">{student.course}</td>
                                  <td className="py-3 px-4 text-slate-600">{student.joining_date}</td>
                                  <td className="py-3 px-4">
                                    {student.fees_status === 'Paid' ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                        Paid
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        id={`btn-view-${student.id}`}
                                        onClick={() =>
                                          navigateTo(`/students/${student.id}/`, student.id)
                                        }
                                        className="px-2.5 py-1 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium rounded transition-colors"
                                      >
                                        View
                                      </button>
                                      <button
                                        id={`btn-edit-${student.id}`}
                                        onClick={() =>
                                          navigateTo(`/students/${student.id}/edit/`, student.id)
                                        }
                                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition-colors"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        id={`btn-delete-${student.id}`}
                                        onClick={() =>
                                          navigateTo(`/students/${student.id}/delete/`, student.id)
                                        }
                                        className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500">
                          <p>No students found in the database.</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Click "+ Add Student" to create your first record!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. ADD / EDIT STUDENT VIEW (student_form.html) */}
                {(currentRoute === '/students/add/' || currentRoute.includes('/edit/')) && (
                  <div className="max-w-xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
                      <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900">
                          {currentRoute === '/students/add/' ? 'Add New Student' : 'Edit Student'}
                        </h2>
                        <button
                          onClick={() => navigateTo('/students/')}
                          className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          &larr; Back to List
                        </button>
                      </div>

                      {/* CSRF Token representation in template */}
                      <div className="mb-4 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-500 flex items-center justify-between">
                        <span>&#123;% csrf_token %&#125;</span>
                        <span className="text-emerald-600 font-semibold">Security Token Active</span>
                      </div>

                      {formError && (
                        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{formError}</span>
                        </div>
                      )}

                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="input-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter full name"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="input-email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter email address"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            id="input-phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter phone number"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Enrolled Course
                          </label>
                          <input
                            type="text"
                            id="input-course"
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            placeholder="Enter enrolled course (e.g. Computer Science)"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Joining Date
                          </label>
                          <input
                            type="date"
                            id="input-joining-date"
                            value={formData.joining_date}
                            onChange={(e) =>
                              setFormData({ ...formData, joining_date: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Fees Status
                          </label>
                          <select
                            id="input-fees-status"
                            value={formData.fees_status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fees_status: e.target.value as 'Paid' | 'Pending',
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-white"
                          >
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                          <button
                            type="submit"
                            id="btn-save-student"
                            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm rounded-md shadow-sm transition-colors"
                          >
                            Save Student
                          </button>
                          <button
                            type="button"
                            onClick={() => navigateTo('/students/')}
                            className="px-5 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium text-sm rounded-md shadow-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 4. STUDENT DETAIL VIEW (student_detail.html) */}
                {currentRoute.startsWith('/students/') &&
                  !currentRoute.includes('/edit/') &&
                  !currentRoute.includes('/delete/') &&
                  currentRoute !== '/students/' &&
                  currentRoute !== '/students/add/' &&
                  currentStudent && (
                    <div className="max-w-xl mx-auto">
                      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-slate-100">
                          <h2 className="text-2xl font-bold text-slate-900">Student Details</h2>
                          <button
                            onClick={() => navigateTo('/students/')}
                            className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium rounded transition-colors"
                          >
                            &larr; Back to List
                          </button>
                        </div>

                        <ul className="divide-y divide-slate-100 text-sm mb-6">
                          <li className="py-3 flex">
                            <span className="w-36 font-semibold text-slate-500">Student ID:</span>
                            <span className="text-slate-900 font-mono">#{currentStudent.id}</span>
                          </li>
                          <li className="py-3 flex">
                            <span className="w-36 font-semibold text-slate-500">Full Name:</span>
                            <span className="text-slate-900 font-bold">{currentStudent.name}</span>
                          </li>
                          <li className="py-3 flex">
                            <span className="w-36 font-semibold text-slate-500">Email:</span>
                            <span className="text-slate-700">{currentStudent.email}</span>
                          </li>
                          <li className="py-3 flex">
                            <span className="w-36 font-semibold text-slate-500">Phone:</span>
                            <span className="text-slate-700">{currentStudent.phone}</span>
                          </li>
                          <li className="py-3 flex">
                            <span className="w-36 font-semibold text-slate-500">Course:</span>
                            <span className="text-slate-700">{currentStudent.course}</span>
                          </li>
                          <li className="py-3 flex">
                            <span className="w-36 font-semibold text-slate-500">Joining Date:</span>
                            <span className="text-slate-700">{currentStudent.joining_date}</span>
                          </li>
                          <li className="py-3 flex">
                            <span className="w-36 font-semibold text-slate-500">Fees Status:</span>
                            <span>
                              {currentStudent.fees_status === 'Paid' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                  Paid
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                  Pending
                                </span>
                              )}
                            </span>
                          </li>
                        </ul>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() =>
                              navigateTo(`/students/${currentStudent.id}/edit/`, currentStudent.id)
                            }
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-md shadow-sm transition-colors"
                          >
                            Edit Information
                          </button>
                          <button
                            onClick={() =>
                              navigateTo(
                                `/students/${currentStudent.id}/delete/`,
                                currentStudent.id
                              )
                            }
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md shadow-sm transition-colors"
                          >
                            Delete Student
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                {/* 5. DELETE CONFIRMATION VIEW (student_confirm_delete.html) */}
                {currentRoute.includes('/delete/') && currentStudent && (
                  <div className="max-w-md mx-auto">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
                      <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900">Confirm Deletion</h2>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm">
                        <p className="text-red-700 font-semibold mb-2">
                          ⚠️ Warning: Are you sure you want to permanently delete this student record?
                        </p>
                        <div className="text-slate-700 space-y-1 mt-2 text-xs">
                          <p>
                            <strong>Name:</strong> {currentStudent.name}
                          </p>
                          <p>
                            <strong>Course:</strong> {currentStudent.course}
                          </p>
                          <p>
                            <strong>Email:</strong> {currentStudent.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          id="btn-confirm-delete"
                          onClick={handleDeleteConfirm}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md shadow-sm transition-colors"
                        >
                          Yes, Delete Record
                        </button>
                        <button
                          onClick={() => navigateTo('/students/')}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium text-sm rounded-md shadow-sm transition-colors"
                        >
                          No, Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulated Footer */}
              <div className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
                &copy; Student Management System - Built with Python & Django (Running on SQLite)
              </div>
            </div>
          </div>
        )}

        {/* ================= MODE 2: DJANGO CODE FILES EXPLORER ================= */}
        {activeTab === 'code' && (
          <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full flex flex-col">
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col md:flex-row flex-1 shadow-xl">
              {/* File List Sidebar */}
              <div className="w-full md:w-72 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                  Project Files Tree
                </div>
                <div className="space-y-1 font-mono text-xs">
                  {Object.keys(CODE_FILES).map((fileName) => {
                    const isSelected = activeCodeFile === fileName;
                    return (
                      <button
                        key={fileName}
                        onClick={() => setActiveCodeFile(fileName)}
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{fileName}</span>
                        {isSelected && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Code Viewer Panel */}
              <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-400 font-mono text-sm font-semibold">
                      {CODE_FILES[activeCodeFile].path}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {CODE_FILES[activeCodeFile].description}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(CODE_FILES[activeCodeFile].code, activeCodeFile)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-700 transition-colors"
                  >
                    {copiedKey === activeCodeFile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed text-slate-200">
                  <pre className="whitespace-pre">
                    <code>{CODE_FILES[activeCodeFile].code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODE 3: SETUP COMMANDS & ARCHITECTURE ================= */}
        {activeTab === 'guide' && (
          <div className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6 overflow-y-auto">
            {/* PowerShell Commands Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">
                    Windows PowerShell Setup Commands (Step-by-Step)
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wide">
                      1. Create Virtual Environment
                    </span>
                    <button
                      onClick={() => handleCopy('python -m venv venv', 'cmd1')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd1' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded font-mono text-xs text-sky-300 select-all">
                    python -m venv venv
                  </pre>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Creates an isolated Python environment folder named <code>venv</code> so your Django packages don't conflict with other projects.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wide">
                      2. Activate Virtual Environment
                    </span>
                    <button
                      onClick={() => handleCopy('.\\venv\\Scripts\\Activate.ps1', 'cmd2')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd2' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded font-mono text-xs text-sky-300 select-all">
                    .\venv\Scripts\Activate.ps1
                  </pre>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Turns on the virtual environment in PowerShell. You will see <code>(venv)</code> appear in front of your terminal prompt.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wide">
                      3. Install Django
                    </span>
                    <button
                      onClick={() => handleCopy('pip install django', 'cmd3')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd3' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded font-mono text-xs text-sky-300 select-all">
                    pip install django
                  </pre>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Downloads and installs the latest stable version of Django into your activated environment.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wide">
                      4. Create Django Project
                    </span>
                    <button
                      onClick={() => handleCopy('django-admin startproject student_management', 'cmd4')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd4' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded font-mono text-xs text-sky-300 select-all">
                    django-admin startproject student_management
                  </pre>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Creates the main project container directory containing <code>manage.py</code> and project settings.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wide">
                      5. Create Students App
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          'cd student_management\npython manage.py startapp students',
                          'cmd5'
                        )
                      }
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd5' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded font-mono text-xs text-sky-300 select-all">
                    cd student_management
                    <br />
                    python manage.py startapp students
                  </pre>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Navigates inside your project and generates the dedicated <code>students</code> application folder with models, views, and admin files.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wide">
                      6. Run Migrations
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          'python manage.py makemigrations\npython manage.py migrate',
                          'cmd6'
                        )
                      }
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd6' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded font-mono text-xs text-sky-300 select-all">
                    python manage.py makemigrations
                    <br />
                    python manage.py migrate
                  </pre>
                  <p className="text-xs text-slate-400 mt-1.5">
                    First prepares instructions for creating the <code>Student</code> table, then executes them to generate the <code>db.sqlite3</code> database.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wide">
                      7. Create Superuser (Admin)
                    </span>
                    <button
                      onClick={() => handleCopy('python manage.py createsuperuser', 'cmd7')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd7' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded font-mono text-xs text-sky-300 select-all">
                    python manage.py createsuperuser
                  </pre>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Prompts you for an admin username, email, and password to log into Django's built-in administration dashboard at <code>/admin/</code>.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wide">
                      8. Start Development Server
                    </span>
                    <button
                      onClick={() => handleCopy('python manage.py runserver', 'cmd8')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'cmd8' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded font-mono text-xs text-emerald-400 select-all font-bold">
                    python manage.py runserver
                  </pre>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Launches your local web server at <code>http://127.0.0.1:8000/</code> so you can open it in any web browser!
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
                <Layers className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg font-bold text-white">Django Request-Response Flow (MVT)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-center text-xs">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <p className="font-bold text-sky-400">1. Browser</p>
                  <p className="text-[11px] text-slate-400 mt-1">User clicks link or enters URL</p>
                </div>
                <ArrowRight className="w-4 h-4 mx-auto text-slate-600 hidden md:block" />
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <p className="font-bold text-emerald-400">2. urls.py</p>
                  <p className="text-[11px] text-slate-400 mt-1">Matches path pattern to view</p>
                </div>
                <ArrowRight className="w-4 h-4 mx-auto text-slate-600 hidden md:block" />
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <p className="font-bold text-amber-400">3. views.py</p>
                  <p className="text-[11px] text-slate-400 mt-1">Executes logic and queries ORM</p>
                </div>
                <ArrowRight className="w-4 h-4 mx-auto text-slate-600 hidden md:block" />
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <p className="font-bold text-indigo-400">4. SQLite DB</p>
                  <p className="text-[11px] text-slate-400 mt-1">Reads/writes student records</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <strong>C (Create):</strong> <code>StudentForm.save()</code>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <strong>R (Read):</strong> <code>Student.objects.all()</code>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <strong>U (Update):</strong> <code>form.save() with instance</code>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <strong>D (Delete):</strong> <code>student.delete()</code>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
