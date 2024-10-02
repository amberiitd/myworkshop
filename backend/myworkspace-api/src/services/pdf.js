const AWS = require("aws-sdk");
const muhammara = require("muhammara");
const { PassThrough } = require("stream");
const path = require("path");
const moment = require("moment");

const S3 = new AWS.S3({
	region: process.env.REGION,
});

async function crypt(action, { sourcePath, password }) {
	const sourceFilePath = path.parse(sourcePath);
	const targetPath = `decrypted/${sourceFilePath.name}_${moment().unix()}${sourceFilePath.ext}`;

	const source = new muhammara.PDFRStreamForBuffer(
		(await S3.getObject({ Bucket: process.env.S3_FILE_BUCKET, Key: sourcePath }).promise()).Body
	);
	const target = new muhammara.PDFWStreamForBuffer();
	let options;
	if (action === "decrypt") {
		options = { password };
	} else if (action === "encrypt") {
		options = { userPassword: password };
	} else {
		throw Error("Invalid action");
	}

	muhammara.recrypt(source, target, options);

	await S3.upload({
		Bucket: process.env.S3_FILE_BUCKET,
		Key: targetPath,
		Body: target.buffer,
		ContentType: "application/pdf",
	}).promise();

	return {
		sourcePath,
		targetUrl: S3.getSignedUrl("getObject", {
			Bucket: process.env.S3_FILE_BUCKET,
			Key: targetPath,
			Expires: 60 * 5,
		}),
	};
}

module.exports = { decrypt: (args) => crypt("decrypt", args), encrypt: (args) => crypt("encrypt", args) };
