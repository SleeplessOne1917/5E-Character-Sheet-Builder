import { Document, Schema, model, models } from 'mongoose';

export interface IUser {
	email: string;
	hash: string;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema({
	email: String,
	hash: String
});

export default models.User || model<IUserDocument>('User', userSchema, 'users');
