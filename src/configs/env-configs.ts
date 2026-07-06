import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path: path.join(process.cwd(), ".env"),
});

const envConfigs = {
	port: process.env.PORT,
	db_url: process.env.DATABASE_URL as string,
};

export default envConfigs;
