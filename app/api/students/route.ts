import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/lib/models/Student';
import Class from '@/lib/models/Class'; // To update student count in class
import mongoose from 'mongoose';
import { studentSchema } from '@/lib/validations';
import logger from '@/lib/logger';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('className');
    const status = searchParams.get('status');

    let filter: any = {};
    if (className) {
      filter.className = className;
    }
    if (status) {
      filter.status = status;
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (error) {
    logger.error(error, 'Failed to fetch students');
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const validation = studentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }
    
    const { name, className, email, status } = validation.data;

    // Check if the class exists and increment student count
    const relatedClass = await Class.findOne({ name: className });
    if (!relatedClass) {
      return NextResponse.json({ error: `Class '${className}' not found` }, { status: 404 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newStudent = await Student.create([{ name, className, email, status }], { session });

      // Increment student count in the class
      await Class.updateOne(
        { _id: relatedClass._id },
        { $inc: { numberOfStudents: 1 } },
        { session }
      );

      await session.commitTransaction();
      return NextResponse.json(newStudent[0], { status: 201 });
    } catch (transactionError: any) {
      await session.abortTransaction();
      logger.error(transactionError, 'Transaction failed during student creation');
      if (transactionError.code === 11000) { // Duplicate key error for email
        return NextResponse.json({ error: 'Student with this email already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    } finally {
      session.endSession();
    }

  } catch (error) {
    logger.error(error, 'Failed to create student');
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
