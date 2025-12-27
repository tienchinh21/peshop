import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL_DOTNET || 'https://peshop.tandat.site';
  
  try {
    const url = `${baseUrl}/Product/get-products?page=1&pageSize=5`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `API returned ${response.status}: ${response.statusText}`,
        envUrl: process.env.NEXT_PUBLIC_API_URL_DOTNET || 'not set',
        usedUrl: baseUrl
      });
    }
    
    const data = await response.json();
    const productCount = data.data?.products?.length || 0;
    
    return NextResponse.json({
      success: true,
      productCount,
      envUrl: process.env.NEXT_PUBLIC_API_URL_DOTNET || 'not set',
      usedUrl: baseUrl,
      sampleProduct: data.data?.products?.[0]?.name || null
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      envUrl: process.env.NEXT_PUBLIC_API_URL_DOTNET || 'not set',
      usedUrl: baseUrl
    });
  }
}
