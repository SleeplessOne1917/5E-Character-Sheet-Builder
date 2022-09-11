import { Types, Schema, model, models, Model } from 'mongoose';

import Document from '../../types/db/document';

export interface IUsernameOTL {
	userId: Types.ObjectId;
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
