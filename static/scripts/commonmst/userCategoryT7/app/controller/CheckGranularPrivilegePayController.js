Ext.define('GCP.controller.CheckGranularPrivilegePayController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : ['GCP.view.CheckGranularPriviligesPopup'],
	refs : [{
		ref : 'checkGranularPrivHeaderPanel',
		selector : 'checkGranularPriviligesPopup container panel panel[id="checkGranPrivParametersSection"]'
	}],
	init : function() {
		var me = this;
		me.control({

			'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] checkbox[itemId="checkGranularPrivHeader_inquiryIcon"]' : {
				change : me.toggleCheckUncheck
			},
			'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] checkbox[itemId="checkGranularPrivHeader_stopPayIcon"]' : {
				change : me.toggleCheckUncheck
			},
			'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] checkbox[itemId="checkGranularPrivHeader_cancelStopPayIcon"]' : {
				change : me.toggleCheckUncheck
			},
			'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] checkbox[itemId="checkGranularPrivHeader_cancelApproveIcon"]' : {
				change : me.toggleCheckUncheck
			},
			'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] checkbox[itemId="checkGranularPrivHeader_stopPayApproveIcon"]' : {
				change : me.toggleCheckUncheck
			},

			'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] checkbox[itemId="checkGranularPrivHeader_createInquiryIcon"]' : {
				change : me.toggleCheckUncheck
			},

			'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] checkbox[itemId="checkGranularPrivHeader_viewPaidCheckImageIcon"]' : {
				change : me.toggleCheckUncheck
			},

			'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] checkbox[itemId="checkGranularPrivHeader_createCancelStopPayIcon"]' : {
				change : me.toggleCheckUncheck
			},

			'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] checkbox[itemId="checkGranularPrivHeader_createStopPayIcon"]' : {
				change : me.toggleCheckUncheck
			}

		});

	},
	changeIcon : function(btn) {
		if (mode != "VIEW") {
		if(btn.checked == true){
				return true;
			}
		else{
			return false;
		}
			if (btn.icon.match('icon_uncheckmulti.gif')) {
				btn.setIcon("./static/images/icons/icon_checkmulti.gif");
				return true;
			} else {
				btn.setIcon("./static/images/icons/icon_uncheckmulti.gif");
				return false;
			}
		}
	},
	setcheckboxValues : function(selectValue, items, chkMode) {
		if (mode != "VIEW") {
			for (var i = 0; i < items.length; i++) {
				var checkbox = items[i];
				if (checkbox.mode === chkMode)
					checkbox.setValue(selectValue);
			}
		}
	},
	toggleCheckUncheck : function(btn, e, eOpts) {

		var me = this;
		var btnId = btn.itemId;
		switch (btnId) {

			case 'checkGranularPrivHeader_inquiryIcon' :
				var selectValue = me.changeIcon(btn);
				var mode = 'INQUIRY';
				var items = me.getCheckGranularPrivHeaderPanel()
						.query('checkbox');
				me.setcheckboxValues(selectValue, items, mode);
				break;
			case 'checkGranularPrivHeader_stopPayIcon' :
				var selectValue = me.changeIcon(btn);
				var mode = 'STOPPAY';
				var items = me.getCheckGranularPrivHeaderPanel()
						.query('checkbox');
				me.setcheckboxValues(selectValue, items, mode);
				break;
			case 'checkGranularPrivHeader_cancelStopPayIcon' :
				var selectValue = me.changeIcon(btn);
				var mode = 'CANCELSTOPPAY';
				var items = me.getCheckGranularPrivHeaderPanel()
						.query('checkbox');
				me.setcheckboxValues(selectValue, items, mode);
				break;
			case 'checkGranularPrivHeader_cancelApproveIcon' :
				var selectValue = me.changeIcon(btn);
				var mode = 'CANCELSTOPPAYAPPROVE';
				var items = me.getCheckGranularPrivHeaderPanel()
						.query('checkbox');
				me.setcheckboxValues(selectValue, items, mode);
				break;
			case 'checkGranularPrivHeader_stopPayApproveIcon' :
				var selectValue = me.changeIcon(btn);
				var mode = 'STOPPAYAPPROVE';
				var items = me.getCheckGranularPrivHeaderPanel()
						.query('checkbox');
				me.setcheckboxValues(selectValue, items, mode);
				break;

			case 'checkGranularPrivHeader_createInquiryIcon' :
				var selectValue = me.changeIcon(btn);
				var mode = 'CREATE_INQUIRY_FLAG';
				var items = me.getCheckGranularPrivHeaderPanel()
						.query('checkbox');
				me.setcheckboxValues(selectValue, items, mode);
				break;

			case 'checkGranularPrivHeader_viewPaidCheckImageIcon' :
				var selectValue = me.changeIcon(btn);
				var mode = 'VIEW_PAID_CHECK_IMG_FLAG';
				var items = me.getCheckGranularPrivHeaderPanel()
						.query('checkbox');
				me.setcheckboxValues(selectValue, items, mode);
				break;

			case 'checkGranularPrivHeader_createCancelStopPayIcon' :
				var selectValue = me.changeIcon(btn);
				var mode = 'CREATE_CANCEL_STOPPAY_FLAG';
				var items = me.getCheckGranularPrivHeaderPanel()
						.query('checkbox');
				me.setcheckboxValues(selectValue, items, mode);
				break;

			case 'checkGranularPrivHeader_createStopPayIcon' :
				var selectValue = me.changeIcon(btn);
				var mode = 'CREATE_STOPPAY_FLAG';
				var items = me.getCheckGranularPrivHeaderPanel()
						.query('checkbox');
				me.setcheckboxValues(selectValue, items, mode);
				break;

		}
	}
});