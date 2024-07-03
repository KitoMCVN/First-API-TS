import { Response } from "express";

export const sendServerError = (res: Response, error: Error, message?: string) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    error: {
      code: 500,
      message: message || "Oh no! Server error",
    },
  });
};

export const sendBadRequest = (res: Response, message: string) => {
  res.status(400).json({
    success: false,
    error: {
      code: 400,
      message,
    },
  });
};

export const sendNotFound = (res: Response, message: string) => {
  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message,
    },
  });
};

export const sendAuthError = (res: Response, message: string) => {
  res.status(401).json({
    success: false,
    error: {
      code: 401,
      message: message || "Authentication Failed",
    },
  });
};

export const sendSuccess = (res: Response, data: object | string) => {
  if (typeof data === "object") {
    res.json({
      success: true,
      data,
    });
  } else {
    res.json({
      success: true,
      data: {
        message: data,
      },
    });
  }
};
