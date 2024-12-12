Ext.define('GCP.controller.InterfaceMapSummaryController', {
	extend : 'Ext.app.Controller',
	views : ['GCP.view.InterfaceMapSummaryView', 'GCP.view.ShowClonePopUp',
			'GCP.view.InterfaceMapHistoryPopup', 'GCP.view.Widget'],
	refs : [{
				ref : 'interfaceMapSummaryView',
				selector : 'interfaceMapSummaryView'
			}, {
				ref : 'interfaceMapSummaryFilterView',
				selector : 'interfaceMapSummaryFilterView'
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
				selector : 'interfaceMapSummaryFilterView button[itemId="taskStatusItemId"]'
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
			},{
				ref : 'groupView',
				selector : 'interfaceMapSummaryView groupView'
			},{
				ref:'filterView',
				selector:'filterView'
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
		editChkBoxVal : null,
		editProfileChkBoxVal : null,
		widgetTypeCodeColumns : new Array(),
		urlGridPref : 'userpreferences/interfaceMapSummary/gridView.srvc?',
		urlGridFilterPref : 'userpreferences/interfaceMapSummary/gridViewFilter.srvc?',
		commonPrefUrl : 'services/userpreferences/interfaceMapSummary.json',
		sellerFilterVal : null,
		clientFilterVal : '',
		clientFilterDesc : null,	
		strGetModulePrefUrl : 'services/userpreferences/interfaceMapCenter/{0}.json',
		strDefaultMask : '0000',
		cfgGroupByUrl : 'services/grouptype/interfaceMapCenter/groupBy.srvc?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}'+'\'' + '&$filterscreen=BANKADMIN&$filterGridId=GRD_ADM_INTERFACECEN',
		cfgBankClientGroupByUrl : 'services/grouptype/interfaceMapCenter/groupBy.srvc?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}'+'\'' + '&$filterscreen=BANKCLIENT&$filterGridId=GRD_ADM_INTERFACECEN',
		cfgClientGroupByUrl : 'services/grouptype/interfaceMapCenter/groupBy.srvc?'+csrfTokenName+'='+tokenValue+'&$filter=entityCode eq '+'\'{0}\' and seller eq '+'\'{1}\''+ '&$filterscreen=CLIENT&$filterGridId=GRD_ADM_INTERFACECEN',
		preferenceHandler : null,
		strPageName : 'interfaceMapSummaryNewUX',
		filterDataPref : {},
		cloneRestrictedFlagChkBoxVal : 'RESTRICTED_DISABLE'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.clientFilterVal = strClient;
		me.sellerFilterVal=SESVAR_SELLER;
		//me.clientFilterVal = strClientId;
		me.clientFilterDesc = strClientDesc;
		$(document).on("handleAddUploadDefination",function(){
			me.addUploadDefinition();
		});
		$(document).on("handleAddDownloadDefination",function(){
			me.addDownloadDefinition();
		});
		$(document).on('savePreference', function(event) {
				//	me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				});
		$(document).on('clearPreference', function(event) {
				me.handleClearPreferences();
		});
		$(document).on("handleCloneAction",function(){
			me.handleCloneAction();
		});
		$(document).on("closeClonePopup",function(){
			me.closeClonePopup();
		});
		
		$(document).on("handleCheckBoxEditAction",function(){
			var editCheckBox=$('#popUpEditableCheckbox');
			var checked;
			if(editCheckBox.is(":checked")){
				 checked=true;
				  $('#popUpRestrictionCheckbox').removeAttr("disabled");
			}else{
				checked=false;
				$('#popUpRestrictionCheckbox').attr("disabled",true);
			}
				me.editChkBoxVal = checked;				
		});
		
		$(document).on("handleCheckBoxProfileAction",function(){
			var profileChkBox=$('#popUpSecurityCheckbox');
			var checked;
			if(profileChkBox.is(":checked")){
				 checked=true;
			}else{
				checked=false;
			}
			me.editProfileChkBoxVal = checked;
		});
		
		$(document).on("handleCheckBoxCloneRestrictedFlagAction",function(){
			var restrictionChkBox=$('#popUpRestrictionCheckbox');
			var checked;
			if(restrictionChkBox.is(":checked")){
				 checked=true;
			}else{
				checked=false;
			}
			me.cloneRestrictedFlagChkBoxVal = checked;
			if( checked )
			{
				me.cloneRestrictedFlagChkBoxVal = 'RESTRICTED_ENABLE';
			}
			else
			{
				me.cloneRestrictedFlagChkBoxVal = 'RESTRICTED_DISABLE';
			}
		});
		
		var btnClearPref = me.getBtnClearPreferences();
		if (btnClearPref) {
			btnClearPref.setEnabled(false);
		}
		me.updateFilterConfig();
		me.objClonePopup = Ext.create('GCP.view.ShowClonePopUp', {
					parent : 'interfaceMapSummaryView',
					itemId : 'clonePopUpId'
				});
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
			me.handleClientChangeInQuickFilter(isSessionClientFilter);
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
			/*'interfaceMapSummaryView interfaceMapSummaryFilterView button[itemId="btnSavePreferences"]' : {
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
			},*/
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
				/*handleCloneAction : function(btn) {
					me.handleCloneAction(btn);
				},
				closeClonePopup : function(btn) {
					me.closeClonePopup(btn);
				},*/
				/*handleCheckBoxEditAction : function(checked) {
					me.editChkBoxVal = checked;
					if (checked === true) {
						Ext.getCmp('profileChkBox').show();
					} else {
						Ext.getCmp('profileChkBox').hide();
					}
				},
				handleCheckBoxProfileAction : function(checked) {
					me.editProfileChkBoxVal = checked;
				}*/
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
			},
			'interfaceMapSummaryView groupView' : {				
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {			
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
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
				//	me.toggleSavePrefrenceAction(true);
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);
				},
				'render' : function(){
					if (objGridViewFilterPref) {
						
							var objJsonData = Ext.decode(objGridViewFilterPref);
							objGroupByPref = objJsonData;
							if (!Ext.isEmpty(objGroupByPref)) {
								/*me.toggleSavePrefrenceAction(false);
								me.toggleClearPrefrenceAction(true);*/
								me.disablePreferencesButton("savePrefMenuBtn",true);
								me.disablePreferencesButton("clearPrefMenuBtn",false);
							}
						}
					}
			},
			'interfaceMapSummaryFilterView' : {	
				beforerender:function(){
					var useSettingsButton = me.getFilterView()
					.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
					var createAdvanceFilterLabel = me.getFilterView()
							.down('label[itemId="createAdvanceFilterLabel"]');
					if (!Ext.isEmpty(createAdvanceFilterLabel)) {
						createAdvanceFilterLabel.hide();
					}
				},
				'afterrender' : function() {
					//me.setInfoTooltip();
					//me.setDataForQuickFilter();
					me.setSelectedFilters();
				//	me.setDataForFilter();
				},
				
				'filterClient' : function(clientCode, clientDesc) {
					me.clientFilterVal = clientCode;
					me.clientFilterDesc = clientDesc;
					me.refreshGroupByTabs(me.sellerFilterVal,me.clientFilterVal);
					me.setDataForFilter();
					me.applyQuickFilter();
				},
				
				'filterInterface' : function(combo) {
					me.handleIntCode(combo);
				},
				
				'refreshGroupByTabs': function(seller){
					me.sellerFilterVal = seller;
					strSeller = seller;
					me.refreshGroupByTabs(seller); 
				},
				'filterType' : function(combo) {
				//	me.toggleSavePrefrenceAction(true);
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.handleType(combo);
				},
				'filterFlavorType' : function(combo) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.handleFlavorType(combo);
				},
				'filterStatusType' : function(btn, opts) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.handleStatusType(btn);
					me.updateStatusFilterView();

				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'interfaceMapSummaryView groupView smartgrid' : {
				'cellclick' : me.doHandleCellClick
			}
				 
		});
	},
	doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
		if(e.target.id == 'selectSecurityProfile')
		{
			me.selectSecurityProfile(record, view);
		}
	},
	selectSecurityProfile : function( record ,viewSmartGrid)
	{
		var me = this;
		var reportName = record.raw.reportName;		
		var clientCode = record.get('entityCode');
		var sellerCode = record.get('sellerId');
		me.handleSecurityProfileLoading(record);
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		if (isSessionClientFilter)
			me.clientFilterVal = selectedFilterClient;
		else
			me.clientFilterVal = isEmpty(selectedClient)
					? 'all'
					: selectedClient;
		me.clientFilterDesc = selectedFilterClientDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal == 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
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
				//strUrl = "services/userpreferences/interfaceMapCenter/all.json";
				/*me.getSavedPreferences(strUrl,
						me.postDoHandleGroupTabChange, args);*/
					me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postDoHandleGroupTabChange, args, me, true);
			}
		}
	},	
	postDoHandleGroupTabChange : function(data, args, isSuccess) {
		
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getInterfaceMapSummaryView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			me.disablePreferencesButton("clearPrefMenuBtn",false);
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols
					|| objDefPref[mapService[args['module']]] || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumns(arrCols);
			showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;	
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel:{
					  sortState:objPref.sortState
                    }
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
		var me = this, filter = me.getFilterView();
		var objPref = null;
		objPref = me.filterDataPref;
		if(objPref.interfaceType){
			//var btn = filter.down('toolbar[itemId=interfaceTypeToolBar]').down('button[code='+objPref.interfaceType+']');	
			//me.setButtonCls(btn, 'interfaceTypeToolBar');
			 var interfaceTypeCombo=filter.down('combobox[itemId="interfaceTypeToolBar"]');	
			 interfaceTypeCombo.setValue(objPref.interfaceType);
			 me.interfaceTypeFilterVal = objPref.interfaceType;
		}
		if(objPref.flavorType){
			/*var btn = filter.down('toolbar[itemId=flavorTypeToolBar]').down('button[code='+objPref.flavorType+']');	
			me.setButtonCls(btn, 'flavorTypeToolBar');*/
			var flavorTypeCombo=filter.down('combobox[itemId="flavorTypeToolBar"]');	
			 flavorTypeCombo.setValue(objPref.flavorType);
			  me.flavorTypeFilterVal = objPref.flavorType;
		}
		if(objPref.statusType){
			/*var btn = filter.down('button[code='+objPref.statusType+']');	
			//me.setButtonCls(btn, 'repOrDwnldToolBar');
			me.updateStatusFilterView();*/
			 var taskStatusId=filter.down('label[itemId="strStatusValue"]');
			// taskStatusId.setText(objPref.statusType);
			 me.updateStatusFilterView();
			 me.typeFilterVal=objPref.statusType;
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
		if (strAction === 'interfaceReject') {
			fieldLbl = getLabel('rejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('rejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					cls:'t7-popup',
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.doRejectAction(strActionUrl, text,
									interfaceMapSummaryWidget, record);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
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
											title : getLabel('lblError', 'Error'),
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
													'lblError',
													'Error'),
											msg : getLabel(
													'lblDataError',
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
											title : getLabel('lblError', 'Error'),
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
													'lblError',
													'Error'),
											msg : getLabel(
													'lblDataError',
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
												'lblError',
												'Error'),
										msg : getLabel(
												'lblDataError',
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
		var arrOfParseQuickFilter = [];
       	if(!Ext.isEmpty(me.filterData)){
     	      if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				    arrOfParseQuickFilter = generateUserFilterArray(me.filterData);
				}
		   }
		if(arrOfParseQuickFilter) 
		{
			me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}		
		grid.loadGridData(strUrl, null, null, false);
		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
				eventObj) {
			me.handleGridRowDoubleClick(record, grid);
		});
	},
	handleGridRowDoubleClick : function(record, grid) {
		var me = this;
		var columnModel = null;
		var columnAction = null;
		if (!Ext.isEmpty(grid.columnModel)) {
			columnModel = grid.columnModel;
			for (var index = 0; index < columnModel.length; index++) {
				if (columnModel[index].colId == 'actionId') {
					columnAction = columnModel[index].items;
					break;
				}
			}
		}
		var arrVisibleActions = [];
		var arrAvailableActions = [];
		if (!Ext.isEmpty(columnAction))
			arrAvailableActions = columnAction;
		var store = grid.getStore();
		var jsonData = store.proxy.reader.jsonData;
		if (!Ext.isEmpty(arrAvailableActions)) {
			for (var count = 0; count < arrAvailableActions.length; count++) {
				var btnIsEnabled = false;
				if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
					btnIsEnabled = grid.isRowIconVisible(store, record,
							jsonData, arrAvailableActions[count].itemId,
							arrAvailableActions[count].maskPosition);
					if (btnIsEnabled == true) {
						arrVisibleActions.push(arrAvailableActions[count]);
						btnIsEnabled = false;
					}
				}
			}
		}
		if (!Ext.isEmpty(arrVisibleActions)) {
			me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
		}
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
		var filter = me.getFilterView();
		var jsonArray = [];
       	if (entityType==0) {
				var banks = me.sellerFilterVal;
				if (Ext.isEmpty(me.clientFilterVal)) {
					banks = banks + ',OWNER';
				}
				jsonArray.push({
							paramName : 'sellerCode',
							operatorValue : 'in',
							paramValue1 : banks,
							fieldLabel : "Financial Institution",
							value1 :  me.sellerFilterVal,
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
					jsonArray.push({
								paramName : 'clientCode',
								operatorValue : 'eq',
								paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),		
								fieldLabel : getLabel('grid.column.company', 'Company Name'),
								value1: me.clientFilterDesc,
								dataType : 'S'
							});
				}
			}	
		if (me.interfaceCodeFilterVal != null && me.interfaceCodeFilterVal !== 'All' && me.interfaceCodeFilterVal != '') {
			jsonArray.push({
						paramName : 'interfaceName',
						operatorValue : 'eq',
						paramValue1 : encodeURIComponent(me.interfaceCodeFilterVal.replace(new RegExp("'", 'g'), "\''")),	
						fieldLabel:  getLabel('interfaceName','Interface Code'),
						dataType : 'S'
					});
		}		
		if (interfaceTypeFilterVal != null && interfaceTypeFilterVal !== 'All' && interfaceTypeFilterVal != '') {
			jsonArray.push({
						paramName : 'interfaceType',
						paramValue1 : encodeURIComponent(interfaceTypeFilterVal.trim().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						fieldLabel : getLabel('type','Interface Type'),
						dataType : 'S'
					});
		}
		if (flavorTypeFilterVal != null && flavorTypeFilterVal !== 'All' && flavorTypeFilterVal != '') {
			jsonArray.push({
						paramName : 'flavorType',
						paramValue1 : encodeURIComponent(flavorTypeFilterVal.trim().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						fieldLabel: getLabel('category','Category'),
						dataType : 'S'
					});
		}
		
		var statusVal = me.typeFilterVal;
		var u = USER;
		if (!Ext.isEmpty(statusVal)) {
			var isPending = true;
					if (statusVal == 13)//Pending My Approval
						{
							statusVal  = new Array('5YY','4NY','0NY','1YY');
							isPending = false;
							jsonArray.push({
								paramName : 'statusFilter',
								paramValue1 : statusVal,
								operatorValue : 'in',
								fieldLabel: getLabel('status','Status') ,
							    value1 :  me.updateStatusFilterView(),
								dataType : 'S'
							});
							jsonArray.push({
										paramName : 'user',
										paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'ne',
										dataType : 'S'
									});
			           }
		if(isPending)
		{			
			if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 ) // 12:New Submitted,14:Modified Submitted
				{
					statusVal = "0";
					jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								fieldLabel: getLabel('isSubmitted','Submitted'),
								dataType : 'S'
							});
					jsonArray.push({
						paramName : 'validFlag',
						paramValue1 : 'N',
						operatorValue : 'eq',
					    fieldLabel: getLabel('validFlag','Valid Flag'),
						dataType : 'S'
					});
				} else // Valid/Authorized
				{
					if(statusVal == 14)
					{
						statusVal = "1";
						jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								fieldLabel: getLabel('isSubmitted','Submitted'),
								dataType : 'S'
							});
					}
					jsonArray.push({
								paramName : 'validFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								fieldLabel: getLabel('validFlag','Valid Flag'),
								dataType : 'S'
							});
				}
			} else if (statusVal == 11) // Disabled
			{
				statusVal = 3;
				jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							fieldLabel: getLabel('validFlag','Valid Flag'),
							dataType : 'S'
						});
			}  
			else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				
					jsonArray.push({
						paramName : 'validFlag',
						paramValue1 : 'N',
						operatorValue : 'eq',
						fieldLabel: getLabel('validFlag','Valid Flag'),
						dataType : 'S'
					});
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							fieldLabel: getLabel('isSubmitted','Submitted'),
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if(statusVal != '' && statusVal !='All' && statusVal != null){
					jsonArray.push({
								paramName : 'taskStatus',
								paramValue1 : statusVal,
								operatorValue : 'eq',
								fieldLabel: getLabel('status','Status') ,
							    value1 :  me.updateStatusFilterView(),
								dataType : 'S'
							});
			}
		 }
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
					tip.update(getLabel('grid.column.company', 'Company Name')
										+ ' : '
										+ client
										+'</br>'
										+('type', 'InterFace Type')
										+ ' : '
										+ interFaceType
										+'</br>'
										+ getLabel('flavour', 'Flavour')
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
		if ($("#clearPrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{
			var arrPref = me.getPreferencesToSave(false);
			me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					me.postHandleClearPreferences, null, me, true);
			me.disablePreferencesButton("clearPrefMenuBtn",true);
			me.disablePreferencesButton("savePrefMenuBtn",false);		
		}		
	},
	handleSavePreferences : function() {
		var me = this;
		if ($("#savePrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{			
			var arrPref = me.getPreferencesToSave(false);
			if (arrPref) {
				me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
						me.postHandleSavePreferences, null, me, true);
			me.disablePreferencesButton("clearPrefMenuBtn",false);
			me.disablePreferencesButton("savePrefMenuBtn",true);
			}
		}
	},
	postHandleSavePreferences:function(args){	},
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
							'pgSize' : state.grid.pageSize,
							'sortState' : state.grid.sortState,
							'gridSetting' : groupView.getGroupViewState().gridSetting
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
		me.disablePreferencesButton("savePrefMenuBtn",true);
		if (isSuccess === 'N') {
		} else {
		//	me.toggleClearPrefrenceAction(false);
		//	me.toggleSavePrefrenceAction(true);
			me.disablePreferencesButton("clearPrefMenuBtn",true);
			me.disablePreferencesButton("savePrefMenuBtn",false);
		}
	},
