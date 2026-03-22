export type ProductUnit = "kg" | "szt" | "pęczek" | "l" | "opak";

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: ProductUnit;
  quantityAvailable: number;
  imageUrl?: string;
  createdAt?: string;
}

export interface Farm {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  location: string;
  coverImageUrl?: string;
  products: Product[];
}

export interface FarmProfileFormValues {
  name: string;
  description: string;
  location: string;
  coverImageUrl: string;
}

export interface ProductFormValues {
  name: string;
  price: string;
  unit: ProductUnit;
  quantityAvailable: string;
  imageUrl: string;
}

export const emptyFarmProfileForm: FarmProfileFormValues = {
  name: "",
  description: "",
  location: "",
  coverImageUrl: "",
};

export const emptyProductForm: ProductFormValues = {
  name: "",
  price: "",
  unit: "kg",
  quantityAvailable: "",
  imageUrl: "",
};