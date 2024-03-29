import { authentication } from "../helpers/index";
import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select(
            "+authentication.salt +authentication.password"
        );

        if (!user) {
            return res.sendStatus(404);
        }

        const expectedHast = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHast) {
            return res.sendStatus(401);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie("ICIKIWIR-AUTH", user.authentication.sessionToken, {
            domain: "localhost",
            path: "/",
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.sendStatus(400);
        }

        const exsitingUser = await getUserByEmail(email);
        if (exsitingUser) {
            return res.sendStatus(409);
        }

        const salt = random();

        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        return res.status(201).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
