// src/components/checkout/CheckoutForm.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form'; 
import { PaymentMethodType } from '@/core/dtos/Order.dto';
import { CreateOrderDto } from '@/core/dtos/Order.dto';
type CheckoutFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string; // Optional field
    city: string;
    state: string;
    postalCode: string;
    country: string;
    paymentMethod: PaymentMethodType;
};

interface CheckoutFormProps {
    onSubmit: (data: Omit<CreateOrderDto, 'cartId'>) => void;
    isProcessing: boolean;
    checkoutError: string | null;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isProcessing, checkoutError }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
        defaultValues: {
            paymentMethod: 'COD'
        }
    });

    const handleFormSubmission = (data: CheckoutFormValues) => {
        const payload: Omit<CreateOrderDto, 'cartId'> = {
            userId: '', // Placeholder, should be set by parent or context
            items: [], // Placeholder, should be set by parent or context
            shippingAddress: {
                firstName: data.firstName,
                lastName: data.lastName,
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country,
            },
            contactInfo: {
                email: data.email,
                phone: data.phone,
            },
            paymentMethod: data.paymentMethod,
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmission)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping & Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: 'Invalid email address'
                        }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    id="phone"
                    type="tel"
                    {...register('phone', {
                        required: 'Phone number is required',
                        minLength: {
                            value: 10,
                            message: 'Phone number must be at least 10 digits'
                        }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div>
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input
                    id="address1"
                    type="text"
                    {...register('address1', { required: 'Address is required', minLength: { value: 5, message: 'Address must be at least 5 characters' } })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.address1 && <p className="mt-1 text-sm text-red-600">{errors.address1.message}</p>}
            </div>

            <div>
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                <input
                    id="address2"
                    type="text"
                    {...register('address2')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                        id="city"
                        type="text"
                        {...register('city', { required: 'City is required', minLength: { value: 2, message: 'City must be at least 2 characters' } })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                </div>
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                    <input
                        id="state"
                        type="text"
                        {...register('state', { required: 'State is required', minLength: { value: 2, message: 'State must be at least 2 characters' } })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                </div>
                <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                        id="postalCode"
                        type="text"
                        {...register('postalCode', { required: 'Postal code is required', minLength: { value: 5, message: 'Postal code must be at least 5 characters' } })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input
                    id="country"
                    type="text"
                    {...register('country', { required: 'Country is required', minLength: { value: 2, message: 'Country must be at least 2 characters' } })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
            </div>

            {/* Payment Method Selection - Now with <select> */}
            <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                    id="paymentMethod"
                    {...register('paymentMethod', { required: 'Please select a payment method' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select a payment method</option> {/* Optional: A default, disabled option */}
                    <option value="Stripe">Credit Card (Stripe)</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="UPI">UPI</option>
                </select>
                {errors.paymentMethod && <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>}
            </div>

            {checkoutError && (
                <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 my-4 rounded-md">
                    <p className="font-bold">Error:</p>
                    <p>{checkoutError}</p>
                </div>
            )}

            <Button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold text-lg hover:bg-gray-700 transition-colors duration-300"
                disabled={isProcessing}
            >
                {isProcessing ? 'Processing Order...' : 'Complete Order'}
            </Button>
        </form>
    );
};

export default CheckoutForm;