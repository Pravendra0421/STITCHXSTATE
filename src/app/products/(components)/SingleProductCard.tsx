'use client'
import React, { useEffect, useMemo, useState } from 'react';

import { ProductEntity,ProductImageEntity,ProductVariationEntity, GalleryImageEntity } from '@/core/entities/product.entity';
import { Button } from '@/components/ui/button';
import ShippingInfo from './ShippingInfo';
import { PlayIcon } from '@heroicons/react/24/outline';
import CartSidebar from '@/components/cart/CartSidebar';
import { useCartStore } from '@/hooks/useCart';
import { AddToCartDTO } from '@/core/dtos/Cart.dto';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { OrderApiRepository } from '@/infrastructure/frontend/repositories/OrderRepository.api';
import { AddressEntity, ContactInfoEntity } from '@/core/entities/order.entity';
import { PaymentMethodType } from '@/core/dtos/Order.dto';
interface SingleProductCardProps {
  product: ProductEntity;
}

interface VideoThumbnailData extends ProductImageEntity {
  id: 'product-video';
  videoUrl: string;
}

type ThumbnailDataType = ProductImageEntity | GalleryImageEntity | VideoThumbnailData;

type MainContentType = {
    type: 'image' | 'video';
    data: ThumbnailDataType;
} | null;


