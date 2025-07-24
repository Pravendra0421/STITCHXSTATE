import React from "react"
import { OrderRepository } from "@/core/repositories/IOrderRepository"
import { PrismaUserRepository } from "@/core/repositories/IUserRepository"
import { CartRepository } from "@/core/repositories/ICartRepository"
import { ProductRepository } from "@/core/repositories/IProductRepository"
import { OrderUseCase } from "@/core/usecases/Order.usecase"
import OrderListTable from "./(_component)/orderListTable"
import { orderEntity } from "@/core/entities/order.entity"

const page = async () => {
    const orderRepository= new OrderRepository();
    const userRepository= new PrismaUserRepository();
    const cartRepository = new CartRepository();
    const productRepository = new ProductRepository()
    const orderUsecase=new OrderUseCase(orderRepository,cartRepository,userRepository,productRepository);
    let order:orderEntity[]=[];
    try {
        order = await orderUsecase.getAllOrders()
    } catch (error) {
        error =  'Failed to load order.';
    }
  return (
    <div>
        <OrderListTable order={order}/>
    </div>
  )
}

export default page