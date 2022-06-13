import express from "express";
import { protect } from "../../engine/middlewares/protect";
import { restrictTo } from "../../engine/middlewares/restrict-to";
import { lineApiRouter } from "../domains/lines/routes/api.routes";
import { orderApiRouter } from "../domains/orders/routes/api.routes";
import { productApiRouter } from "../domains/products/routes/api.routes";
import { userApiRouter } from "../domains/users/routes/api.routes";

const router = express.Router();

router.use("/users", userApiRouter);
router.use("/orders", orderApiRouter);

router.use("/lines", lineApiRouter);

router.use("/products", productApiRouter);

export { router as apiRouter };
