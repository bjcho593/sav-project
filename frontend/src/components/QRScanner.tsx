import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { registerAttendance } from '../services/attendance.service';

export const QRScanner = () => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null, msg: string }>({ type: null, msg: '' });

  const handleScan = async (result: string) => {
    if (!result || status.type === 'loading') return;

    setStatus({ type: 'loading', msg: 'Verifying with academic microservices...' });

    try {
      // ID de prueba para la demo (Debe existir en tu microservicio de Enrollment)
      const testUserId = '12345'; 
      
      const response = await registerAttendance(testUserId, result);

      setStatus({ 
        type: 'success', 
        msg: `✅ SUCCESS: ${response.message}. Room: ${response.details?.room || 'Confirmed'}` 
      });
    } catch (error: any) {
      setStatus({ 
        type: 'error', 
        msg: `❌ REJECTED: ${error.message}` 
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-[400px] rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">SAV - Attendance Scanner</h2>
      
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border-4 border-blue-600 shadow-2xl">
        <Scanner 
          onScan={(detected) => handleScan(detected[0].rawValue)}
          allowMultiple={false}
        />
      </div>

      {status.msg && (
        <div className={`mt-8 p-4 w-full rounded-lg font-medium text-center animate-pulse ${
          status.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 
          status.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : 
          'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
        }`}>
          {status.msg}
        </div>
      )}
    </div>
  );
};