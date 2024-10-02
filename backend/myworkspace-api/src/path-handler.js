function convertToRegex(key) {
	const pattern = key.replaceAll(/\{(\w+)\}/g, "(?<$1>[\\w\\d-]+)");
	return "^" + pattern + "/?$";
}

function getPathPattern(path, functionMapper) {
	let pathPattern,
		pathParams = {};
	for (let key of Object.keys(functionMapper)) {
		const regex = convertToRegex(key);
		const match = path.match(new RegExp(regex));
		if (match) {
			pathPattern = key;
			pathParams = match.groups || {};
      break;
		}
	}
	return [pathPattern, pathParams];
}

async function pathHandler(event, context, functionMapper) {
	let responseHeaders = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	};

	try {
		const requestMethod = event.requestContext.httpMethod;
		const path = (event.requestContext.path || "")
			.replace(`/${event.requestContext.stage}/`, "/")
			.replace(/\/+$/, "");

		const [pathPattern, pathParams] = getPathPattern(path, functionMapper);
		if (!pathPattern) {
			const error = new Error(`Path not found: ${path}`);
			throw error;
		}

		const body = JSON.parse(event.body || "{}");
		const paramDict = (functionMapper[pathPattern][requestMethod].paramList || []).reduce((agg, param) => {
			agg[param] = body[param];
			return agg;
		}, {});
		paramDict["queryParams"] = event.queryStringparameters;
		Object.entries(pathParams).forEach(([key, value]) => {
			paramDict[key] = value;
		});
		const validations = functionMapper[pathPattern][requestMethod].validations || [];
		for (let validate of validations) {
			validate(paramDict);
		}

		const returnObject = await functionMapper[pathPattern][requestMethod].function(paramDict);
		return {
			statusCode: 200,
			body: JSON.stringify(returnObject),
			headers: responseHeaders,
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 400,
			body: JSON.stringify({ errorMessage: error.message }),
			headers: responseHeaders,
		};
	}
}

module.exports = { pathHandler };
