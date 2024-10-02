const { pathHandler } = require("./path-handler");
const { decrypt, encrypt } = require("./services/pdf");
const { getSignedUrl } = require("./services/uploads");

const functionMapper = {
	"/uploads/get-signed-url": {
		POST: {
			function: getSignedUrl,
			paramList: ["path"],
		},
	},
	"/decrypt": {
		POST: {
			function: decrypt,
			paramList: ["sourcePath", "password"],
		},
	},
  "/encrypt": {
		POST: {
			function: encrypt,
			paramList: ["sourcePath", "password"],
		},
	},
};

module.exports.handler = (event, context) => {
	return pathHandler(event, context, functionMapper);
};
