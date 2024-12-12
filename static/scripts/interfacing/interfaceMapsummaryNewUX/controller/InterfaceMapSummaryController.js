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
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView container[itemId="clientFilterPanel"]'
			}, {
				ref : 'clientLoginMenuBar',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView panel[itemId="clientLoginMenuBar"]'
			},{
				ref : 'clientCodeCombo',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView combo[itemId="clientCodeComboId"]'
			},{
				ref : 'groupView',
				selector : 'interfaceMapSummaryView groupView'
			},{
				ref : 'clientAutoCompleter',
				selector : 'interfaceMapSummaryView interfaceMapSummaryFilterView container[itemId="clientFilterPanel"] AutoCompleter[itemId="clientCodeId"]'
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
		cloneRestrictedFlagChkBoxVal : 'RESTRICTED_DISABLE',
		widgetTypeCodeColumns : new Array(),
		urlGridPref : 'userpreferences/interfaceMapSummary/gridView.srvc?',
		urlGridFilterPref : 'userpreferences/interfaceMapSummary/gridViewFilter.srvc?',
		commonPrefUrl : 'services/userpreferences/interfaceMapSummary.json',
		sellerFilterVal : null,
		clientFilterVal : null,
		clientFilterDesc : null,
		strGetModulePrefUrl : 'services/userpreferences/interfaceMapCenter/{0}.json',
		strDefaultMask : '0000',
		cfgGroupByUrl : 'services/grouptype/interfaceMapCenter/groupBy.srvc?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}'+'\'' + '&$filterscreen=BANKADMIN',
		cfgBankClientGroupByUrl : 'services/grouptype/interfaceMapCenter/groupBy.srvc?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}'+'\'' + '&$filterscreen=BANKCLIENT',
		cfgClientGroupByUrl : 'services/grouptype/interfaceMapCenter/groupBy.srvc?'+csrfTokenName+'='+tokenValue+'&$filter=entityCode eq '+'\'{0}\' and seller eq '+'\'{1}\''+ '&$filterscreen=CLIENT',
		preferenceHandler : null,
		strPageName : 'interfaceMapSummaryNewUX',
		filterDataPref : {},
		initialSmartGridRender : true,
		entityType : 'BANK'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.sellerFilterVal=SESVAR_SELLER;
		me.clientFilterVal = strClientId;
		me.clientFilterDesc = strClientDesc;
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
					if (checked === true)
					{
						Ext.getCmp('profileChkBox').show();
						Ext.getCmp( 'cloneRestrictedFlagChkBox' ).setDisabled( false );
					}
					else
					{
						Ext.getCmp('profileChkBox').hide();
						Ext.getCmp( 'cloneRestrictedFlagChkBox' ).setValue( false );
						Ext.getCmp( 'cloneRestrictedFlagChkBox' ).setDisabled( true );
					}
				},
				handleCheckBoxProfileAction : function(checked) {
					me.editProfileChkBoxVal = checked;
				},
				handleCheckBoxCloneRestrictedFlagAction : function(checked)
				{
					me.cloneRestrictedFlagChkBoxVal = checked;
					if( checked )
					{
						me.cloneRestrictedFlagChkBoxVal = 'RESTRICTED_ENABLE';
					}
					else
					{
						me.cloneRestrictedFlagChkBoxVal = 'RESTRICTED_DISABLE';
					}
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
			'interfaceMapSummaryView groupView' : {				
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {	
					//me.setDataForQuickFilter(me.filterJson);		
					me.toggleSavePrefrenceAction(true);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},			
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record, rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'gridRender' : me.handleLoadGridData,
				'gridPageChange' : me.handleLoadGridData,
				'gridSortChange' : me.handleLoadGridData,
				'gridPageSizeChange' : me.handleLoadGridData,
				'gridColumnFilterChange' : me.handleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				
				'gridStateChange' : function(grid) {
					me.toggleSavePrefrenceAction(true);
				},
				'render' : function(){
					if (objGridViewFilterPref) {
						
							var objJsonData = Ext.decode(objGridViewFilterPref);
							objGroupByPref = objJsonData;
							if (!Ext.isEmpty(objGroupByPref)) {
								me.toggleSavePrefrenceAction(false);
								me.toggleClearPrefrenceAction(true);
							}
						}
					}
			},
			'interfaceMapSummaryView interfaceMapSummaryFilterView' : {	
				'afterRender' : function() {
					//me.setInfoTooltip();
					//me.setDataForQuickFilter();
					me.setSelectedFilters();
					me.setDataForFilter();
				},
				'filterClient' : function(clientCode, clientDesc) {
					me.filterClient(clientCode, clientDesc);
				},
				'refreshGroupByTabs': function(seller){
					me.sellerFilterVal = seller;
					strSeller = seller;
					me.refreshGroupByTabs(seller); 
				},
				'filterType' : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleType(btn);
				},
				'filterFlavorType' : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleFlavorType(btn);
				},
				'filterStatusType' : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleStatusType(btn);
					me.updateStatusFilterView();

				},
				'filterEntityType' : function(entityType){
					me.filterEntityType(entityType);
				}
			},
			'interfaceMapSummaryView groupView smartgrid' : {
					'afterrender' : function(){
						var isShowClientCol = me.entityType == 'BANK' ? false : true;
						me.hideShowClientColumn(isShowClientCol);
					}
			}
				 
		});
	},
	filterClient : function(clientCode, clientDesc){
		var me = this;
		var isShowClientColumn = (clientCode == null ? false : true);
		me.clientFilterVal = clientCode;
		me.clientFilterDesc = clientDesc;
					
		var groupView = me.getGroupView();
		if(null != groupView.down('smartgrid'))
		{
			var columnModel = groupView.down('smartgrid').getAllColumns();
			var i = 0;
			for( i = 0; i < columnModel.length; i++){
				var column = columnModel[i];
				if(column.itemId == 'col_clientDesc'){
					if(isShowClientColumn)
						column.show();
					else
						column.hide();
				}
			}
		}
		me.setDataForFilter();
		me.applyQuickFilter();	
	},
	
	hideShowClientColumn : function(isShowClientColumn){
		var me = this;
		var groupView = me.getGroupView();
		if(null != groupView.down('smartgrid'))
		{
			var columnModel = groupView.down('smartgrid').getAllColumns();
			var i = 0;
			for( i = 0; i < columnModel.length; i++){
				var column = columnModel[i];
				if(column.itemId == 'col_clientDesc'){
					if(isShowClientColumn)
						column.show();
					else
						column.hide();
				}
			}
		}
	},
	
	filterEntityType : function(entityType){
		var me = this;
		me.entityType = entityType;
		if(entityType === 'BANK'){
			me.hideClientPanel();
			//me.filterClient(null,null);
			me.clientFilterVal = 'BANK';
			me.clientFilterDesc = 'BANK';
		}
		else if(entityType === 'BANK_CLIENT'){
			var clientAutoCompleter = me.getClientAutoCompleter();
			clientAutoCompleter.store.loadRawData({
																"d" : {
																	"preferences" : [{
																				"CODE" : 'ALL',
																				"DESCR" : 'ALL'
																			}]
																}
															});
			clientAutoCompleter.setValue('ALL');
			me.clientFilterVal = 'ALL';
			me.clientFilterDesc = 'ALL';
			me.showClientpanel();
			//me.filterClient('ALL','ALL');
		}
		var client = null;
		if(me.entityType == 'BANK_CLIENT')
		{
			client = 'ALL';
		}
		me.refreshGroupByTabs(me.sellerFilterVal,client);
	},
	hideClientPanel : function(){
		var me = this;
		var objOfCreateNewFilter = me.getClientMenuBar();
		if (!Ext.isEmpty(objOfCreateNewFilter)) {
			objOfCreateNewFilter.hide();
		}
	},
	showClientpanel : function(){
		var me = this;
		var objOfCreateNewFilter = me.getClientMenuBar();
		if (!Ext.isEmpty(objOfCreateNewFilter)) {
			objOfCreateNewFilter.show();
		}
	},
	
	doHandleRowActions : function(actionName, grid, record, rowIndex){
		var me = this;
		if(actionName === 'btnEdit')
		{
			me.editAction(record,rowIndex);
		}
		else if(actionName === 'btnView')
		{
			me.viewAction(record,rowIndex);
		}
		else if(actionName === 'btnHistory')
		{
			me.showHistory(record,rowIndex);
		}
		else if(actionName === 'clone')
		{
			me.cloneAction(record);
		}
		else if(actionName === 'btnSubmit')
		{
			me.submitAction(record);
		}
	},
	refreshGroupByTabs: function(seller, client)
	{
		var me = this;
		var strUrl = Ext.String.format(me.cfgGroupByUrl, seller);
		if(entityType == '1'){
			strUrl = Ext.String.format(me.cfgClientGroupByUrl, seller,client);
		}
		else if( !Ext.isEmpty( client ) )
		{
			strUrl = Ext.String.format( me.cfgBankClientGroupByUrl, seller);
		}
		me.getGroupView().loadGroupByMenus(strUrl);
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {	
		var me = this;
		me.widgetType = subGroupInfo.groupCode;
		me.reportModule = subGroupInfo.groupCode;	
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};

		if(groupInfo){
			if (groupInfo.groupTypeCode == 'ADV_FILTER') {
					strModule = subGroupInfo.groupCode
				args = {
					'module' : strModule
					};
				me.preferenceHandler.readModulePreferences(me.strPageName,
						strModule, me.postDoHandleGroupTabChange, args, me, true);
			} 
			else {
					args = {
							scope : me
					};
				strModule = subGroupInfo.groupCode;
				strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
				me.getSavedPreferences(strUrl,
						me.postDoHandleGroupTabChange, args);
			}
		}
	},	
	postDoHandleGroupTabChange : function(data, args, isSuccess) {
		
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getInterfaceMapSummaryView(), objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			me.toggleClearPrefrenceAction(true);
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols
					|| objDefPref[mapService[args['module']]] || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumns(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize
				};
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	getSavedPreferences : function(strUrl, fnCallBack, args) {
		var me = this;
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var data = null;
						if (response && response.responseText)
							data = Ext.decode(response.responseText);
						Ext.Function.bind(fnCallBack, me);
						if (fnCallBack)
							fnCallBack(data, args);
					},
					failure : function() {
					}

				});
	},

	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl = Ext.String
				.format('uploadSummaryList/{1}.srvc?', strAction);
				
		var strActionUrl = Ext.String.format('{0}.srvc', strAction);
		// me.preHandleGroupActions( strUrl, '',
		// interfaceMapSummaryWidget, record );
		if (strAction === 'interfaceReject') {
			this.showRejectVerifyPopUp(strAction, strActionUrl,
					grid, null);

		} else if (strAction === 'clone') {
			me.showClonePopup(strAction, strUrl, null);
		} else {
			me.doAction(strActionUrl, '', grid, null);
			// this.preHandleGroupActions(strUrl,
			// '',interfaceMapSummaryWidget, record);
		}
	},
	setSelectedFilters : function() {
		var me = this, filter = me.getInterfaceMapSummaryFilterView();
		var objPref = null;
		objPref = me.filterDataPref;
		if(objPref.interfaceType){
			var btn = filter.down('toolbar[itemId=interfaceTypeToolBar]').down('button[code='+objPref.interfaceType+']');	
			me.setButtonCls(btn, 'interfaceTypeToolBar');
		}
		if(objPref.flavorType){
			var btn = filter.down('toolbar[itemId=flavorTypeToolBar]').down('button[code='+objPref.flavorType+']');	
			me.setButtonCls(btn, 'flavorTypeToolBar');
		}
		if(objPref.statusType){
			var btn = filter.down('button[code='+objPref.statusType+']');	
			//me.setButtonCls(btn, 'repOrDwnldToolBar');
			me.updateStatusFilterView();
			
		}
		if(objPref.clientCode){
			var clientMenu = filter.down('menu[itemId="clientMenu"]');
			var clientBtn = filter.down('button[itemId="clientBtn"]');
			filter.clientDesc = objPref.clientDesc;
		}
		//me.setDataForQuickFilter(objPref);
	},
	
	setButtonCls : function(btn, itemId) {
		var me = this, filter = me.getInterfaceMapSummaryFilterView();
		filter.down('toolbar[itemId='+ itemId +']').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
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
		var me = this;
		var groupView = me.getGroupView();
		var objGroupView = me.getGroupView();
		if (!Ext.isEmpty(interfaceMapSummaryWidget)) {
				var grid = interfaceMapSummaryWidget;	
				var arrayJson = new Array();
				var records = grid.getSelectedRecords();
				records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
						? records
						: [record];
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
						viewState : records[index].data.viewState,
						interfaceMapMasterViewState : records[index].data.interfaceMapMasterViewState
					});
					
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				
				Ext.Ajax.request({
							url : strActionUrl,
							method : 'POST',
							jsonData :  Ext.encode(arrayJson),
							success : function(jsonData) {
								//var jsonRes = Ext.JSON
								//		.decode(jsonData.responseText);
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								groupView.setLoading(false);
								groupView.down('smartgrid').refreshData();
								objGroupView.handleGroupActionsVisibility(me.strDefaultMask);
								var errCode = '';
								actionData = jsonRes.d.instrumentActions;
								
								msg = '';
								Ext.each(actionData, function(result) {
									if(result.success == 'N')
									{									
										Ext.each(result.errors, function(error) {
										msg = msg + error.code + ' : '
												+ error.errorMessage + '<br/>';
										errCode = error.code;
										});
									}
								});
								if(!Ext.isEmpty(msg))
								{
									Ext.MessageBox.show({
											title : "Error",
											msg : msg,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
								}
								
						       }						
							,
							failure : function() {
								var errMsg = "";
								groupView.setLoading(false);
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
	doRejectAction : function(strActionUrl, remark, interfaceMapSummaryWidget,
			record) {
		var me = this;
		var groupView = me.getGroupView();
		var objGroupView = me.getGroupView();
		if (!Ext.isEmpty(interfaceMapSummaryWidget)) {
				var grid = interfaceMapSummaryWidget;	
				var arrayJson = new Array();
				var records = grid.getSelectedRecords();
				records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
						? records
						: [record];
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
						viewState : records[index].data.viewState,
						interfaceMapMasterViewState : records[index].data.interfaceMapMasterViewState,
						fieldRemarks : remark
					});
					
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				
				Ext.Ajax.request({
							url : strActionUrl,
							method : 'POST',
							jsonData :  Ext.encode(arrayJson),
							success : function(jsonData) {
								//var jsonRes = Ext.JSON
								//		.decode(jsonData.responseText);
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								groupView.setLoading(false);
								groupView.down('smartgrid').refreshData();
								objGroupView.handleGroupActionsVisibility(me.strDefaultMask);
								var errCode = '';
								actionData = jsonRes.d.instrumentActions;
								
								msg = '';
								Ext.each(actionData, function(result) {
									if(result.success == 'N')
									{									
										Ext.each(result.errors, function(error) {
										msg = msg + error.code + ' : '
												+ error.errorMessage + '<br/>';
										errCode = error.code;
										});
									}
								});
								if(!Ext.isEmpty(msg))
								{
									Ext.MessageBox.show({
											title : "Error",
											msg : msg,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
								}
								
						       }						
							,
							failure : function() {
								var errMsg = "";
								groupView.setLoading(false);
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
	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {		
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		url = url + me.widgetType + '.srvc';
		objGroupView.handleGroupActionsVisibility(buttonMask);
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		strUrl = strUrl + "&" + "$client="+ me.clientFilterVal + "&"+ csrfTokenName +"="+ csrfTokenValue;
		grid.loadGridData(strUrl, null, null, false);
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
	
	generateFilterUrl : function(groupInfo, subGroupInfo) {
		var me = this;
		var filterView = me.getInterfaceMapSummaryFilterView();
		var strQuickFilterUrl = '', strWidgetFilterUrl = '', strUrl = '', isFilterApplied = false, isFavouriteFilter = false;
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		strWidgetFilterUrl = me.generateWidgetUrl(groupInfo, subGroupInfo);
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
		
	generateWidgetUrl : function(groupInfo, subGroupInfo) {
		if(subGroupInfo.groupCode != 'all'){
			var strWidgetFilter = 'module_code' + ' eq ' + '\'' + subGroupInfo.groupCode + '\'';
		}
		return strWidgetFilter;
	},
	applyQuickFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		groupView.down('smartgrid').refreshData();
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
		//me.getSearchTxnTextInput().setValue('');
		if (this.filterApplied === 'Q') {
			this.filterData = this.getQuickFilterQueryJson();
		} else if (this.filterApplied === 'ALL') {
			this.advFilterData = [];
			this.filterData = this.getQuickFilterQueryJson();
		}
		else{
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
				if (!Ext.isEmpty(me.clientFilterVal)) {
					clientCodeComboValue = me.clientFilterVal;
				}else{
				   clientCodeComboValue=strClientId;
				}
				if (!Ext.isEmpty(clientCodeComboValue)
						&& clientCodeComboValue !== null) {
					if(clientCodeComboValue != 'ALL' && clientCodeComboValue != 'BANK')
					{
						jsonArray.push({
								paramName : 'clientCode',
								operatorValue : 'eq',
								paramValue1 : me.clientFilterVal,
								dataType : 'S'
							});
					}
					else if(clientCodeComboValue == 'ALL'){
						jsonArray.push({
								paramName : 'clientCode',
								operatorValue : 'lk',
								paramValue1 : '',
								dataType : 'S'
							});
					}
				}
				
			}
			if (entityType==0) {
				var banks = me.sellerFilterVal;
				if( Ext.isEmpty(me.clientFilterVal) || 'BANK' == me.clientFilterVal )
				{
					banks = banks + ',OWNER';
				}
				jsonArray.push({
							paramName : 'sellerCode',
							operatorValue : 'in',
							paramValue1 : banks,
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
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var buttonMask = me.strDefaultMask;
		var objGroupView = me.getGroupView();
		var maskArray = new Array(), actionMask = '', objData = null;
		
		if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push( buttonMask );
		for( var index = 0 ; index < arrSelectedRecords.length ; index++ )
		{
			objData = arrSelectedRecords[ index ];
			maskArray.push( objData.get( '__metadata' ).__rightsMap );
		}
		actionMask = doAndOperation( maskArray, 10 );
		objGroupView.handleGroupActionsVisibility(actionMask);
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
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		var arrPref = me.getPreferencesToSave(false);
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
	},
	handleSavePreferences : function() {
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePreferences, null, me, true);
		}
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null, strModule = null;
		var state = null;
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			strModule = state.groupCode
			arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : state.groupCode,
							subGroupCode : state.subGroupCode
						}
					});
			arrPref.push({
						"module" : subGroupInfo.groupCode,
						"jsonPreferences" : {
							'gridCols' : state.grid.columns,
							'pgSize' : state.grid.pageSize
						}
					});
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : {
							'financialInstitutionVal' : me.sellerFilterVal,
							'clientVal' : me.clientFilterVal,
							'clientDesc' : me.clientFilterDesc,
							'interfaceType' : me.interfaceTypeFilterVal,
							'flavorType' : me.flavorTypeFilterVal,
							'statusType' : me.typeFilterVal
						}
					});
		}
		return arrPref;
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		if (isSuccess === 'N') {
		} else {
			me.toggleClearPrefrenceAction(false);
			me.toggleSavePrefrenceAction(true);
		}
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'N') {
			if (!Ext.isEmpty(me.getBtnSavePreferences()))
				me.toggleSavePrefrenceAction(true);
		} else {
			me.toggleClearPrefrenceAction(true);
		}
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
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		var arrJsn = new Array();
		
		if (!Ext.isEmpty(objGridViewFilterPref)) {
			var data = Ext.decode(objGridViewFilterPref);
			var seller = data.financialInstitutionVal;
			strPreClientCode = data.clientVal;
			strPrefClientDesc = data.clientDesc;
			var strInterfaceType = data.interfaceType;
			var strFlavorType = data.flavorType;
			var strStatusType = data.statusType;

			me.interfaceTypeFilterVal = !Ext.isEmpty(strInterfaceType)
					? strInterfaceType
					: 'all';
			me.flavorTypeFilterVal = !Ext.isEmpty(strFlavorType)
					? strFlavorType
					: 'all';
			me.typeFilterVal = !Ext.isEmpty(strStatusType)
					? strStatusType
					: 'all';
			
			me.clientFilterVal = !Ext.isEmpty(strPreClientCode)
					? strPreClientCode: null;
			me.clientFilterDesc = !Ext.isEmpty(strPrefClientDesc)
					? strPrefClientDesc: null;
			
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
			
					var objPref = {};
					objPref['sellerCode'] = seller;
					objPref['clientCode'] = strPreClientCode;
					objPref['clientDesc'] = strPrefClientDesc;
					objPref['interfaceType'] = strInterfaceType;
					objPref['flavorType'] = strFlavorType;
					objPref['statusType'] = strStatusType;
					me.filterDataPref = objPref;
			
			me.filterData = arrJsn;
		
		}
	},
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferencesRef();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);

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
		me.setDataForFilter();
		me.applyQuickFilter();
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
		me.applyQuickFilter();
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
		me.applyQuickFilter();
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
		var strUrl = "loadUploadWidgetsData.srvc?";

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
		var strActionUrl = Ext.String.format('{0}.srvc', 'interfaceSubmit');
		var me = this;
		var groupView = me.getGroupView();
		var objGroupView = me.getGroupView();
		if (true) {
				var arrayJson = new Array();
				var records = null;
				records = [record];
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
						viewState : records[index].data.viewState,
						interfaceMapMasterViewState : records[index].data.interfaceMapMasterViewState
					});
					
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				
				Ext.Ajax.request({
							url : strActionUrl,
							method : 'POST',
							jsonData :  Ext.encode(arrayJson),
							success : function(jsonData) {
								//var jsonRes = Ext.JSON
								//		.decode(jsonData.responseText);
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								groupView.setLoading(false);
								groupView.down('smartgrid').refreshData();
								objGroupView.handleGroupActionsVisibility(me.strDefaultMask);
								var errCode = '';
								actionData = jsonRes.d.instrumentActions;
								
								msg = '';
								Ext.each(actionData, function(result) {
									if(result.success == 'N')
									{									
										Ext.each(result.errors, function(error) {
										msg = msg + error.code + ' : '
												+ error.errorMessage + '<br/>';
										errCode = error.code;
										});
									}
								});
								if(!Ext.isEmpty(msg))
								{
									Ext.MessageBox.show({
											title : "Error",
											msg : msg,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
								}
								
						       }						
							,
							failure : function() {
								var errMsg = "";
								groupView.setLoading(false);
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
			if (isBankFlag === 'true')
			{
				if(me.clientFilterVal != null)
				{
					Ext.getCmp('editChkBox').show();
					Ext.getCmp( 'cloneRestrictedFlagChkBox' ).setValue( false );
					Ext.getCmp( 'cloneRestrictedFlagChkBox' ).setDisabled( true );
				}
				else
				{
					Ext.getCmp('editChkBox').hide();
				}
				Ext.getCmp('profileChkBox').hide();
			}
			else
			{
				Ext.getCmp('editChkBox').show();
				Ext.getCmp('profileChkBox').hide();
				Ext.getCmp( 'cloneRestrictedFlagChkBox' ).setValue( false );
				Ext.getCmp( 'cloneRestrictedFlagChkBox' ).setDisabled( true );
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
				'cloneRestrictedFlag', me.cloneRestrictedFlagChkBoxVal));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'clientCode', me.clientFilterVal));
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
				title : 'Attach Security Profile'
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
