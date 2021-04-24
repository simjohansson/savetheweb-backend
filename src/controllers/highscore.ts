import { Request, Response } from "express";
import { HighscoreDocument, HighscoreModel } from "../models/Highscore";
import { check, validationResult } from "express-validator";

export const getHighscore = async (req: Request, res: Response) => {
  const result = await getTop5Score();
  res.json(result);
};

export const tryUpdateHighscore = async (req: Request, res: Response) => {
  await check("name", "Name cannot be blank").not().isEmpty().run(req);
  await check("score", "Score is not valid").isInt().run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //  req.flash("errors", errors.array());
    return res.status(400).json(errors.array());
  }
  const data = req.body as HighscoreDocument;
  const result = await getTop5Score();
  if (result.length < 5 || result.find(x => x.score < data.score)) {
    const highscore = new HighscoreModel({ name: data.name, score: data.score });
    try {
      await highscore.save();
    }
    catch (error) {
      throw error;
    }
  }
  res.sendStatus(200);
};


const getTop5Score = async () => {
  return await HighscoreModel.find({}).sort({ score: -1 }).limit(5);
};