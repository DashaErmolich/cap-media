sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox"],function(e){"use strict";return e.extend("test.controller.FileUploader",{onInit:function(){},_getBaseURL:function(){var e=this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".","/");return jQuery.sap.getModulePath(e)},onFileChange:function(e){var t=e.getParameters("files").files[0];this.file=t},onUploadFile:function(){var e=this.byId("__fileUploader");var t=new FileReader;t.onload=function(e){this.content=e.currentTarget.result;this.createfile()}.bind(this);t.readAsDataURL(this.file)},createfile:function(){var e=this;var t={content:this.content,mediaType:this.file.type,fileName:this.file.name};var n=this.getOwnerComponent().getModel("oCAPModel");var i="/media/MediaFile";fetch(i,{body:JSON.stringify(t),method:"POST",headers:{"Content-Type":"application/json"}}).then(e=>{console.log(e)}).catch(e=>{console.log("err")})}})});