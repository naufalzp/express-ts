import { authentication } from "../helpers/index";
import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { random } from "../helpers";

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
