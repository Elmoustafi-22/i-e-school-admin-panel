import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/lib/models/Student';
import Class from '@/lib/models/Class';
import Attendance from '@/lib/models/Attendance';
import mongoose from 'mongoose';
import { studentSchema } from '@/lib/validations';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const id = request.url.split('/').pop();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Student ID' }, { status: 400 });
    }

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch student:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const id = request.url.split('/').pop();
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid Student ID' }, { status: 400 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await request.json();
    const validation = studentSchema.partial().safeParse(body);

    if (!validation.success) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }
    
    const { name, className, email, status } = validation.data;

    const originalStudent = await Student.findById(id).session(session);
    if (!originalStudent) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const updatedData: any = { ...validation.data };
    
    // If className is being changed, update student counts in classes
    if (className && originalStudent.className !== className) {
      // Decrement count in old class
      if (originalStudent.className) {
        await Class.updateOne(
          { name: originalStudent.className },
          { $inc: { numberOfStudents: -1 } },
          { session }
        );
      }
      // Increment count in new class
      const newClass = await Class.findOne({ name: className }).session(session);
      if (!newClass) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ error: `Class '${className}' not found` }, { status: 404 });
      }
      await Class.updateOne(
        { name: className },
        { $inc: { numberOfStudents: 1 } },
        { session }
      );
    }
    
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true, session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(updatedStudent, { status: 200 });

  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error('Failed to update student:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Student with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const id = request.url.split('/').pop();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Student ID' }, { status: 400 });
    }

    const studentToDelete = await Student.findById(id);

    if (!studentToDelete) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedStudent = await Student.findByIdAndDelete(id, { session });

      if (deletedStudent && deletedStudent.className) {
        // Decrement student count in the associated class
        await Class.updateOne(
          { name: deletedStudent.className },
          { $inc: { numberOfStudents: -1 } },
          { session }
        );
      }

      // Delete associated attendance records
      await Attendance.deleteMany({ studentId: id }, { session });

      await session.commitTransaction();
      return NextResponse.json({ message: 'Student and associated attendance records deleted successfully' }, { status: 200 });

    } catch (transactionError) {
      await session.abortTransaction();
      console.error('Transaction failed during student deletion:', transactionError);
      return NextResponse.json({ error: 'Failed to delete student and associated data' }, { status: 500 });
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Failed to delete student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
