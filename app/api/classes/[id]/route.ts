import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Class from '@/lib/models/Class';
import Student from '@/lib/models/Student';
import Attendance from '@/lib/models/Attendance';
import mongoose from 'mongoose';
import { classSchema } from '@/lib/validations';
import logger from '@/lib/logger';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Class ID' }, { status: 400 });
    }

    const classData = await Class.findById(id);

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json(classData, { status: 200 });
  } catch (error: any) {
    logger.error(error, `Failed to fetch class with id: ${params.id}`);
    return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Class ID' }, { status: 400 });
    }

    const validation = classSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { name, teacher, description } = validation.data;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { name, teacher, description },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json(updatedClass, { status: 200 });
  } catch (error: any) {
    logger.error(error, `Failed to update class with id: ${params.id}`);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Class with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Class ID' }, { status: 400 });
    }

    // Find the class to get its name
    const classToDelete = await Class.findById(id);
    if (!classToDelete) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove students associated with this class
      await Student.deleteMany({ className: classToDelete.name }, { session });

      // Remove attendance records associated with this class
      await Attendance.deleteMany({ classId: id }, { session });

      // Delete the class itself
      const deletedClass = await Class.findByIdAndDelete(id, { session });

      if (!deletedClass) {
        throw new Error('Class not found during deletion'); // Should not happen if classToDelete was found
      }

      await session.commitTransaction();
      return NextResponse.json({ message: 'Class and associated data deleted successfully' }, { status: 200 });

    } catch (transactionError) {
      await session.abortTransaction();
      logger.error(transactionError, `Transaction failed during class deletion with id: ${id}`);
      return NextResponse.json({ error: 'Failed to delete class and associated data' }, { status: 500 });
    } finally {
      session.endSession();
    }
  } catch (error) {
    logger.error(error, `Failed to delete class with id: ${params.id}`);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}

