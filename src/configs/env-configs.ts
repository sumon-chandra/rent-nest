import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path: path.join(process.cwd(), ".env"),
});

const envConfigs = {
	port: process.env.PORT,
	db_url: process.env.DATABASE_URL as string,
	app_url: process.env.APP_URL as string,
	jwt: {
		access_secret: process.env.ACCESS_TOKEN_SECRET as string,
		refresh_secret: process.env.REFRESH_TOKEN_SECRET as string,
		access_expired_in: process.env.ACCESS_TOKEN_EXPIRED_IN as string,
		refresh_expired_in: process.env.REFRESH_TOKEN_EXPIRED_IN as string,
	},
};

export default envConfigs;
