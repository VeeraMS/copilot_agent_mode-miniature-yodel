import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from './Avatar';

export default function Profile() {
  const { isLoggedIn, user } = useAuth();
  const { darkMode } = useTheme();

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} rounded-lg shadow-lg p-8 transition-colors duration-300`}>
          <div className="flex flex-col items-center mb-8">
            <Avatar initials={user.initials} size="lg" className="mb-4" />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
              {user.name}
            </h1>
          </div>
          <div className="space-y-4">
            <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg transition-colors duration-300`}>
              <p className="text-sm font-medium text-primary mb-1">Email</p>
              <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.email}</p>
            </div>
            <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg transition-colors duration-300`}>
              <p className="text-sm font-medium text-primary mb-1">Phone</p>
              <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
