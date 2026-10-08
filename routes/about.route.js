const express = require("express");

const {
  createAbout,
  getAbout,
  updateAbout,
  addFeature,
  updateFeature,
  deleteFeature,
  deleteAbout,
} = require("../controllers/about.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createAbout
);

router.get(
  "/",
  getAbout
);

router.put(
  "/",
  authMiddleware,
  updateAbout
);

router.post(
  "/features",
  authMiddleware,
  addFeature
);

router.put(
  "/features/:featureId",
  authMiddleware,
  updateFeature
);

router.delete(
  "/features/:featureId",
  authMiddleware,
  deleteFeature
);

router.delete(
  "/",
  authMiddleware,
  deleteAbout
);

module.exports = router;