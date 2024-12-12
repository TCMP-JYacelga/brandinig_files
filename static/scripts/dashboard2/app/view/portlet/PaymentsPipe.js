Ext.define('Cashweb.view.portlet.PaymentsPipe', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.paymentspipe',
	padding : '100 10 15 10',
	requires : ['Cashweb.store.PaymentsPipeStore'],
	cls : 'xn-ribbon ux_panel-transparent-background',
	cols : 3,
	strFilter : '',
	filterJson : '',
	titleId : '',
	dateFilterVal : '12',
	dateFilterFromVal : null,
	dateFilterToVal : null,
	datePickerCreatedDate : [],
	enableQueryParam : false,
	objClientStore : null,
	height:336,
	initComponent : function() {
		var me = this;
		me.on('refreshWidget', function() {
					var record = me.record, settings = [];
					var filterUrl = '';
					var isClientPresent = false, isCategoryPresent = false, datePresentFlag = false;
					if (!Ext.isEmpty(record.get('settings'))){
						settings = record.get('settings');
						me.filterJson = settings;
					}
					filterUrl = me.generateUrl(settings);
					me.ajaxRequest(filterUrl, settings);
				});
		me.on('render', function() {
					var record = me.record, settings = [];
					var filterUrl = '';
					var isClientPresent = false, isCategoryPresent = false, datePresentFlag = false;
					if (!Ext.isEmpty(record.get('settings'))){
						settings = record.get('settings');
						me.filterJson = settings;
					}						
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'Client') {
							isClientPresent = true;
							continue;
						}
						if (settings[i].field === 'EntryDate') {
							datePresentFlag = true;
							continue;
						}
					}
					if (!datePresentFlag) 
					{
						var objDateParams = me.getDateParam("5", null);
						vFromDate = $.		datepick.formatDate(strApplDateFormat.toLowerCase(), 
						$.
							datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue1));
							
							vToDate = $.	datepick.
							formatDate(strApplDateFormat.toLowerCase(), $.
							
							datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue2));
							settings.push({
									field : 'EntryDate',
									operator : (!Ext.isEmpty(vToDate)) ? 'bt' : 'eq',
									value1 : Ext.util.Format.date(vFromDate, 'Y-m-d'),
									value2 : Ext.util.Format.date(vToDate, 'Y-m-d'),
									dateLabel : getLabel("creationDate", "Creation Date") + " (" + getLabel("thismonth","This Month") + ")",
									dataType : 'D',
									displayType : 5,
									btnValue : "5"
								});
						}
					me.record.set('settings', settings);
					filterUrl = me.generateUrl(settings);
					me.ajaxRequest(filterUrl, settings);
				});
		me.on('boxready', function() {
					me.setHeight(100);
				});
		var strHtml = Ext.String
				.format(
						'<div id="{0}" class="extrapadding" width="180" height="200"> </div>',
						me.getId())
		me.update(strHtml);
		me.callParent(arguments);
	},
	ajaxRequest : function(filterUrl, settings) {
		var obj;
		var me = this;
		me.setTitle(settings);
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = filterUrl || {}, arrMatches;
		if (me.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(filterUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/getPaymentsPipelineData.json',
					method : "POST",
					params : objParam,
					success : function(response) {
						if (response.status == 200
								&& response.statusText == "OK") {
							var arrStatus = ["Repair", "Submit", "Authorize",
									"Rejected", "Send", "Under Process",
									"History", "Failed"];
							var responseObj = Ext.decode(response.responseText);
							responseObj = me.generateJson(
									responseObj.summary.d.commonDataTable[0],
									arrStatus);

							if (!Ext.isEmpty(responseObj)) {
								me.show();
								me.showPendingPayments(responseObj);
							} else
								me.hide();
						}
						me.setHeight(336);
						me.getTargetEl().unmask();
						me.setRefreshLabel();
					},
					failure : function(response) {
						thisClass.getTargetEl().unmask();
						thisClass.setLoading(false);
					}
				});

	},
	generateJson : function(objJson, arrStatus) {
		var me = this;
		var arrData = [];
		$.each(arrStatus, function(index, opt) {
			var objTemp = {};
			switch (arrStatus[index]) {
				case "Repair" :
					objTemp = {
						"batches" : objJson ? objJson.TOTAL_REPAIR_BATCH : 0,
						"count1" : objJson ? objJson.REPAIR_COUNT_1 : 0,
						"count2" : objJson ? ((objJson.REPAIR_COUNT_2 >= 0)
								? objJson.REPAIR_COUNT_2
								: 0) : 0,
						"key" : "Repair"
					};
					break;
				case "Submit" :
					objTemp = {
						"batches" : objJson ? objJson.TOTAL_SUBMIT_BATCH : 0,
						"count1" : objJson ? objJson.SUBMIT_COUNT_1 : 0,
						"count2" : objJson ? ((objJson.SUBMIT_COUNT_2 >= 0)
								? objJson.SUBMIT_COUNT_2
								: 0) : 0,
						"key" : "Submit"
					};
					break;
				case "Authorize" :
					objTemp = {
						"batches" : objJson ? objJson.TOTAL_AUTH_BATCH : 0,
						"count1" : objJson ? objJson.AUTH_COUNT_1 : 0,
						"count2" : objJson ? ((objJson.AUTH_COUNT_2 >= 0)
								? objJson.AUTH_COUNT_2
								: 0) : 0,
						"key" : "Authorize"
					};
					break;
				case "Rejected" :
					objTemp = {
						"batches" : objJson ? objJson.TOTAL_REJECT_BATCH : 0,
						"count1" : objJson ? objJson.REJECT_COUNT_1 : 0,
						"count2" : objJson ? ((objJson.REJECT_COUNT_2 >= 0)
								? objJson.REJECT_COUNT_2
								: 0) : 0,
						"key" : "Rejected"
					};
					break;
				case "Send" :
					objTemp = {
						"batches" : objJson ? objJson.TOTAL_SEND_BATCH : 0,
						"count1" : objJson ? objJson.SEND_COUNT_1 : 0,
						"count2" : objJson ? ((objJson.SEND_COUNT_2 >= 0)
								? objJson.SEND_COUNT_2
								: 0) : 0,
						"key" : "Send"
					};
					break;
				case "Under Process" :
					objTemp = {
						"batches" : objJson
								? objJson.IN_PROCESS_BATCH_COUNT
								: 0,
						"count1" : objJson ? objJson.IN_PROCESS_COUNT_1 : 0,
						"count2" : 0,
						"key" : "Under Process"
					};
					break;
				case "History" :
					objTemp = {
						"batches" : objJson ? objJson.PROCESSED_BATCH_COUNT : 0,
						"count1" : objJson ? objJson.PROCESSED_COUNT_1 : 0,
						"count2" : 0,
						"key" : "History"
					};
					break;
				case "Failed" :
					objTemp = {
						"batches" : objJson ? objJson.FAILED_BATCH_COUNT : 0,
						"count1" : objJson ? objJson.FAILED_COUNT_1 : 0,
						"count2" : 0,
						"key" : "Failed"
					};
					break;
			}
			arrData.push(objTemp);
		});
		return arrData;
	},
	processPaymentPipeline : function(data) {
		var arrResponse = data;
		var dataObj = {}, objTemp = {};
		var objMeta = [{
			'desc' : 'Customer',
			'avilableStatus' : ['Repair', 'Submit', 'Authorize', 'Rejected',
					'Send'],
			'statusValues' : []
		}, {
			'desc' : 'Bank',
			'avilableStatus' : ['Under Process', 'History', 'Failed'],
			'statusValues' : []
		}];
		$.each(arrResponse, function(index, opt) {
					dataObj[opt.key] = opt;
				});

		$.each(objMeta, function(key, obj) {
					obj['statusValues'] = [];
					$.each(obj.avilableStatus, function(index, value) {
								if (dataObj[value]) {
									objTemp = dataObj[value];
									objTemp.desc = value;
									objTemp.batches = objTemp.batches === null
											? 0
											: objTemp.batches;
									objTemp.count1 = objTemp.count1 === null
											? 0
											: objTemp.count1;
									objTemp.count2 = objTemp.count2 === null
											? 0
											: objTemp.count2;
									obj['statusValues'].push(objTemp);
								}
							});
				});
		return objMeta;
	},
	showPendingPayments : function(data) {
		var me = this;
		var divId = Ext.String.format('{0}', me.getId());
		$("#" + divId).T7DataPipe({
					processColors : true,
					metaData : me.processPaymentPipeline(data)
				});
		me.setLoading(false);
		me.doComponentLayout();
	},
	setTitle : function(settings) {
		var me = this;
		var titleChangeFlag = false;
		for (var i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			if (fieldName === 'customname' && !Ext.isEmpty(fieldVal)) {
				me.up('panel').setTitle(fieldVal + '<span id=' + me.titleId
						+ '>&nbsp;&nbsp;</span> ');
				titleChangeFlag = true;
				break;
			}
		}
		if (!titleChangeFlag) {
			var defaultTitle = label_map[me.record.get('widgetCode')
					.toLowerCase()];
			me.up('panel').setTitle(defaultTitle + '<span id=' + me.titleId
					+ '>&nbsp;&nbsp;</span> ');
		}
	},

	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					minHeight : 156,
					maxHeight : 550,
					height:336,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					width : (screen.width) > 1024 ? 830 : 830,
					modal : true,
					resizable : false,
					draggable : false,
					items : me.getSettingsPanel(),
					listeners : {
						resize : function() {
							this.center();
						}
					},
					bbar : [{
								text : getLabel("cancel", "Cancel"),
								//cls : 'ux-button-s ft-button-secondary footer-btns',
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save", "Save"),
								//cls : 'ux-button-s footer-btns',
								handler : function() {
									var settings = me.getSettings(this
											.up('window'));
									me.record.set('settings', settings);
									me.filterJson = settings;
									me.setLoading(label_map.loading);
									var filterUrl = me.generateUrl(settings);
									me.ajaxRequest(filterUrl, settings);
									me.up('panel').fireEvent('saveSettings',
											record, settings);
									this.up('window').close();
								}
							}]
				});
		portletSettings.show();
		//me.addMyProductsMenuItems(portletSettings);
		me.addClientMenu(portletSettings);
		me.addDatePanel(portletSettings);
		me.addDateMenu(portletSettings);
		me.setSettings(portletSettings, me.record.get('settings'));
	},
	getSettingsPanel : function() {
		var thisClass = this;
		var settingsPanel = Ext.create('Ext.panel.Panel', {
			//padding : '10 10 10 10',
			items : [{
				xtype : 'container',
				layout : {
					type : 'column',
					pack : 'center'
				},
				cls : 'ft-padding-bottom',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					cls : 'pagesetting',
					items : [{
						xtype : 'label',
						text : getLabel("paymentCategory",
						"Payment Category"),
						cls : 'f13 ux_font-size14 ',
						padding : '0 0 2 0'
					}, {	
							xtype : 'checkcombo',
							valueField : 'instTypeCode',
							displayField : 'instTypeDescription',
							editable : false,
							addAllSelector : true,
							emptyText : getLabel('all','All'),
							multiSelect : true,
							//width  : (screen.width) > 1024 ? 242 : 242,
							width : '100%',
							padding : '-4 0 0 0',
							itemId : 'payCategory',
							//isQuickStatusFieldChange : false,
							store : thisClass.getPaymentCategoryStore()
						}]
				}, {
					xtype : 'container',
					layout : 'vbox',
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-right ft-smallMargin-left pagesetting',
					items : [{
								xtype : 'label',
								text : getLabel("paymentMethod",
										"Payment Package"),
								cls : 'frmLabel'
							}, {
								xtype : 'checkcombo',
								editable : false,
								addAllSelector : true,
								multiSelect : true,
								itemId : 'payMethod',
								valueField : 'CODE',
								displayField : 'PRDDESCR',
								hideTrigger : true,
								width : '100%',
								store : thisClass.getPaymentMethodStore()
							
							}]
				}, {
					xtype : 'container',
					layout : 'hbox',
					columnWidth : 0.3333,
					cls : 'ft-extraLargeMargin-left',
					hidden : ((thisClass.getClientStore().getCount() <= 2) || !isClientUser) ? true : false,//If count is one or admin then hide
					items : [{
								xtype : 'textfield',
								fieldLabel : getLabel('company', 'Company Name'),
								labelPad : 2,
								labelWidth : 55,
								readOnly : true,
								labelAlign : 'top',
								labelCls : 'frmLabel',
								labelSeparator : '',
								itemId : 'Client',
								fieldCls : 'ux_no-border-right xn-form-field',
								width : (screen.width) > 1024 ? 215 : 215,
								name : 'Client',
								clientCodesData : ''
							}, {
								xtype : 'button',
								border : 0,
								margin : '19 0 0 0',
								itemId : 'clientBtn',
								cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								glyph : 'xf0d7@fontawesome',
								height : 36,
								menuAlign : 'tr-br',
								menu : Ext.create('Ext.menu.Menu', {
									itemId : 'clientMenu',
									width : (screen.width) > 1024 ? 215 : 215,
									cls : 'ux_dropdown ux_dropdown-no-leftpadding',
									maxHeight : 200,
									items : []
								}),
								handler : function(btn, event) {
									btn.menu.show();
								}
							}]
				}]
			}, {
				xtype : 'container',
				layout : 'column',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'vbox',
					itemId : 'completDatePanel',
					columnWidth : 0.3344,
					cls : 'ft-extraLargeMargin-right',
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
							xtype : 'label',
							itemId : 'creationDateLbl',
							name : 'creationDateLbl',
							text : getLabel("creationDate", "Creation Date"),
							style : {
								'padding-right' : '10px !important'
							},
							cls : 'widget_date_menu',
							listeners : {
								render : function(c) {
									var tip = Ext.create('Ext.tip.ToolTip', {
										target : c.getEl(),
										listeners : {
											beforeshow : function(tip) {
												if (creation_date_opt === null)
													tip.update(getLabel("creationDate", "Creation Date"));
												else
													tip
															.update(creation_date_opt);

											}
										}
									});
								}
							}
						}, {
							xtype : 'button',
							border : 0,
							itemId : 'creationDateBtn',
							margin : '7 0 0 0',
							menuAlign : 'tr-br',
							name : 'creationDateBtn',
							cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
							glyph : 'xf0d7@fontawesome',
							menu : Ext.create('Ext.menu.Menu', {
										itemId : 'dateMenu',
										width : 175,
										cls : 'ux_dropdown ux_dropdown-no-leftpadding',
										maxHeight : 200,
										items : []
									})

						}]
					}, {
						xtype : 'container',
						itemId : 'CreateDate',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'dateFilterFrom',
									name : 'dateFilterFrom',
									btnValue : ''
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo',
									name : 'dateFilterTo'
								}]
					}]
				}, {
						xtype : 'container',
						itemId : 'Widgetname',
						layout : 'vbox',
						columnWidth : 0.3344,
						cls : 'ft-smallMargin-right ft-smallMargin-left',
						items : [{
									xtype : 'label',
									itemId : 'widgetLabel',
									text : getLabel("widgetName", "Widget Name"),
									cls : 'frmLabel',
									margin : '1 0 6 0'
								},{
									xtype : 'textfield',
									hideTrigger : true,
									columnWidth : 0.3333,
									cls : 'ft-smallMargin-right ft-smallMargin-left',
									itemId : 'customname',
									btnValue : '',
									fieldCls : 'xn-form-text',
									width : (screen.width) > 1024 ? 239 : 239,
									labelCls : 'frmLabel',
									name : 'customname',
									maxLength : 40, // restrict user to enter 40 chars
									// max
									margin : '1 0 0 0',//Top Right Bottom Left
									enforceMaxLength : true,
									maskRe : /[A-Za-z0-9 .]/
								}]
					
				}]
			}]
		});
		return settingsPanel;
	},

	setSettings : function(widget, settings) {
	var me = this;
		var strSqlDateFormat = 'm/d/Y';
		var temp = widget.down('label[itemId="creationDateLbl"]');
		if (temp.text == "Creation Date") {
			var dateFilterLabel = getLabel("creationDate", "Creation Date")+"("+getLabel('latest','Latest')+")";
			widget.down('label[itemId="creationDateLbl"]')
					.setText(dateFilterLabel);
			creation_date_opt = dateFilterLabel;
		}
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;

			if (fieldName === 'Client') {
				var clientField = widget.down('textfield[itemId=Client]');
				var clientFieldContainer = clientField.up('container');
				if (!Ext.isEmpty(clientField) && clientFieldContainer.hidden != true) {
					if (!Ext.isEmpty(fieldVal2))
						clientField.setValue(fieldVal2);
					clientField.clientCodesData = fieldVal;
				}
			}
			if (fieldName === 'InstrumentType') {
				var paymentCategoryCombo = widget
						.down('checkcombo[itemId="payCategory"]');
				var values = fieldVal.split(',');
				if (!(Ext.isEmpty(paymentCategoryCombo) || Ext.isEmpty(values))) {
					if (!Ext.isEmpty(fieldVal))
						paymentCategoryCombo.setValue(values);
				}
			}
			if (fieldName === 'ProductType') {
				var paymentMethodCombo = widget
						.down('checkcombo[itemId="payMethod"]');
				var values = fieldVal.split(',');
				if (!(Ext.isEmpty(paymentMethodCombo) || Ext.isEmpty(values))) {
					if (!Ext.isEmpty(fieldVal))
						paymentMethodCombo.setValue(values);
				}
			}
			if (fieldName === 'EntryDate') {
				var dateFilterLabel = settings[i].dateLabel;
				var dateVar1 = $.datepick.parseDate('yyyy-mm-dd', fieldVal);
				var dateVar2 = $.datepick.parseDate('yyyy-mm-dd', fieldVal2);
				var vFromDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), dateVar1 );
				var vToDate = $.datepick.formatDate(strApplDateFormat.toLowerCase(), dateVar2 );

				creation_date_opt = dateFilterLabel;

				$('#entryDatePickerQuickText').datepick({
								monthsToShow : 1,
								changeMonth : true,
								changeYear : true,
								dateFormat : strApplDateFormat.toLowerCase(),
								rangeSeparator : '  to  ',
								minDate : dtHistoryDate,
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
											me.dateFilterVal = '7';
											me.datePickerCreatedDate = dates;
											me.dateFilterLabel = getLabel('daterange','Date Range');
											var dtParams = me.getDateParamForDateRange(me.dateFilterVal, dates[0],dates[1]);
											me.dateFilterFromVal = dtParams.fieldValue1;
											me.dateFilterToVal = dtParams.fieldValue2;
									}
								}
							});
				widget.down('label[itemId="creationDateLbl"]').setText(dateFilterLabel);
				widget.down('container[itemId="dateRangeComponent"]').show();
				var datePickerRef = $('#entryDatePickerQuickText');
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}

			if (fieldName === 'customname') {
				var customnameField = widget
						.down('textfield[itemId=customname]');
				if (!Ext.isEmpty(customnameField)) {
					if (!Ext.isEmpty(fieldVal))
						customnameField.setValue(fieldVal);
				}
			}

		}
	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var thisClass = this;
		var jsonArray = [];
		// Client
		var clientCode = me.down('textfield[itemId="Client"]').clientCodesData;
		var clientDesc = me.down('textfield[itemId="Client"]').getValue();
		var clientField = me.down('textfield[itemId=Client]');
		var clientFieldContainer = clientField.up('container');
		if (!Ext.isEmpty(clientField) && clientFieldContainer.hidden != true) {
			if (!Ext.isEmpty(clientCode) && clientCode != 'all') {
				jsonArray.push({
							field : 'Client',
							operator : 'eq',
							value1 : clientCode,
							value2 : clientDesc,
							displayValue1 : clientDesc,
							dataType : 'S',
							displayType : 5
						});
			}
		}

		// Payment Category
		var paymentCategoryCombo = me.down('checkcombo[itemId="payCategory"]');
		if (!(Ext.isEmpty(paymentCategoryCombo.getValue()) || paymentCategoryCombo.isAllSelected())) {
			jsonArray.push({
						field : 'InstrumentType',
						operator : 'in',
						value1 : paymentCategoryCombo.getValue(),
						value2 : paymentCategoryCombo.getRawValue(),
						dataType : 0,
						displayType : 6
					});
		}

		// Payment Method
		var paymentMethodCombo = me.down('checkcombo[itemId="payMethod"]');
		if (!(Ext.isEmpty(paymentMethodCombo.getValue()) || paymentMethodCombo.isAllSelected())) {
			jsonArray.push({
						field : 'ProductType',
						operator : 'in',
						value1 : paymentMethodCombo.getValue(),
						value2 : paymentMethodCombo.getRawValue(),
						dataType : 0,
						displayType : 6
					});
		}

		// custom Name
		var customnameValue = me.down('textfield[itemId="customname"]')
				.getValue();
		if (!Ext.isEmpty(customnameValue)) {
			jsonArray.push({
						field : 'customname',
						operator : 'eq',
						value1 : customnameValue,
						dataType : 0,
						displayType : 6
					});
		}

		// Creation Date
		var dateLabel = me.down('label[itemId="creationDateLbl"]').text;
		var fromCreation, toCreation, creationFromDate, creationToDate;
		
			var portlet2 = me.down('container[itemId="completDatePanel"]');
			var daterange = portlet2.down('container[itemId="dateRangeComponent"]');
			
			var fieldVal = Ext.util.Format.date(Ext.Date.parse(thisClass.dateFilterFromVal, 'Y-m-d'),strExtApplicationDateFormat);
			var fieldVal2 = Ext.util.Format.date(Ext.Date.parse(thisClass.dateFilterToVal, 'Y-m-d'),strExtApplicationDateFormat);
			
			
			fromCreation = fieldVal;
			toCreation = fieldVal2;
			if (Ext.isEmpty(toCreation)) {
				toCreation = fromCreation;
			}
			creationFromDate = fromCreation;
			creationToDate = toCreation;
			
		if (!(creationFromDate instanceof Date)
				&& (!creationFromDate.replace(/\s/g, '').length)) {
			creationFromDate = '';
		}
		if (!Ext.isEmpty(creationFromDate)) {
			jsonArray.push({
						field : 'EntryDate',
						operator : (!Ext.isEmpty(creationToDate)) ? 'bt' : 'eq',
						value1 : Ext.util.Format.date(creationFromDate, 'Y-m-d'),
						value2 : Ext.util.Format.date(creationToDate, 'Y-m-d'),
						dateLabel : dateLabel,
						dataType : 'D',
						displayType : 5,
						btnValue : thisClass.dateFilterVal
					});
		}
		return jsonArray;
	},
	getDataPanel : function() {
		return this;
	},
	setRefreshLabel : function() {
		var thisClass = this;
		$("#" + thisClass.titleId).empty();
		var label = Ext.create('Ext.form.Label', {
					text : getLabel('asof',"As of ")+ displaycurrenttime(),
					margin : '0 0 0 5',
					style : {
						'font-size' : '14px !important',
						'font-weight' : 'bold',
						'position' : 'absolute',
						'right' : '50px',
						'color' : '#67686b'
					},
					renderTo : Ext.get(thisClass.titleId)
				});
	},
	addClientMenu : function(summaryPortlet) {
		var menuRef = summaryPortlet.down('menu[itemId="clientMenu"]');
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json?$top=-1&$skip=-1',
			method : 'POST',
			async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences;
				if (data && data.d) {
						clientData = data.d.preferences;
						me.objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE',
											'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All Companies')
													});
										}
									}
								});
						me.objClientStore.load();
				}
				var count = data.length;
				if (menuRef.items.length > 0) {
					menuRef.removeAll();
				}
				if (count > 0) {
					if (count > 1) {
						menuRef.add({
									text : getLabel('allCompanies',
											'All companies'),
									clientCode : 'all',
									handler : function(item, opts) {
										var clientField = summaryPortlet
												.down('textfield[itemId="Client"]');
										clientField.setValue(item.text);
										clientField.clientCodesData = item.clientCode;
									}
								});
					}

					for (var index = 0; index < count; index++) {
						menuRef.add({
									text : data[index].DESCR,
									clientCode : data[index].CODE,
									handler : function(item, opts) {
										var clientField = summaryPortlet
												.down('textfield[itemId="Client"]');
										clientField.setValue(item.text);
										clientField.clientCodesData = item.clientCode;
									}
								});
					}
					summaryPortlet.down('textfield[itemId="Client"]')
							.setValue(menuRef.items.items[0].text);
					summaryPortlet.down('textfield[itemId="Client"]').clientCodesData = menuRef.items.items[0].clientCode;
				}
			},
			failure : function(summaryPortlet) {
			}
		});
	},
	addDatePanel : function(portletSettings) {
		var me = this;
		var dateParentPanel = Ext.create('Ext.panel.Panel', {
					cls : 'xn-filter-toolbar',
					layout : 'hbox',
					flex : 0.7,
					itemId : 'ParentPanel',
					items : []
				});
		me.addDateContainerPanel(dateParentPanel, portletSettings);
	},
	checkInfinity : function(intFilterDays) {
		if (intFilterDays == '0' || Ext.isEmpty(intFilterDays)) {
			return true;
		}
	},
	addDateMenu : function(portletSettings) {
		var me = this;
		var intFilterDays = me.filterRestrict;
		intFilterDays = filterDays;
		var arrMenuItem = portletSettings.down('menu[itemId="dateMenu"]');
		arrMenuItem.add({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					parent : me,
					btnValue : '12',
					handler : function(btn, opts) {
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(portletSettings, btn.btnValue);
					}
				});

		if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : me,
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : me,
						btnValue : '4',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : me,
						btnValue : '5',
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : me,
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : me,
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
			arrMenuItem.add({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : me,
						handler : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(portletSettings, btn.btnValue);
						}
					});

		arrMenuItem.add({
					text :getLabel('daterange','Date Range'),
					btnId : 'btnDateRange',
					btnValue : '7',
					parent : me,
					handler : function(btn, opts) {
						me.dateFilterVal = btn.btnValue;
						me.dateFilterLabel = btn.text;
						me.handleDateChange(portletSettings, btn.btnValue);
					}
				});
	},
	addDateContainerPanel : function(dateParentPanel, portletSettings) {
		var me = this;
		var dateContainerPanel = Ext.create('Ext.panel.Panel', {
			layout : 'hbox',
			items : [{
						xtype : 'container',
						itemId : 'dateRangeComponent',
						layout : 'hbox',
						hidden : true,
						items : [{
								xtype : 'component',
								width : '224px',
								margin : '1 -2 0 1',//Top Right Bottom Left
								itemId : 'entryDatePickerQuick',
								filterParamName : 'EntryDate',
								endDateField : 'toDate',
								startDateField : 'fromDate',
								html : '<input type="text"  id="entryDatePickerQuickText" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
							},{
								itemId : 'entryDateFaFaCalender',
								xtype : 'component',
								margin : '2 0 0 -9',//Top Right Bottom Left
								cls : 'icon-calendar',
								html : '<span class=""><i class="fa fa-calendar"></i></span>'
							}]
				}]
		});
		dateParentPanel.add(dateContainerPanel);
		portletSettings.down('container[itemId="completDatePanel"]')
				.add(dateParentPanel);
	},
	handleDateChange : function(portlet2, index) {
		var me = this;
		var objDateParams = me.getDateParam(index, null);
		var datePickerRef = $('#entryDatePickerQuickText');
		if(index === '7')
		{
			objDateParams = me.getDateParamForDateRange(index, null);
		}	
		else
		{
			objDateParams = me.getDateParam(index, null);		
			me.dateFilterFromVal = objDateParams.fieldValue1;
			me.dateFilterToVal = objDateParams.fieldValue2;
		}
			
		vFromDate = $.		datepick.
		formatDate(strApplDateFormat.toLowerCase(), $.
		datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue1));
		
		vToDate = $.	datepick.
		formatDate(strApplDateFormat.toLowerCase(), $.
		datepick.		parseDate('yyyy-mm-dd', objDateParams.fieldValue2));
		
		if (!Ext.isEmpty(me.dateFilterLabel)) 
		{
			creation_date_opt = "Creation Date (" + me.dateFilterLabel + ")";
			portlet2.down('label[itemId="creationDateLbl"]')
					.setText(getLabel("creationDate", "Creation Date") + " (" + me.dateFilterLabel + ")");
		}
		var datePickerRef = $('#entryDatePickerQuickText');
		
		portlet2.down('container[itemId="dateRangeComponent"]').show();
		if(vFromDate != '' && vToDate != '')
			datePickerRef.datepick('setDate', [vFromDate, vToDate]);
		else if(vFromDate != ''  && vToDate == '')
			datePickerRef.datepick('setDate', vFromDate);
		
		$('#entryDatePickerQuickText').datepick({
					monthsToShow : 1,
					changeMonth : false,
					dateFormat : strApplDateFormat.toLowerCase(),
					rangeSeparator : '  to  ',
					onClose : function(dates) {
						if (!Ext.isEmpty(dates)) {
							me.dateFilterVal = '7';
							me.datePickerCreatedDate = dates;
							me.dateFilterLabel = getLabel('daterange','Date Range');
							var dtParams = me.getDateParamForDateRange(me.dateFilterVal, dates[0],dates[1]);
							me.dateFilterFromVal = dtParams.fieldValue1;
							me.dateFilterToVal = dtParams.fieldValue2;
						}
					}
				}).show();

		if($('#entryDatePickerQuickText').datepick('getDate'))
		 me.datePickerCreatedDate = $('#entryDatePickerQuickText').datepick('getDate');
	},
	getDateParamForDateRange : function(index, fromDate, toDate) {
		var me = this;
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		switch (index) {
			case '7' :
				// Date Range
				fieldValue1 = Ext.Date.format(fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				if(Ext.isEmpty(fieldValue2)){
					operator = 'eq';					
				}else{
					operator = 'bt';
				}
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.btnValue = index;
		return retObj;
	},
	getDateParam : function(index, dateType) {
		var me = this;
		var objDateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		switch (index) {
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '12' :
				 //Latest
				 fieldValue1 = Ext.Date.format(date,
				 strSqlDateFormat);
				 fieldValue2 = fieldValue1;
				 operator = 'le';
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.btnValue = index;
		return retObj;
	},
	generateUrl : function(settings) {
		var me = this;
		var filterUrl = '';
		var isFilterApplied = false;
		var navigationFilterUrl = '';
		if (!Ext.isEmpty(settings)) {
			for (var index = 0; index < settings.length; index++) {
				if (settings[index].field != 'customname') {
					// Logic to generate url for navigation to Payment
					// summaryscreen

					switch (settings[index].field) {
						case 'Client' :
							if (isFilterApplied) {
								navigationFilterUrl = navigationFilterUrl
										+ ' and ';
								isFilterApplied = false;
							}
							filterUrl += '&$clientFilter='
									+ settings[index].value1;
							navigationFilterUrl = navigationFilterUrl
									+ settings[index].field + ' '
									+ settings[index].operator + ' ' + '\''
									+ settings[index].value1 + '\'';
							isFilterApplied = true;
							break;
						case 'InstrumentType' :
							if (isFilterApplied) {
								navigationFilterUrl = navigationFilterUrl
										+ ' and ';
								isFilterApplied = false;
							}
							filterUrl += '&$prdCategory='
									+ settings[index].value1;
							
							var objValue = settings[index].value1;
							var objArray = objValue.split(',');
							if (objArray.length > 0) {
								if (objArray[0] != 'All') {
									isFilterApplied = true;
									navigationFilterUrl = navigationFilterUrl
											+ '(';
									for (var i = 0; i < objArray.length; i++) {
										navigationFilterUrl = navigationFilterUrl
												+ settings[index].field
												+ ' eq ';
										navigationFilterUrl = navigationFilterUrl
												+ '\'' + objArray[i] + '\'';
										if (i != objArray.length - 1)
											navigationFilterUrl = navigationFilterUrl
													+ ' or ';
									}
									navigationFilterUrl = navigationFilterUrl
											+ ')';
								}
							}
							isFilterApplied = true;
							break;
						case 'ProductType' :
							if (isFilterApplied) {
								navigationFilterUrl = navigationFilterUrl
										+ ' and ';
								isFilterApplied = false;
							}
							filterUrl += '&$prdCode=' + settings[index].value1;
							var objValue = settings[index].value1;
							var objArray = objValue.split(',');
							if (objArray.length > 0) {
								if (objArray[0] != 'All') {
									isFilterApplied = true;
									navigationFilterUrl = navigationFilterUrl
											+ '(';
									for (var i = 0; i < objArray.length; i++) {
										navigationFilterUrl = navigationFilterUrl
												+ settings[index].field
												+ ' eq ';
										navigationFilterUrl = navigationFilterUrl
												+ '\'' + objArray[i] + '\'';
										if (i != objArray.length - 1)
											navigationFilterUrl = navigationFilterUrl
													+ ' or ';
									}
									navigationFilterUrl = navigationFilterUrl
											+ ')';
								}
							}
						isFilterApplied = true;
							break;
						case 'EntryDate' :
							filterUrl += '&$fromDate=' + settings[index].value1;
							filterUrl += '&$toDate=' + settings[index].value2;
							if (isFilterApplied) {
								navigationFilterUrl = navigationFilterUrl
										+ ' and ';
								isFilterApplied = false;
							}

							  navigationFilterUrl = navigationFilterUrl + 
							  '(' + settings[index].field + ' ' +
							  settings[index].operator + ' ' + 'date\'' +
							  Ext.util.Format.date(settings[index].value1,
							  'Y-m-d') + '\'' + ' and ' + 'date\'' +
							  Ext.util.Format.date(settings[index].value2,
							  'Y-m-d') + '\'' + ')'; 
							  isFilterApplied = true;
							 
							break;
					}
				}
			}
			me.strFilter = navigationFilterUrl
		}
		return filterUrl;
	},
	getClientStore:function(){
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE',
											'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All Companies')
													});
										}
									}
								});
						objClientStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objClientStore;
	},
	getPaymentCategoryStore : function(thisClass) {
		var data;
		Ext.Ajax.request({
			url : 'services/paymentMethod.json',
			async : false,
			method : 'GET',
			success : function(response) {
				if(!Ext.isEmpty(response) && !Ext.isEmpty(response.responseText)){
					var responseData = Ext.decode(response.responseText);
					data = getJsonObj(responseData.d.instrumentType);
				}
			},
			failure : function() {
			}
		});
		var pmtCategoryStore = null;
		if (!Ext.isEmpty(data)) {
			pmtCategoryStore = Ext.create('Ext.data.Store', {
						fields : ['instTypeCode', 'instTypeDescription'],
						data : data,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			pmtCategoryStore.load();
		}
		return pmtCategoryStore;
	},
	getPaymentMethodStore : function() {
		var me = this;
		var paymentMethodStore = null;
		var paymentMethodStoreData = null;
		Ext.Ajax.request({
			url : 'services/userseek/usermyproducts.json?$top=-1&$skip=-1&$filterCode1=' + me.selectedClientCode,
			method : 'GET',
			async : false,
			success : function(response) {
				paymentMethodStoreData = Ext.decode(response.responseText).d.preferences;
			},
			failure : function() {
				
			}
		});
		if (!Ext.isEmpty(paymentMethodStoreData)) {
			paymentMethodStore = Ext.create('Ext.data.Store', {
				fields : ['CODE','PRDDESCR'],
				data : paymentMethodStoreData
			});
		}
		return paymentMethodStore;
	}
});