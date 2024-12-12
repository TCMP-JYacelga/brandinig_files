/**
 * @class BankScheduleController
 * @extends Ext.app.Controller
 * @author Vaidehi
 */
Ext.define('GCP.controller.BankScheduleController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.BankScheduleView', 'GCP.view.BankScheduleWidget',
			'GCP.view.BankSchedulePreGenPopup'],
	views : ['GCP.view.BankScheduleView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'bankScheduleView',
				selector : 'bankScheduleView'
			}, {
				ref : 'bankScheduleFilterView',
				selector : 'bankScheduleView bankScheduleFilterView'
			}, {
				ref : 'bankScheduleGridView',
				selector : 'bankScheduleView bankScheduleGridView'
			}, {
				ref : 'bankScheduleGridInfoView',
				selector : 'bankScheduleView bankScheduleGridInformationView'
			}, {
				ref : 'schSummaryLowerPanel',
				selector : 'bankScheduleGridInformationView panel[itemId="schSummaryLowerPanel"]'
			},

			{
				ref : 'withHeaderCheckbox',
				selector : 'bankScheduleTitleView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'mostViewedReportItemId',
				selector : 'bankScheduleGridInformationView label[itemId="mostViewedReportItemId"]'
			}, {
				ref : 'leastViewedReportItemId',
				selector : 'bankScheduleGridInformationView label[itemId="leastViewedReportItemId"]'
			}, {
				ref : 'reportModuleWidgetContainer',
				selector : 'bankScheduleGridView widgetContainer[itemId="moduleContainer"]'
			},

			{
				ref : 'matchCriteria',
				selector : 'bankScheduleGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'searchTxnTextInput',
				selector : 'bankScheduleGridView textfield[itemId="searchTxnTextField"]'
			}, {
				ref : 'bankScheduleSellerId',
				selector : 'bankScheduleFilterView AutoCompleter[itemId="bankScheduleSellerId"]'
			}, {
				ref : 'bankScheduleClientId',
				selector : 'bankScheduleFilterView AutoCompleter[itemId="bankScheduleClientId"]'
			}, {
				ref : 'btnSavePreferences',
				selector : 'BankScheduleView BankScheduleFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : 'BankScheduleView BankScheduleFilterView button[itemId="btnClearPreferences"]'
			}, {
				ref : 'schTypeToolBar',
				selector : 'bankScheduleView bankScheduleFilterView toolbar[itemId="schTypeToolBar"]'
			}, {
				ref : 'reportTypeToolBar',
				selector : 'bankScheduleView bankScheduleFilterView toolbar[itemId="reportTypeToolBar"]'
			}, {
				ref : 'reportStatusToolBar',
				selector : 'bankScheduleView bankScheduleFilterView toolbar[itemId="reportStatusToolBar"]'
			}, {
				ref : 'bankScheduleGridInformationView',
				selector : 'BankScheduleGridInformationView'
			}, {
				ref : 'groupByCardPanel',
				selector : 'bankScheduleGridView panel[itemId="widgetCardPanel"]'
			}, {
				ref : 'favButtonRef',
				selector : 'bankScheduleGridView toolbar[itemId="viewAccToolBar"] button[itemId="Favoritesbtn"]'
			}, {
				ref : 'bankSchedulePreGenRef',
				selector : 'bankSchedulePreGenPopup[itemId="gridPreGen"]'
			}, {
				ref : 'bankSchedulePreGenGrid',
				selector : 'bankSchedulePreGenPopup grid[itemId="gridPreGenItemId"]'
			}, {
				ref : 'bankSchedulePreGenPopupDtl',
				selector : 'bankSchedulePreGenPopup panel[itemId="preGeneratedId"]'
			}],
	config : {
		selectedReportCenter : 'reportCenter',
		selectedReportCenterSchedule : 'reportCenterSchedule',
		filterData : [],
		scheduleFilterData : [],
		favReport : [],
		copyByClicked : '',
		activeFilter : null,
		showAdvFilterCode : null,
		savePrefAdvFilterCode : null,
		objPreGenPopup : null,
		repOrDwnldFilterVal : 'All',
		repOrDwnldFilterDesc : 'All',
		reportTypeFilterVal : 'All',
		reportTypeFilterDesc : 'All',
		reportStatusFilterVal : 'All',
		reportStatusFilterDesc : 'All',
		reportCenterSellerVal : 'All',
		reportCenterClientVal : 'All',
		reportCenterEntityType : 'BANK',
		filterApplied : 'ALL',
		widgetTypeCodeColumns : new Array(),
		urlOfGridViewPref : 'userpreferences/bankScheduleFilter/bankScheduleViewPref.srvc?',
		urlGridViewFilterPref : 'userpreferences/bankScheduleFilter/bankScheduleViewFilter.srvc?',
		commonPrefUrl : 'services/userpreferences/bankScheduleFilter.json',
		dateHandler : null,
		headerRecord : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		var tbarSubTotal = null;
		// this.dateHandler = me.getController(
		// 'GCP.controller.DateHandler' );
		var btnClearPref = me.getBtnClearPreferences();
		if (btnClearPref) {
			btnClearPref.setEnabled(false);
		}
		me.objPreGenPopup = Ext.create('GCP.view.BankSchedulePreGenPopup', {
					parent : 'BankScheduleView',
					itemId : 'gridPreGen'

				});
		me.getFavoriteReports();
		me.updateFilterConfig();
		me.control({
			'bankScheduleView' : {
				beforerender : function(panel, opts) {
					// me.loadDetailCount();

				},
				afterrender : function(panel, opts) {

				}
			},
			'bankScheduleView bankScheduleTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
			'bankScheduleView bankScheduleTitleView button[itemId="downloadPdf"]' : {
				click : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
			'bankScheduleGridView panel[itemId="widgetCardPanel"] widgetContainer[itemId="moduleContainer"]' : {
				render : function(panel, opts) {
					this.handleWidgetsLoadingForReportModule(panel);
				},
				drop : function() {
					this.toggleSavePreferencesAction(true);
				}
			},
			'bankScheduleGridView widgetContainer[itemId="moduleContainer"] bankScheduleWidget' : {
				gridRender : me.handleLoadGridData,
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				deleteFavoriteRep : me.deleteFavoriteRep,
				addFavoriteRep : me.addFavoriteRep,
				gridRowSelectionChange : function(bankScheduleWidget, grid,
						record, recordIndex, records, jsonData) {
					me.enableValidActionsForGrid(bankScheduleWidget, grid,
							record, recordIndex, records, jsonData);
				},
				performGroupAction : function(btn, bankScheduleWidget, opts) {
					me.handleGroupActions(btn, bankScheduleWidget);
				},
				collapse : function(bankScheduleWidget, opts) {
					me.collapseWidget(bankScheduleWidget);
				},
				expand : function(bankScheduleWidget, opts) {
					me.expandWidget(bankScheduleWidget);
				},
				performComboPageSizeChange : function(pager, current,
						oldPageNum) {
					me.handleComboPageSizeChange(pager, current, oldPageNum);
				},
				gridStateChange : function(grid) {
					me.toggleSavePreferencesAction(true);
				},

				generateReport : me.generateOndemand,
				preGeneratedReports : me.preGeneratedReport,
				scheduleReports : me.addNewScheduleReport,
				editReports : me.editReport
			},
			'bankScheduleGridView textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'bankScheduleGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},

			'bankScheduleView  button[itemId="myBankInterfaceId"]' : {
				click : function(btn, opts) {
					me.submitRequest('addIMDef');
				}

			},
			'bankScheduleView bankScheduleFilterView' : {
				render : function(panel, opts) {
					me.setInfoTooltip();
					me.setDataForFilter();
				},
				filterSchType : function(btn, opts) {
					// me.toggleSavePreferencesAction( true );
					me.handleRepUpldDwnld(btn);
				},
				/*
				 * filterType : function( btn, opts ) {
				 * me.toggleSavePreferencesAction( true ); me.handleReportType(
				 * btn ); },
				 */
				filterStatus : function(btn, opts) {
					me.toggleSavePreferencesAction(true);
					me.handleReportStatus(btn);
				}

			},
			'bankScheduleView bankScheduleFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePreferencesAction(false);
					me.handleSavePreferences();
				}
			},
			'bankScheduleView bankScheduleFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePreferencesAction(false);
					me.handleClearPreferences();
				}
			},

			'bankScheduleView bankScheduleFilterView  AutoCompleter[itemId="bankScheduleSellerId"]' : {
				select : function(combo, record, index) {
					me.reportCenterSellerVal = record[0].data.CODE;
					if (me.reportCenterSellerVal === 'All')
						me.filterApplied = 'ALL';
					else
						me.filterApplied = 'Q';

					var objAutocompleter = me.getBankScheduleClientId();
					objAutocompleter.setValue('');
					objAutocompleter.cfgExtraParams = [{
								key : '$filtercode1',
								value : record[0].data.CODE
							}];
					me.toggleSavePreferencesAction(true);
					// me.setDataForFilter();
					// me.applyQuickFilter();
				},
				change : function(combo, record, index) {
					if (record == null) {
						me.reportCenterSellerVal = 'All';

						me.filterApplied = 'ALL';
						var objAutocompleter = me.getBankScheduleClientId();
						objAutocompleter.setValue('');
						objAutocompleter.cfgExtraParams = [{
									key : '$filtercode1',
									value : ''
								}];
						me.toggleSavePreferencesAction(true);
						// me.setDataForFilter();
						// me.applyQuickFilter();
					}
				}
			},
			// 'bankScheduleView bankScheduleFilterView
			// AutoCompleter[itemId="bankScheduleClientId"]' : {
			// select : function(combo, record, index) {
			// me.reportCenterClientVal = record[0].data.CODE;
			// if (me.reportCenterClientVal === 'All')
			// me.filterApplied = 'ALL';
			// else
			// me.filterApplied = 'Q';
			//
			// me.toggleSavePreferencesAction(true);
			// me.setDataForFilter();
			// me.applyQuickFilter();
			// },
			// change : function(combo, record, index) {
			// if (record == null) {
			// me.reportCenterClientVal = 'All';
			//
			// me.filterApplied = 'ALL';
			// me.toggleSavePreferencesAction(true);
			// me.setDataForFilter();
			// me.applyQuickFilter();
			// }
			// }
			// },

			'bankScheduleView bankScheduleFilterView button[itemId="filterBtnId"]' : {
				click : function(btn) {
					this.setDataForFilter();
					this.applyQuickFilter();
				}
			},
			'bankScheduleView bankScheduleGridInformationView panel[itemId="bankScheduleSummInfoHeaderBarGridView"] image[itemId="summInfoShowHideGridView"]' : {
				click : function(image) {
					var objAccSummInfoBar = me.getSchSummaryLowerPanel();
					if (image.hasCls("icon_collapse_summ")) {
						image.removeCls("icon_collapse_summ");
						image.addCls("icon_expand_summ");
						objAccSummInfoBar.hide();
					} else {
						image.removeCls("icon_expand_summ");
						image.addCls("icon_collapse_summ");
						objAccSummInfoBar.show();
					}
				}
			},
			'bankScheduleGridInformationView' : {
				beforerender : function(panel, opts) {

				},
				afterrender : function(panel, opts) {
					me.renderMostViewedReportList();
					me.renderLeastViewedReportList();
				}

			},
			'bankSchedulePreGenPopup[itemId="gridPreGen"]' : {
				closeBankSchedulePreGenPopup : function(btn) {
					me.closeBankSchedulePreGenPopup(btn);
				}
			}
		});
	},

	submitRequest : function(str, record) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		if (str == 'addReport') {
			strUrl = "addBankCustomReport.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportCode', ''));
		}
		if (str == 'addIMDef') {
			strUrl = "interfaceMapCenter.srvc";
		}
		if (str == 'editReport') {
			strUrl = "editBankCustomReport.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportCode', record.get('reportCode')));
		} else if (str == 'addSchedule') {
			strUrl = "addBankScheduleDefination.srvc";

			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'schSrcId',
					record.get('reportCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schSrcName', record.get('reportName')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schSecurityProfileName', record.get('securityProfile')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schSecurityProfileID', record.get('SecurityProfileId')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schDelInfo', record.get('delInfo')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schDelMedium', record.get('medium')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schModuleCode', record.get('moduleCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schSrcType', record.get('srcType')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schEntityCode', record.get('entityCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
					record.get('sellerId')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', record.get('identifier')));
			form.appendChild(me
					.createFormField('INPUT', 'HIDDEN', 'version', 0));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));
		} else if (str == 'Generate') {
			strUrl = "showBankScheduleGenerateParam.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'moduleCode', record.get('moduleCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'srcType',
					record.get('srcType')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportCode', record.get('reportCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportFileName', record.get('reportName')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'delInfo',
					record.get('delInfo')));
			// form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
			// 'delMedium', record.get( 'medium' ) ) );
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'delMedium',
					'SMTP'));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'securityProfileID', record.get('SecurityProfileId')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'securityProfileName', record.get('securityProfile')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'clientCode', record.get('entityCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'entitlementSeller', record.get('sellerId')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'entityType', record.get('showEntityType')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));
		} else if (str == 'Download') {
			strUrl = "downloadBankSchPreGeneratedReport.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schTempFileDir', record.get('schTempFileDir')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'gaFileName', record.get('gaFileName')));
		} else if (str == 'View') {
			strUrl = "viewBankScheduleDefination.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', record.get('identifier')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'version',
					record.get('version')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));

		} else if (str == 'Edit') {
			strUrl = "editBankScheduleDefination.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', record.get('identifier')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'version',
					record.get('version')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));

		}

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
				csrfTokenValue));
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
	handleReportAction : function(btn, opts) {
		var me = this;
		me.downloadReport(btn.itemId);
	},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = me.getWithHeaderCheckbox().checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv'
		};
		var currentPage = 1;
		var strExtension = '', strUrl = '', strSelect = '', strFilterUrl = '';

		strExtension = arrExtension[actionName];
		strUrl = 'services/paymentsbatch.' + strExtension;
		strUrl += '?$skip=1';
		strFilterUrl = me.generateUrlWithQuickFilterParams(me.filterData);
		// strAdvancedFilterUrl =
		// me.generateUrlWithAdvancedFilterParams( me );

		if (!Ext.isEmpty(strFilterUrl))
			strUrl += '&$filter=' + strFilterUrl;
		/*
		 * if( arrAvailableBatchColumn ) { if( arrAvailableBatchColumn.length >
		 * 0 ) strSelect = '&$select=[' + arrAvailableBatchColumn.toString() +
		 * ']'; }
		 */
		// strUrl += strSelect;
		var wdgt = null, grid = null;
		// var count = 0, objOfSelectedGridRecord = null,
		// objOfGridSelected = null;
		var wdgtCt = me.getReportModuleWidgetContainer();
		var arrWdgt = wdgtCt.query('bankScheduleWidget');
		var viscols;
		var visColsStr = "";
		if (!Ext.isEmpty(arrWdgt)) {
			var colMap = new Object();
			var colArray = new Array();
			for (var i = 0; i < arrWdgt.length; i++) {
				grid = null;
				wdgt = arrWdgt[i];
				grid = wdgt.down('smartgrid');
				if (!Ext.isEmpty(grid)) {
					// var objOfRecords = grid.getSelectedRecords();
					viscols = grid.getAllVisibleColumns();
					var col = null;

					for (var j = 0; j < viscols.length; j++) {
						col = viscols[j];
						if (col.dataIndex && arrSortColumn[col.dataIndex]) {
							if (colMap[arrSortColumn[col.dataIndex]]) {
								// ; do nothing
							} else {
								colMap[arrSortColumn[col.dataIndex]] = 1;
								colArray.push(arrSortColumn[col.dataIndex]);

							}
						}

					}

				}

				/*
				 * for ( var cnt1 = 0; cnt1 < viscols.length; cnt1++) {
				 * //visColsStr = visColsStr + "\"" +viscols[cnt1].itemId+
				 * "\":\"" + viscols[cnt1].itemId + "\","; visColsStr =
				 * visColsStr + viscols[cnt1].itemId + ","; //if
				 * (!Ext.isEmpty(objOfRecords)) { // objOfGridSelected = grid; //
				 * objOfSelectedGridRecord = objOfRecords; }
				 */
			}
			if (colMap != null) {

				// var colArray = new Array();
				// colMap.each(function(key, value, length){
				// colArray.push(value);
				// });

				visColsStr = visColsStr + colArray.toString();
				strSelect = '&$select=[' + colArray.toString() + ']';
			}
		}
		strUrl = strUrl + strSelect;
		// alert(visColsStr);
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'visColsStr',
				visColsStr));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

	},
	handleWidgetsLoadingForReportModule : function() {
		var me = this;
		if (!Ext.isEmpty(objGridViewPref)) {
			me.loadSavedPrefWidgets(Ext.decode(objGridViewPref));
		} else if (objDefaultStandardViewPref) {
			me.getWidgetsData();
		}
	},
	loadSavedPrefWidgets : function(savedPrefData) {
		var me = this;
		var objWgtCt = me.getReportModuleWidgetContainer();
		var arrItem;

		if (savedPrefData) {
			arrItem = new Array();
			for (var index = 0; index < savedPrefData.length; index++) {
				var widgetDesciption = savedPrefData[index].widgetDesc;
				var widgtCode = savedPrefData[index].widgetCode;
				var wcode = savedPrefData[index].code;
				var cColumn = savedPrefData[index].codeColumn;
				var columnDetailsData = savedPrefData[index];
				if (!Ext.isEmpty(widgetDesciption) && !Ext.isEmpty(wcode)
						&& !Ext.isEmpty(widgtCode) && !Ext.isEmpty(cColumn)
						&& !Ext.isEmpty(columnDetailsData)) {
					arrItem.push({
								xtype : 'bankScheduleWidget',
								widgetType : wcode,
								widgetDesc : widgetDesciption,
								widgetCode : widgtCode,
								code : wcode,
								codeColumn : cColumn,
								widgetModel : columnDetailsData,
								collapsed : false
							});
				} else {
					// console.log("Error Occured - Saved widget Data
					// Found
					// Empty");
				}
			}
		}

		if (!Ext.isEmpty(arrItem))
			Ext.apply(objWgtCt, {
						widgets : arrItem
					});
		objWgtCt.add(objWgtCt.handleWidgetLayout());
		objWgtCt.doLayout();
	},
	getWidgetsData : function() {
		var me = this;
		var strUrl = "bankScheduleLoadWidgets.srvc?";
		this.filterData = this.getQuickFilterQueryJson();
		var strQuickFilterUrl = me
				.generateUrlWithQuickFilterParams(me.filterData);

		Ext.Ajax.request({
					url : strUrl + csrfTokenName + "=" + csrfTokenValue
							+ strQuickFilterUrl,
					method : 'POST',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var reportModuleData = data.widgetTypeList;
						if (!Ext.isEmpty(reportModuleData))
							me.loadWidgetsForReportModule(
									objDefaultStandardViewPref,
									reportModuleData);

					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}

				});

	},
	loadWidgetsForReportModule : function(columnDetailsData, reportModuleData) {
		var me = this;
		var objWgtCt = me.getReportModuleWidgetContainer();
		var arrItem;

		if (reportModuleData) {
			arrItem = new Array();
			for (var index = 0; index < reportModuleData.length; index++) {
				var widgetDesciption = reportModuleData[index].widgetDesc;
				var wcode = reportModuleData[index].code;
				var widgtCode = wcode + '_' + index;

				if (!Ext.isEmpty(widgetDesciption) && !Ext.isEmpty(wcode)) {
					arrItem.push({
								xtype : 'bankScheduleWidget',
								widgetType : wcode,
								widgetDesc : widgetDesciption,
								widgetCode : widgtCode,
								code : wcode,
								codeColumn : 'reportModule',
								widgetModel : columnDetailsData,
								collapsed : false
							});
				} else {
					// console.log("Error Occured - Account Type Data
					// Found
					// Empty");
				}
			}
		}
		if (!Ext.isEmpty(arrItem))
			Ext.apply(objWgtCt, {
						widgets : arrItem
					});
		objWgtCt.add(objWgtCt.handleWidgetLayout());
		objWgtCt.doLayout();

	},
	expandWidget : function(widget) {
		var me = GCP.getApplication()
				.getController('GCP.controller.BankScheduleController');
		widget.setTitle(widget.widgetDesc);
		me.resetWidgetHeaderLabels(widget);
	},
	resetWidgetHeaderLabels : function(widget) {
		if (!Ext.isEmpty(widget)) {

			if (widget.widgetDesc != 'txncategory') {
				var spacer = widget.header.items.items[1];
				var custlink = widget.header.items.items[2];
				spacer.show();
				custlink.show();
			}

		}
	},
	enableValidActionsForGrid : function(bankScheduleWidget, grid, record,
			recordIndex, selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;

		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		actionMask = doAndOperation(maskArray, 4);
		me.enableDisableGroupActions(actionMask, bankScheduleWidget);
	},
	enableDisableGroupActions : function(actionMask, bankScheduleWidget) {
		var actionBar = bankScheduleWidget.down(Ext.String.format(
				'toolbar[itemId="bankScheduleGroupActionBarView_{0}"]',
				bankScheduleWidget.widgetCode));
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	handleGroupActions : function(btn, bankScheduleWidget, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('{0}List/{1}.srvc?',
				me.selectedReportCenter, strAction);
		me.preHandleGroupActions(strUrl, '', bankScheduleWidget, record);

	},
	preHandleGroupActions : function(strUrl, remark, bankScheduleWidget, record) {
		if (!Ext.isEmpty(bankScheduleWidget)) {
			var me = this;
			var grid = bankScheduleWidget.down(Ext.String.format(
					'smartgrid[itemId="bankSchedule_{0}"]',
					bankScheduleWidget.widgetCode));
			if (!Ext.isEmpty(grid)) {
				var arrayJson = new Array();
				var records = grid.getSelectedRecords();
				records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
						? records
						: [record];
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : grid.getStore()
										.indexOf(records[index])
										+ 1,
								identifier : records[index].data.identifier,
								userMessage : remark
							});
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				bankScheduleWidget.setLoading(true);
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								var errors = '';
								if (errors != '') {
									alert("Error in Report Center action : "
											+ errors);
								}
								bankScheduleWidget.setLoading(false);
								me.enableDisableGroupActions('0000',
										bankScheduleWidget);
								grid.refreshData();
							},
							failure : function() {
								var errMsg = "";
								bankScheduleWidget.setLoading(false);
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		}
	},
	collapseWidget : function(bankScheduleWidget) {
		var me = GCP.getApplication()
				.getController('GCP.controller.BankScheduleController');
		bankScheduleWidget.setTitle('<span class="block w16">'
				+ bankScheduleWidget.bankScheduleWidgetDesc + '</span>');
		me.addTotalToWidget(bankScheduleWidget);
	},
	handleComboPageSizeChange : function(pager, current, oldPageNum) {
		var me = this;
		me.toggleSavePreferencesAction(true);
	},
	addFavoriteRep : function(reportCode, wdgt) {
		var me = this;
		me.favReport.push(reportCode);
		var newReportset = "{\"reports\":" + "[";
		me.flagFavSet = true;
		for (var index = 0; index < me.favReport.length; index++) {
			var rep = me.favReport[index];
			var newRep = '"' + rep + '"';
			newReportset = newReportset + newRep;
			if (index != (me.favReport.length - 1))
				newReportset = newReportset + ",";
		}

		newReportset = newReportset + "]}";

		wdgt.setLoading(true);

		Ext.Ajax.request({
					url : 'userpreferences/bankScheduleFilter/preferredReports.srvc',
					method : 'POST',
					jsonData : newReportset,
					success : function(response) {
						wdgt.setLoading(false);
					},
					failure : function() {
					}
				});

		var favLength = me.favReport.length;
		/*
		 * me.getFavButtonRef().setText(getLabel('favorites', 'Favorites') + "(<span
		 * class='red'>" + favLength + "</span>)");
		 * me.getFavButtonRef().accArray = me.favReport;
		 */
	},
	deleteFavoriteRep : function(reportCode, wdgt) {
		var reportId = reportCode;
		var me = this;
		me.flagFavSet = true;
		var index = me.favReport.indexOf(reportId, 0);

		if (index > -1) {
			me.favReport.splice(index, 1);
		}
		var newReportset = "{\"reports\":" + "[";

		for (var index = 0; index < this.favReport.length; index++) {
			var Acc = me.favReport[index];
			var newAcc = '"' + Acc + '"';
			newReportset = newReportset + newAcc;
			if (index != (me.favReport.length - 1))
				newReportset = newReportset + ",";
		}

		newReportset = newReportset + "]}";

		wdgt.setLoading(true);
		Ext.Ajax.request({
					url : 'userpreferences/bankScheduleFilter/preferredReports.srvc',
					method : 'POST',
					jsonData : newReportset,
					success : function(response) {
						wdgt.setLoading(false);
					},
					failure : function() {
					}

				});
		var favLength = me.favReport.length;
		/*
		 * me.getFavButtonRef().setText(getLabel('favorites', 'Favorites') + "(<span
		 * class='red'>" + favLength + "</span>)");
		 * me.getFavButtonRef().accArray = me.favReport;
		 */
	},
	generateOndemand : function(record) {
		var me = this;
		me.submitRequest('Generate', record);
	},
	getFavoriteReports : function() {
		var me = this;
		Ext.Ajax.request({

					url : 'userpreferences/bankScheduleFilter/preferredReports.srvc?',
					method : "GET",
					success : function(response) {
						if (response.responseText != '')
							me.loadFavoriteReports(Ext
									.decode(response.responseText));
					},
					failure : function(response) {
						// console.log('Error
						// Occured-handleAccountTypeLoading');
					}
				});
	},
	loadFavoriteReports : function(data) {
		if (data.error == null) {
			var me = this;
			var jsonData = JSON.parse(data.preference);
			// var FavoritesCount = jsonData.reports.length;
			var accSetArray = jsonData.reports;
			var accFavArrInt = [];
			for (i = 0; i < jsonData.reports.length; i++) {
				accFavArrInt.push(accSetArray[i]);
			}
			me.favReport = accFavArrInt;
		}
	},

	handleRepUpldDwnld : function(btn) {
		var me = this;
		me.toggleSavePreferencesAction(true);
		me.getSchTypeToolBar().items.each(function(item) {
					// item.removeCls( 'xn-custom-heighlight' );
					// item.addCls( 'xn-account-filter-btnmenu' );
					item.removeCls('f13 xn-custom-heighlight');
					item.addCls('f13 xn-custom');
				});
		// btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
		btn.addCls('xn-custom-heighlight');
		me.repOrDwnldFilterVal = btn.code;
		me.setDataForFilter();

		me.repOrDwnldFilterDesc = btn.btnDesc;

		if (me.repOrDwnldFilterVal === 'All')
			me.filterApplied = 'ALL';
		else
			me.filterApplied = 'Q';

		// me.applyQuickFilter();
	},

	handleReportType : function(btn) {
		var me = this;
		me.toggleSavePreferencesAction(true);
		me.getReportTypeToolBar().items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');
				});
		btn.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
		if (btn.code == 'Favorites') {
			me.reportTypeFilterVal = me.favReport;
			me.setDataForFavoritesFilter();
		} else {
			me.reportTypeFilterVal = btn.code;
			me.setDataForFilter();
		}

		me.reportTypeFilterDesc = btn.btnDesc;

		if (me.reportTypeFilterVal === 'All')
			me.filterApplied = 'ALL';
		else
			me.filterApplied = 'Q';

		// me.applyQuickFilter();
	},

	handleReportStatus : function(btn) {
		var me = this;
		me.toggleSavePreferencesAction(true);
		me.getReportStatusToolBar().items.each(function(item) {
					// item.removeCls( 'xn-custom-heighlight' );
					// item.addCls( 'xn-account-filter-btnmenu' );
					item.removeCls('f13 xn-custom-heighlight');
					item.addCls('f13 xn-custom');
				});
		// btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
		btn.addCls('xn-custom-heighlight');
		me.reportStatusFilterVal = btn.code;
		me.setDataForFilter();

		me.reportStatusFilterDesc = btn.btnDesc;

		if (me.reportStatusFilterVal === 'All')
			me.filterApplied = 'ALL';
		else
			me.filterApplied = 'Q';
	},
	setDataForFavoritesFilter : function() {
		var me = this;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var reportTypeFilterVal = me.reportTypeFilterVal;
		me.getReportTypeToolBar().items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');
					if ('favoritesType' == item.btnId)
						item
								.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
				});

		if (me.reportTypeFilterVal != null && me.reportTypeFilterVal != 'All') {
			jsonArray.push({
						paramName : 'reportCode',
						paramValue1 : me.reportTypeFilterVal,
						operatorValue : 'in',
						dataType : 'A'
					});
		}
		this.filterData = jsonArray;
	},
	setDataForFilter : function() {
		var me = this;
		var str = "allReportType";
		if (me.reportTypeFilterVal == 'S')
			str = "standardType";
		else if (me.reportTypeFilterVal == 'C')
			str = "myReportsType";
		else if (me.reportTypeFilterVal == 'Favorites')
			str = "favoritesType";
		var reportTypeFilterVal = me.reportTypeFilterVal;
		/*
		 * me.getReportTypeToolBar().items.each( function( item ) {
		 * item.removeCls( 'xn-custom-heighlight' ); item.addCls(
		 * 'xn-account-filter-btnmenu' ); if( str == item.btnId ) item.addCls(
		 * 'xn-custom-heighlight xn-account-filter-btnmenu' ); } );
		 */
		this.filterData = this.getQuickFilterQueryJson();
		if (me.reportTypeFilterVal == 'Favorites') {
			me.getFavoriteReports();
			me.reportTypeFilterVal = me.favReport;
			// me.setDataForFavoritesFilter();
		}
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var jsonArray = [];

		// entity type defaulted to BANK
		me.reportCenterEntityType = 'BANK';

		// seller
		if (Ext.isEmpty(me.reportCenterSellerVal)
				|| me.reportCenterSellerVal == 'All') {
			me.reportCenterSellerVal = userSeller;
		}
		jsonArray.push({
					paramName : 'seller',
					paramValue1 : 'OWNER,' + me.reportCenterSellerVal,
					operatorValue : 'in',
					dataType : 'S'
				});
		// commented below because it will be still 'BANK' though seller is
		// selected
		// me.reportCenterEntityType = 'BANKADMIN';

		// client
		if (!Ext.isEmpty(me.reportCenterClientVal)
				&& me.reportCenterClientVal != 'All') {
			jsonArray.push({
						paramName : 'client',
						paramValue1 : me.reportCenterClientVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
			me.reportCenterEntityType = 'BANKADMIN';
		}

		if (!Ext.isEmpty(me.repOrDwnldFilterVal)
				&& me.repOrDwnldFilterVal != 'All') {
			jsonArray.push({
						paramName : me.getSchTypeToolBar().filterParamName,
						paramValue1 : me.repOrDwnldFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.reportTypeFilterVal)
				&& me.reportTypeFilterVal != 'All'
				&& me.reportTypeFilterVal != 'Favorites') {
			jsonArray.push({
						paramName : me.getReportTypeToolBar().filterParamName,
						paramValue1 : me.reportTypeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.reportStatusFilterVal)
				&& me.reportStatusFilterVal != 'All') {
			jsonArray.push({
						paramName : me.getReportStatusToolBar().filterParamName,
						paramValue1 : me.reportStatusFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		// entity type
		if (!Ext.isEmpty(me.reportCenterEntityType)
				&& me.reportCenterEntityType != 'All') {
			jsonArray.push({
						paramName : 'entityType',
						paramValue1 : me.reportCenterEntityType,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		return jsonArray;
	},
	applyQuickFilter : function() {
		var me = this;
		var card = me.getGroupByCardPanel();
		var index = card.getLayout().getActiveItem();
		me.refreshAllWidgets(index);
	},
	refreshAllWidgets : function(wdgtCt) {
		var me = this, wdgt = null;
		var arrWdgt = wdgtCt.query('bankScheduleWidget');
		if (!Ext.isEmpty(arrWdgt)) {
			for (var i = 0; i < arrWdgt.length; i++) {
				wdgt = arrWdgt[i];
				wdgt.widgetEqCcy = me.equiCcy;
				if (!Ext.isEmpty(wdgt) && !Ext.isEmpty(wdgt.down('smartgrid'))) {
					wdgt.down('smartgrid').refreshData();
				}

			}
		}
	},

	handleLoadGridData : function(widget, grid, url, pgSize, newPgNo, oldPgNo,
			sorter) {
		var me = this;
		var card = me.getGroupByCardPanel();
		var cardcontainer = card.down('panel[itemId="moduleContainer"]');
		cardcontainer.viewRendered = true;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.generateFilterUrl(widget);
		strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
		grid.loadGridData(strUrl, null, widget);
	},

	generateFilterUrl : function(widget) {
		var me = this;
		var strQuickFilterUrl = strWidgetFilterUrl = '', strUrl = '', isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me.filterData);
		strWidgetFilterUrl = me.generateWidgetUrl(widget);

		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += strQuickFilterUrl;
			isFilterApplied = true;
		}

		if (!Ext.isEmpty(strWidgetFilterUrl)) {
			if (isFilterApplied)
				strUrl += ' and ' + strWidgetFilterUrl;
			else
				strUrl += '&$filter=' + strWidgetFilterUrl;
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(urlFilterData) {
		var filterData = urlFilterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				case 'in' :
					var arrId = filterData[index].paramValue1;
					var tempArrId = arrId.split(',');
					if (tempArrId[0] == 'OWNER') {
						arrId = arrId.split(',');
					}
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
					}
					break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
					}
					break;
			}
			isFilterApplied = true;
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	generateWidgetUrl : function(widget) {
		var column = widget.codeColumn;
		var value = widget.code;
		var strWidgetFilter = column + ' eq ' + '\'' + value + '\'';
		return strWidgetFilter;
	},
	searchTrasactionChange : function() {
		var me = this;
		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;
		var card = me.getGroupByCardPanel();
		var wdgtCt = card.getLayout().getActiveItem();
		var arrWdgt = wdgtCt.query('bankScheduleWidget');
		var searchValue = me.getSearchTxnTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();

		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		if (!Ext.isEmpty(arrWdgt)) {
			for (var i = 0; i < arrWdgt.length; i++) {
				wdgt = arrWdgt[i];
				if (!Ext.isEmpty(wdgt) && !wdgt.collapsed) {

					var grid = wdgt.down('smartgrid');
					grid.view.refresh();
					if (searchValue !== null) {
						searchRegExp = new RegExp(searchValue, 'g'
										+ (anyMatch ? '' : 'i'));

						if (!Ext.isEmpty(grid)) {
							var store = grid.store;

							store.each(function(record, idx) {
								var td = Ext.fly(grid.view.getNode(idx))
										.down('td'), cell, matches, cellHTML;
								while (td) {
									cell = td.down('.x-grid-cell-inner');
									matches = cell.dom.innerHTML.match(tagsRe);
									cellHTML = cell.dom.innerHTML.replace(
											tagsRe, tagsProtect);

									if (cellHTML === '&nbsp;') {
										td = td.next();
									} else {
										// populate indexes array, set
										// currentIndex,
										// and replace
										// wrap matched string in a span
										cellHTML = cellHTML.replace(
												searchRegExp, function(m) {
													return '<span class="xn-livesearch-match">'
															+ m + '</span>';
												});
										// restore protected tags
										Ext.each(matches, function(match) {
													cellHTML = cellHTML
															.replace(
																	tagsProtect,
																	match);
												});
										// update cell html
										cell.dom.innerHTML = cellHTML;
										td = td.next();
									}
								}
							}, me);
						}
					}

				}

			}
		}
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = '11111';
		var buttonMask = '11111';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);

		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);

		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		}
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		strRetValue = value;
		return strRetValue;
	},

	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoGridView',
					listeners : {
						// Change content dynamically
						// depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var ReportTypeVal = '';

							var dateFilter = me.dateFilterLabel;

							if (me.reportTypeFilterVal == 'All'
									&& me.filterApplied == 'ALL') {
								ReportTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else {
								ReportTypeVal = me.reportTypeFilterDesc;
							}
							var advfilter = me.showAdvFilterCode;
							if (advfilter == '' || advfilter == null) {
								advfilter = getLabel('none', 'None');
							}

							tip.update('Type' + ' : ' + ReportTypeVal);
						}
					}
				});
	},
	toggleSavePreferencesAction : function(isVisible) {
		var me = this;
		var btnPreferences = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPreferences))
			btnPreferences.setDisabled(!isVisible);

	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},
	handleSavePreferences : function() {
		var me = this;
		me.saveWidgetPreferences();
	},
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePreferencesAction(false);
		me.clearWidgetPreferences();
	},
	saveWidgetPreferences : function() {
		var me = this, wdgt = null, grid = null, objPref = null, objWdgtPref = null, arrPref = null, arrColPref = null, arrCols = null, objCol = null;
		var card = me.getGroupByCardPanel();
		var activeContainer = card.getLayout().getActiveItem();

		var wdgtCt = activeContainer;
		var arrWdgt = wdgtCt.query('bankScheduleWidget');
		var strUrl = me.urlOfGridViewPref;

		arrPref = null;
		if (!Ext.isEmpty(arrWdgt)) {
			arrPref = new Array();
			for (var i = 0; i < arrWdgt.length; i++) {
				grid = null;
				wdgt = arrWdgt[i];
				objPref = {};
				objPref.widgetCode = wdgt.widgetDetails.widgetCode;
				objPref.widgetDesc = wdgt.widgetDetails.widgetDesc;
				objPref.code = wdgt.widgetDetails.code;
				objPref.codeColumn = wdgt.widgetDetails.codeColumn;
				arrColPref = new Array();
				grid = wdgt.down('smartgrid');
				if (!Ext.isEmpty(grid)) {
					arrCols = grid.headerCt.getGridColumns();
					for (var j = 0; j < arrCols.length; j++) {
						objCol = arrCols[j];
						if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
								&& objCol.itemId.startsWith('col_')
								&& !Ext.isEmpty(objCol.xtype)
								&& objCol.xtype !== 'actioncolumn'
								&& objCol.itemId !== 'col_genrateId')
							arrColPref.push({
										colId : objCol.dataIndex,
										colDesc : objCol.text,
										colHidden : objCol.hidden
									});

					}
				}
				objWdgtPref = {};

				objWdgtPref.pgSize = wdgt.widgetDetails.pgSize;
				objWdgtPref.gridCols = arrColPref;
				objPref.widgetPref = objWdgtPref;
				arrPref.push(objPref);
			}

			if (arrPref) {
				Ext.Ajax.request({
					url : strUrl + csrfTokenName + "=" + csrfTokenValue,
					method : 'POST',
					jsonData : Ext.encode(arrPref),
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var isSuccess;
						var title, strMsg, imgIcon;
						if (responseData.d.preferences
								&& responseData.d.preferences.success)
							isSuccess = responseData.d.preferences.success;
						if (isSuccess && isSuccess === 'N') {
							if (!Ext.isEmpty(me.getBtnSavePreferences()))
								me.toggleSavePreferencesAction(true);
							title = getLabel('messageTitle', 'Message');
							strMsg = responseData.d.preferences.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										buttons : Ext.MessageBox.OK,
										icon : imgIcon
									});

						} else
							me.saveFilterPreferences();
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
			}
		}
	},
	saveFilterPreferences : function() {
		var me = this;
		var strUrl = me.urlGridViewFilterPref;
		var objFilterPref = {};
		objFilterPref.reportType = me.reportTypeFilterDesc;
		objFilterPref.reportsArray = me.reportTypeFilterVal;
		if (objFilterPref)
			Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(objFilterPref),
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var title = getLabel('messageTitle', 'Message');
							if (data.d.preferences
									&& data.d.preferences.success === 'Y') {
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSaveSuccMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.INFO
										});
							} else if (data.d.preferences
									&& data.d.preferences.success === 'N'
									&& data.d.error
									&& data.d.error.errorMessage) {
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
									me.toggleSavePreferencesAction(true);
								Ext.MessageBox.show({
											title : title,
											msg : data.d.error.errorMessage,
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
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
	clearWidgetPreferences : function() {
		var me = this, wdgt = null, grid = null, objPref = null, objWdgtPref = null, arrPref = null, arrColPref = null, arrCols = null, objCol = null;
		var strUrl = me.commonPrefUrl + "?$clear=true";

		var card = me.getGroupByCardPanel();
		var activeContainer = card.getLayout().getActiveItem();
		var wdgtCt = activeContainer;
		var arrWdgt = wdgtCt.query('bankScheduleWidget');
		arrPref = null;
		if (!Ext.isEmpty(arrWdgt)) {
			arrPref = new Array();
			arrWidgetOrder = new Array();
			for (var i = 0; i < arrWdgt.length; i++) {
				grid = null;
				wdgt = arrWdgt[i];
				objPref = {};
				objPref.widgetCode = wdgt.widgetDetails.widgetCode;
				objPref.widgetDesc = wdgt.widgetDetails.widgetDesc;
				objPref.code = wdgt.widgetDetails.code;
				objPref.codeColumn = wdgt.widgetDetails.codeColumn;
				arrColPref = new Array();
				grid = wdgt.down('smartgrid');
				if (!Ext.isEmpty(grid)) {
					arrCols = grid.headerCt.getGridColumns();
					for (var j = 0; j < arrCols.length; j++) {
						objCol = arrCols[j];
						if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
								&& objCol.itemId.startsWith('col_')
								&& !Ext.isEmpty(objCol.xtype)
								&& objCol.xtype !== 'actioncolumn'
								&& objCol.itemId !== 'col_genrateId')
							arrColPref.push({
										colId : objCol.dataIndex,
										colDesc : objCol.text,
										colHidden : objCol.hidden
									});
					}
				}
				objWdgtPref = {};
				objWdgtPref.pgSize = wdgt.widgetDetails.pgSize;
				objWdgtPref.gridCols = arrColPref;
				objPref.widgetPref = objWdgtPref;
				arrWidgetOrder.push(wdgt.widgetDetails.widgetCode);
				arrPref.push({
							"module" : wdgt.widgetDetails.widgetCode,
							"jsonPreferences" : objPref
						});
			}

			if (arrPref) {
				Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					// jsonData : Ext.encode(arrPref),
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var isSuccess;
						var title, strMsg, imgIcon;
						if (responseData.d.preferences
								&& responseData.d.preferences.success)
							isSuccess = responseData.d.preferences.success;
						if (isSuccess && isSuccess === 'N') {
							if (!Ext.isEmpty(me.getBtnSavePreferences()))
								me.toggleSavePrefrenceAction(true);
							title = getLabel('SaveFilterPopupTitle', 'Message');
							strMsg = responseData.d.preferences.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										buttons : Ext.MessageBox.OK,
										icon : imgIcon
									});

						} else {
							Ext.MessageBox.show({
										title : title,
										msg : getLabel('prefClearedMsg',
												'Preferences Cleared Successfully'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO
									});
						}

					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
			}
		}
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		if (!Ext.isEmpty(objGridViewFilterPref)) {
			var data = Ext.decode(objGridViewFilterPref);
			var strReportType = data.reportType;

			me.reportTypeFilterVal = !Ext.isEmpty(strReportType)
					? strReportType
					: 'all';

			if (!Ext.isEmpty(me.reportTypeFilterVal)
					&& me.reportTypeFilterVal != 'all') {
				arrJsn.push({
							paramName : 'reportType',
							paramValue1 : me.reportTypeFilterVal,
							operatorValue : 'in',
							dataType : 'A'
						});
			}

			me.filterData = arrJsn;
			// set the typecode column if present in pref to typecodes[]

			if (!Ext.isEmpty(objGridViewPref)) {
				data = Ext.decode(objGridViewPref);

				for (var i = 0; i < data.length; i++) {
					var objWidgetPref = data[i];
					var arrColsPref = objWidgetPref.widgetPref.gridCols;
					var typecodes = new Array();
					for (var count = 0; count < arrColsPref.length; count++) {
						typecodes[count] = arrColsPref[count].colId;
					}

					me.widgetTypeCodeColumns.push({
								widgetCode : objWidgetPref.widgetCode,
								typeCode : typecodes
							});
				}
			}

		}
	},

	// Pregen methods
	closeBankSchedulePreGenPopup : function(btn) {
		var me = this;
		me.getBankSchedulePreGenRef().close();
	},
	preGeneratedReport : function(record) {
		var me = this;
		me.handlePreGenSmartGridConfig(record);
		if (!Ext.isEmpty(me.objPreGenPopup)) {
			me.objPreGenPopup.show();
		} else {
			me.objPreGenPopup = Ext.create('GCP.view.BankSchedulePreGenPopup');
			me.objPreGenPopup.show();
		}
	},
	handlePreGenSmartGridConfig : function(record) {
		var me = this;

		var preGenGrid = me.getBankSchedulePreGenGrid();
		var objConfigMap = me.getPreGenConfiguration();
		var arrCols = new Array();
		arrCols = me.getPreGenColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		if (!Ext.isEmpty(preGenGrid))
			preGenGrid.destroy(true);
		me.handlePreGenSmartGridLoading(arrCols, objConfigMap.storeModel,
				record);
	},
	getPreGenConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"gendatetime" : 300,
			"size" : 100,
			"copies" : 100,
			"gastatus" : 200
		};
		arrColsPref = [{
					"colId" : "genDateTime",
					"colDesc" : "Generated On"
				}, {
					"colId" : "size",
					"colDesc" : "Size"
				}, {
					"colId" : "copies",
					"colDesc" : "Count"
				}, {
					"colId" : "gaStatus",
					"colDesc" : "Status"
				}];

		storeModel = {
			fields : ['genDateTime', 'size', 'copies', 'gaStatus',
					'recordKeyNo', 'gaFileName', 'schTempFileDir'],
			proxyUrl : 'getBankSchPreGeneratedList.srvc',
			rootNode : 'd.reportCenter',
			totalRowsNode : 'd.__count'
		};

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	getPreGenColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createPreGenActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	createPreGenActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'btnDownloadId',
			width : 120,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'btnDownload',
						text : 'Upload to Other System',
						itemLabel : getLabel('download', 'Upload to Other System'),
						maskPosition : 5
					}]
		};
		return objActionCol;
	},
	handlePreGenSmartGridLoading : function(arrCols, storeModel, record) {
		var me = this;
		var pgSize = null;
		var reportCode = record.get('reportCode');
		var bankSchedulePregenGrid = null;
		pgSize = _GridGizeMaster;
		var bankSchedulePreGenPopupDtl = me.getBankSchedulePreGenPopupDtl();
		var bankSchedulePregenGrid = Ext.getCmp('gridPreGenItemId');

		if (typeof bankSchedulePregenGrid == 'undefined') {
			bankSchedulePregenGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
						id : 'gridPreGenItemId',
						itemId : 'gridPreGenItemId',
						pageSize : pgSize,
						autoDestroy : true,
						stateful : false,
						showEmptyRow : false,
						showSummaryRow : true,
						padding : '5 0 0 0',
						showCheckBoxColumn : false,
						rowList : _AvailableGridSize,
						minHeight : 180,
						columnModel : arrCols,
						storeModel : storeModel,
						isRowIconVisible : me.isRowIconVisible,
						isRowMoreMenuVisible : me.isRowMoreMenuVisible,
						handleRowMoreMenuClick : me.handleRowMoreMenuClick,

						handleRowIconClick : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							me.handleRowIconClick(tableView, rowIndex,
									columnIndex, btn, event, record);
						},
						listeners : {
							render : function(bankSchedulePregenGrid) {
								me.handlePreGenLoadGridData(
										bankSchedulePregenGrid, reportCode, 1,
										1, record);
							},
							afterrender : function(bankSchedulePregenGrid) {
								me.handlePreGenLoadGridData(
										bankSchedulePregenGrid, reportCode, 1,
										1, record);
							},
							gridPageChange : function(bankSchedulePregenGrid,
									strDataUrl, intPgSize, intNewPgNo,
									intOldPgNo, jsonSorter) {
								me.handlePreGenLoadGridData(
										bankSchedulePregenGrid, reportCode,
										intNewPgNo, intOldPgNo, record);
							},
							gridSortChange : function(bankSchedulePregenGrid,
									strDataUrl, intPgSize, intNewPgNo,
									intOldPgNo, jsonSorter) {
								me.handlePreGenLoadGridData(
										bankSchedulePregenGrid, reportCode,
										intNewPgNo, intOldPgNo, record);
							}
						}
					});
			bankSchedulePregenGrid.view.refresh();
			bankSchedulePreGenPopupDtl.add(bankSchedulePregenGrid);
			bankSchedulePreGenPopupDtl.doLayout();
		}

		me.handlePreGenLoadGridData(bankSchedulePregenGrid, reportCode, 1, 1,
				record);
	},
	handlePreGenLoadGridData : function(grid, reportCode, intNewPgNo,
			intOldPgNo, record) {
		var me = this;
		var strUrl = grid.generateUrl(grid.store.dataUrl, grid.pageSize,
				intNewPgNo, intOldPgNo, null);
		var distributionId = record.get('distributionId');

		if (Ext.isEmpty(distributionId)) {
			distributionId = ' ';
		}
		strUrl += '&' + csrfTokenName + "=" + csrfTokenValue + '&$argString='
				+ reportCode + '&$showEntityType='
				+ record.get('showEntityType') + '&$entityCode='
				+ record.get('entityCode') + '&$srcName='
				+ record.get('reportName') + '&$srcId='
				+ record.get('reportCode') + '&$distributionId='
				+ distributionId + '&$originalSourceId='
				+ record.get('originalSourceId') + '&$moduleCode='
				+ record.get('moduleCode') + '&$srcTag='
				+ record.get('reportType') + '&$srcType='
				+ record.get('srcType');
		grid.loadGridData(strUrl, null);
	},
	editReport : function(record) {
		var me = this;
		me.submitRequest('editReport', record);
	},
	addNewScheduleReport : function(record) {
		var me = this;
		me.submitRequest('addSchedule', record);
	},
	renderMostViewedReportList : function() {
		var me = this;
		var mostViewedReportItem = me.getMostViewedReportItemId();
		var mostUsedReport = '';
		for (var i = 0; i < mostViewedReportList.length; i++) {
			if (i == mostViewedReportList.length - 1) {
				mostUsedReport = mostUsedReport + mostViewedReportList[i]
			} else {
				mostUsedReport = mostUsedReport + mostViewedReportList[i]
						+ ", ";
			}
		}
		mostViewedReportItem.setText(mostUsedReport);
	},
	renderLeastViewedReportList : function() {
		var me = this;
		var leastViewedReportItem = me.getLeastViewedReportItemId();
		var leastUsedReport = '';
		for (var i = 0; i < leastViewedReportList.length; i++) {
			if (i == leastViewedReportList.length - 1) {
				leastUsedReport = leastUsedReport + leastViewedReportList[i]
			} else {
				leastUsedReport = leastUsedReport + leastViewedReportList[i]
						+ ", ";
			}
		}
		leastViewedReportItem.setText(leastUsedReport);
	}

});
