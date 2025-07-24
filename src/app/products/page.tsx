import { ProductList } from './(components)/ProductList';
import ProductGridDisplay from '../category/(component)/productGripDisplay';
import { GetAllProductsUseCase } from '@/core/usecases/GetAllProducts.usecase';
import { ProductRepository } from '@/core/repositories/IProductRepository'; 

// The Page component is now async
export default async function ProductsPage() {
  const productRepository = new ProductRepository();
  const getAllProducts = new GetAllProductsUseCase(productRepository);
  
  // Fetch the data on the server before rendering the page.
  const products = await getAllProducts.execute();
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold mb-8">Product Management</h1>
      <ProductGridDisplay products={products} />
      
    </main>
  );
}