module.exports = class Upload {
	constructor (buffer, path, url) {
		this.buffer = buffer;
		this.path = path;
	}

	async saveUrlFromFirebase (filetype, Model) {
		const model = new Model();
		model.media.url = this.url
		model.media.type = filetype
		try {
			return await model.save();
		} catch (e) {
			return e
		}
	}
}
