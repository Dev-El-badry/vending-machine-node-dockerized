import mongoose from 'mongoose';
import { Product } from '../../products/models/product.model';

//An interface that describe the properties
//that are required to create new Order
interface OrderAttrs {
  product: string;
  amount: number;
  qty: number;
  createdAt: Date;
}

//An interface that describe the properties
//that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

//An interface what describe properties
//that a Order document has
interface OrderDoc extends mongoose.Document {
  product: string;
  amount: number;
  qty: number;
  createdAt: Date;
}

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, ' must belong to a product'],
      ref: 'Product',
    },
    amount: {
      type: Number,
      // required: [true, 'amount not be empty'],
    },
    qty: {
      type: Number,
      required: [true, 'quantity not be empty'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
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

orderSchema.post('save', async function (done) {
  const qty = this.get('qty') * -1;
  const productId = this.get('product');

  await Product.findById(productId).update({
    $inc: { qty: qty },
  });
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

//virtual population
orderSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'Order',
  localField: '_id',
});

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export { Order };
