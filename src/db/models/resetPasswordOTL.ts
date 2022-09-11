import { Types, Schema, model, models, Model } from 'mongoose';
import Document from '../../types/db/document';
export interface IResetPasswordOTL {
	userId: Types.ObjectId;
	createdAt: Date;
}

export interface IResetPasswordOTLDocument
	extends IResetPasswordOTL,
		Document {}

const resetPasswordOTLSchema = new Schema<IResetPasswordOTL>({
	userId: Schema.Types.ObjectId,
	createdAt: Date
});

resetPasswordOTLSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 });

export default (models.ResetPasswordOTL ||
	model<IResetPasswordOTLDocument>(
		'ResetPasswordOTL',
		resetPasswordOTLSchema,
		'resetPasswordOTLs'
	)) as Model<IResetPasswordOTLDocument>;
