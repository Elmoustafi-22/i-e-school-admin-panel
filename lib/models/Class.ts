import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  teacher: string;
  numberOfStudents: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  teacher: { type: String, required: true },
  numberOfStudents: { type: Number, default: 0 },
  description: { type: String },
}, {
  timestamps: true
});


export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);
