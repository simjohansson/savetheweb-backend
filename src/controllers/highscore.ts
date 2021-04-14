import { Request, Response } from "express";
import { HighscoreDocument, HighscoreModel } from "../models/Highscore";
import { check, validationResult } from "express-validator";

export const getHighscore = async (req: Request, res: Response) => {
    const result  = await HighscoreModel.find({});
    res.json(result);    
};

export const tryUpdateHighscore = async (req: Request, res: Response) => {
    await check("name", "Name cannot be blank").not().isEmpty().run(req);
    await check("score", "Score is not valid").isInt().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //  req.flash("errors", errors.array());
      return  res.status(400).json(errors.array());
    }
    const data = req.body as HighscoreDocument;
    const highscore = new HighscoreModel({name: data.name, score: data.score});
    highscore.save((error) => console.log(error));
    res.sendStatus(200);
};