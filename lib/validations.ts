import { z } from 'zod';

export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  teacher: z.string().min(1, 'Teacher name is required'),
  description: z.string().optional(),
});

export const studentSchema = z.object({
  name: z.string().min(1, 'Student name is required'),
  className: z.string().min(1, 'Class name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive']),
});

export const attendanceRecordSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  classId: z.string(),
  className: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  status: z.enum(['Present', 'Absent']),
});

export const attendanceSchema = z.object({
  records: z.array(attendanceRecordSchema),
});
