import { Link } from 'react-router-dom';
import { useCart, CartItem } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, shipping, total } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-50'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-xl mx-auto text-center py-20">
          <svg
            className={`mx-auto h-20 w-20 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-6`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-3`}>Your cart is empty</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-8`}>
            Looks like you haven't added any items yet.
          </p>
          <Link
            to="/products"
            className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-50'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-xl mx-auto">
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
          Shopping Cart
        </h1>

        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item: CartItem) => {
            const effectivePrice = item.discount
              ? item.price * (1 - item.discount)
              : item.price;

            return (
              <div
                key={item.productId}
                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-4 flex items-center gap-4 transition-colors duration-300`}
              >
                {/* Product Image */}
                <div className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <img
                    src={`/${item.imgName}`}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-grow min-w-0">
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} truncate transition-colors duration-300`}>
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    {item.discount ? (
                      <>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} line-through`}>${item.price.toFixed(2)}</span>
                        <span className="text-primary text-sm font-medium">${effectivePrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-primary text-sm font-medium">${item.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className={`flex items-center gap-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg px-2 py-1 transition-colors duration-300`}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className={`w-6 h-6 flex items-center justify-center text-lg leading-none ${darkMode ? 'text-gray-300 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors`}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>
                  <span className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-800'} min-w-[1.25rem] text-center`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className={`w-6 h-6 flex items-center justify-center text-lg leading-none ${darkMode ? 'text-gray-300 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors`}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>

                {/* Line Total */}
                <div className={`text-right min-w-[4rem] ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  <span className="text-sm font-bold">${(effectivePrice * item.quantity).toFixed(2)}</span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className={`text-lg leading-none ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-400'} transition-colors ml-1`}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary — inline at bottom */}
        <div className={`mt-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl border shadow-sm p-5 transition-colors duration-300`}>
          <div className="space-y-2 text-sm">
            <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Shipping</span>
              {shipping === 0 && subtotal > 0 ? (
                <span className="text-green-500 font-medium">Free</span>
              ) : (
                <span>${shipping.toFixed(2)}</span>
              )}
            </div>

            {subtotal > 0 && subtotal < 100 && (
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Add ${(100 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}

            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} pt-3 mt-3`}>
              <div className={`flex justify-between font-bold text-base ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button className="w-full mt-5 bg-primary hover:bg-accent text-white py-3 rounded-full font-medium transition-colors">
            Checkout
          </button>

          <Link
            to="/products"
            className={`block text-center mt-3 text-sm ${darkMode ? 'text-gray-500 hover:text-primary' : 'text-gray-400 hover:text-primary'} transition-colors`}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
