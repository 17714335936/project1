sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		initDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		initGlobalPropertiesModel: function () {

			var oGlobalProperties = {
			};

			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("TwoWay");
			oModel.setData(oGlobalProperties);
			return oModel;
		}
	};

});