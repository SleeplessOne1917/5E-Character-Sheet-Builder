import { Document, ObjectId, Schema, model, models, Model } from 'mongoose';

export interface IUsernameOTL {
	userId: ObjectId;
	createdAt: Date;
}

export interface IUsernameOTLDocument extends IUsernameOTL, Document {}

const usernameOTLSchema = new Schema<IUsernameOTL>({
	userId: Schema.Types.ObjectId,
	createdAt: Date
});

usernameOTLSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 });

export default (models.UsernameOTL ||
	model<IUsernameOTLDocument>(
		'UsernameOTL',
		usernameOTLSchema,
		'usernameOTLs'
	)) as Model<IUsernameOTLDocument>;
