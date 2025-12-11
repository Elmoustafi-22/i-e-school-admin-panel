export interface Class {
  _id: string; // MongoDB's default ID field
  name: string;
  teacher: string;
  numberOfStudents: number;
  description?: string;
  createdAt?: string; // Optional, Mongoose adds this
  updatedAt?: string; // Optional, Mongoose adds this
}

export interface Student {
  _id: string; // MongoDB's default ID field
  name: string;
  className: string; // Name of the class the student belongs to
  email?: string;
  status: "Active" | "Inactive";
  createdAt?: string; // Optional, Mongoose adds this
  updatedAt?: string; // Optional, Mongoose adds this
}

export interface AttendanceRecord {
  _id: string; // MongoDB's default ID field
  studentId: string; // References Student _id
  studentName: string;
  classId: string; // References Class _id
  className: string;
  date: string; // Stored as ISO string or Date
  status: "Present" | "Absent";
  createdAt?: string; // Optional, Mongoose adds this
}

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  status: "Present" | "Absent";
}