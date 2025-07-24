
'use client';
import { orderEntity } from '@/core/entities/order.entity';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // For page refresh
import { OrderApiRepository } from '@/infrastructure/frontend/repositories/OrderRepository.api';
import { OrderUseCase } from '@/core/usecases/Order.usecase';
import { PrismaUserRepository } from "@/core/repositories/IUserRepository"
import { CartRepository } from "@/core/repositories/ICartRepository"
import { ProductRepository } from "@/core/repositories/IProductRepository"
import toast from 'react-hot-toast';
interface OrdersListTableProps {
  order: orderEntity[];
}

export default function OrderListTable({ order }: OrdersListTableProps) {
    const router = useRouter();
    const orderRepository = new OrderApiRepository();
    const userRepository= new PrismaUserRepository();
    const cartRepository = new CartRepository();
    const productRepository = new ProductRepository()
  const DeleteOrderUseCase = new OrderUseCase(orderRepository,cartRepository,userRepository,productRepository);

  const handleDelete = async (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete the order "${orderId}"? This action cannot be undone.`)) {
      try {
        await DeleteOrderUseCase.deleteOrder(orderId);
        toast.success("order deleted successfully"); 
        router.refresh(); // Refresh the page to show updated list
      } catch (error) {
        toast.error(" error during delete the order");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PaymentMethod</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {order.map((order) => {

            return (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[100px]">{order.items.map((item)=>item.id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[100px]">{order.items.map((item)=>item.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.items.map((item, index) => ( 
                    <div key={item.id || index} className="mb-2 last:mb-0"> 
                    {item.productVariation &&
                    item.productVariation.images && 
                    item.productVariation.images.length > 0 ? ( 
                        <img
                        src={item.productVariation.images[0].url} 
                        alt={item.productVariation.id ? `${item.productVariation.id} image` : 'Product image'} 
                        className="h-10 w-10 object-cover rounded"
                        />
                    ) : (
                    
                        <span>No Image</span>
                    )}
                    </div>
                ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{order.paymentMethod}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{order.contactInfo.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{order.contactInfo.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/sxs_admin/products/${order.id}/edit`}>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
