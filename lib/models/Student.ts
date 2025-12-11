import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  className?: string; // This will store the name of the class
  email?: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  className: { type: String }, // Store class name for easier querying
  email: { type: String, unique: true, sparse: true }, // sparse allows nulls
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },

}, {
  timestamps: true
});


export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
