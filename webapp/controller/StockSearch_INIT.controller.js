sap.ui.define([
	"project1/controller/BaseController",
	"project1/model/formatter",
	"sap/ui/model/Filter"
], function(Controller, formatter, Filter) {
	"use strict";

	return Controller.extend("project1.controller.StockSearch_INIT", {

		formatter: formatter,

		onInit: function() {

			if (this.Second_check()) {
				this.ODataModel = this.getOwnerComponent().getModel("OData");
				this.oRouter = this.getRouter(this);
				this.oRouter.getRoute("StockSearch_INIT").attachPatternMatched(this.onObjectMatched, this);
				this.oSF = this.byId("searchField");
			}

		},

		Second_check: function() {

			var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
			this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

			if (this.oCrossAppNavigator && (sessionStorage.getItem("PDAID") == null)) {
				this.oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "Login",
						action: "display"
					}
				});
			} else {
				return true;
			}

		},

		onObjectMatched: function(oEvent) {

			if (sap.ui.getCore().byId("homeBtn")) {
				sap.ushell.Container.getRenderer("fiori2").hideHeaderItem("backBtn", false);
			}

			var that = this;

			that.byId("PDAID").setText("用户:" + sessionStorage.getItem("PDAID"));

			that.CallFunction(that, "ZSTOCKSEARCH_INIT_WERKS").then(function(oData) {
				if (oData.ReturnCode == 200) {
					that.setGlobalProperty("/", JSON.parse(oData.np_expand.results[0].Output));
					that.globalBusyOff();
				} else {
					var message = oData.ReturnMessage;
					that.showWarning(message);
					setTimeout(function() {
						that.globalBusyOff();
						if (that.oCrossAppNavigator) {
							that.oCrossAppNavigator.toExternal({
								target: {
									semanticObject: "#"
								}
							});
						}
					}, 1000);
				}
			});
		},

		onClickSure: function() {

			var that = this;
			that.CallFunction(that, "ZSTOCKSEARCH_SURE").then(function(oData) {
				if (oData.ReturnCode == 200) {
					that.setGlobalProperty("/", JSON.parse(oData.np_expand.results[0].Output));
					that.oRouter.navTo("StockSearch_LIST", {});
				} else {
					var message = oData.ReturnMessage;
					that.showWarning(message);
					that.globalBusyOff();
				}
			});

		}

	});
});