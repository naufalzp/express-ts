import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, "identity._id") as string;

        if (!id || !currentUserId) {
            return res.sendStatus(400);
        }

        if (id !== currentUserId.toString()) {
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const isAuthenticated = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const sessionToken = req.cookies["ICIKIWIR-AUTH"];

        if (!sessionToken) {
            return res.sendStatus(401);
        }

        const exsitingUser = await getUserBySessionToken(sessionToken);

        if (!exsitingUser) {
            return res.sendStatus(401);
        }

        merge(req, { identity: exsitingUser });

        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
