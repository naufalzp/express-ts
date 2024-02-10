import express from "express";

import { deleteUserById, getUserById, getUsers, updateUserById } from "../db/users";
import { authentication, random } from "../helpers";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.sendStatus(400);
        }

        const deletedUser = await deleteUserById(id);

        return res.json(deletedUser).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;

        if (!id) {
            return res.sendStatus(400);
        }

        //
        if (!username && !password) {
            return res.sendStatus(400);
        }

        const user = await getUserById(id).select(
            "+authentication.salt +authentication.password"
        );

        const updateFields: { username?: string; password?: string } = {};

        if (username) {
            updateFields.username = username;
            user.username = updateFields.username;
            user.save();
        }

        if (password) {
            const salt = user.authentication.salt;
            const hashedPassword = authentication(salt, password);
            updateFields.password = hashedPassword;
            user.authentication.password = updateFields.password;
            user.save();
        }

        if (!user) {
            return res.sendStatus(404);
        }

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
