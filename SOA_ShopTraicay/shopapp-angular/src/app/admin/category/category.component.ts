import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  searchForm!: FormGroup;
  editMode: boolean = false;
  viewMode: boolean = false;
  categoryForm!: FormGroup;
  editingCategoryId: number | null = null;

  page:number = 1;
  pageSize: number = 5;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.initForm();
    this.initSearchForm();
  }

  initForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      keyword: ['']
    });
  }


  fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data || [];
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.categories = [];
        if (typeof window !== 'undefined') {
          alert('Lỗi: ' + (err.error?.message || err.message || 'Không thể tải danh sách danh mục.'));
        }
      }
    });
  }

  filteredCategories(): Category[] {
    const keyword = this.searchForm.get('keyword')?.value?.trim().toLowerCase() || '';
    if (!keyword) return this.categories;
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(keyword)
    );
  }


  get pagedCategories(): Category[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredCategories().slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCategories().length / this.pageSize);
  }


  addCategory() {
    this.editMode = true;
    this.viewMode = false;
    this.editingCategoryId = null;
    this.categoryForm.reset();
  }

  editCategory(category: Category) {
    this.editMode = true;
    this.viewMode = false;
    this.editingCategoryId = category.category_id;
    this.categoryForm.setValue({
      name: category.name,
      description: category.description || ''
    });
    this.categoryForm.enable();
  }

  
  viewCategory(category: Category) {
    this.viewMode = true;
    this.editMode = false;
    this.categoryForm.setValue({
      name: category.name,
      description: category.description || ''
    });
    this.categoryForm.disable();
  }
  
  closeView() {
    this.viewMode = false;
    this.categoryForm.enable();
  }

  saveCategory() {
    if (this.categoryForm.invalid) {
      if (typeof window !== 'undefined') {
        alert('Vui lòng điền đầy đủ thông tin.');
      }
      return;
    }
    const formValue = this.categoryForm.value;
    if (this.editingCategoryId == null) {
      // Thêm mới
      this.categoryService.addCategory({
        category_id: 0,
        name: formValue.name,
        description: formValue.description
      }).subscribe({
        next: () => {
          this.fetchCategories();
          this.cancelEdit();
          if (typeof window !== 'undefined') {
            alert('Thêm danh mục thành công!');
          }
        },
        error: (err) => {
          console.error('Error adding category:', err);
          const errorMessage = err.error?.message || err.message || 'Backend không hỗ trợ thêm category. Vui lòng thêm trực tiếp trong database.';
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + errorMessage);
          }
        }
      });
    } else {
      // Sửa
      this.categoryService.updateCategory({
        category_id: this.editingCategoryId,
        name: formValue.name,
        description: formValue.description
      }).subscribe({
        next: () => {
          this.fetchCategories();
          this.cancelEdit();
          if (typeof window !== 'undefined') {
            alert('Cập nhật danh mục thành công!');
          }
        },
        error: (err) => {
          console.error('Error updating category:', err);
          const errorMessage = err.error?.message || err.message || 'Backend không hỗ trợ cập nhật category.';
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + errorMessage);
          }
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (!id) {
      if (typeof window !== 'undefined') {
        alert('ID danh mục không hợp lệ');
      }
      return;
    }

    if (typeof window !== 'undefined' && confirm('Bạn có chắc muốn xóa danh mục này?')) {
      console.log('Deleting category ID:', id);
      this.categoryService.deleteCategory(id).subscribe({
        next: (response) => {
          console.log('Delete category success:', response);
          this.fetchCategories();
          if (typeof window !== 'undefined') {
            alert('Xóa danh mục thành công!');
          }
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          console.error('Error details:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            errorBody: err.error
          });
          
          const errorMessage = err.error?.message || err.message || 'Không thể xóa danh mục.';
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + errorMessage);
          }
        }
      });
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.editingCategoryId = null;
    this.categoryForm.reset();
  }
}