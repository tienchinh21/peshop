export interface UserCategory {
  id: string;
  name: string;
}

export interface UserCategoryChild {
  id: string;
  name: string;
}

export interface CategoriesResponse {
  error: string | null;
  data: {
    categories: UserCategory[];
  };
}

export interface CategoryChildrenResponse {
  error: string | null;
  data: {
    categoryChildren: UserCategoryChild[];
  };
}
