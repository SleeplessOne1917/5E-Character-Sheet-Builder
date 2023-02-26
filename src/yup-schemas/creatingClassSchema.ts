import { object } from "yup";
import editingClassSchema from "./editingClassSchema";
import subclassSchema from "./subclassSchema";

const creatingClassSchema = editingClassSchema.concat(object({
	subclass: subclassSchema
}));

export default creatingClassSchema;