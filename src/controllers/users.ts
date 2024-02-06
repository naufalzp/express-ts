import express from "express";

import { deleteUserById, getUsers } from "../db/users";

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