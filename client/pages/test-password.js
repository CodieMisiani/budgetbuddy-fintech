
'use client';
import { useState } from 'react';
import PasswordInput from '../components/PasswordInput';

export default function TestPassword() {
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Password Input Test
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Password length:</span> {password.length}
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-medium">Current value:</span> {password || '(empty)'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
