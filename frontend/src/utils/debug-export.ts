/**
 * Debug utility for CSV export issues
 */
export function debugCSVExport() {
  console.log('=== CSV Export Debug Info ===');
  
  // Check API configuration
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  console.log('📍 API Base URL:', baseURL);
  console.log('🔗 Full export URL:', `${baseURL}/leads/export/csv`);
  
  // Check if token exists
  const authStore = localStorage.getItem('auth-storage');
  if (!authStore) {
    console.error('❌ No auth storage found');
    return;
  }

  try {
    const parsed = JSON.parse(authStore);
    const hasToken = parsed.state?.token;
    console.log('✅ Auth storage exists');
    console.log('✓ Token present:', !!hasToken);
    if (hasToken) {
      console.log('✓ Token preview:', hasToken.substring(0, 30) + '...');
      console.log('✓ Token length:', hasToken.length);
      
      // Try to decode JWT payload (without verification)
      try {
        const parts = hasToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log('✓ Token payload:', payload);
          console.log('✓ Token expires:', new Date(payload.exp * 1000));
          console.log('✓ Token expired?', Date.now() > payload.exp * 1000);
        }
      } catch (e) {
        console.warn('⚠️  Could not decode token payload:', e);
      }
    }
    console.log('✓ Is authenticated:', parsed.state?.isAuthenticated);
  } catch (e) {
    console.error('❌ Error parsing auth storage:', e);
  }
}

/**
 * Manual test of CSV export with detailed logging
 */
export async function testCSVExport() {
  debugCSVExport();

  try {
    console.log('\n🔄 Attempting CSV export with fetch...');
    
    const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const token = authStore.state?.token;
    
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseURL}/leads/export/csv`;
    
    console.log('Request details:');
    console.log('  URL:', url);
    console.log('  Method: GET');
    console.log('  Authorization: Bearer', token ? token.substring(0, 20) + '...' : 'MISSING');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    console.log('\n📊 Response details:');
    console.log('  Status:', response.status);
    console.log('  StatusText:', response.statusText);
    console.log('  Headers:');
    response.headers.forEach((value, key) => {
      console.log(`    ${key}: ${value}`);
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorText = '';
      
      if (contentType?.includes('application/json')) {
        const json = await response.json();
        errorText = JSON.stringify(json, null, 2);
      } else {
        errorText = await response.text();
      }
      
      console.error('❌ Export failed with status', response.status);
      console.error('Response:', errorText);
      return;
    }

    const blob = await response.blob();
    console.log('✅ CSV export successful!');
    console.log('  Blob size:', blob.size, 'bytes');
    console.log('  Blob type:', blob.type);
    
    // Trigger download for testing
    const url_obj = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url_obj;
    link.download = 'leads-test-export.csv';
    console.log('📥 Download link created - check your downloads folder');
    
  } catch (error) {
    console.error('❌ Error during CSV export:', error);
  }
}
