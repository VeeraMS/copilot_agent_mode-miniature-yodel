import { Link } from 'react-router-dom';
import { useCart, CartItem } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';

const FREE_SHIPPING_THRESHOLD = 100;

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, shipping, total, itemCount } = useCart();
  const { darkMode } = useTheme();

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto text-center py-16">
          {/* Basket icon for empty state */}
          <svg
            className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-6`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9h18M9 9V6a3 3 0 016 0v3M5 9l1 11h12l1-11H5z"
            />
          </svg>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Your cart is empty</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
            Looks like you haven't added any items yet.
          </p>
          <Link
            to="/products"
            className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
          Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>

        {/* Free Shipping Progress Bar */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 mb-6 transition-colors duration-300`}>
          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <span className="text-primary font-medium">✓ You've qualified for free shipping!</span>
            ) : (
              <>You're <span className="font-semibold">${amountToFreeShipping.toFixed(2)}</span> away from free shipping!</>
            )}
          </p>
        </div>

        {/* Cart Table — desktop */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden mb-6 transition-colors duration-300`}>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'} text-sm uppercase tracking-wide`}>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-right">Unit Price</th>
                  <th className="px-6 py-3 text-center">Quantity</th>
                  <th className="px-6 py-3 text-right">Subtotal</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: CartItem, index: number) => {
                  const effectivePrice = item.discount
                    ? item.price * (1 - item.discount)
                    : item.price;
                  const rowBg = index % 2 === 0
                    ? (darkMode ? 'bg-gray-800' : 'bg-white')
                    : (darkMode ? 'bg-gray-700' : 'bg-gray-50');

                  return (
                    <tr key={item.productId} className={`${rowBg} border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} transition-colors duration-300`}>
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <img
                              src={`/${item.imgName}`}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="px-6 py-4 text-right">
                        {item.discount ? (
                          <div className="flex flex-col items-end">
                            <span className="text-gray-500 line-through text-xs">${item.price.toFixed(2)}</span>
                            <span className="text-primary font-semibold">${effectivePrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-primary font-semibold">${effectivePrice.toFixed(2)}</span>
                        )}
                      </td>

                      {/* Quantity Stepper */}
                      <td className="px-6 py-4">
                        <div className={`flex items-center justify-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 w-fit mx-auto transition-colors duration-300`}>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className={`w-7 h-7 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[1.5rem] text-center text-sm`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className={`w-7 h-7 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className={`px-6 py-4 text-right font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                        ${(effectivePrice * item.quantity).toFixed(2)}
                      </td>

                      {/* Remove */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className={`p-1.5 rounded ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'} transition-colors`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card-stack layout */}
          <div className={`md:hidden divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {items.map((item: CartItem, index: number) => {
              const effectivePrice = item.discount
                ? item.price * (1 - item.discount)
                : item.price;
              const cardBg = index % 2 === 0
                ? (darkMode ? 'bg-gray-800' : 'bg-white')
                : (darkMode ? 'bg-gray-700' : 'bg-gray-50');

              return (
                <div key={item.productId} className={`${cardBg} p-4 transition-colors duration-300`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <img
                        src={`/${item.imgName}`}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} flex-grow`}>
                      {item.name}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className={`p-1.5 rounded ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className={`grid grid-cols-2 gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Unit Price</span>
                    <span className="text-right">
                      {item.discount ? (
                        <span>
                          <span className="line-through text-gray-500 mr-1">${item.price.toFixed(2)}</span>
                          <span className="text-primary font-semibold">${effectivePrice.toFixed(2)}</span>
                        </span>
                      ) : (
                        <span className="text-primary font-semibold">${effectivePrice.toFixed(2)}</span>
                      )}
                    </span>
                    <span>Quantity</span>
                    <div className="flex justify-end">
                      <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-0.5`}>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className={`w-6 h-6 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[1.25rem] text-center text-sm`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className={`w-6 h-6 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span>Subtotal</span>
                    <span className={`text-right font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      ${(effectivePrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Order Summary</h2>

          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 space-y-3`}>
            <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Shipping</span>
              {shipping === 0 ? (
                <span className="text-primary font-medium">Free</span>
              ) : (
                <span>${shipping.toFixed(2)}</span>
              )}
            </div>

            <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Tax</span>
              <span>$0.00</span>
            </div>

            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
              <div className={`flex justify-between font-bold text-lg ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 gap-4">
            <button
              onClick={clearCart}
              className={`px-5 py-2.5 rounded-lg border font-medium transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              Clear Cart
            </button>
            <button className="bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
              Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/products"
              className={`text-sm ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-500 hover:text-primary'} transition-colors`}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
