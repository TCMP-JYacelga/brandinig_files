Ext.define('GCP.controller.InterfaceMapSummaryController', {
	extend : 'Ext.app.Controller',
	views : ['GCP.view.InterfaceMapSummaryView', 'GCP.view.ShowClonePopUp',
			'GCP.view.InterfaceMapHistoryPopup', 'GCP.view.Widget'],
	refs : [{
				ref : 'interfaceMapSummaryView',
				selector : 'interfaceMapSummaryView'
			}, {
				ref : 'interfaceMapSummaryFilterView',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView'
			}, {
				ref : 'interfaceMapSummaryGridView',
				selector : 'interfaceMapSummaryView interfaceMapSummaryGridView'
			}, {
				ref : 'matchCriteria',
				selector : 'interfaceMapSummaryView radiogroup[itemId="widgetMatchCriteria"]'
			}, {
				ref : 'searchTxnTextInput',
				selector : 'interfaceMapSummaryView textfield[itemId="searchTxnTextField"]'
			}, {
				ref : 'btnSavePreferencesRef',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView button[itemId="btnClearPreferences"]'
			}, {
				ref : 'withHeaderCheckbox',
				selector : 'interfaceMapSummaryView interfaceMapSummaryTitleView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'interfaceMapSummaryInfoView',
				selector : 'interfaceMapSummaryInfoView'
			}, {
				ref : 'infoSummaryLowerPanel',
				selector : 'interfaceMapSummaryInfoView panel[itemId="infoSummaryLowerPanel"]'
			}, {
				ref : 'clonePopUpDtlRef',
				selector : 'showClonePopUp[itemId="clonePopUpId"] container[itemId="clonePopUpItemId"]'
			}, {
				ref : 'clonePopUpRef',
				selector : 'showClonePopUp[itemId="clonePopUpId"]'
			}, {
				ref : 'uploadModuleWidgetContainer',
				selector : 'interfaceMapSummaryView widgetContainer[itemId="moduleContainer"]'
			}, {
				ref : 'interfaceTypeToolBar',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView toolbar[itemId="interfaceTypeToolBar"]'
			}, {
				ref : 'flavorTypeToolBar',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView toolbar[itemId="flavorTypeToolBar"]'
			}, {
				ref : 'statusLabel',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView label[itemId="strStatusValue"]'
			}, {
				ref : 'taskStatusItemId',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView button[itemId="taskStatusItemId"]'
			}, {
				ref : 'sellerClientMenuBar',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView panel[itemId="sellerClientMenuBar"]'
			}, {
				ref : 'sellerMenuBar',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView panel[itemId="sellerMenuBar"]'
			}, {
				ref : 'clientMenuBar',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView panel[itemId="clientMenuBar"]'
			}, {
				ref : 'clientLoginMenuBar',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView panel[itemId="clientLoginMenuBar"]'
			},{
				ref : 'clientCodeCombo',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView combo[itemId="clientCodeComboId"]'
			}
			],
	config : {
		filterData : [],
		advFilterData : [],
		typeFilterVal : 'All',
		filterApplied : 'ALL',
		showAdvFilterCode : null,
		actionFilterVal : 'all',
		actionFilterDesc : 'all',
		typeFilterDesc : 'All',
		objClonePopup : null,
		interfaceTypeFilterVal : 'All',
		interfaceTypeFilterDesc : 'All',
		flavorTypeFilterVal : 'All',
		flavorTypeFilterDesc : 'All',
		statusTypeFilterVal : 'All',
		statusTypeFilterDesc : 'All',
		clientCodeVal : 'All',
		editChkBoxVal : null,
		editProfileChkBoxVal : null,
		widgetTypeCodeColumns : new Array(),
		urlGridPref : 'userpreferences/interfaceMapSummary/gridView.srvc?',
		urlGridFilterPref : 'userpreferences/interfaceMapSummary/gridViewFilter.srvc?',
		commonPrefUrl : 'services/userpreferences/interfaceMapSummary.json',
		sellerFilterVal : null,
		clientFilterVal : null,
		clientFilterDesc : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.sellerFilterVal=SESVAR_SELLER;
		var btnClearPref = me.getBtnClearPreferences();
		if (btnClearPref) {
			btnClearPref.setEnabled(false);
		}
		me.updateFilterConfig();
		me.objClonePopup = Ext.create('GCP.view.ShowClonePopUp', {
					parent : 'interfaceMapSummaryView',
					itemId : 'clonePopUpId'
				});

		me.control({
			'interfaceMapSummaryView' : {
				beforerender : function(panel, opts) {
				},
				afterrender : function(panel, opts) {
				}
			},
			'interfaceMapSummaryView widgetContainer[itemId="moduleContainer"]' : {
				render : function(panel, opts) {
					this.handleWidgetsLoadingForUploadSummary(panel);
				},
				drop : function() {
					this.toggleSavePrefrenceAction(true);
				}
			},
			'interfaceMapSummaryView widgetContainer[itemId="moduleContainer"] widget' : {
				gridRender : me.handleLoadGridData,
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(interfaceMapSummaryWidget,
						grid, record, recordIndex, records, jsonData) {
					me.enableValidActionsForGrid(interfaceMapSummaryWidget,
							grid, record, recordIndex, records, jsonData);
				},
				performGroupAction : function(btn, interfaceMapSummaryWidget,
						opts) {
					me.handleGroupActions(btn, interfaceMapSummaryWidget);
				},
				collapse : function(interfaceMapSummaryWidget, opts) {
					me.collapseWidget(interfaceMapSummaryWidget);
				},
				expand : function(interfaceMapSummaryWidget, opts) {
					me.expandWidget(interfaceMapSummaryWidget);
				},
				performComboPageSizeChange : function(pager, current,
						oldPageNum) {
					me.handleComboPageSizeChange(pager, current, oldPageNum);
				},
				gridStateChange : function(grid) {
					me.toggleSavePrefrenceAction(true);
				},
				cloneProcess : me.cloneAction,
				editProcess : me.editAction,
				viewProcess : me.viewAction,
				historyProcess : me.showHistory,
				submitProcess : me.submitAction,
				selectSecurityProfile : me.handleSecurityProfileLoading

			},
			'interfaceMapSummaryView textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'interfaceMapSummaryView radiogroup[itemId="widgetMatchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'interfaceMapSummaryView interfaceMapSummaryFilterView' : {
				render : function(panel, opts) {
					me.setInfoTooltip();
					//me.showHideSellerClientMenuBar(isBankFlag);
					me.setDataForFilter();
				},
				filterType : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleType(btn);
				},
				filterFlavorType : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleFlavorType(btn);
				},
				filterStatusType : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleStatusType(btn);
					me.updateStatusFilterView();

				}

			},
			'interfaceMapSummaryView interfaceMapSummaryFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
					me.toggleClearPrefrenceAction(true);
				}
			},
			'interfaceMapSummaryView interfaceMapSummaryFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleClearPreferences();
					me.toggleClearPrefrenceAction(false);
				}
			},
			'interfaceMapSummaryView interfaceMapSummaryTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				},
				afterrender : function() {
				}
			},
			'interfaceMapSummaryView interfaceMapSummaryInfoView panel[itemId="interfaceMapSummaryInfoHeaderBarGridView"] image[itemId="summInfoShowHideGridView"]' : {
				click : function(image) {
					var objAccSummInfoBar = me.getInfoSummaryLowerPanel();
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
			'interfaceMapSummaryInfoView' : {
				render : this.onUploadSummaryInformationViewRender
			},
			'showClonePopUp[itemId="clonePopUpId"]' : {
				handleCloneAction : function(btn) {
					me.handleCloneAction(btn);
				},
				closeClonePopup : function(btn) {
					me.closeClonePopup(btn);
				},
				handleCheckBoxEditAction : function(checked) {
					me.editChkBoxVal = checked;
					if (checked === true) {
						Ext.getCmp('profileChkBox').show();
					} else {
						Ext.getCmp('profileChkBox').hide();
					}
				},
				handleCheckBoxProfileAction : function(checked) {
					me.editProfileChkBoxVal = checked;
				}
			},
			'interfaceMapSummaryView  button[itemId="uploadDefId"]' : {
				click : function(btn, opts) {
					me.addUploadDefinition();
				}
			},
			'interfaceMapSummaryView  button[itemId="downloadDefId"]' : {
				click : function(btn, opts) {
					me.addDownloadDefinition();
				}
			},
			'interfaceMapSummaryView interfaceMapSummaryFilterView toolbar[itemId="statusToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.updateStatusFilterView();
				}
			},
			'interfaceMapSummaryView interfaceMapSummaryFilterView button[itemId="filterBtnId"]' : {
				click : function(btn) {
					me.applySeekFilter();
				}
				/*
				 * select : function(combo, record, index) { var objFilterPanel =
				 * me .getClientMenuBar(); me.clientCodeVal =
				 * record[0].data.CODE; me.clientFilterVal =
				 * record[0].data.CODE; me.clientFilterDesc =
				 * record[0].data.DESCR; me.applySeekFilter(); }, change :
				 * function( combo, record, index ) { if( record == null ) {
				 * me.filterApplied = 'ALL'; me.applySeekFilter(); } var
				 * objFilterPanel = me.getClientMenuBar(); me.clientCodeVal =
				 * record; me.clientFilterVal = record; me.clientFilterDesc =
				 * record; }
				 */
			},
			'interfaceMapSummaryView interfaceMapSummaryFilterView AutoCompleter[itemId="clientCodeId"]': {
				select : function( combo, record, index )
				{
					if(record !== null)
					{
						me.clientFilterDesc = record[0].data.DESCR;
						me.clientFilterVal = record[0].data.CODE;
						me.sellerFilterVal=record[0].data.SELLER_CODE;
					}
					
					me.applySeekFilter();
				},
				change : function( combo, record, index)
				{
					if( record == null )
					{
						me.clientFilterDesc = '';
						me.clientFilterVal = '';
						me.filterApplied = 'ALL';
						me.applySeekFilter();
					}
				}
		     },
		     'interfaceMapSummaryView interfaceMapSummaryFilterView combo[itemId="interfaceSellerId"]': {
		     	select : function( combo, record, index ){
		     		if(record !== null)
					{
						me.sellerFilterVal = record[0].data.sellerCode;
					}
					me.applySeekFilter();
		     	}		     	
		     }
				 
		});
	},
	handleGroupActions : function(btn, interfaceMapSummaryWidget, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String
				.format('uploadSummaryList/{1}.srvc?', strAction);
		var strActionUrl = Ext.String.format('{0}.srvc', strAction);
		// me.preHandleGroupActions( strUrl, '',
		// interfaceMapSummaryWidget, record );
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strActionUrl,
					interfaceMapSummaryWidget, record);

		} else if (strAction === 'clone') {
			me.showClonePopup(strAction, strUrl, record);
		} else {
			me.doAction(strActionUrl, '', interfaceMapSummaryWidget, record)
			// this.preHandleGroupActions(strUrl,
			// '',interfaceMapSummaryWidget, record);
		}

	},
	showRejectVerifyPopUp : function(strAction, strActionUrl,
			interfaceMapSummaryWidget, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('rejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			fieldLbl = getLabel('rejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					style : {
						height : 400
					},
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.doRejectAction(strActionUrl, text,
									interfaceMapSummaryWidget, record);
						}
					}
				});
	},
	doAction : function(strActionUrl, remark, interfaceMapSummaryWidget, record) {

		if (!Ext.isEmpty(interfaceMapSummaryWidget)) {
			var me = this;
			var grid = interfaceMapSummaryWidget.down(Ext.String.format(
					'smartgrid[itemId="uploadCenter_{0}"]',
					interfaceMapSummaryWidget.widgetCode));
			var form = document.forms["frmMain"];
			var url = strActionUrl + '?' + csrfTokenName + '=' + csrfTokenValue;
			if (!Ext.isEmpty(grid)) {
				var records = grid.getSelectedRecords();
				records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
						? records
						: [record];
				for (var index = 0; index < records.length; index++) {

					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'mappingDetails[' + index + '].identifier',
							records[index].data.identifier));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'mappingDetails[' + index + '].viewState',
							records[index].data.viewState));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'mappingDetails[' + index
									+ '].interfaceMapMasterViewState',
							records[index].data.interfaceMapMasterViewState));
				}
				if (records.length > 0) {
					form.method = 'POST';
					form.action = url;
					form.submit();
				}
			}
		}
	},
	doRejectAction : function(strActionUrl, remark, interfaceMapSummaryWidget,
			record) {
		if (!Ext.isEmpty(interfaceMapSummaryWidget)) {
			var me = this;
			var grid = interfaceMapSummaryWidget.down(Ext.String.format(
					'smartgrid[itemId="uploadCenter_{0}"]',
					interfaceMapSummaryWidget.widgetCode));
			var form = document.forms["frmMain"];
			var url = strActionUrl + '?' + csrfTokenName + '=' + csrfTokenValue;
			// var grid = this.getUploadSummaryGridView();
			if (!Ext.isEmpty(grid)) {
				var records = grid.getSelectedRecords();
				records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
						? records
						: [record];
				for (var index = 0; index < records.length; index++) {
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							csrfTokenName, tokenValue));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'mappingDetails[' + index + '].identifier',
							records[index].data.identifier));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'mappingDetails[' + index + '].viewState',
							records[index].data.viewState));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'mappingDetails[' + index
									+ '].interfaceMapMasterViewState',
							records[index].data.interfaceMapMasterViewState));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'mappingDetails[' + index + '].fieldRemarks',
							remark));
				}
				if (records.length > 0) {
					form.method = 'POST';
					form.action = url;
					form.submit();
				}
			}
		}
	},
	preHandleGroupActions : function(strUrl, remark, interfaceMapSummaryWidget,
			record) {
		var me = this;
		var grid = this.getInterfaceMapSummaryGridView();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl + '?' + csrfTokenName + '='
								+ csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to
							// be done here
							me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
						},
						failure : function() {
							var errMsg = "";
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
	},
	enableDisableGroupActions : function(actionMask, interfaceMapSummaryWidget) {

		var actionBar = interfaceMapSummaryWidget.down(Ext.String.format(
				'toolbar[itemId="interfaceMapGroupActionBarView_{0}"]',
				interfaceMapSummaryWidget.widgetCode));
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
	applyFilter : function() {
		var me = this;
		var grid = me.getInterfaceMapSummaryGridView();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl() + '&' + csrfTokenName + '='
					+ csrfTokenValue;
			me.getInterfaceMapSummaryGridView().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	handleLoadGridData : function(widget, grid, url, pgSize, newPgNo, oldPgNo,
			sorter) {
		var me = this;
		var clientCodeValue = me.getClientcode();
		// var card = me.getGroupByCardPanel();
		// var cardcontainer = card.down(
		// 'panel[itemId="moduleContainer"]' );
		// cardcontainer.viewRendered = true;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.generateFilterUrl(widget);
		strUrl = strUrl + "&" + "$client=" + me.clientFilterVal + "&"
				+ csrfTokenName + "=" + csrfTokenValue;
		grid.loadGridData(strUrl, null, widget);
		//me.showGridSummaryInfo(grid);
	},
	getClientcode : function() {
		var me = this;
		var objOfCreateNewFilter = me.getClientMenuBar();
		if (!Ext.isEmpty(objOfCreateNewFilter)) {
			var clientCode = objOfCreateNewFilter
					.down('AutoCompleter[itemId="clientCodeId"]');
			if (!Ext.isEmpty(clientCode)) {
				var clientCodeValue = objOfCreateNewFilter
						.down('AutoCompleter[itemId="clientCodeId"]')
						.getValue();
			}
		}
		return clientCodeValue;
	},
	generateFilterUrl : function(widget) {
		var me = this;
		var strQuickFilterUrl = strWidgetFilterUrl = '', strUrl = '', isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
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
	generateWidgetUrl : function(widget) {
		var column = widget.codeColumn;
		var value = widget.code;
		var strWidgetFilter = column + ' eq ' + '\'' + value + '\'';
		return strWidgetFilter;
	},
	applyQuickFilter : function() {
		var me = this;
		// var card = me.getGroupByCardPanel();
		// var index = card.getLayout().getActiveItem();
		// me.refreshAllWidgets( index );
		me.refreshAllWidgets();
	},
	applyAdvancedFilter : function() {
		var me = this;
		var grid = me.getInterfaceMapSummaryGridView();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl() + '&' + csrfTokenName + '='
					+ csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl, null);
		}
	},
	setDataForFilter : function() {
		var me = this;
		me.getSearchTxnTextInput().setValue('');
		if (this.filterApplied === 'Q') {
			this.filterData = this.getQuickFilterQueryJson();
		} else if (this.filterApplied === 'ALL') {
			this.advFilterData = [];
			this.filterData = this.getQuickFilterQueryJson();
		}
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strUrl = '', isFilterApplied = 'false', strAdvFilterUrl = '';
		if (me.filterApplied === 'ALL' || me.filterApplied === 'Q') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += strQuickFilterUrl;
				isFilterApplied = true;
			} else {
				strUrl = strUrl + '&$filter=';
			}
			return strUrl;
		}

	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var typeFilterVal = me.typeFilterVal;
		var typeFilterDesc = me.typeFilterDesc;
		var actionFilterVal = this.actionFilterVal;
		var interfaceTypeFilterVal = me.interfaceTypeFilterVal;
		var flavorTypeFilterVal = me.flavorTypeFilterVal;
		var jsonArray = [];
         var sellerCodeValue=null;
		if (interfaceTypeFilterVal != null && interfaceTypeFilterVal !== 'All' && interfaceTypeFilterVal != '') {
			jsonArray.push({
						paramName : 'interfaceType',
						paramValue1 : interfaceTypeFilterVal.trim(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (flavorTypeFilterVal != null && flavorTypeFilterVal !== 'All' && flavorTypeFilterVal != '') {
			jsonArray.push({
						paramName : 'flavorType',
						paramValue1 : flavorTypeFilterVal.trim(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (me.typeFilterVal != null && me.typeFilterVal != 'All' && typeFilterVal != '' ) {
			jsonArray.push({
						paramName : me.getTaskStatusItemId().filterParamName,
						paramValue1 : me.typeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if(entityType==0){
				if (Ext.isEmpty(me.clientFilterVal)) {
					clientCodeComboValue = me.clientFilterVal;
				}else{
				   clientCodeComboValue=strClientId;
				}
				if (!Ext.isEmpty(clientCodeComboValue)
						&& clientCodeComboValue !== null) {
					jsonArray.push({
								paramName : 'clientCode',
								operatorValue : 'eq',
								paramValue1 : me.clientFilterVal,
								dataType : 'S'
							});
				}
			}
		if (entityType==0) {
						jsonArray.push({
									paramName : 'sellerCode',
									operatorValue : 'eq',
									paramValue1 : me.sellerFilterVal,
									dataType : 'S'
								});
			}
		
			
		return jsonArray;
	},
	searchTrasactionChange : function() {
		var me = this;
		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;
		var wdgtCt = me.getUploadModuleWidgetContainer();
		var arrWdgt = wdgtCt.query('widget');
		var searchValue = me.getSearchTxnTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.widgetAdvanceFlt) {
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
										// populate
										// indexes
										// array,
										// set
										// currentIndex,
										// and
										// replace
										// wrap
										// matched
										// string
										// in a
										// span
										cellHTML = cellHTML.replace(
												searchRegExp, function(m) {
													return '<span class="xn-livesearch-match">'
															+ m + '</span>';
												});
										// restore
										// protected
										// tags
										Ext.each(matches, function(match) {
													cellHTML = cellHTML
															.replace(
																	tagsProtect,
																	match);
												});
										// update
										// cell
										// html
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
	enableValidActionsForGrid : function(interfaceMapSummaryWidget, grid,
			record, recordIndex, selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, interfaceMapSummaryWidget);
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
			target : 'interfaceMapSummaryFilterView-1034_header_hd-textEl',
			listeners : {
				// Change content dynamically depending on which
				// element
				// triggered the show.
				beforeshow : function(tip) {
				var interFaceType='';
				var client='';
				if(entityType==0){
				    client = (me.clientFilterDesc!= '' && me.clientFilterDesc!= null) ? me.clientFilterDesc : getLabel('none','None');
				}
					if(me.interfaceTypeFilterVal!=='' && me.interfaceTypeFilterVal!=='All'){
					interFaceType=me.interfaceTypeFilterVal;
							interFaceType=(interFaceType=='U')?"Imports" :"Uploads";
					}else{
					 interFaceType="All";
					}
					tip.update(getLabel('client', 'Client')
										+ ' : '
										+ client
										+'</br>'
										+('interFaceType', 'InterFaceType')
										+ ' : '
										+ interFaceType
										+'</br>'
										+ getLabel('Falvour', 'Flavour')
										+ ' : '
										+ me.flavorTypeFilterVal
										+ '<br/>'
										+ getLabel('status', 'Status')
										+ ' : '
										+ me.typeFilterVal);
				}
			}
		});
	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},
	generateUrlWithQuickFilterParams : function(me) {

		var filterData = me.filterData;
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
					arrId = arrId.split(',');
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' )';
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
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		if (!Ext.isEmpty(objGridViewFilter)) {
			var data = Ext.decode(objGridViewFilter);
			strPreClientCode = data.filterClientCode;
			strPrefClientDesc = data.filterClientDesc;
			var strInterfaceType = data.quickFilter.interfaceType;
			var strFlavorType = data.quickFilter.flavorType;
			var strStatusType = data.quickFilter.statusType;

			me.interfaceTypeFilterVal = !Ext.isEmpty(strInterfaceType)
					? strInterfaceType
					: 'all';
			me.flavorTypeFilterVal = !Ext.isEmpty(strFlavorType)
					? strFlavorType
					: 'all';
			me.typeFilterVal = !Ext.isEmpty(strStatusType)
					? strStatusType
					: 'all';

			if (!Ext.isEmpty(me.interfaceTypeFilterVal)
					&& me.interfaceTypeFilterVal != 'all') {
				arrJsn.push({
							paramName : 'interfaceType',
							paramValue1 : me.interfaceTypeFilterVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (!Ext.isEmpty(me.flavorTypeFilterVal)
					&& me.flavorTypeFilterVal != 'all') {
				arrJsn.push({
							paramName : 'flavorType',
							paramValue1 : me.flavorTypeFilterVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (!Ext.isEmpty(me.typeFilterVal) && me.typeFilterVal != 'all') {
				arrJsn.push({
							paramName : 'taskStatus',
							paramValue1 : me.typeFilterVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
			}

			me.filterData = arrJsn;

			// set the typecode column if present in pref to
			// typecodes[]

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
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferencesRef();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);

	},
	handleSavePreferences : function() {
		var me = this;
		me.saveWidgetPreferences();
	},
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		me.clearWidgetPreferences();
	},
	saveWidgetPreferences : function() {
		var me = this, wdgt = null, grid = null, objPref = null, objWdgtPref = null, arrPref = null, arrColPref = null, arrCols = null, objCol = null;
		// var card = me.getGroupByCardPanel();
		// var activeContainer =
		// card.getLayout().getActiveItem();
		// var wdgtCt = activeContainer;
		// var arrWdgt = wdgtCt.query(
		// 'interfaceMapSummaryWidget' );

		var wdgtCt = me.getUploadModuleWidgetContainer();
		var arrWdgt = wdgtCt.query('widget');

		var strUrl = me.urlGridPref;

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
								&& objCol.xtype !== 'actioncolumn')
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
							if (!Ext.isEmpty(me.getBtnSavePreferencesRef()))
								me.toggleSavePrefrenceAction(true);
							me.toggleClearPrefrenceAction(false);
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
		var strUrl = me.urlGridFilterPref;
		var advFilterCode = null;
		var objFilterPref = {};
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var objQuickFilterPref = {};
		objQuickFilterPref.interfaceType = me.interfaceTypeFilterVal;
		objQuickFilterPref.flavorType = me.flavorTypeFilterVal;
		objQuickFilterPref.statusType = me.typeFilterVal;
		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = objQuickFilterPref;
		objFilterPref.filterClientCode = me.clientFilterVal;
		objFilterPref.filterClientDesc = me.clientFilterDesc;

		if (objFilterPref)
			Ext.Ajax.request({
						url : strUrl + csrfTokenName + '=' + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(objFilterPref),
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var title = getLabel('SaveFilterPopupTitle',
									'Message');
							if (data.d.preferences
									&& data.d.preferences.success === 'Y') {
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.INFO
										});
							} else if (data.d.preferences
									&& data.d.preferences.success === 'N'
									&& data.d.error
									&& data.d.error.errorMessage) {
								if (!Ext.isEmpty(me.getBtnSavePreferencesRef()))
									me.toggleSavePrefrenceAction(true);
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
	},
	clearWidgetPreferences : function() {
		var me = this;
		var strUrl = me.commonPrefUrl + "?$clear=true";

		var me = this, wdgt = null, grid = null, objPref = null, objWdgtPref = null, arrPref = null, arrColPref = null, arrCols = null, objCol = null;
		// var card = me.getGroupByCardPanel();
		// var activeContainer =
		// card.getLayout().getActiveItem();
		// var wdgtCt = activeContainer;
		// var arrWdgt = wdgtCt.query(
		// 'interfaceMapSummaryWidget' );

		var wdgtCt = me.getUploadModuleWidgetContainer();
		var arrWdgt = wdgtCt.query('widget');

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
								&& objCol.xtype !== 'actioncolumn')
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
							if (!Ext.isEmpty(me.getBtnSavePreferencesRef()))
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
	handleType : function(btn) {
		var me = this;
		me.toggleSavePrefrenceAction(true);
		me.getInterfaceTypeToolBar().items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');
				});
		btn.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
		// me.typeFilterVal = btn.code;
		// me.typeFilterDesc = btn.btnDesc;
		me.interfaceTypeFilterVal = btn.code;
		me.interfaceTypeFilterDesc = btn.btnDesc;
		if (me.interfaceTypeFilterVal === 'All') {
			me.filterApplied = 'ALL';
		} else {
			me.filterApplied = 'Q';
		}
		//me.setDataForFilter();
		//me.applyQuickFilter();
	},
	handleFlavorType : function(btn) {
		var me = this;
		me.toggleSavePrefrenceAction(true);
		me.getFlavorTypeToolBar().items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');
				});
		btn.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
		me.flavorTypeFilterVal = btn.code;
		me.flavorTypeFilterDesc = btn.btnDesc;
		me.setDataForFilter();
		if (me.flavorTypeFilterVal === 'All') {
			me.filterApplied = 'ALL';
		} else {
			me.filterApplied = 'Q';

		}
		//me.applyQuickFilter();
	},
	handleStatusType : function(btn) {
		var me = this;
		me.toggleSavePrefrenceAction(true);
		/*
		 * me.getFlavorTypeToolBarflavorTypeToolBar().items.each( function( item ) {
		 * item.removeCls( 'xn-custom-heighlight' ); item.addCls(
		 * 'xn-account-filter-btnmenu' ); } );
		 */
		// btn.addCls( 'xn-custom-heighlight
		// xn-account-filter-btnmenu' );
		me.typeFilterVal = btn.btnValue;
		me.typeFilterDesc = btn.btnDesc;
		me.setDataForFilter();
		if (me.typeFilterVal === 'All') {
			me.filterApplied = 'ALL';
		} else {
			me.filterApplied = 'Q';

		}
		//me.applyQuickFilter();
	},
	onUploadSummaryInformationViewRender : function() {
		var me = this;
		var accSummInfoViewRef1 = me.getInterfaceMapSummaryInfoView();
		accSummInfoViewRef1.createSummaryLowerPanelView();
	},
	setSummaryInfo : function(grid) {
		var me = this;
		// var uploadSummaryGrid =
		// me.getUploadSummaryGridView();
		var interfaceMapSummaryInfoView = me.getInterfaceMapSummaryInfoView();
		var standardCountId = interfaceMapSummaryInfoView
				.down('panel[itemId="infoSummaryLowerPanel"] panel label[itemId="standardId"]');
		var customisedCountId = interfaceMapSummaryInfoView
				.down('panel[itemId="infoSummaryLowerPanel"] panel label[itemId="customId"]');
		var dataStore = grid.store;
		dataStore.on('load', function(store, records) {
					var i = records.length - 1;
					if (i >= 0) {
						standardCount = records[i].get('standardCount');
						standardCountId.setText(standardCount);
						customisedCount = records[i].get('customisedCount');
						customisedCountId.setText(customisedCount);

					} else {
						standardCountId.setText("# 0");
						customisedCountId.setText("# 0");
					}
				});
	},
	closeClonePopup : function(btn) {
		var me = this;
		me.getClonePopUpRef().close();
		var objPanel = me.getClonePopUpDtlRef();
		objPanel.down('textfield[itemId="interfaceName"]').setValue("");
	},
	addUploadDefinition : function() {
		var me = this;
		var strUrl = "showUploadProcessForm.srvc";
		me.submitForm(strUrl);
	},
	addDownloadDefinition : function() {
		var me = this;
		var strUrl = "showDownloadProcessForm.srvc";
		me.submitForm(strUrl);
	},
	submitForm : function(strUrl) {
		var me = this;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'pageMode',
				'entry'));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedSeller', me.sellerFilterVal));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedClient', me.clientFilterVal));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'selectedClientDesc', me.clientFilterDesc));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	showHistory : function(record) {
		var recHistory = record.get('history');
		if (!Ext.isEmpty(recHistory) && !Ext.isEmpty(recHistory.__deferred.uri)) {
			var strUrl = record.get('history').__deferred.uri;
			Ext.create('GCP.view.InterfaceMapHistoryPopup', {
				historyUrl : strUrl + "?" + csrfTokenName + "="
						+ csrfTokenValue,
				interfaceCode : record.get('interfaceName'),
				identifier : record.get('identifier')
			}).show();
		}
	},
	updateStatusFilterView : function() {
		var me = this;
		var statuslabelValue = me.getStatusLabel();
		var objStatusLbl = {
			'All' : getLabel('AllStatus', 'All'),
			'0' : getLabel('newStatus', 'New / Draft'),
			'1' : getLabel('modifiedStatus', 'Modified'),
			'2' : getLabel('deleteStatus', 'Delete Request'),
			'3' : getLabel('authorizedStatus', 'Authorized'),
			'4' : getLabel('enableStatus', 'Enable Request'),
			'5' : getLabel('disableStatus', 'Disable Request'),
			'6' : getLabel('disabledStatus', 'Disabled'),
			'7' : getLabel('rejectedStatus', 'Rejected'),
			'8' : getLabel('modifiedRejectStatus', 'Modified Request Rejected'),
			'9' : getLabel('disableRequestStatus', 'Disable Request Rejected'),
			'10' : getLabel('enableRequestStatus', 'Enable Request Rejected')
		};
		if (!Ext.isEmpty(me.typeFilterVal)) {
			statuslabelValue.setText(objStatusLbl[me.typeFilterVal]);
		}
	},
	showHideSellerClientMenuBar : function(isBankFlag) {
		var me = this;
		if (isBankFlag === 'false') {
			me.getSellerMenuBar().hide();
			me.getClientMenuBar().hide();
			if (client_count > 1) {
				me.getClientLoginMenuBar().show();
			} else {
				me.getClientLoginMenuBar().hide();
			}
		} else {
			me.getClientMenuBar().show();
			me.getClientLoginMenuBar().hide();
		}

	},
	handleWidgetsLoadingForUploadSummary : function(panel) {
		var me = this;
		var objDefaultStandardViewPref = null;
		if (isBankFlag === 'true') {
			objDefaultStandardViewPref = objBankDefaultStandardViewPref;
		} else {
			if (client_count > 1) {
				objDefaultStandardViewPref = objClientDefaultStandardViewPref;
			} else {
				objDefaultStandardViewPref = objClientCountDefaultStandardViewPref
			}
		}

		if (!Ext.isEmpty(objGridViewPref)) {
			me.loadSavedPrefWidgets(Ext.decode(objGridViewPref));
		} else if (objDefaultStandardViewPref) {
			me.getWidgetsData(objDefaultStandardViewPref);
		}
	},
	loadSavedPrefWidgets : function(savedPrefData) {
		var me = this;
		var objWgtCt = me.getUploadModuleWidgetContainer();
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
								xtype : 'widget',
								widgetType : wcode,
								widgetDesc : widgetDesciption,
								widgetCode : widgtCode,
								code : wcode,
								codeColumn : cColumn,
								widgetModel : columnDetailsData,
								collapsed : false
							});
				} else {
					// console.log("Error Occured - Saved widget
					// Data Found Empty");
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
	getWidgetsData : function(objDefaultStandardViewPref) {
		var me = this;
		var strUrl = "loadUploadWidgets.srvc?";

		Ext.Ajax.request({
					url : strUrl + csrfTokenName + "=" + csrfTokenValue
							+ "&$filter= ",
					method : 'POST',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var uploadModuleData = data.widgetTypeList;
						if (!Ext.isEmpty(uploadModuleData))
							me.loadWidgetsForUploadSummary(
									objDefaultStandardViewPref,
									uploadModuleData);
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}

				});

	},
	loadWidgetsForUploadSummary : function(columnDetailsData, uploadModuleData) {
		var me = this;
		var objWgtCt = me.getUploadModuleWidgetContainer();
		var arrItem;

		if (!Ext.isEmpty(uploadModuleData)) {
			arrItem = new Array();
			for (var index = 0; index < uploadModuleData.length; index++) {
				var widgetDesciption = uploadModuleData[index].widgetDesc;
				var wcode = uploadModuleData[index].code;
				var widgtCode = wcode + '_' + index;

				if (!Ext.isEmpty(widgetDesciption) && !Ext.isEmpty(wcode)) {
					arrItem.push({
								xtype : 'widget',
								widgetType : wcode,
								widgetDesc : widgetDesciption,
								widgetCode : widgtCode,
								code : wcode,
								codeColumn : 'module_code',
								widgetModel : columnDetailsData,
								collapsed : false
							});
				} else {
					// console.log("Error Occured - Account Type
					// Data Found Empty");
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
		// widget.setTitle( widget.widgetDesc );
		// me.resetWidgetHeaderLabels( widget );
	},
	resetWidgetHeaderLabels : function(widget) {
		if (!Ext.isEmpty(widget)) {
			var spacer = widget.header.items.items[1];
			var custlink = widget.header.items.items[2];
			if (!Ext.isEmpty(spacer) && !Ext.isEmpty(custlink)) {
				spacer.show();
				custlink.show();
			}
		}
	},
	collapseWidget : function(interfaceMapSummaryWidget) {
		// interfaceMapSummaryWidget.setTitle( '<span
		// class="block ux_header-width ux-custom-header-font">'
		// + interfaceMapSummaryWidget.widgetDesc + '</span>' );
	},
	handleComboPageSizeChange : function(pager, current, oldPageNum) {
		var me = this;
		me.toggleSavePrefrenceAction(true);
	},
	refreshAllWidgets : function() {
		var me = this, wdgt = null;
		var wdgtCt = me.getUploadModuleWidgetContainer();
		var arrWdgt = wdgtCt.query('widget');
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
	editAction : function(record, rowIndex) {
		var me = this;
		var strUrl;
		if (record.get('interfaceType') == 'Upload') {
			strUrl = "editUploadProcess.srvc";
		} else {
			strUrl = "editDownloadProcess.srvc";
		}
		me.editUploadDefinition(strUrl, record, rowIndex);
	},
	viewAction : function(record, rowIndex) {
		var me = this;
		var strUrl;
		if (record.get('interfaceType') == 'Upload') {
			strUrl = "editUploadProcess.srvc";
		} else {
			strUrl = "editDownloadProcess.srvc";
		}
		me.viewUploadDefinition(strUrl, record, rowIndex);
	},
	submitAction : function(record, rowIndex) {

		var me = this;
		var strUrl;
		if (record.get('interfaceType') == 'Upload') {
			strUrl = "submitUploadForm.srvc";
		} else {
			strUrl = "submitDownloadForm.srvc";
		}
		me.submitDefinition(strUrl, record, rowIndex);
	},
	submitDefinition : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.get('viewState');
		var interfaceMapMasterViewState = record
				.get('interfaceMapMasterViewState');
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'screenType',
				"ListScreen"));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'interfaceMapMasterViewState', interfaceMapMasterViewState));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	cloneAction : function(record) {
		var me = this;
		me.showClonePopup(record);
	},
	editUploadDefinition : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.get('viewState');
		var interfaceMapMasterViewState = record
				.get('interfaceMapMasterViewState');
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'interfaceMapMasterViewState', interfaceMapMasterViewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'pageMode',
				'Entry'));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	viewUploadDefinition : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.get('viewState');
		var interfaceMapMasterViewState = record
				.get('interfaceMapMasterViewState');
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'interfaceMapMasterViewState', interfaceMapMasterViewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'pageMode',
				'View'));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	showClonePopup : function(record) {
		var me = this;
		var objPanel = me.getClonePopUpDtlRef();
		objPanel.down('hidden[itemId="viewStateVal"]').setValue(record
				.get('viewState'));
		objPanel.down('hidden[itemId="interfaceType"]').setValue(record
				.get('interfaceType'));
		objPanel.down('hidden[itemId="interfaceMapMasterViewStateVal"]')
				.setValue(record.get('interfaceMapMasterViewState'));
		if (!Ext.isEmpty(me.objClonePopup)) {
			if (isBankFlag === 'true') {
				Ext.getCmp('editChkBox').hide();
				Ext.getCmp('profileChkBox').hide();
			} else {
				Ext.getCmp('editChkBox').show();
				Ext.getCmp('profileChkBox').hide();
			}
			me.objClonePopup.show();
		} else {
			me.objClonePopup = Ext.create('GCP.view.ShowClonePopUp');
			me.objClonePopup.show();
		}
	},
	handleCloneAction : function(btn) {
		var me = this;
		var strUrl;
		var objPanel = me.getClonePopUpDtlRef();
		var viewState = objPanel.down('hidden[itemId="viewStateVal"]')
				.getValue();
		var interfaceType = objPanel.down('hidden[itemId="interfaceType"]')
				.getValue();
		if (interfaceType == 'Upload') {
			strUrl = "cloneUploadInterface.srvc";
		} else {
			strUrl = "cloneDownloadInterface.srvc";
		}
		var interfaceMapMasterViewState = objPanel
				.down('hidden[itemId="interfaceMapMasterViewStateVal"]')
				.getValue();
		var cloneProcessCode = objPanel
				.down('textfield[itemId="interfaceName"]').getValue();
		if (!Ext.isEmpty(cloneProcessCode)) {
			var form;
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
					viewState));
			form
					.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'interfaceMapMasterViewState',
							interfaceMapMasterViewState));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'cloneProcessCode', cloneProcessCode));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'editFlagValue', me.editChkBoxVal));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'secProfileFlagValue', me.editProfileChkBoxVal));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'clientCode', me.clientCodeVal));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
		} else {
			me.getClonePopUpRef().close();
		}
	},
	showGridSummaryInfo : function(grid) {
		var me = this;
		me.setSummaryInfo(grid);
	},
	applySeekFilter : function() {
		var me = this;
		me.toggleSavePrefrenceAction(true);
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.applyQuickFilter();
	},
	handleSecurityProfileLoading : function(record) {
		// showSecurityProfilePopUp();
		var me = this;
		var clientCode = record.get('entityCode');
		document.getElementById('interfaceCode').value = record
				.get('interfaceName');
		document.getElementById('recId').value = record.get('identifier');
		document.getElementById('viewStateSecProf').value = record
				.get('viewState');
		document.getElementById('interfaceMapMasterViewStateSecProf').value = record
				.get('interfaceMapMasterViewState');
		var securityProfileId = record.get('securityProfileId');
		var strUrl = 'getClientSecurityProfile.srvc?';
		if (clientCode != null) {
			Ext.Ajax.request({
						url : strUrl + csrfTokenName + '=' + csrfTokenValue
								+ '&$clientFilter=' + clientCode,
						method : "POST",
						success : function(response) {
							createSecProfileCombo(Ext
											.decode(response.responseText),
									securityProfileId);
						},
						failure : function(response) {
							// console.log( 'Error Occured' );
						}
					});
		}

	}
});
function createSecProfileCombo(obj, securityProfileId) {
	var fcode = obj;
	// eval( "document.getElementById('secProfName').options[0]=" + "new
	// Option('Select')");
	for (var i = 0; i < fcode.length; i++) {
		eval("document.getElementById('secProfName').options[i]="
				+ "new Option('" + fcode[i].filterValue + "','"
				+ fcode[i].filterCode + "')");
	}
	showSecurityProfilePopUp(securityProfileId);
}

