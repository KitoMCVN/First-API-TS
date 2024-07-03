import sqlite3 from "sqlite3";
import { Request, Response, NextFunction } from "express";
import { sendServerError } from "../utils/responseHandler";

const dbPath = "src/database/key.db";

export const apikeys = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header("Authorization")?.replace("Bearer ", "");

  if (!apiKey) {
    return res.status(401).json({ error: "Oops! Looks like the API key is missing!" });
  }

  const db = new sqlite3.Database(dbPath);

  db.get("SELECT * FROM api_keys WHERE key = ?", [apiKey], (err, row) => {
    if (err) {
      sendServerError(res, err as Error);
      return;
    }

    if (!row) {
      return res.status(401).json({ error: "It seems like your API key be wrong!" });
    }

    db.close();
    next();
  });
};
