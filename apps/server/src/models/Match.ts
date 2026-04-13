import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  player1: string; // userId
  player2: string; // userId
  winner: string; // userId
  wpm: number;
  accuracy: number;
  createdAt: Date;
}

const MatchSchema: Schema = new Schema({
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  winner: { type: String, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMatch>('Match', MatchSchema);
