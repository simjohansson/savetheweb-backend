import mongoose from "mongoose";

export type HighscoreDocument = mongoose.Document & {
    name: string,
    score: number
};

const highScoreSchema = new mongoose.Schema<HighscoreDocument>(
    {
        name: String,
        score: Number
    },
    { timestamps: true },
);

export const HighscoreModel = mongoose.model<HighscoreDocument>("Highscore", highScoreSchema);