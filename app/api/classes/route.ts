import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Class from '@/lib/models/Class';
import { classSchema } from '@/lib/validations';
import logger from '@/lib/logger';

export async function GET() {
  await dbConnect();
  try {
    const classes = await Class.find({}).sort({ createdAt: -1 });
    return NextResponse.json(classes);
  } catch (error) {
    logger.error(error, 'Failed to fetch classes');
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    const validation = classSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { name, teacher, description } = validation.data;

    const newClass = await Class.create({ name, teacher, description });
    return NextResponse.json(newClass, { status: 201 });
  } catch (error: any) {
    logger.error(error, 'Failed to create class');
    if (error.code === 11000) { // Duplicate key error
      return NextResponse.json({ error: 'Class with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}
