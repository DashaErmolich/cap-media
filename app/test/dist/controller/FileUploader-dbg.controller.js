sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("test.controller.FileUploader", {
            onInit: function () {

            },
            _getBaseURL: function () {
                var oBaseUrl = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".", "/");
                return jQuery.sap.getModulePath(oBaseUrl)
            },

            /**
             * on File Change
             */
            onFileChange: function (oEvent) {
                var file = oEvent.getParameters("files").files[0];
                this.file = file;
            },

            /**
             * On File Upload
             */
            onUploadFile: function () {
                var oUploadSet = this.byId("__fileUploader");
                //Upload image
                var reader = new FileReader();
                reader.onload = function (oEvent) {
                    // get an access to the content of the file
                    this.content = oEvent.currentTarget.result;
                    this.createfile();
                }.bind(this);
                reader.readAsDataURL(this.file);

            },

            /**
             *  Create Operation to create an entry in CAP
             */
            createfile: function () {
                var that = this;
                // Data for CAP to create entry
                var oImageData = {
                    "content": this.content,
                    "mediaType": this.file.type,
                    "fileName": this.file.name
                };
                var oCAPModel = this.getOwnerComponent().getModel("oCAPModel");
                var sURL = "/media/MediaFile";
                //Create call for CAP OData Service
                // oCAPModel.create(sURL, oImageData, {
                //     success: function (oData, oResponse) {
                //         var id = oData.id;
                //         var sMsg = "File Uploaded Successfully for ID: " + id;
                //         MessageBox.success(sMsg);
                //     },
                //     error: function (jqXHR, textStatus) {
                //         var sMsg = "File Not Uploaded Successfully";
                //         MessageBox.error(sMsg);
                //     },
                // });

                fetch(sURL, {
                    body: JSON.stringify(oImageData),
                    method : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                      }
                }).then(resp => {
                    console.log(resp);
                }).catch(err => {
                    console.log('err');
                })

            }
        });
    });
