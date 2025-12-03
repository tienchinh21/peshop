export interface Category {
  id: string;
  name: string;
  type: string;
}

export interface CategoryResponse {
  error: string | null;
  content: Category[];
}

export interface CategoryChild {
  id: string;
  name: string;
  description: string | null;
}

export interface CategoryChildResponse {
  error: string | null;
  content: {
    category: Category;
    templateCategories: Category[];
    categoryChildren: CategoryChild[];
  };
}

// ============ Category Template Types ============
export interface AttributeTemplate {
  id: number;
  name: string;
}

export interface TemplateCategory {
  id: number;
  name: string;
  attributeTemplates: AttributeTemplate[];
}

export interface TemplateCategoryChild {
  id: number;
  name: string;
  attributeTemplates: AttributeTemplate[];
}

export interface CategoryTemplate {
  id: string;
  name: string;
  description: string;
  templateCategories: TemplateCategory[];
  templateCategoryChildren: TemplateCategoryChild[];
}

export interface CategoryTemplateResponse {
  error: string | null;
  content: CategoryTemplate;
}
