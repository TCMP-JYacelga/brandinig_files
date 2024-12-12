Ext.define('Cashweb.controller.DebitFailedPortletController', {
	extend : 'Ext.app.Controller',
	views : ['portlet.DebitFailedPortlet'],
	stores : ['DebitFailedPortletStore'],
	models : ['DebitFailedPortletModel'],
	mask : null,
	refs : [{
				ref : 'summaryPortlet',
				selector : 'debitfailedportlet'
			}, {
				ref : 'summaryRefreshTool',
				selector : 'portlet2 tool[itemId=debitfailedportlet_refresh]'
			}, {
				ref : 'clientTextField',
				selector : 'portlet2 panel[itemId=debitfailedportletSettingsPanel] textfield[itemId="Client"]'
			}],
	init : function() {
		var me = this;
		this.control({
					'debitfailedportlet' : {
						// afterrender : this.afterSummaryRender,
						//boxready : this.onBoxReady,
						navigateToPayments : this.navigateToPayments,
						seeMorePaymentRecords : this.seeMorePaymentRecords
						// clientChange : this.setSelectedClient
					}
				});
	},
	seeMorePaymentRecords : function(strFilter, filterJson) {
		var me = this;
		var strUrl = 'paymentSummary.form';
		var frm = document.createElement('FORM');
		if (!Ext.isEmpty(strFilter)) {
			frm.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterUrl',
					strFilter));
			frm.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterJson',
					JSON.stringify(filterJson)));
			frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokVal));
		}
		frm.action = strUrl;
		frm.name = 'frmMain';
		frm.id = 'frmMain';
		frm.method = "POST";
		document.body.appendChild(frm);
		frm.submit();
		document.body.removeChild(frm);
	},
	navigateToPayments : function(record) {
		var me = this;
		var strPmtType = record.get('paymentType');
		var strUrl = '', objFormData = {}, actionName = 'btnView';
		if (strPmtType === 'QUICKPAY')
			strUrl = 'viewPayment.form';
		else if (strPmtType === 'BB' || strPmtType === 'RR')
			strUrl = 'viewMultiPayment.form';
		objFormData.strLayoutType = !Ext.isEmpty(record.get('layout')) ? record
				.get('layout') : '';
		objFormData.strPaymentType = !Ext.isEmpty(record.get('paymentType'))
				? record.get('paymentType')
				: '';
		objFormData.strProduct = !Ext.isEmpty(record.get('productType'))
				? record.get('productType')
				: '';
		objFormData.strActionStatus = !Ext.isEmpty(record.get('actionStatus'))
				? record.get('actionStatus')
				: '';
		objFormData.strPhdnumber = !Ext.isEmpty(record.get('phdnumber'))
				? record.get('phdnumber')
				: '';
		objFormData.viewState = record.get('identifier');
		if (!Ext.isEmpty(strUrl)) {
			me.doSubmitForm(strUrl, objFormData, actionName);
		}
	},
	doSubmitForm : function(strUrl, formData, actionName) {
		var me = this;
		var form = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokVal));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtLayout',
				formData.strLayoutType));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				formData.viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct',
				formData.strProduct));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtPaymentType', formData.strPaymentType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtActionStaus', formData.strActionStatus));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber',
				formData.strPhdnumber));
		var paymentType = 'PAYMENT';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtEntryType',
				paymentType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'actionName',
				actionName));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	onBoxReady : function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	aftertSummaryRender : function() {
		if (this.getSummaryRefreshTool().record.get('refreshType') == "A") {
			this.handleSummaryAutoRefresh(this.getSummaryRefreshTool().record);
		}
	},
	loadData : function(data) {
		var me = this;
		var storeData = [];
		var arrData = data.summary;

		for (var i = 0; i < arrData.length; i++) {
			var colJson = {};
			if (arrData[i]) {
				colJson["CCY_SYMBOL"] = arrData[i].CCY_SYMBOL;
				colJson["MAKER_DATE"] = arrData[i].MAKER_DATE;
				colJson["PHDREFERENCE"] = arrData[i].PHDREFERENCE
				colJson["PHDTOTALNO"] = arrData[i].PHDTOTALNO, colJson["TXN_AMNT"] = arrData[i].TXN_AMNT;
				colJson["USRDESCRIPTION"] = arrData[i].USRDESCRIPTION;
				colJson["BANKPRODUCTDESCRIPTION"] = arrData[i].BANKPRODUCTDESCRIPTION;
				colJson["paymentType"] = arrData[i].paymentType;
				colJson["identifier"] = arrData[i].identifier;
				colJson["productType"] = arrData[i].productType;
				colJson["actionStatus"] = arrData[i].actionStatus;
				colJson["phdnumber"] = arrData[i].phdnumber;
				colJson["HOST_MESSAGE"] = arrData[i].HOST_MESSAGE;
			}
			storeData.push(colJson);
		}
		me.getSummaryPortlet().getStore().loadData(storeData);
		me.getSummaryPortlet().getTargetEl().unmask();
	},

	ajaxRequest : function(filterUrl) {
		var obj;
		var thisClass = this;
		Ext.Ajax.request({
					url : 'services/debitFailedList.json' + filterUrl,
					method : 'POST',
					success : function(response) {
						obj = Ext.decode(response.responseText);
						thisClass.getSummaryPortlet().total = obj.totalAmount;
						thisClass.loadData(obj);
					},
					failure : function(response) {
						if (!Ext.isEmpty(thisClass.getSummaryPortlet())) {
							thisClass.getSummaryPortlet().getTargetEl()
									.unmask();
						}
						var viewref = thisClass.getSummaryPortlet();
						thisClass.mask = new Ext.LoadMask(viewref, {
									msgCls : 'error-msg'
								});
						if (response.timedout) {
							thisClass.mask.msg = label_map.timeoutmsg;

						} else if (response.aborted) {
							thisClass.mask.msg = label_map.abortmsg;

						} else {
							if (response.status === 0) {
								thisClass.mask.msg = label_map.serverStopmsg;
							} else
								thisClass.mask.msg = response.statusText;

						}
					}
				});
	},

	portletRefresh : function() {
		if (this.mask != null) {
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.getSummaryPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
	},
	handleSummaryAutoRefresh : function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
					run : portlet.portletRefresh,
					interval : record.get('refreshInterval') * 100,
					scope : portlet
				});
		task.start();
		this.getSummaryPortlet().taskRunner = taskRunner;
	}
});