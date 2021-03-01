sap.ui.define([
	"project1/controller/BaseController"
], function(Controller) {
	"use strict";
	return Controller.extend("project1.controller.App", {

		onInit: function() {
			this.getView().addStyleClass(this.getContentDensityClass());
		},

		onBeforeRendering: function() {}
	});

});