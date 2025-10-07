"use client";

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';

const AboutDebug = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAboutData = async () => {
      try {
        console.log('🔍 Testing About data from Sanity...');
        
        // Test 1: Basic connection
        const allAbout = await client.fetch('*[_type == "about"]');
        console.log('📊 All About documents:', allAbout);
        
        // Test 2: Active About
        const activeAbout = await client.fetch('*[_type == "about" && isActive == true]');
        console.log('📊 Active About documents:', activeAbout);
        
        // Test 3: Single active About
        const singleAbout = await client.fetch('*[_type == "about" && isActive == true][0]');
        console.log('📊 Single About document:', singleAbout);
        
        // Test 4: Fallback query
        const fallbackAbout = await client.fetch('*[_type == "about"][0]');
        console.log('📊 Fallback About document:', fallbackAbout);
        
        setDebugInfo({
          allAbout,
          activeAbout,
          singleAbout,
          fallbackAbout,
          totalCount: allAbout.length,
          activeCount: activeAbout.length,
        });
        
      } catch (error) {
        console.error('❌ Error testing About data:', error);
        setDebugInfo({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    testAboutData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg m-4">
        <h3 className="text-lg font-bold mb-2">🔍 About Debug - Loading...</h3>
        <p>Testing Sanity connection...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">🔍 About Debug Information</h3>
      
      {debugInfo?.error ? (
        <div className="bg-red-900 p-3 rounded mb-4">
          <h4 className="font-bold text-red-200">❌ Error:</h4>
          <p className="text-red-100">{debugInfo.error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-900 p-3 rounded">
              <h4 className="font-bold text-blue-200">📊 Total About Documents:</h4>
              <p className="text-blue-100 text-2xl font-bold">{debugInfo?.totalCount || 0}</p>
            </div>
            <div className="bg-green-900 p-3 rounded">
              <h4 className="font-bold text-green-200">✅ Active About Documents:</h4>
              <p className="text-green-100 text-2xl font-bold">{debugInfo?.activeCount || 0}</p>
            </div>
          </div>

          {debugInfo?.singleAbout ? (
            <div className="bg-gray-700 p-3 rounded mb-4">
              <h4 className="font-bold text-gray-200 mb-2">📄 Single About Data:</h4>
              <pre className="text-xs text-gray-300 overflow-auto max-h-40">
                {JSON.stringify(debugInfo.singleAbout, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-yellow-900 p-3 rounded mb-4">
              <h4 className="font-bold text-yellow-200">⚠️ No Single About Data Found</h4>
              <p className="text-yellow-100">No active About section found in Sanity</p>
            </div>
          )}

          {debugInfo?.fallbackAbout ? (
            <div className="bg-gray-700 p-3 rounded mb-4">
              <h4 className="font-bold text-gray-200 mb-2">🔄 Fallback About Data:</h4>
              <pre className="text-xs text-gray-300 overflow-auto max-h-40">
                {JSON.stringify(debugInfo.fallbackAbout, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-red-900 p-3 rounded mb-4">
              <h4 className="font-bold text-red-200">❌ No Fallback About Data Found</h4>
              <p className="text-red-100">No About documents exist in Sanity at all</p>
            </div>
          )}

          <div className="bg-blue-900 p-3 rounded">
            <h4 className="font-bold text-blue-200 mb-2">💡 Recommendations:</h4>
            <ul className="text-blue-100 text-sm space-y-1">
              {debugInfo?.totalCount === 0 && (
                <li>• Create an About document in Sanity Studio</li>
              )}
              {debugInfo?.activeCount === 0 && debugInfo?.totalCount > 0 && (
                <li>• Set isActive to true for an About document</li>
              )}
              {debugInfo?.activeCount > 0 && (
                <li>• About data is available and should load correctly</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AboutDebug;
