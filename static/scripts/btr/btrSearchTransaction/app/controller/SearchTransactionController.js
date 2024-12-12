Ext.define('GCP.controller.SearchTransactionController', {
	extend : 'Ext.app.Controller',
	views : ['GCP.view.SearchTransactionView',
			'GCP.view.SearchTransactionFilterView',
			'GCP.view.SearchTransactionFilterSummaryView',
			'GCP.view.SearchTransactionAddTemplatePopUpView',
			'GCP.view.SearchTransactionNewTemplateTabView',
			'GCP.view.SearchTransactionTemplateListTabView',
			'GCP.view.SearchTransactionTemplateTabGridView'],
	refs : [{
				ref : 'searchTransactionView',
				selector : 'searchTransactionView'
			}, {
				ref : 'searchTransactionFilterView',
				selector : 'searchTransactionFilterView'
			}, {
				ref : 'dateLabel',
				selector : 'searchTransactionFilterView label[itemId="dateLabel"]'
			}, {
				ref : 'toDateLabel',
				selector : 'searchTransactionFilterView label[itemId="toDateLabel"]'
			}, {
				ref : 'fromDateLabel',
				selector : 'searchTransactionFilterView label[itemId="fromDateLabel"]'
			}, {
				ref : 'dateRangeComponent',
				selector : 'searchTransactionFilterView container[itemId="dateRangeComponent"]'
			}, {
				ref : 'fromEntryDate',
				selector : 'searchTransactionFilterView datefield[itemId="fromDate"]'
			}, {
				ref : 'toEntryDate',
				selector : 'searchTransactionFilterView datefield[itemId="toDate"]'
			}, {
				ref : 'btnTxnCategoryMenu',
				selector : 'searchTransactionFilterView button[itemId="btnTxnCategoryMenu"]'
			}, {
				ref : 'txnCatMenu',
				selector : 'searchTransactionFilterView menu[itemId="txnCatMenu"]'
			}, {
				ref : 'txnCategoryLabel',
				selector : 'searchTransactionFilterView label[itemId="txnCategoryLabel"]'
			}, {
				ref : 'templateToolBar',
				selector : 'searchTransactionFilterView toolbar[itemId="templateActionToolBar"]'
			}],
	config : {
		createNewTemplPopup : null,
		fromDateFilter : null,
		toDateFilter : null,
		dateFilterVal : '1',
		dateFilterLabel : getLabel('today', 'Today'),
		dateHandler : null,
		txnCategoryFilter : 'all',
		templateFilter : 'all',
		moreSeparator : null
	},
	init : function() {
		var me = this;
		me.dateHandler = this.getController('GCP.controller.DateHandler');
		var date = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		if (!Ext.isEmpty(objClientParameters)
				&& !Ext.isEmpty(objClientParameters.filterDays))
			clientFromDate = me.dateHandler.getDateBeforeDays(date,
					objClientParameters.filterDays);
		
		if (Ext.isEmpty(me.moreSeparator)) {
			var imgItem = Ext.create('Ext.Img', {
						src : 'static/images/icons/icon_spacer.gif',
						height : 16
					});

			me.moreSeparator = imgItem;
		}
					
		me.control({
					'searchTransactionView' : {
						beforerender : function(panel, opts) {
							me.handleTitleViewRenderByClientParams(panel);
							me.handleTemplateToolBar(panel);
						}
					},
					'searchTransactionFilterView' : {
						render : function(panel, opts) {
							me.populateTxnCatgeory(panel);
						},
						dateChange : function(btn, opts) {
							me.dateFilterIndex = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.setConfigDateRange(btn.btnValue);
							me.handleDateChange(btn.btnValue);
							if (btn.btnValue !== '7') {
								// me.setDataForFilter();
								// me.applyQuickFilter();
								// me.toggleSavePrefrenceAction(true);
							}
						}
					},
				'searchTransactionFilterView button[itemId="newFilter"]' : {
						newFilterClick : this.createNewTemplate
				},
			'searchTransactionAddTemplatePopUpView searchTransactionTemplateTabGridView' : {
				orderUpEvent : me.orderUpDown,
				deleteSearchTxnTemplate : me.deleteSearchTemplate,
				viewFilterEvent : me.viewFilterData,
				editFilterEvent : me.editFilterData,
				filterSearchEvent : me.searchFilterData
			}
				});
	},
	handleTitleViewRenderByClientParams : function(panel) {
		var me = this;
		var downloadReportContainer = panel
				.down('container[itemId="downloadReportContainer"]');
		var downloadReportBtn = panel.down('button[itemId="downloadReport"]');
		var spacerIcon = panel.down('image[itemId="spacerIcon"]');
		var exportIcon = panel.down('[itemId="exportBtnIcon"]');
		var exportBtn = panel.down('button[itemId="exportBtn"]');
		var exportMenu = panel.down('menu[itemId="exportMenu"]');

		me.hideShowDownloadReportBtn(downloadReportBtn);
		me.hideShowSpacerIcon(spacerIcon);
		me.hideShowExportBtn(exportBtn, exportIcon);
		me.hideShowExportOptions(exportMenu);

	},
	hideShowDownloadReportBtn : function(reportBtn) {
		var me = this;
		var boolVal = false;
		if (!Ext.isEmpty(objClientParameters)) {
			if (!Ext.isEmpty(objClientParameters.enableReport)) {
				var boolVal = objClientParameters.enableReport;
			}
		}
		reportBtn.hidden = !boolVal;
	},
	hideShowExportBtn : function(button, exportIcon) {
		var me = this;
		if (!Ext.isEmpty(objClientParameters)) {
			if (!Ext.isEmpty(objClientParameters.exportList)) {
				button.hidden = false;
				exportIcon.hidden = false;
			} else {
				button.hidden = true;
				exportIcon.hidden = true;
			}
		}
	},
	hideShowSpacerIcon : function(spacerIcon) {
		var me = this;
		if (!Ext.isEmpty(objClientParameters)) {
			if (!Ext.isEmpty(objClientParameters.exportList)) {
				if (!Ext.isEmpty(objClientParameters.enableReport)) {
					var boolVal = objClientParameters.enableReport;
					spacerIcon.hidden = !boolVal;
				}
			} else {
				spacerIcon.hidden = true;
			}
		}
	},
	hideShowExportOptions : function(menu) {
		var me = this;
		if (!Ext.isEmpty(objClientParameters)) {
			if (!Ext.isEmpty(objClientParameters.exportList)) {
				var exportArr = objClientParameters.exportList;
				Ext.each(exportArr, function(exprtEl) {
					switch (exprtEl) {
						case 'SXLSE' :
							var menuBtn = menu.down('[itemId="downloadXls"]');
							menuBtn.hidden = false;
							break;
						case 'SCSVE' :
							var menuBtnCSV = menu
									.down('[itemId="downloadCsv"]');
							menuBtnCSV.hidden = false;
							var menuBtnTSV = menu
									.down('[itemId="downloadTsv"]');
							menuBtnTSV.hidden = false;
							break;
						case 'SPDFE' :
							break;
						case 'A940E' :
							var menuBtn = menu.down('[itemId="downloadMt940"]');
							menuBtn.hidden = false;
							break;
						case 'ABAI2' :
							var menuBtn = menu.down('[itemId="downloadBAl2"]');
							menuBtn.hidden = false;
							break;
						case 'AQUBK' :
							var menuBtn = menu.down('[itemId="downloadqbook"]');
							menuBtn.hidden = false;
							break;
						default :
							break;
					}

				});
			}
		}
	},
	setConfigDateRange : function(index) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var dtJson = {};
		switch (index) {
			case '1' :
				// Today
				me.fromDateFilter = date;
				me.toDateFilter = date;
				me.operator = 'eq';
				break;
			case '2' :
				// Yesterday
				me.fromDateFilter = objDateHandler.getYesterdayDate(date);
				me.toDateFilter = me.fromDateFilter;
				operator = 'eq';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				me.fromDateFilter = dtJson.fromDate;
				me.toDateFilter = date;
				me.operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				me.fromDateFilter = dtJson.fromDate;
				me.toDateFilter = date;
				me.operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				me.fromDateFilter = dtJson.fromDate;
				me.toDateFilter = date;
				me.operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				me.fromDateFilter = dtJson.fromDate;
				me.toDateFilter = date;
				me.operator = 'bt';
				break;
			case '7' :
				// Date Range
				/*
				 * var frmDate = me.getFromEntryDate().getValue(); var toDate =
				 * me.getToEntryDate().getValue(); me.fromDateFilter =
				 * dtJson.fromDate; me.toDateFilter =
				 * objDateHandler.getYesterdayDate(date);
				 */
				me.operator = 'bt';
				break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				me.fromDateFilter = dtJson.fromDate;
				me.toDateFilter = date;
				me.operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				me.fromDateFilter = dtJson.fromDate;
				me.toDateFilter = date;
				me.operator = 'bt';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				me.fromDateFilter = dtJson.fromDate;
				me.toDateFilter = date;
				me.operator = 'bt';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				me.fromDateFilter = dtJson.fromDate;
				me.toDateFilter = date;
				me.operator = 'bt';
				break;
		}
		// comparing with client filter condition
		if (me.fromDateFilter < clientFromDate) {
			me.fromDateFilter = clientFromDate;
		}
	},
	handleDateChange : function(index) {
		var me = this;
		var date = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		var dateLabel = me.getDateLabel();
		var fromDateLabel = me.getFromDateLabel();
		var toDateLabel = me.getToDateLabel();
		var formattedFromDate = Ext.util.Format.date(Ext.Date.format(
						me.fromDateFilter, 'Y-m-d'),
				strExtApplicationDateFormat);
		var formattedToDate = Ext.util.Format.date(Ext.Date.format(
						me.toDateFilter, 'Y-m-d'), strExtApplicationDateFormat);

		if (!Ext.isEmpty(me.dateFilterLabel) && !Ext.isEmpty(dateLabel)) {
			if (index == '0') {
				dateLabel.setText(getLabel('date', 'Date'));
			} else {
				dateLabel.setText(getLabel('date', 'Date') + " ("
						+ me.dateFilterLabel + ")");
			}
		}

		if (!Ext.isEmpty(fromDateLabel) && !Ext.isEmpty(toDateLabel)) {
			if (index === '0' || index === '1' || index === '2') {
				fromDateLabel.setText(formattedFromDate);
				toDateLabel.setText("");
				me.getDateRangeComponent().hide();
				fromDateLabel.show();
				toDateLabel.hide();
			} else if (index == '7') {
				fromDateLabel.hide();
				toDateLabel.hide();
				me.getDateRangeComponent().show();
				me.getFromEntryDate().setValue(me.fromDateFilter);
				me.getFromEntryDate().setMaxValue(date);
				me.getFromEntryDate().setMinValue(clientFromDate);
				if (Ext.isEmpty(me.toDateFilter))
					me.getToEntryDate().setValue(me.fromDateFilter);
				else
					me.getToEntryDate().setValue(me.toDateFilter);
				me.getToEntryDate().setMinValue(clientFromDate);
				me.getToEntryDate().setMaxValue(date);
			} else {
				fromDateLabel.setText(formattedFromDate + " - ");
				toDateLabel.setText(formattedToDate);
				me.getDateRangeComponent().hide();
				fromDateLabel.show();
				toDateLabel.show();
			}
		}
	},
	populateTxnCatgeory : function(filterPanel) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/userseek/txncategorylist?$top=-1',
					method : "GET",
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var dataCount = data.d.preferences.length;
						if (!Ext.isEmpty(data)) {
							var txncatData = data.d.preferences;
							var count = txncatData.length;

							var flag = '';
							var btnMenuRef = me.getBtnTxnCategoryMenu();
							var menuRef = btnMenuRef.menu;

							menuRef.add({
										text : getLabel('all', 'All'),
										code : 'all',
										btnDesc : getLabel('all', 'All'),
										handler : function(btn, opts) {
											me.handleTxnCategoryChange(btn);
										}
									});
							for (var i = 0; i < count; i++) {
								menuRef.add({
											text : txncatData[i].DESCR,
											code : txncatData[i].CODE,
											btnDesc : txncatData[i].DESCR,
											handler : function(btn, opts) {
												me.handleTxnCategoryChange(btn);
											}
										});
							}
						}
					},
					failure : function(response) {
						// console.log('Error
						// Occured-handleAccountTypeLoading');
					}
				});
	},
	handleTxnCategoryChange : function(btn) {
		var me = this;
		var txnLabel = me.getTxnCategoryLabel();
		txnLabel.setText(btn.text);
		me.txnCategoryFilter = btn.code;
		// me.setDataForFilter();
		// me.applyQuickFilter();
		// me.toggleSavePrefrenceAction(true);
	},
	handleTemplateToolBar : function(panel) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/userpreferences/btrsummary/btrSearchTemplatesList.json',
					method : "GET",
					success : function(response) {
						me.loadTemplatesOnFilterPanel(Ext
								.decode(response.responseText));
					},
					failure : function(response) {
						// console.log('Error
						// Occured-handleAccountTypeLoading');
					}
				});
	},
	loadTemplatesOnFilterPanel : function(data) {
		var me = this;
		var toolbar = me.getTemplateToolBar();
		var strcls = '';
		if (me.templateFilter == 'all') {
			strcls = 'xn-custom-heighlight';
		} else {
			strcls = 'cursor_pointer xn-account-filter-btnmenu';
		}

		toolbar.add({
					text : getLabel('all', 'All'),
					cls : strcls,
					btnId : 'all',
					handler : function(btn, opts) {
						//me.handleTemplate(btn);
					}
				});
		var jsonData = null;
		var count = 0;
		if (!Ext.isEmpty(data.preference))
			jsonData = JSON.parse(data.preference);
		if (!Ext.isEmpty(jsonData))
		{
			count = jsonData.length;
			if (count > 3)
				count = 3;
			for (var i = 0; i < count; i++) {
				var accSetName = jsonData[i].accountSetName;

				var accSetCount = jsonData[i].accounts.length;
				var accSetArray = jsonData[i].accounts;
				var strcls = '';

				if (me.templateFilter === accSetName) {
					strcls = 'xn-custom-heighlight';
				} else {
					strcls = 'cursor_pointer xn-account-filter-btnmenu';
				}
				toolbar.add({
							text : accSetName,
							btnId : accSetName,
							cls : strcls,
							bitMapKey : accSetName,
							isGroupAction : 'Y',
							parent : this,
							handler : function(btn, opts) {
								//me.handleAccount(btn);
							}
						});
			}
		}
		toolbar.add(me.moreSeparator);
		toolbar.add({
					text : getLabel('moreText', 'more')
							+ '<span class="extrapadding">' + '>>' + '</span>',
					cls : 'cursor_pointer xn-account-filter-btnmenu',
					btnId : 'templateMore',
					itemId : 'viewTemplatePopup'
				});
	},
	createNewTemplate : function(btn, eOpts) {
		var me = this;
		var strUrl = 'services/btrSearchTemplatesList.json';
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var storeData = responseData;
						me.createNewTemplPopUp(storeData);
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel('errorTitle', 'Error'),
									msg : getLabel('btrErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	createNewTemplPopUp : function(storeData) {
		var me = this;
		me.createNewTemplPopup = Ext.create(
				'GCP.view.SearchTransactionAddTemplatePopUpView', {
					templListStoreData : storeData
				});
		(me.createNewTemplPopup).show();
	},
	deleteSearchTemplate : function(grid, rowIndex) {
		var record = grid.getStore().getAt(rowIndex);
		var id = record.data.identifier;
		Ext.Ajax.request({
					url : 'services/deleteSearchTemplate.json',
					method : 'POST',
					jsonData : Ext.encode(id),
					success : function(response) {
						var data = Ext.decode(response.responseText);
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel('error',
											'Error'),
									msg : getLabel('noRightsMsg',
											'User doesnt have rights to delete.'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	}
});