function closeSecurityProfilePopup() {
	$('#SecurityProfileInnerPopUp').dialog('close');
}
function saveSecurityProfile() {
	var viewState1 = document
			.getElementById('interfaceMapMasterViewStateSecProf').value;
	var secProfId = document.getElementById("securityProfileId").value;

	var frm = document.getElementById("frmMain");
	// frm.target = "";
	frm.appendChild(createFormElement('INPUT', 'HIDDEN', 'viewState1',
			viewState1));
	frm
			.appendChild(createFormElement('INPUT', 'HIDDEN', 'secProfId',
					secProfId));
	frm.action = "attachSecurityProfile.srvc";
	frm.method = "POST";
	$('SecurityProfileInnerPopUp').dialog('close');
	frm.submit();
}
function showSecurityProfilePopUp(securityProfileId) {
	var viewState1 = document
			.getElementById('interfaceMapMasterViewStateSecProf').value;
	var secProfId = document.getElementById("securityProfileId").value;
	$('#SecurityProfileInnerPopUp').dialog({
				autoOpen : false,
				height : 180,
				width : 400,
				modal : true,
				resizable : false,
				title : getLabel('attachSecurityPrf','Attach Security Profile')
			});
	if (null != securityProfileId && '' != securityProfileId) {
		$("#secProfName").find('option').each(function(i, opt) {
					if (opt.value === securityProfileId)
						$(opt).attr('selected', 'selected');
				});
	}
	$('#SecurityProfileInnerPopUp').dialog("open");
}
function createFormElement(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
