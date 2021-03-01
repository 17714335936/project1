sap.ui.define([], function() {
	"use strict";
	return {
		// 去后导零
		deleteRightZero: function(v) // 去后导零
			{
				if (v === null || v === undefined || v === 0 || v === "0") {
					v = 0;
				}
				return parseFloat(v);
			},

		// 去前导零
		deleteLeftZero: function(v) // 去前导零
			{
				if (v === null || v === undefined || v === 0 || v === "0") {
					v = "0";
				}
				return v.replace(/^0+/, "");
			},

		date: function(value) {
			if (value) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				return oDateFormat.format(new Date(value));
			} else {
				return value;
			}
		},

		datetime: function(value) {
			if (value) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd hh:mm:ss"
				});
				return oDateFormat.format(new Date(value));
			} else {
				return value;
			}
		},

		time: function(fValue) {

			if (fValue) {
				fValue = fValue.replace(/^PT/, '').replace(/S$/, '');
				fValue = fValue.replace('H', ':').replace('M', ':');

				var multipler = 60 * 60;
				var result = 0;
				fValue.split(':').forEach(function(token) {
					result += token * multipler;
					multipler = multipler / 60;
				});
				var timeinmiliseconds = result * 1000;

				var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "HH:mm:ss"
				});
				var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
				return timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
			} else {
				return fValue;
			}

		},

		enabled: function(v) {
			if (v) {
				if (v == "X") {
					return true;
				} else {
					return false;
				}
			}
			return true;
		}

	};
});