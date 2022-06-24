import { Document, ObjectId, Schema, model, models } from 'mongoose';

export interface IResetPasswordOTL {
	userId: ObjectId;
	createdAt: Date;
}

export interface IResetPasswordOTLDocument
	extends IResetPasswordOTL,
		Document {}

const resetPasswordOTLSchema = new Schema({
	userId: Schema.Types.ObjectId,
	createdAt: Date
});

resetPasswordOTLSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 });

export default models.ResetPasswordOTL ||
	model<IResetPasswordOTLDocument>(
		'ResetPasswordOTL',
		resetPasswordOTLSchema,
		'resetPasswordOTLs'
	);
