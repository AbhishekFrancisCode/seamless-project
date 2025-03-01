from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.http import HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
from django.urls import reverse_lazy
from django.views import generic, View
# from view_breadcrumbs import ListBreadcrumbMixin
# from viewflow import forms
# from django_audit import forms

from . import models

from django.contrib import messages

from .models import BranchUser
from .service import StoreService

#
# class BranchView(LoginRequiredMixin, PermissionRequiredMixin, generic.ListView):
#     permission_required = ('store.view_store',)
#     permission_denied_message = "Access not provided"
#     model = models.Branch
#     form_class = forms.BranchForm
#     template_name = 'branch_list.html'
#
#
# class BranchUserView(PermissionRequiredMixin, LoginRequiredMixin, generic.CreateView):
#     model = models.Branch
#     permission_required = ('store.add_store',)
#
#     def get(self, request, *args, **kwargs):
#         context = {'form': forms.BranchForm}
#         return render(request, template_name='form_store.html', context=context)
#
#     def post(self, request, *args, **kwargs):
#         form = forms.BranchForm(request.POST or None)
#         if form.is_valid():
#             store = form.save()
#             store.save()
#             messages.success(request, 'Form submission successful')
#             return HttpResponseRedirect(reverse_lazy('Store_create', args=[]))
#         return render(request, 'form_store.html', {'form': form})
#
#
# class StoreDetailView(LoginRequiredMixin, PermissionRequiredMixin, generic.DetailView):
#     permission_required = ('store.view_store',)
#     model = models.Branch
#     form_class = forms.BranchForm
#     template_name = 'store_detail.html'
#
#
# class StoreUpdateView(LoginRequiredMixin, PermissionRequiredMixin, generic.UpdateView):
#     model = models.Branch
#     permission_required = ('store.change_store',)
#     form_class = forms.BranchForm
#     pk_url_kwarg = "pk"
#     template_name = 'form_store.html'
#
#     def get_success_url(self):
#         return reverse_lazy('branch_list')
#
#
# class StoreSelectView(LoginRequiredMixin, View):
#     form_class = forms.BranchForm
#     template_name = 'store_select.html'
#     store_service = StoreService()
#
#     def get(self, request, *args, **kwargs):
#         branch_list = self.store_service.get_store_by_user(request.user.id)
#         return render(request, self.template_name, {'branch_list_object': branch_list})
#
#     def post(self, request, *args, **kwargs):
#         if 'branch_id' in request.POST:
#             branch_id = request.POST['branch_id']
#             branch_name = request.POST['branch_name']
#         if branch_id is not None:
#             request.session['branch_id'] = branch_id
#             request.session['branch_name'] = branch_name
#             # <process form cleaned data>
#             return HttpResponseRedirect('/')
#         return HttpResponseRedirect(reverse_lazy('store_select'))


# class DepartmentView(LoginRequiredMixin, View):
#     model = models.Department
