import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint for on-demand revalidation
 * 
 * Usage:
 * POST /api/revalidate
 * Body: {
 *   secret: "your-secret-token",
 *   path?: "/san-pham/product-slug",
 *   tag?: "products"
 * }
 * 
 * Example with curl:
 * curl -X POST http://localhost:3000/api/revalidate \
 *   -H "Content-Type: application/json" \
 *   -d '{"secret":"your-secret","path":"/san-pham/iphone-15"}'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, path, tag } = body;

    // Verify secret token
    const revalidateSecret = process.env.REVALIDATE_SECRET || 'default-secret-change-in-production';
    
    if (secret !== revalidateSecret) {
      return NextResponse.json(
        { error: 'Invalid secret token' },
        { status: 401 }
      );
    }

    // Revalidate by path
    if (path) {
      revalidatePath(path);
      console.log(`✅ Revalidated path: ${path}`);
      
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        value: path,
        now: Date.now(),
      });
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag);
      console.log(`✅ Revalidated tag: ${tag}`);
      
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        value: tag,
        now: Date.now(),
      });
    }

    // No path or tag provided
    return NextResponse.json(
      { error: 'Missing path or tag parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Revalidation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if revalidation API is working
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Revalidation API is working',
    usage: {
      method: 'POST',
      body: {
        secret: 'your-secret-token',
        path: '/san-pham/product-slug (optional)',
        tag: 'products (optional)',
      },
    },
  });
}

