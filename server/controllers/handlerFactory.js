const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("express-async-handler");
const AppError = require("../utils/appError");

const getAll = (Model) =>
  catchAsync(async (req, res) => {
    // Initialize the query with the Mongoose model
    let query = Model.find();

    // Create an instance of APIFeatures
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const results = await features.query;

    res.status(200).json({
      status: "success",
      results: results.length,
      data: {
        data: results,
      },
    });
  });

const getOne = (Model) =>
  catchAsync(async (req, res) => {
    const query = Model.findById(req.params.id);

    // Create an instance of APIFeatures
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const result = await features.query;

    if (!result) throw new AppError("Id not found", 404);

    res.status(200).json({
      status: "success",
      data: {
        data: result,
      },
    });
  });
const deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const result = await Model.findByIdAndDelete(req.params.id);
    if (!result) throw new AppError("id not found", 404);
    res.status(200).json({
      status: "success",
      data: null,
    });
  });
const createOne = (Model) =>
  catchAsync(async (req, res) => {
    const result = await Model.create(req.body);
    if (!result) throw new AppError("fail created", 400);
    res.status(201).json({
      status: "success",
      data: { data: result },
    });
  });
const updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const result = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) throw new AppError("Id not found", 404);
    res.status(200).json({
      status: "success",
      data: { data: result },
    });
  });

module.exports = {
  getAll,
  getOne,
  deleteOne,
  createOne,
  updateOne,
};
