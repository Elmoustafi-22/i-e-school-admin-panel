import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Attendance from '@/lib/models/Attendance';
import mongoose from 'mongoose';
import { attendanceSchema } from '@/lib/validations';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const dateParam = searchParams.get('date');

    let filter: any = {};
    if (classId) {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        return NextResponse.json({ error: 'Invalid class ID' }, { status: 400 });
      }
      filter.classId = new mongoose.Types.ObjectId(classId);
    }
    if (dateParam) {
      const startOfDay = new Date(dateParam);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(dateParam);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const attendanceRecords = await Attendance.find(filter).sort({ studentName: 1 });
    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error('Failed to fetch attendance records:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const validation = attendanceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { records } = validation.data;

    const newAttendanceRecords = [];
    const errors = [];

    for (const record of records) {
      const { studentId, studentName, classId, className, date, status } = record;

      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(classId)) {
        errors.push(`Invalid ObjectId for studentId or classId in record for studentId: ${studentId}`);
        continue;
      }

      try {
        const attendanceDate = new Date(date);
        attendanceDate.setUTCHours(0, 0, 0, 0); // Normalize date to start of day UTC

        const newRecord = await Attendance.findOneAndUpdate(
          {
            studentId: new mongoose.Types.ObjectId(studentId),
            classId: new mongoose.Types.ObjectId(classId),
            date: attendanceDate, // Match normalized date
          },
          {
            $set: {
              studentName,
              className,
              status,
              createdAt: new Date(), // Update creation time if record is modified
            },
          },
          {
            upsert: true, // Create if not exists
            new: true, // Return the updated/inserted document
            runValidators: true,
          }
        );
        newAttendanceRecords.push(newRecord);
      } catch (error: any) {
        console.error(`Error saving attendance for student ${studentName}:`, error);
        errors.push(`Failed to save attendance for student ${studentName}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        message: 'Some attendance records failed to save',
        savedRecordsCount: newAttendanceRecords.length,
        errors: errors,
      }, { status: 207 }); // Multi-Status
    }

    return NextResponse.json({
      message: 'Attendance records saved successfully',
      savedRecordsCount: newAttendanceRecords.length,
      records: newAttendanceRecords,
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to save attendance records:', error);
    return NextResponse.json({ error: 'Failed to save attendance records' }, { status: 500 });
  }
}
