import { NextRequest, NextResponse } from 'next/server';
import { createDocument } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.clientName || !body.email || !body.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const requirementData = {
      ...body,
      status: 'New',
      source: 'contact_form',
      submittedAt: new Date().toISOString()
    };

    const id = await createDocument('requirements', requirementData);
    
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
