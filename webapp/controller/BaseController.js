sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/BusyDialog",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller, BusyDialog, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("project1.controller.BaseController", {

		globalBusyDialog: new BusyDialog(),

		onInit: function() {
			var oRouter, oTarget;
			oRouter = this.getRouter();
		},

		getRouter: function(oView) {
			return sap.ui.core.UIComponent.getRouterFor(oView);
		},

		globalBusyOn: function() {
			if (!this.globalBusyDialog) {
				this.globalBusyDialog = new sap.m.BusyDialog();
			}
			this.globalBusyDialog.open();
		},

		globalBusyOff: function() {
			this.globalBusyDialog.close();
		},

		getGlobalProperty: function(sPath) {
			return this.getOwnerComponent().getModel("globalProperties").getProperty(sPath);
		},

		setGlobalProperty: function(sPath, oValue) {
			this.getOwnerComponent().getModel("globalProperties").setProperty(sPath, oValue);
			return true;
		},

		valuesCleanup: function(ids) {
			for (var i = 0, length = ids.length; i < length; i++) {
				this.getView().byId(ids[i]).setValue("");
				this.getView().byId(ids[i]).setValueState(sap.ui.core.ValueState.None);
			}
		},

		getI18nText: function(text) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if (resourceBundle.hasText(text)) {
				return resourceBundle.getText(text);
			} else {
				return "";
			}
		},

		setBusy: function(id, isBusy) {
			var that = this;
			setTimeout(function() {
				that.getView().byId(id).setBusy(isBusy);
			}, 0);
		},

		getInputValue: function(id) {
			return this.getView().byId(id).getValue();
		},

		setInputValue: function(id, value) {
			this.getView().byId(id).setValue(value);
			return true;
		},

		getContentDensityClass: function() {
			if (!this.sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this.sContentDensityClass = "sapUiSizeCompact";
				} else {
					this.sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this.sContentDensityClass;
		},

		//---警告类信息弹框
		showWarning: function(sText) {
			MessageBox.warning(sText, {
				styleClass: this.getContentDensityClass()
			});
		},

		//---信息类信息弹框类
		showInformation: function(sText) {
			MessageBox.information(sText, {
				styleClass: this.getContentDensityClass()
			});
		},

		//---Toast形式展示消息
		showText: function(sText) {
			MessageToast.show(sText, {
				width: "20em",
				my: sap.ui.core.Popup.Dock.Center,
				at: sap.ui.core.Popup.Dock.Center
			});
		},

		//---错误类信息弹框
		showError: function(sText) {
			MessageBox.error(sText, {
				styleClass: this.getContentDensityClass()
			});
		},

		CallFunction: function(that, Code) {

			var promise = new Promise(function(resolve, reject) {

				that.globalBusyOn();
				var oRequest = {
					Code: Code,
					ReturnMessage: "",
					np_expand: []
				};
				var item = {
					Input: JSON.stringify(that.getGlobalProperty("/")),
					Output: ""
				};
				oRequest.np_expand.push(item);
				var mParameters = {
					success: function(oData, response) {
						if (oData.ReturnCode == 500) {
							MessageBox.warning(
								oData.ReturnMessage, {
									icon: MessageBox.Icon.WARNING,
									title: "WARNING",
									actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
									onClose: function(bConfirmed) {
										if (bConfirmed == "OK") {
											var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
											var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
											if (oCrossAppNavigator) {
												oCrossAppNavigator.toExternal({
													target: {
														semanticObject: "Login",
														action: "display"
													}
												});
											}
										}
									}
								}
							);
							that.globalBusyOff();
						} else {
							resolve(oData);
						}
					}.bind(that),
					error: function(oError) {
						that.globalBusyOff();
						var message = oError.message;
						that.showWarning(message);
						reject();
					}.bind(that)
				};
				var sUrl = "/codeSet";
				that.ODataModel.setHeaders({
					"PDAID": sessionStorage.getItem("PDAID"),
					"GUID": sessionStorage.getItem("GUID")
				});
				that.ODataModel.create(sUrl, oRequest, mParameters);

			});
			return promise;
		}

	});
});