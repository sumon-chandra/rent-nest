import app from "./app.js";
import envConfigs from "./configs/env-configs.js";
import AppError from "./utilities/app-error.js";

function main() {
	try {
		app.listen(envConfigs.port || 5000, () => {
			console.log({
				message: "Server connected successfully.",
			});
		});
	} catch (error) {
		console.error({ serverError: error });
		throw AppError.internal("Server connection error.");
	}
}

main();
