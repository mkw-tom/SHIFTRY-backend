// @ts-nocheck
import jwt from "jsonwebtoken";

export const generateJWT = (userId: string): string => {
	const secret = process.env.JWT_SECRET as jwt.Secret;

	const expiresIn = process.env.JWT_EXPIRES_IN || "7d"; // デフォルト指定あり

	if (!secret || !expiresIn) {
		throw new Error("JWT_SECRET is not defined");
	}

	return jwt.sign({ userId }, secret, {
		expiresIn,
	});
};
