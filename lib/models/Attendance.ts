import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  studentName: string;
  classId: mongoose.Schema.Types.ObjectId; // Reference to the Class model
  className: string;
  date: Date;
  status: 'Present' | 'Absent';
  createdAt: Date;
}

const AttendanceSchema: Schema = new Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  className: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
}, {
  timestamps: true
});

// Ensure that a student can only have one attendance record per class per day
AttendanceSchema.index({ studentId: 1, classId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
