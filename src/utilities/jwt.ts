import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const createJwt = (payload: JwtPayload, secret: string, expiredIn: SignOptions) => {
	const token = jwt.sign(payload, secret, {
		expiresIn: expiredIn,
	} as SignOptions);

	return token;
};

const verifyToken = (token: string, secret: string) => {
	try {
		const verifiedToken = jwt.verify(token, secret);
		return {
			success: true,
			data: verifiedToken,
		};
	} catch (error: any) {
		console.error("Token verification failed...", error);
		return {
			success: false,
			error: error.message,
		};
	}
};

export const jwtUtils = {
	createJwt,
	verifyToken,
};
