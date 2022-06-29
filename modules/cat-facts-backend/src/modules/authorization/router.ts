import { constants } from "node:http2";
import express from "express";
import { checkSchema } from "express-validator";
import catRouter from "../catFacts/router";
import { asyncHandler } from "../../utils/asyncHandler";
import { validatorMiddleware } from "../../utils/validatorMiddleware";
import { authorizationService } from "./AuthorizationService";
import { UserDto } from "./dto";

const router = express.Router();

const userValidator = checkSchema({
  username: {
    notEmpty: {
      errorMessage: "name cannot be empty",
    },
    trim: {},
  },
  password: {
    notEmpty: {
      errorMessage: "password cannot be empty",
    },
    trim: {},
  },
});

router.post(
  "/new",
  userValidator,
  validatorMiddleware,
  asyncHandler(async (request, response) => {
    const userDto: UserDto = request.body;
    await authorizationService.createUser(userDto);
    response.status(constants.HTTP_STATUS_CREATED).send("User created");
  })
);

router.post(
  "/login",
  userValidator,
  validatorMiddleware,
  asyncHandler(async (request, response) => {
    const userDto: UserDto = request.body;
    const result = await authorizationService.signin(userDto);
    response.send(result);
  })
);

router.use(catRouter);

export default router;
