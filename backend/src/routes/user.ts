import express from "express";
import validator from "validator";
import * as User from "../models/User";
import { createToken } from "../auth";
import { asyncHandler } from "../util";
import { BoxdropError } from "../models/BoxdropError";
import handleAuth from "../middleware/handleAuth.middleware";

const router = express.Router();
const providers = ["email", "google"];

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = req.body;
    const { email, password, provider } = body;

    // validate request
    if (!providers.includes(provider)) {
      return res.status(400).json({ error: "Provider not supported" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // store user on google cloud
    if (provider === "email") {
      const [newUser] = await User.createWithEmail(email, password);
      const [mutationResults] = newUser.mutationResults;
      const [path] = mutationResults.key.path;
      const id = path.id.toString();

      const token = createToken(id);
      return res.json({ access_token: token });
    } else {
      return res.send(await User.createWithProvider(email, provider));
    }
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = req.body;
    const { email, password, provider } = body;

    let user;
    if (provider === "email") {
      user = await User.loginWithEmail(email, password);
    } else {
      user = null; // Google auth integration?
    }

    const token = createToken(user.id);
    return res.json({ access_token: token });
  })
);

router.use("/me", handleAuth);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const id = res.locals.id;

    const user = await User.get(id);
    if (user === undefined) {
      throw new BoxdropError("Requested user does not exist", 404);
    }
    return res.send(user);
  })
);

export default router;
