const AWS = require("aws-sdk");

const S3 = new AWS.S3({ region: process.env.REGION });
const BUCKET = process.env.S3_FILE_BUCKET;
async function getSignedUrl({ path }) {
	return {
		signedUrl: S3.getSignedUrl("putObject", {
			Bucket: BUCKET,
			Key: path,
			Expires: 60 * 5,
			ContentType: "multipart/form-data",
		}),
	};
}

module.exports = { getSignedUrl };
