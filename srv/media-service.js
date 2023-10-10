const cds = require('@sap/cds');
const { Readable } = require("stream");
cds.env.features.fetch_csrf = true

module.exports = cds.service.impl(async function () {

    const {
        MediaFile
    } = this.entities;


    /**
     * Handler method called before creating data entry
     * for entity Mediafile.
     */
    this.before('CREATE', MediaFile, async (req) => {
        req.data.id = cds.utils.uuid();
        //Assign the url by appending the id
        req.data.url = `/media/MediaFile(${req.data.id})/content`;
    });
    /**
     * Handler method called on reading data entry
     * for entity Mediafile.
     **/
    this.on("READ", MediaFile, async (req, next) => {
        if (!req.data.id) {
            return next();
        }
        //Fetch the url from where the req is triggered
        const url = req._.req.path;
        //If the request url contains keyword "content"
        // then read the media content
        if (url.includes("content")) {
            const id = req.data.id;
            var tx = cds.transaction(req);
            // Fetch the media obj from database
            var mediaObj = await tx.run(
                SELECT.one.from("Media.db.MediaFile", ["content", "mediaType"]).where(
                    "id =",
                    id
                )
            );
            if (mediaObj.length <= 0) {
                req.reject(404, "Media not found for the ID");
                return;
            }
            var decodedMedia = "";
            decodedMedia = new Buffer.from(
                mediaObj.content.toString().split(";base64,").pop(),
                "base64"
            );
            return _formatResult(decodedMedia, mediaObj.mediaType);
        } else return next();
    });

    function _formatResult(decodedMedia, mediaType) {
        const readable = new Readable();
        const result = new Array();
        readable.push(decodedMedia);
        readable.push(null);
        return {
            value: readable,
            '*@odata.mediaContentType': mediaType
        }
    }

    this.on('clearData', async (req) => {
        try {
            await DELETE.from(MediaFile);
            return true;
        } catch (error) {
            return false;
        }

    })
})