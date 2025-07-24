import { ProductRepository } from "@/core/repositories/IProductRepository";
import { getProductByIdUSeCase } from "@/core/usecases/GetProductById.usecase";
import { notFound } from "next/navigation";
import UpdateProductForm from "../../(_component)/updatedProductForm";

export default async function ProductEditPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    const productIdTouse = productId;
    const productRepository = new ProductRepository();
    const getProductbyIdusecase = new getProductByIdUSeCase(productRepository);
    let initialProduct;
    try {
        initialProduct = await getProductbyIdusecase.execute(productIdTouse);
    } catch (error) {
        console.error(`Error fetching product with ID ${productIdTouse} for edit:`, error);
    }
    if (!initialProduct) {
        notFound();
    }
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl text-white font-bold mb-6">Edit Product: {initialProduct.name}</h1>
            <UpdateProductForm productId={productIdTouse} />
        </div>
    )
}