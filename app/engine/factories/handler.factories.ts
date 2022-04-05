import { APIFeatures } from './../features/api.features';
import { Request, Response } from 'express';
import { AppError } from '../errors/app-error';

export const getAll =
  (Model: any, cacheKey = '', populationOptions?: any) =>
  async (req: Request, res: Response) => {
    let features = new APIFeatures(Model.find(), req.query);
    features.filter().sort().limitFields().pagination();

    if (cacheKey) {
      features.cache(cacheKey);
    }

    if (populationOptions) {
      features.population(populationOptions);
    }

    const docs = await features.query;

    res.status(201).json({
      status: 'success',
      length: docs.length,
      data: {
        data: docs,
      },
    });
  };

export const getOne =
  (Model: any, populateOptions?: any, cacheKey = '') =>
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const doc = await Model.findById(id).populate(populateOptions);
    if (cacheKey) {
      doc.cache(cacheKey);
    }
    if (!doc) {
      throw new AppError('no document found with that ID', 404);
    }

    res.status(201).json({
      status: 'success',

      data: doc,
    });
  };
export const addOne = (Model: any) => async (req: Request, res: Response) => {
  const newDoc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newDoc,
    },
  });
};

export const updateOne =
  (Model: any) => async (req: Request, res: Response) => {
    const updateDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateDoc) {
      throw new AppError('no document found with that ID', 404);
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: updateDoc,
      },
    });
  };

export const deleteOne =
  (Model: any) => async (req: Request, res: Response) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      throw new AppError(`no document found with that ID`, 404);
    }

    res.status(204).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  };