/*	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'N') {
			if (!Ext.isEmpty(me.getBtnSavePreferences()))
				me.disablePreferencesButton("savePrefMenuBtn",false);
		} else {
			me.disablePreferencesButton("clearPrefMenuBtn",false);
		}
	}, */
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
					if(filterData[index].paramName != 'statusFilter')
					{
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
					: 'All';
			me.flavorTypeFilterVal = !Ext.isEmpty(strFlavorType)
					? strFlavorType
					: 'All';
			me.typeFilterVal = !Ext.isEmpty(strStatusType)
					? strStatusType
					: 'All';
			
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
					objPref['clientCode'] = me.clientFilterVal;
					objPref['clientDesc'] = me.clientFilterDesc;
					objPref['interfaceType'] = strInterfaceType;
					objPref['flavorType'] = strFlavorType;
					objPref['statusType'] = strStatusType;
					if (isClientUser()) {
						$("#summaryClientFilterSpan").text(me.clientFilterDesc);
					}else{
						$("#summaryClientFilter").val(me.clientFilterDesc);
					}
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
	handleIntCode : function(combo) {
		var me = this;
		if (Ext.isEmpty(combo)){
			me.interfaceCodeFilterVal = 'All';
		} else {
		me.interfaceCodeFilterVal = combo.getValue();
		me.interfaceCodeFilterDesc = combo.getRawValue();
		}
		if (me.interfaceCodeFilterVal === 'All') {
			me.filterApplied = 'ALL';
		} else {
			me.filterApplied = 'Q';
		}
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	handleType : function(combo) {
		var me = this;
	//	me.toggleSavePrefrenceAction(true);
		me.disablePreferencesButton("savePrefMenuBtn",false);
		me.interfaceTypeFilterVal = combo.getValue();
		me.interfaceTypeFilterDesc = combo.getRawValue();
		if (me.interfaceTypeFilterVal === 'All') {
			me.filterApplied = 'ALL';
		} else {
			me.filterApplied = 'Q';
		}
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	handleFlavorType : function(combo) {
		var me = this;
	//	me.toggleSavePrefrenceAction(true);
		me.disablePreferencesButton("savePrefMenuBtn",false);
		me.flavorTypeFilterVal = combo.getValue();
		me.flavorTypeFilterDesc = combo.getRawValue();
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
	//	me.toggleSavePrefrenceAction(true);
		me.disablePreferencesButton("savePrefMenuBtn",false);
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
		var historyPopup =	Ext.create('GCP.view.InterfaceMapHistoryPopup', {
				historyUrl : strUrl + "?" + csrfTokenName + "="
						+ csrfTokenValue,
				interfaceCode : record.get('interfaceName'),
				identifier : record.get('identifier')
			}).show();
			historyPopup.center();
		}
	},
	updateStatusFilterView : function() {
		var me = this;
		var filterView=me.getInterfaceMapSummaryFilterView()
		var statuslabelValue=filterView.down('label[itemId="strStatusValue"]');
		var objStatusLbl = {
			'All' : getLabel('all', 'All'),
			'0' : getLabel('newStatus', 'New'),
			'1' : getLabel('modifiedStatus', 'Modified'),
			'2' : getLabel('deleteStatus', 'Delete Request'),
			'3' : getLabel('authorizedStatus', 'Approved'),
			'4' : getLabel('enableStatus', 'Enable Request'),
			'5' : getLabel('disableStatus', 'Disable Request'),
			'11' : getLabel('disabledStatus', 'Disabled'),
			'7' : getLabel('rejectedStatus', 'New Rejected'),
			'8' : getLabel('modifiedRejectStatus', 'Modified Request Rejected'),
			'9' : getLabel('disableRequestStatus', 'Disable Request Rejected'),
			'10' : getLabel('enableRequestStatus', 'Enable Request Rejected'),
			'12' : getLabel('submittedStatus', 'New Submitted'),
			'13' : getLabel('pendingMyApproval', 'Pending My Approval'),
			'14' : getLabel('submittedModifiedStatus', 'Modified Submitted'),
		};
		if (!Ext.isEmpty(me.typeFilterVal)) {
			statuslabelValue.setText(objStatusLbl[me.typeFilterVal]);
		}
		return objStatusLbl[me.typeFilterVal];	
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
	//	me.toggleSavePrefrenceAction(true);
		me.disablePreferencesButton("savePrefMenuBtn",false);
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
											title : getLabel('lblError', 'Error'),
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
													'lblError',
													'Error'),
											msg : getLabel(
													'lblDataError',
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
	cloneAction : function(record) {//Bharat
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
	    clonePopUp();
	   var editChkBox=$('#editChkBox');
	  // var restrictedChkBox=$('#popUpRestrictionCheckbox');
	   var profileChkBox=$('#profileChkBox');
	   var viewStateVal=$('#viewStateVal').val(record.get('viewState'));
	   var interfaceType=$('#interfaceType').val(record.get('interfaceType'));
	   var interfaceMapMasterViewStateVal=$('#interfaceMapMasterViewStateVal').val(record.get('interfaceMapMasterViewState'));
	    if (true) {
			if (isBankFlag === 'true') {
				if(me.clientFilterVal != null){
					editChkBox.show();
					$('#popUpRestrictionCheckbox').prop( "checked", false );
					$('#popUpRestrictionCheckbox').attr("disabled",true);
					$('#interfaceScopeDIV').hide();
					$('input:radio[name=interfaceScope]').removeAttr("checked");
					}
				else{
					editChkBox.hide();
				}
				profileChkBox.hide();
			} else {
				editChkBox.show();
				profileChkBox.hide();
				$('#popUpRestrictionCheckbox').prop( "checked", false );
				$('#popUpRestrictionCheckbox').attr("disabled",true);
				$('#interfaceScopeDIV').hide();
				$('input:radio[name=interfaceScope]').removeAttr("checked");
			}
		} 
		/*var me = this;
		var objPanel = me.getClonePopUpDtlRef();
		 
		objPanel.down('hidden[itemId="viewStateVal"]').setValue(record
				.get('viewState'));
		objPanel.down('hidden[itemId="interfaceType"]').setValue(record
				.get('interfaceType'));
		objPanel.down('hidden[itemId="interfaceMapMasterViewStateVal"]')
				.setValue(record.get('interfaceMapMasterViewState'));
		if (!Ext.isEmpty(me.objClonePopup)) {
			if (isBankFlag === 'true') {
				if(me.clientFilterVal != null){
					Ext.getCmp('editChkBox').show();
				}
				else{
					Ext.getCmp('editChkBox').hide();
				}
				Ext.getCmp('profileChkBox').hide();
			} else {
				Ext.getCmp('editChkBox').show();
				Ext.getCmp('profileChkBox').hide();
			}
			me.objClonePopup.show();
		} else {
			me.objClonePopup = Ext.create('GCP.view.ShowClonePopUp');
			me.objClonePopup.show();
		}*/
	},
	handleCloneAction : function() {
		var me = this;
		var strUrl;
	   var profileChkBox=$('#profileChkBox');
	   var viewStateVal=$('#viewStateVal').val();
	   var interfaceType=$('#interfaceType').val();
	   var interfaceScope = null;
	  if (interfaceType == 'Upload') {
			strUrl = "cloneUploadInterface.srvc";
		} else {
			strUrl = "cloneDownloadInterface.srvc";
		}
		interfaceScope = $('input:radio[name=interfaceScope]:checked').val();
	   var interfaceMapMasterViewState=$('#interfaceMapMasterViewStateVal').val();
	   	var cloneProcessCode =$('#interfaceName').val();
		if (!Ext.isEmpty(cloneProcessCode)) {
			var form;
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
					viewStateVal));
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
					'clientCode', me.clientFilterVal));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'cloneRestrictedFlag', me.cloneRestrictedFlagChkBoxVal));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'globalLocalInterfaceFlag', interfaceScope));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
		} 
		/*var objPanel = me.getClonePopUpDtlRef();
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
					'clientCode', me.clientFilterVal));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
		} else {
			me.getClonePopUpRef().close();
		}*/
	},
	showGridSummaryInfo : function(grid) {
		var me = this;
		me.setSummaryInfo(grid);
	},
	applySeekFilter : function() {
		var me = this;
	//	me.toggleSavePrefrenceAction(true);
		me.disablePreferencesButton("savePrefMenuBtn",false);
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
		var arrayJson = new Array();
		var entityType = record.get('entityType');
		var strUrl = 'getClientSecurityProfile.srvc?';
		var id = record.get('identifier');
		if (entityType != 'BANK') {
			strUrl = strUrl + csrfTokenName + '=' + csrfTokenValue
								+ '&$clientFilter=' + clientCode;
		}
		else{
			strUrl = 'getBankSecurityProfile.srvc?' + csrfTokenName + '=' + csrfTokenValue+ '&identifier=' + id;
		}
			Ext.Ajax.request({
						url : strUrl,
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
		

	},
	 handleClearSettings:function(){
	 var me=this;
	 var filterView=me.getInterfaceMapSummaryFilterView();
	  var isClientUser=entityType == 1 ? true : false
	 if(!isClientUser){
	 		var sellerFilterId=filterView.down('combo[itemId="interfaceSellerId"]');
		    if(sellerFilterId != null)
			{
				sellerFilterId.suspendEvents();
				sellerFilterId.reset();
				sellerFilterId.resumeEvents();
			}
	 }
	 var interfaceTypeId=filterView.down('combobox[itemId="interfaceTypeToolBar"]');
	 var flavourTypeId=filterView.down('combobox[itemId="flavorTypeToolBar"]');
	 var taskStatusId=filterView.down('label[itemId="strStatusValue"]');
	 var companyId=filterView.down('AutoCompleter[itemId="clientCodeId"]');
	 var interfaceCodeId=filterView.down('AutoCompleter[itemId="interfaceCodeId"]');
	 me.interfaceCodeFilterVal ="";
	 me.interfaceTypeFilterVal="";
	 me.flavorTypeFilterVal="";
	 me.typeFilterVal="";
	 me.clientFilterVal = "";
	 interfaceTypeId.suspendEvents();
	 interfaceTypeId.setValue("");
	 interfaceTypeId.resumeEvents();
	 flavourTypeId.suspendEvents();
	 flavourTypeId.setValue("");
	 flavourTypeId.resumeEvents();
	 taskStatusId.suspendEvents();
	 taskStatusId.setText("All");
	 taskStatusId.resumeEvents();
	 companyId.setRawValue("");
	 interfaceCodeId.setRawValue("");
	 me.filterData=[];
	 me.applyQuickFilter();
	},
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			$("#"+btnId).css("color",'grey');
		else
			$("#"+btnId).css("color",'#FFF');
	}
});
function createSecProfileCombo(obj, securityProfileId) {
	var fcode = obj;
	// eval( "document.getElementById('secProfName').options[0]=" + "new
	// Option('Select')");
	for (var i = 0; i < fcode.length; i++) {
		//fcode[0].filterValue=fcode[0].filterCode;
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
	frm.appendChild(createFormElement('INPUT', 'HIDDEN', 'viewState1', viewState1));
	frm.appendChild(createFormElement('INPUT', 'HIDDEN', 'secProfId', secProfId));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
	frm.action = "attachSecurityProfile.srvc";
	frm.method = "POST";
	$('SecurityProfileInnerPopUp').dialog('close');
	console.log(secProfId);
	frm.submit();
}
function showSecurityProfilePopUp(securityProfileId) {
	var editRights = canEdit;
	var viewState1 = document
			.getElementById('interfaceMapMasterViewStateSecProf').value;
	var secProfId = document.getElementById("securityProfileId").value;
	$('#SecurityProfileInnerPopUp').dialog({
				autoOpen : false,
				/*height : 260,*/
				width : 400,
				modal : true,
				resizable : false,
				title :  getLabel('attachSecurityPrf', 'Attach Security Profile')
			});
	if (null != securityProfileId && '' != securityProfileId) {
		$("#secProfName").find('option').each(function(i, opt) {
					if (opt.value === securityProfileId)
						$(opt).attr('selected', 'selected');
				});
	}

	if(editRights === false){
		$('#btnSecurityProfileSubmit').attr("class","hidden");
	}
	else 
	{
		$('#btnSecurityProfileSubmit').removeClass("hidden");
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
