import mongoose from 'mongoose';

//An interface that describe the properties
//that are required to create new Line
interface LineAttrs {
  title: string;
}

//An interface that describe the properties
//that a Line Model has
interface LineModel extends mongoose.Model<LineDoc> {
  build(attrs: LineAttrs): LineDoc;
}

//An interface what describe properties
//that a Line document has
interface LineDoc extends mongoose.Document {
  title: string;
}

const lineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: [1, 'A Line name must have less or equal 1 characters'],
      maxLength: [50, 'A tour name must have big or equal 50 characters'],
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

lineSchema.statics.build = (attrs: LineAttrs) => {
  return new Line(attrs);
};

//virtual population
lineSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'line',
  localField: '_id',
});

const Line = mongoose.model<LineDoc, LineModel>('Line', lineSchema);
export { Line };
