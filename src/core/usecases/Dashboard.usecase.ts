import { DashboardDto } from "../dtos/Dashboard.dto";
import { IDashboardRepository } from "../repositories/IDashboardRepository";
export class DashboarduseCase{
    constructor(private dashboardRepository:IDashboardRepository){}
    async execute():Promise<DashboardDto>{
        const {totalSales,totalOrders} = await this.dashboardRepository.getSalesAndOrderSummary();
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        const recentOrders= await this.dashboardRepository.getRecentOrders(5);
        const topProducts = await this.dashboardRepository.getTopSellingProducts();
        const orderStatusBreakdown= await this.dashboardRepository.getOrderStatusBreakdown();
        const totalProducts= await this.dashboardRepository.getTotalProductsCount();
        const totalcategories = await this.dashboardRepository.getTotalCategoriesCount();
        const totalUsers = await this.dashboardRepository.getTotalUsersCount();
        const totalPurchase = await this.dashboardRepository.getTotalItemsSold();
        const totalGrowth=await this.dashboardRepository.getGrowthMetrics();
        const stockAlerts= await this.dashboardRepository.getLowStockAlerts(5);
         const growthHistory = await this.dashboardRepository.getHistoricalGrowthData(6);
        return{
            totalSales,
            totalOrders,
            totalPurchase,
            averageOrderValue,
            totalGrowth,
            totalUsers,
            stockAlerts,
            totalProducts,
            totalcategories,
            recentOrders,
            topProducts,
            orderStatusBreakdown,
            growthHistory,
        }
    }
}