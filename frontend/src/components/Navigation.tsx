import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';

export default function Navigation() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { itemCount, items } = useCart();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [badgeBounce, setBadgeBounce] = useState(false);
  const prevItemCount = useRef(itemCount);
  const navigate = useNavigate();

  // Trigger bounce animation whenever item count increases
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setBadgeBounce(false);
      // Force reflow so the animation restarts
      requestAnimationFrame(() => setBadgeBounce(true));
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  const handleBadgeAnimationEnd = () => setBadgeBounce(false);

  const handleViewFullCart = () => {
    setDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <>
      <nav className={`${darkMode ? 'bg-dark/95' : 'bg-white/95'} backdrop-blur-sm fixed w-full z-50 shadow-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/copilot.png" 
                  alt="Copilot icon"
                  className="h-8 w-auto"
                />
                <div className="ml-2">
                  <span className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>OctoCAT Supply</span>
                  <span className="block text-xs text-primary">Smart Cat Tech, Powered by AI</span>
                </div>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Home</Link>
                <Link to="/products" className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Products</Link>
                <Link to="/about" className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>About us</Link>
                {isAdmin && (
                  <div className="relative">
                    <button 
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors`}
                    >
                      Admin
                      <svg 
                        className={`ml-1 h-4 w-4 transform ${adminMenuOpen ? 'rotate-180' : ''} transition-transform`}
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    {adminMenuOpen && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${darkMode ? 'bg-dark' : 'bg-white'} ring-1 ring-black ring-opacity-5 transition-colors`}>
                        <div className="py-1">
                          <Link
                            to="/admin/products"
                            className={`block px-4 py-2 text-sm ${darkMode ? 'text-light hover:bg-primary hover:text-white' : 'text-gray-700 hover:bg-primary hover:text-white'} transition-colors`}
                            onClick={() => setAdminMenuOpen(false)}
                          >
                            Manage Products
                          </Link>
                          {/* Space for other entity management links */}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Cart icon — opens slide-in drawer */}
              <button
                onClick={() => setDrawerOpen(true)}
                className={`relative p-2 ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                aria-label="Shopping cart"
              >
                {/* Filled cart SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2a1 1 0 000 2h1.22l.305 1.222A1 1 0 003 6v10a2 2 0 002 2h14a2 2 0 002-2V6a1 1 0 00-.025-.223L20.22 4H22a1 1 0 000-2H2zm2.28 4h13.44l.5 2H3.78l.5-2zM5 14v-4h14v4H5zm2 4a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                {itemCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md ${badgeBounce ? 'badge-bounce' : ''}`}
                    onAnimationEnd={handleBadgeAnimationEnd}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full focus:outline-none transition-colors"
                aria-label="Toggle dark/light mode"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              {isLoggedIn ? (
                <>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-700'} text-sm transition-colors`}>
                    {isAdmin && <span className="text-primary">(Admin) </span>}
                    Welcome!
                  </span>
                  <button 
                    onClick={logout}
                    className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-in Cart Drawer */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label="Cart preview"
      >
        {/* Drawer header */}
        <div className={`flex items-center justify-between px-4 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Your Cart {itemCount > 0 && <span className="text-primary">({itemCount})</span>}
          </h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className={`p-1 rounded ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}
            aria-label="Close cart preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer content */}
        <div className="flex-grow overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your cart is empty.</p>
          ) : (
            items.map(item => {
              const effectivePrice = item.discount ? item.price * (1 - item.discount) : item.price;
              return (
                <div key={item.productId} className={`flex items-center gap-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-2`}>
                  <div className={`w-12 h-12 flex-shrink-0 rounded overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <img src={`/${item.imgName}`} alt={item.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className={`text-sm font-medium truncate ${darkMode ? 'text-light' : 'text-gray-800'}`}>{item.name}</p>
                    <p className="text-xs text-primary font-semibold">${effectivePrice.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <span className={`text-sm font-bold flex-shrink-0 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    ${(effectivePrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer footer */}
        {items.length > 0 && (
          <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={handleViewFullCart}
              className="w-full bg-primary hover:bg-accent text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}