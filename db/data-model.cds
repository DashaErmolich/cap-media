namespace Media.db;

entity MediaFile {
    key id        : UUID;
         //It denotes the data element contains media data.
       
        content   : LargeBinary @Core.MediaType   : mediaType  @Core.ContentDisposition.Filename: fileName;
        @Core.IsMediaType : true //It denotes the data element contains a MIME type.
        mediaType : String;
        fileName  : String;
        url       : String;
};