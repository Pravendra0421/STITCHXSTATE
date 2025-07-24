// src/app/sxs_admin/(_component)/Dashboard.tsx
'use client'
import React from 'react';
import { FaUsers, FaOpencart, FaMoneyBillWave, FaShoppingCart, FaChartLine, FaBoxOpen, FaClipboardList, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { DashboardDto, GrowthDataPoint } from '@/core/dtos/Dashboard.dto';
import { IconType } from "react-icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Interface remains the same
interface DashboardProps {
  dashboardData: DashboardDto;
}

// Icon Map remains the same (important for dynamic icon selection)
const iconMap: { [key: string]: IconType } = {
  totalUsers: FaUsers,
  totalProducts: AiFillProduct,
  totalcategories: MdOutlineCategory,
  totalOrders: FaOpencart,
  totalSales: FaMoneyBillWave,
  totalPurchase: FaShoppingCart,
  averageOrderValue: FaChartLine,
  revenueGrowthUp: FaArrowUp,
  revenueGrowthDown: FaArrowDown,
  orderGrowthUp: FaArrowUp,
  orderGrowthDown: FaArrowDown,
};

const dashboardSummaryConfig = [
  { id: 'totalUsers', title: 'Total Customers', iconKey: 'totalUsers' },
  { id: 'totalProducts', title: 'Total Products', iconKey: 'totalProducts' },
  { id: 'totalcategories', title: 'Total Categories', iconKey: 'totalcategories' },
  { id: 'totalOrders', title: 'Total Orders', iconKey: 'totalOrders' },
  { id: 'totalSales', title: 'Total Sales', iconKey: 'totalSales', format: (val: number) => `₹${val.toLocaleString()}` },
  { id: 'totalPurchase', title: 'Total Purchase', iconKey: 'totalPurchase', format: (val: number) => `${val.toLocaleString()}` },
  { id: 'averageOrderValue', title: 'Avg. Order Value', iconKey: 'averageOrderValue', format: (val: number) => `₹${val.toFixed(2)}` },
  
];
// ---

const Dashboard = ({ dashboardData }: DashboardProps) => {
  if (!dashboardData) {
    return (
      <div className='bg-gray-100 min-h-screen flex items-center justify-center '>
        <p className='text-gray-600'>Loading data or no dashboard data available.</p>
      </div>
    );
  }
  const growthChartData: GrowthDataPoint[] = dashboardData.growthHistory || [];

  return (
   
      <div className='w-full '>
        <h1 className='text-gray-800 font-bold text-4xl mb-6'>Dashboard</h1>

        {/* Summary Cards Section */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
          {dashboardSummaryConfig.map((config) => {
            let value: number | string;
            const IconComponent = iconMap[config.iconKey];
            let colorClass: string | undefined;
                value = (dashboardData as any)[config.id];
                if (config.format) {
                    value = config.format(value as number);
                }

            return (
              <div
                key={config.id}
                className='bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center border border-gray-200'
              >
                {IconComponent && <IconComponent className='w-12 h-12 text-blue-500 mb-4' />}
                <h2 className='text-lg font-semibold text-gray-700 mb-2'>{config.title}</h2>
                <p className={`text-4xl font-bold ${colorClass || 'text-gray-900'}`}>{value}</p>
              </div>
            );
          })}
          
        </div>
        <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6'>
        <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
            <FaChartLine className='mr-2 text-green-500' /> Revenue & Order Growth History
        </h2>
        {growthChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={growthChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" /> 
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                </LineChart>
            </ResponsiveContainer>
        ) : (
            <p className='text-gray-500 text-center'>No historical growth data available for charts.</p>
        )}

        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Recent Orders Section */}
          <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center'><FaClipboardList className='mr-2 text-purple-500' /> Recent Orders</h2>
            {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Order ID</th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Customer</th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Amount</th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {dashboardData.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>{order.id.slice(0, 8)}...</td>
                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-600'>{order.customerName}</td>
                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-600'>{order.totalAmount.toFixed(2)}</td>
                        <td className='px-4 py-2 whitespace-nowrap text-sm'>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-600'>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-gray-500 text-center'>No recent orders to display.</p>
            )}
          </div>

          {/* Stock Alerts Section */}
          <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center'><FaBoxOpen className='mr-2 text-orange-500' /> Stock Alerts</h2>
            {dashboardData.stockAlerts && dashboardData.stockAlerts.length > 0 ? (
              <ul className='divide-y divide-gray-200'>
                {dashboardData.stockAlerts.map((product) => (
                  <li key={product.id} className='py-3 flex justify-between items-center'>
                    <span className='text-gray-700 font-medium'>{product.id.slice(0, 8)}...</span>
                    <span className='text-red-500 font-semibold'>Low Stock: {product.stock}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500 text-center'>No stock alerts at the moment.</p>
            )}
          </div>

          {/* Top Products Section */}
          <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center'><AiFillProduct className='mr-2 text-green-500' /> Top Products</h2>
            {dashboardData.topProducts && dashboardData.topProducts.length > 0 ? (
              <ul className='divide-y divide-gray-200'>
                {dashboardData.topProducts.map((product) => (
                  <li key={product.id} className='py-3 flex justify-between items-center'>
                    <span className='text-gray-700 font-medium'>{product.name}</span>
                    <span className='text-blue-600 font-semibold'>₹{product.totalRevenue.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500 text-center'>No top products to display.</p>
            )}
          </div>

          {/* Order Status Breakdown Section */}
          <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center'><FaOpencart className='mr-2 text-pink-500' /> Order Status Breakdown</h2>
            {dashboardData.orderStatusBreakdown && Object.keys(dashboardData.orderStatusBreakdown).length > 0 ? (
              <ul className='divide-y divide-gray-200'>
                {Object.entries(dashboardData.orderStatusBreakdown).map(([status, count]) => (
                  <li key={status} className='py-3 flex justify-between items-center'>
                    <span className='text-gray-700 font-medium'>{status}</span>
                    <span className='text-gray-900 font-semibold'>{count} Orders</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500 text-center'>No order status breakdown available.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;