const SingleProductCard: React.FC<SingleProductCardProps> = ({ product}) => {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariationEntity | null>(
    product.variations && product.variations.length > 0 ? product.variations[0] : null
  );
  const [isSidebar,setISSidebarOpen]=useState(false);
  const { addToCart, getCart, cart } = useCartStore();
  const router=useRouter()
  const orderApi=useMemo(()=>new OrderApiRepository(),[]);
  const videoPosterImageUrl = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages[0].url
    : "https://placehold.co/600x600/cccccc/ffffff?text=Video+Thumbnail";


  const initialMainContent: MainContentType = (() => {
    if (selectedVariation && selectedVariation.images.length > 0) {
      return { type: 'image', data: selectedVariation.images[0] };
    }
    if (product.thumbnailVideo) {
      return {
        type: 'video',
        data: {
          id: 'product-video',
          url: videoPosterImageUrl,
          videoUrl: product.thumbnailVideo
        } as VideoThumbnailData
      };
    }
    return null;
  })();

  const [mainContent, setMainContent] = useState<MainContentType>(initialMainContent);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);
  useEffect(() => {
  const fetchUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };
  fetchUser();
}, []);
  useEffect(() => {
    if (isSidebar && !cart) { // Fetch cart if sidebar is open and cart is null
      getCart();
    }
  }, [isSidebar, cart, getCart]);

  const handleVariationChange = (variation: ProductVariationEntity) => {
    setSelectedVariation(variation);
    if (variation.images.length > 0) {
      setMainContent({ type: 'image', data: variation.images[0] });
    } else if (product.thumbnailVideo) {
      setMainContent({
        type: 'video',
        data: {
          id: 'product-video',
          url: videoPosterImageUrl,
          videoUrl: product.thumbnailVideo
        } as VideoThumbnailData
      });
    } else {
      setMainContent(null);
    }
  };

  const handleThumbnailClick = (image: ProductImageEntity | GalleryImageEntity) => {
    setMainContent({ type: 'image', data: image });
  };

  const handleVideoThumbnailClick = (videoThumbnailData: VideoThumbnailData) => {
    setMainContent({ type: 'video', data: videoThumbnailData });
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg shadow-md m-4">
        <p className="text-gray-600 text-lg">Product data is not available.</p>
      </div>
    );
  }

  const hasMultipleSizes = new Set(product.variations?.map(v => v.size)).size > 1;
  const sizes = Array.from(new Set(product.variations?.map(v => v.size))).sort();

  const colorsForSelectedSize = selectedVariation
    ? Array.from(new Set(product.variations?.filter(v => v.size === selectedVariation.size).map(v => v.color)))
    : [];
  const hasMultipleColors = colorsForSelectedSize.length > 1;

  const handleAddToCart = async() => {
    if(!selectedVariation || !isInStock) return;
    if(!currentUser){
      router.push('/login/request-otp')
      return
    }
    const dto:AddToCartDTO={
      productVariationId:selectedVariation.id,
      quantity:1
    };
    try{
      await addToCart(dto);
      setISSidebarOpen(true);
    }catch(err){
      console.error('failed to add to cart :',err);
    }
  };
  const handleBuyNow = async() => {
    if (!selectedVariation) {
            alert('Please select a product variation (e.g., size or color) before buying now.');
            return;
      }
      console.log("selectedvariationId:",selectedVariation.id)
      const priceToUse = selectedVariation.salePrice && selectedVariation.salePrice > 0
      ? selectedVariation.salePrice
      : selectedVariation.price;
      console.log("Price to use",priceToUse);
      const imageUrl = selectedVariation.images && selectedVariation.images.length > 0
        ? selectedVariation.images[0].url
        : 'https://placehold.co/100x100'; 
      const productName = product.name; // Product name will be from the main product
      const size = selectedVariation.size || 'N/A';
      const color = selectedVariation.color || 'N/A';
    if(!currentUser){
      router.push('/login/request-otp')
      return
    }
    const queryParams= new URLSearchParams({
      type:'buy-now',
      productVariationId:selectedVariation.id,
      quantity:'1',
      price:priceToUse.toString(),
      imageUrl:imageUrl,
      name:productName,
      size:size,
      color:color
    
    })
    router.push(`/checkout?${queryParams}`);
  };

  const showCustomMessage = (message: string) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto">
        <p class="text-lg font-semibold mb-4">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById('closeMessageBox')?.addEventListener('click', () => {
      document.body.removeChild(messageBox);
    });
  };

  const stockStatus = selectedVariation ? selectedVariation.stock : 0;
  const isLowStock = stockStatus > 0 && stockStatus <= 5;
  const isInStock = stockStatus > 0;

  const isVideoThumbnail = (thumbnail: ThumbnailDataType): thumbnail is VideoThumbnailData => {
    return (thumbnail as VideoThumbnailData).videoUrl !== undefined && thumbnail.id === 'product-video';
  };

  const allThumbnails: ThumbnailDataType[] = [
    ...(selectedVariation?.images || []),
    ...((product.galleryImages || []).filter(
      (galImage) => !(selectedVariation?.images || []).some(varImage => varImage.url === galImage.url)
    )),
    ...(product.thumbnailVideo ? [{
        id: 'product-video',
        url: videoPosterImageUrl,
        videoUrl: product.thumbnailVideo
    } as VideoThumbnailData ] : []),
  ].filter((item, index, self) =>
    index === self.findIndex((t) => {
      if (isVideoThumbnail(t) && isVideoThumbnail(item)) {
        return t.url === item.url && t.videoUrl === item.videoUrl;
      }
      if (isVideoThumbnail(t) !== isVideoThumbnail(item)) {
        return false;
      }
      return t.url === item.url;
    })
  );


  return (
    <div className='w-full bg-white mx-auto'>
        <div className="flex flex-col lg:flex-row bg-white  overflow-hidden max-w-6xl mx-auto my-8 font-inter">
      {/* Image/Video Gallery */}
      <div className="w-full lg:w-1/2 flex flex-col md:flex-row p-4 items-center">
        {/* Thumbnails */}
        <div className="flex flex-row md:flex-col gap-3 p-2 border-r-0 md:border-r border-gray-200">
          {allThumbnails.map((thumbnail) => {
            // Determine if the current thumbnail is the active one
            let isActiveThumbnail = false;
            if (mainContent) {
              if (isVideoThumbnail(thumbnail) && isVideoThumbnail(mainContent.data)) {
                // Both are video thumbnails, compare URL and video URL
                isActiveThumbnail = thumbnail.url === mainContent.data.url && thumbnail.videoUrl === mainContent.data.videoUrl;
              } else if (!isVideoThumbnail(thumbnail) && !isVideoThumbnail(mainContent.data)) {
                isActiveThumbnail = thumbnail.url === mainContent.data.url;
              }
            }

            return (
              <div
                key={thumbnail.id}
                className={`w-20 h-20 relative rounded-md overflow-hidden cursor-pointer shadow-sm
                  ${isActiveThumbnail ? 'border-2 border-blue-500' : 'border border-gray-200'}
                  ${isVideoThumbnail(thumbnail) ? 'relative' : ''}`}
                onClick={() => isVideoThumbnail(thumbnail) ? handleVideoThumbnailClick(thumbnail) : handleThumbnailClick(thumbnail)}
              >
                <img
                  src={thumbnail.url}
                  alt={`Thumbnail of ${product.name}${isVideoThumbnail(thumbnail) ? ' Video' : ''}`}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/80x80/cccccc/ffffff?text=Image+Error`;
                  }}
                />
                {isVideoThumbnail(thumbnail) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                    <PlayIcon className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Image/Video Display */}
        <div className="flex-grow p-4 flex justify-center items-center w-full aspect-square">
          {mainContent?.type === 'image' && mainContent.data ? (
            <div className="relative w-full h-full">
              <img
                src={mainContent.data.url}
                alt={`${product.name} - Main Image`}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/600x600/cccccc/ffffff?text=Image+Error`;
                }}
              />
            </div>
          ) : mainContent?.type === 'video' && isVideoThumbnail(mainContent.data) && mainContent.data.videoUrl ? (
            <div className="relative w-full h-full bg-black rounded-lg flex items-center justify-center">
              <video
                controls
                autoPlay
                src={mainContent.data.videoUrl}
                poster={mainContent.data.url}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  console.error('Video error:', e);
                  e.currentTarget.parentNode?.querySelector('.video-error-message')?.remove();
                  const errorMessage = document.createElement('div');
                  errorMessage.className = 'absolute inset-0 flex items-center justify-center text-red-400 bg-black bg-opacity-75 rounded-lg video-error-message';
                  errorMessage.innerText = 'Video failed to load.';
                  e.currentTarget.parentNode?.appendChild(errorMessage);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Media Available
            </div>
          )}
        </div>
      </div>

      {/* Product Details (rest of your component remains the same) */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold  text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-start  text-gray-700 mb-4">
            {selectedVariation && (
              <>
                {selectedVariation.salePrice && selectedVariation.salePrice > 0 ? (
                  <span className="text-red-600">Rs. {selectedVariation.salePrice.toFixed(2)}</span>
                ) : (
                  <span>Rs. {selectedVariation.price.toFixed(2)}</span>
                )}
              </>
            )}
          </p>
            <div className="w-full border-t border-gray-300"></div>
          {hasMultipleSizes && (
            <div className="mb-4">
              <h2 className="text-md uppercase font-semibold text-gray-700 mb-2">SIZE</h2>
              <div className="flex space-x-2">
                {sizes.map(size => (
                  <Button
                    key={size}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200
                      ${selectedVariation?.size === size
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-black hover:text-white border-gray-300 hover:border-gray-500'
                      }`}
                    onClick={() => {
                      const newVar = product.variations?.find(v => v.size === size && v.color === selectedVariation?.color) ||
                                     product.variations?.find(v => v.size === size);
                      if (newVar) handleVariationChange(newVar);
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {hasMultipleColors && (
            <div className="mb-4">
              <h2 className="text-md uppercase font-semibold text-gray-700 mb-2">COLOR</h2>
              <div className="flex space-x-2">
                {colorsForSelectedSize.map(color => (
                  <Button
                    key={color}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200
                      ${selectedVariation?.color === color
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-black hover:text-white border-gray-300 hover:border-gray-500'
                      }`}
                    onClick={() => {
                      const newVar = product.variations?.find(v => v.size === selectedVariation?.size && v.color === color);
                      if (newVar) handleVariationChange(newVar);
                    }}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {!hasMultipleColors && selectedVariation?.color && (
            <div className="mb-4">
              <h2 className="text-md uppercase font-semibold text-gray-700 mb-2">COLOR</h2>
              <span className="px-4 py-2 border rounded-md text-sm font-medium bg-gray-900 text-white border-gray-900">
                {selectedVariation.color}
              </span>
            </div>
          )}
          <div className="mb-6 text-gray-600 text-sm">
            <p className="mb-1 flex items-center">
              <span className="mr-2">🌍</span> Free worldwide shipping
            </p>
            {isInStock ? (
              <p className={`flex items-center ${isLowStock ? 'text-red-500' : 'text-green-600'}`}>
                <span className="mr-2">{isLowStock ? '⚠️' : '✅'}</span>
                {isLowStock ? `Low stock - ${stockStatus} items left` : 'In stock, ready to ship'}
              </p>
            ) : (
              <p className="flex items-center text-red-500">
                <span className="mr-2">🚫</span> Out of stock
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-3 mb-6">
            <Button
              className="w-full bg-gray-900 text-white py-5 px-6 rounded-md font-semibold text-lg hover:bg-gray-700 transition-colors duration-300 shadow-md"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              ADD TO CART
            </Button>
            <Button
              className="w-full border border-gray-900 text-white  hover:text-black py-5 px-6 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-md"
              onClick={handleBuyNow}
              disabled={!isInStock}
            >
              BUY IT NOW
            </Button>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            This is a demonstration store.
          </p>
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>
        </div>
      <ShippingInfo/>
      </div>
    </div>
    <CartSidebar isOpen={isSidebar} onClose={() => setISSidebarOpen(false)} />
    </div>
  );
};
export default SingleProductCard;