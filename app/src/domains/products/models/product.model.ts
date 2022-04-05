import mongoose from 'mongoose';

//An interface that describe the properties
//that are required to create new product
interface ProductAttrs {
  title: string;
  cost: number;
  userId: string;
  qty: number;
  lineId: string;
}

//An interface that describe the properties
//that a Product Model has
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

//An interface what describe properties
//that a Product document has
interface ProductDoc extends mongoose.Document {
  title: string;
  cost: number;
  qty: number;
  userId: string;
  lineId: string;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: [3, 'A product name must have less or equal 3 characters'],
      maxLength: [120, 'A tour name must have big or equal 120 characters'],
    },
    cost: {
      type: Number,
      required: [true, 'A product must have a price'],
    },
    qty: {
      type: Number,
      required: [true, 'A product must have a quantity'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'user must belong to a user'],
      ref: 'User',
    },

    line: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'product must belong to a user'],
      ref: 'Line',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

productSchema.pre(/^find/, function (done) {
  this.populate([
    {
      path: 'seller',
      select: 'id username',
    },
    {
      path: 'line',
      select: 'id title',
    },
  ]);

  done();
});

const Product = mongoose.model<ProductDoc, ProductModel>(
  'Product',
  productSchema
);
export { Product };
