Ext.define('GCP.controller.UploadSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.UploadSummaryGridView'],
	views : ['GCP.view.UploadSummaryView','GCP.view.ShowClonePopUp','GCP.view.UploadDefinitionHistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'uploadSummaryView',
				selector : 'uploadSummaryView'
			},
	        {
				ref : 'uploadSummaryGridView',
				selector : 'uploadSummaryView uploadSummaryGridView grid[itemId="gridViewMstId"]'
			},
			{
				ref : 'uploadSummaryGridDtlView',
				selector : 'uploadSummaryView uploadSummaryGridView panel[itemId="uploadSummaryGridDtlViewId"]'
			},
			{
				ref : 'uploadSummaryGridView',
				selector : 'uploadSummaryView uploadSummaryGridView'
			}, 
			{
				ref : 'matchCriteria',
				selector : 'uploadSummaryGridView radiogroup[itemId="matchCriteria"]'
			},
			{
				ref : 'searchTxnTextInput',
				selector : 'uploadSummaryGridView textfield[itemId="searchTxnTextField"]'
			},
			{
				ref : 'btnSavePreferences',
				selector : 'uploadSummaryView uploadSummaryFilterView button[itemId="btnSavePreferences"]'
			}, 
			{
				ref : 'withHeaderCheckbox',
				selector : 'uploadSummaryView uploadSummaryTitleView menuitem[itemId="withHeaderId"]'
			},
			{
				ref : 'uploadSummaryInfoView',
				selector : 'uploadSummaryInfoView'
			},
			{
				ref : 'infoSummaryLowerPanel',
				selector : 'uploadSummaryInfoView panel[itemId="infoSummaryLowerPanel"]'
			},
			{
				ref : 'actionBarSummDtl',
				selector : 'uploadSummaryView uploadSummaryGridView uploadSummaryGroupActionBarView'
			},
			{
				ref : 'modelTypeToolBar',
				selector : 'uploadSummaryView uploadSummaryFilterView panel[itemId="modelTypeToolBar"]'
			},
			{
				ref : 'dataStoreTypeToolBar',
				selector : 'uploadSummaryView uploadSummaryFilterView panel[itemId="dataStoreTypeToolBar"]'
			},
			{
				ref : 'categoryTypeToolBar',
				selector : 'uploadSummaryView uploadSummaryFilterView panel[itemId="categoryTypeToolBar"]'
			},
			{
				ref : 'clonePopUpDtlRef',
				selector : 'showClonePopUp[itemId="clonePopUpId"] container[itemId="clonePopUpItemId"]'
			},
			{
				ref : 'clonePopUpRef',
				selector : 'showClonePopUp[itemId="clonePopUpId"]'
			},	
			{
				ref : 'modelStatusLabel',
				selector : 'uploadSummaryView uploadSummaryFilterView label[itemId="strModelValue"]'
			},
			{
				ref : 'datastorStatusLabel',
				selector : 'uploadSummaryView uploadSummaryFilterView label[itemId="strDataStoreValue"]'
			},
			{
				ref : 'categoryStatusLabel',
				selector : 'uploadSummaryView uploadSummaryFilterView label[itemId="strCategoryValue"]'
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
		objClonePopup:null,
		modelTypeFilterVal : 'All',
		dataTypeFilterVal : 'All',
		catTypeFilterVal : 'All',
		urlGridPref : 'userpreferences/uploadSummary/gridView.srvc',
		urlGridFilterPref : 'userpreferences/uploadSummary/gridViewFilter.srvc'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
			var me = this;
			me.updateFilterConfig();
			me.updateAdvFilterConfig();
			me.objClonePopup = Ext.create( 'GCP.view.ShowClonePopUp',
					{
						parent : 'uploadSummaryView',
						itemId : 'clonePopUpId'
					} );
			
			me.control({
				'uploadSummaryView' : {
				beforerender : function(panel, opts) {
				},
				afterrender : function(panel, opts) {
				}
			},
			'uploadSummaryGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
					me.setSummaryInfo();
				}
			},

			'uploadSummaryGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,grid.pageSize, 1, 1, null);					
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
			},
			'uploadSummaryGridView textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'uploadSummaryGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'uploadSummaryView uploadSummaryFilterView' : {
				render : function(panel, opts) {
					me.setInfoTooltip();
					me.createInterfaceMenuList(interafaceList);
					me.createDataStoreMenuList(dataStoreList);
					me.createCategoryMenuList(categoryList);
				},
				filterType : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
				}
			},
			'uploadSummaryView uploadSummaryFilterView toolbar[itemId="modelToolBar"]' :
			{
				afterrender : function( tbar, opts ){
					me.toggleSavePrefrenceAction(true);
				}
			},
			'uploadSummaryView uploadSummaryFilterView toolbar[itemId="dataStoreToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.toggleSavePrefrenceAction(true);
				}
			},
			'uploadSummaryView uploadSummaryFilterView toolbar[itemId="categoryToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.toggleSavePrefrenceAction(true);
				}
			},
			'uploadSummaryView uploadSummaryFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				}
			},
			'uploadSummaryView uploadSummaryTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				},
				afterrender : function() {
				}
			},
			'uploadSummaryView uploadSummaryInfoView panel[itemId="uploadSummaryInfoHeaderBarGridView"] image[itemId="summInfoShowHideGridView"]' : {
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
			'uploadSummaryInfoView' : {
				render : this.onUploadSummaryInformationViewRender
			},
			'uploadSummaryView uploadSummaryGridView toolbar[itemId=uploadSummaryGroupActionBarView_summDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'showClonePopUp[itemId="clonePopUpId"]' :
			{
				handleCloneAction : function(btn)
				{
					me.handleCloneAction(btn);
				},
				closeClonePopup : function( btn )
				{
					me.closeClonePopup(btn);
				}
			},
			'uploadSummaryView  button[itemId="uploadDefId"]' :
			{
				click : function( btn, opts )
				{
					me.addUploadDefinition();
				}
			}
		});
	},

	handleSmartGridConfig : function() {
		var me = this;
		var uploadSummaryGridView = me.getUploadSummaryGridView();
		var objConfigMap = me.getUploadSummaryConfiguration();
		var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
		
		if( Ext.isEmpty( uploadSummaryGridView ) )
		{
			if( !Ext.isEmpty( objGridViewPref ) )
			{
				var data = Ext.decode( objGridViewPref );
				objPref = data[ 0 ];
				arrColsPref = objPref.gridCols;
				arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
				pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 100;
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
			}
			else if( objConfigMap.arrColsPref )
			{
				arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				pgSize = 100;
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
			}
		}
		else
		{
			me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
		}
	},
	
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 25;
		uploadSummaryGridView = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			autoDestroy : true,
			stateful : false,
			showEmptyRow : false,
			hideRowNumbererColumn : true,
			padding : '5 0 0 0',
			rowList : _AvailableGridSize,
			minHeight : 140,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(grid, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(grid, rowIndex, columnIndex, btn,
						event, record);
			},

			handleRowMoreMenuItemClick : function(menu, event) {
				var dataParams = menu.ownerCt.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, this, event, dataParams.record);
			}
		});
		
		var uploadSummaryGridDtlView = me.getUploadSummaryGridDtlView();
		uploadSummaryGridDtlView.add(uploadSummaryGridView);
		uploadSummaryGridDtlView.doLayout();
	},
	
	handleRowIconClick : function(grid, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var strUrl;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
			|| actionName === 'reject' || actionName === 'discard'
			|| actionName === 'enable' || actionName === 'disable' || actionName === 'clone' ){
			me.handleGroupActions(btn, record);
		} else if (actionName === 'btnEdit') {
			strUrl = "editUploadProcess.srvc";
			me.editUploadDefinition(strUrl,record,rowIndex);
		}else if (actionName === 'btnView') {
			strUrl = "editUploadProcess.srvc";
			me.viewUploadDefinition(strUrl,record,rowIndex);
		} else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
			{
				me.showHistory(record.get('interfaceCode'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		}
	},
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('uploadSummaryList/{0}.srvc',strAction);
		var strActionUrl = Ext.String.format('{0}.srvc',strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strActionUrl, record);

		} else if (strAction === 'clone') {
			me.showClonePopup(strAction, strUrl, record);
		} else {
			me.doAction(strActionUrl, '', record)
			//this.preHandleGroupActions(strUrl, '', record);
		}

	},
	showClonePopup : function(strAction, strActionUrl, record){
		var me = this;
		var objPanel = me.getClonePopUpDtlRef();
		objPanel.down('hidden[itemId="viewStateVal"]').setValue(record.get('viewState'));
		
		if( !Ext.isEmpty(me.objClonePopup) )
		{
			me.objClonePopup.show();
		}
		else
		{
			me.objClonePopup = Ext.create( 'GCP.view.ShowClonePopUp' );
			me.objClonePopup.show();
		}
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, record) {
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
							me
									.doRejectAction(strActionUrl, text,
											record);
						}
					}
				});
	},
	doAction : function(strActionUrl, remark, record) {
		var me = this;
		var form = document.forms["frmMain"];
		var url = strActionUrl + '?' + csrfTokenName + '=' + csrfTokenValue;
		var grid = this.getUploadSummaryGridView();
		if (!Ext.isEmpty(grid)) {
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record)) ? records : [record];
			for (var index = 0; index < records.length; index++) {
				//form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'mappingDetails['+index+'].identifier', records[index].data.identifier));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'mappingDetails['+index+'].viewState', records[index].data.viewState));
			}
			if (records.length > 0)
			{
				form.method = 'POST';
				form.action = url;
				form.submit();			
			}
		}
	},
	doRejectAction : function(strActionUrl, remark, record) {
		var me = this;
		var form = document.forms["frmMain"];
		var url = strActionUrl + '?' + csrfTokenName + '=' + csrfTokenValue;
		var grid = this.getUploadSummaryGridView();
		if (!Ext.isEmpty(grid)) {
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record)) ? records : [record];
			for (var index = 0; index < records.length; index++) {
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'mappingDetails['+index+'].identifier', records[index].data.identifier));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'mappingDetails['+index+'].viewState', records[index].data.viewState));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'mappingDetails['+index+'].fieldRemarks', remark));
			}
			if (records.length > 0)
			{
				form.method = 'POST';
				form.action = url;
				form.submit();			
			}
		}
	},
	preHandleGroupActions : function(strUrl, remark, record) {
		var me = this;
		var grid = this.getUploadSummaryGridView();
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
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
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
	enableDisableGroupActions : function(actionMask, isSameUser) {
		var actionBar = this.getActionBarSummDtl();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							if ((item.maskPosition === 6 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getUploadSummaryGridView();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			me.getUploadSummaryGridView().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	getUploadSummaryConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"interfaceCode" : 210,
			"processCode" : 120,
			"datastoreType" : 70,
			"entityCode" : 110,
			"category" : 90,
			"requestStateDesc" : 120
		};
		
			arrColsPref = [{
						"colId" : "processCode",
						"colDesc" : "Interface Name"
					}, {
						"colId" : "interfaceCode",
						"colDesc" : "Model"
					}, {
						"colId" : "datastoreType",
						"colDesc" : "Medium"
					},{
						"colId" : "entityCode",
						"colDesc" : "Owner"
					},{
						"colId" : "category",
						"colDesc" : "Category"
					},{
						"colId" : "requestStateDesc",
						"colDesc" : "Status"
					}
					];

			storeModel = {
				fields : ['processCode', 'interfaceCode','datastoreType','entityCode','__metadata',
				          'identifier','category','requestStateDesc','recordKeyNo','bankCount','clientCount',
				          'standardCount','viewState','version','history'],
				proxyUrl : 'getUploadInterfaceList.srvc',
				rootNode : 'd.uploadSummary',
				totalRowsNode : 'd.__count'
			};
		
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel"  : storeModel
		};
		return objConfigMap;
	},
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl, null);		
	},
	applyQuickFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		var grid = me.getUploadSummaryGridView();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl,null);
		}
	},
	applyAdvancedFilter : function() {
		var me = this;
		var grid = me.getUploadSummaryGridView();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl,null);
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
		var strQuickFilterUrl = '',  strUrl = '', isFilterApplied = 'false',strAdvFilterUrl ='';
		if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
		{
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
			if( !Ext.isEmpty( strQuickFilterUrl ) )
			{
				strUrl += strQuickFilterUrl;
				isFilterApplied = true;
			}
			else{
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
		var modelTypeFilterVal = me.modelTypeFilterVal;
		var dataTypeFilterVal = me.dataTypeFilterVal;
		var catTypeFilterVal = me.catTypeFilterVal;
		var jsonArray = [];
		if (modelTypeFilterVal != null && modelTypeFilterVal !== 'All') {
			jsonArray.push({
						paramName : 'interfaceCode',
						paramValue1 : modelTypeFilterVal.trim(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (dataTypeFilterVal != null && dataTypeFilterVal !== 'All') {
			jsonArray.push({
						paramName : 'datastoreType',
						paramValue1 : dataTypeFilterVal.trim(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (catTypeFilterVal != null && catTypeFilterVal !== 'All') {
			jsonArray.push({
						paramName : 'category',
						paramValue1 : catTypeFilterVal.trim(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		return jsonArray;
	},
	searchTrasactionChange : function() {
		var me = this;
		var searchValue = me.getSearchTxnTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getUploadSummaryGridView();
		grid.view.refresh();

		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

		if (searchValue !== null) {
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
							});
							// update cell html
							cell.dom.innerHTML = cellHTML;
							td = td.next();
						}
					}
				}, me);
			}
		}
	},
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
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
		me.enableDisableGroupActions( actionMask, isSameUser );
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
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
	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
	},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn());
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
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me=this;
		var strRetValue = "";
		strRetValue = value;
		return strRetValue;
	},
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 70,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'clone',
						text : 	'Copy Record',
						toolTip : getLabel( 'actionClone', 'Copy Record' ),
						maskPosition : 8
					}],
			moreMenu : {
				fnMoreMenuVisibilityHandler : function(store, record, jsonData,
						itmId, menu) {
					return me.isRowMoreMenuVisible(store, record, jsonData,
							itmId, menu);
				},
				fnMoreMenuClickHandler : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
					me.handleRowMoreMenuClick(tableView, rowIndex, columnIndex,
							btn, event, record);
				},
				items : [{
					itemId : 'submit',
					itemCls : 'grid-row-text-icon icon-submit-text',
					toolTip : getLabel('actionSubmit','Submit'),
					itemLabel : getLabel('actionSubmit', 'Submit'),
					maskPosition : 2
				},{
						itemId : 'approve',
						itemCls : 'grid-row-text-icon icon-auth-text',
						toolTip : getLabel('actionApprove','Approve'),
						itemLabel : getLabel('actionApprove', 'Approve'),
						maskPosition : 3
					},{
						itemId : 'reject',
						itemCls : 'grid-row-text-icon icon-reject-text',
						toolTip : getLabel('actionReject','Reject'),
						itemLabel : getLabel('actionReject', 'Reject'),
						maskPosition : 4
					},{
						itemId : 'enable',
						toolTip : getLabel('actionEnable', 'Enable'),
						itemLabel : getLabel('actionEnable', 'Enable'),
						maskPosition : 5
					},
					{
						itemId : 'disable',
						toolTip : getLabel('actionDisable', 'Disable'),
						itemLabel : getLabel('actionDisable', 'Disable'),
						maskPosition : 6
					},{
						itemId : 'discard',
						toolTip : getLabel('actionDiscard', 'Discard'),
						itemLabel : getLabel('actionDiscard', 'Discard'),
						maskPosition : 7
					}]
			}
		};
		return objActionCol;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'action',
			width : 80,
			align : 'right',
			locked : true,
			items : [ {
				itemId : 'btnEdit',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('editToolTip', 'Edit'),
				maskPosition : 1
			},{
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record'),
				maskPosition : 9
			},{
				itemId : 'btnHistory',
				itemCls : 'grid-row-action-icon icon-history',
				toolTip : getLabel('historyToolTip', 'View History'),
				maskPosition : 10
			}]
		};
		return objActionCol;
	},
	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoGridView',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var paymentTypeVal = '';
							var paymentActionVal = '';
							var dateFilter = me.dateFilterLabel;

							if (me.typeFilterVal == 'all' && me.filterApplied == 'ALL') {
								paymentTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else {
								paymentTypeVal = me.typeFilterDesc;
							}

							if (me.actionFilterVal == 'all') {
								paymentActionVal = 'All';
							} else {
								paymentActionVal = me.actionFilterDesc;
							}
						}
					}
				});
	},
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
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
			var strModelType = data.quickFilter.modelType;
			var strDataStoreType = data.quickFilter.dataStoreType;
			var strCategoryType = data.quickFilter.categoryType;
			var typeDesc = data.quickFilter.paymentTypeDesc;
			me.modelTypeFilterVal = !Ext.isEmpty(strModelType)
					? strModelType
					: 'all';		
			me.dataTypeFilterVal = !Ext.isEmpty(strDataStoreType)
					? strDataStoreType
					: 'all';	
			me.catTypeFilterVal = !Ext.isEmpty(strCategoryType)
					? strCategoryType
					: 'all';	
		}
		if (!Ext.isEmpty(me.modelTypeFilterVal)  && me.modelTypeFilterVal !== 'All') {
			arrJsn.push({
						paramName : 'interfaceCode',
						paramValue1 : me.modelTypeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.dataTypeFilterVal)  && me.dataTypeFilterVal !== 'All') {
			arrJsn.push({
						paramName : 'datastoreType',
						paramValue1 : me.dataTypeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.catTypeFilterVal)  && me.catTypeFilterVal !== 'All') {
			arrJsn.push({
						paramName : 'category',
						paramValue1 : me.catTypeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		me.filterData = arrJsn;
	},
	updateAdvFilterConfig : function()
	{
		var me = this;
		if( !Ext.isEmpty( objGridViewFilter ) )
		{
			var data = Ext.decode( objGridViewFilter );
			if( !Ext.isEmpty( data.advFilterCode ) )
			{
				me.showAdvFilterCode = data.advFilterCode;
				me.savePrefAdvFilterCode = data.advFilterCode;
				var strUrl = 'userfilters/uploadSummary/{0}.srvc';
				strUrl = Ext.String.format( strUrl, data.advFilterCode );
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					async : false,
					method : 'GET',
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var applyAdvFilter = false;
						me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
						var objOfCreateNewFilter = me.getCreateNewFilter();
						var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );

						me.advFilterData = objJson;
						this.advFilterCodeApplied = data.advFilterCode;
						me.savePrefAdvFilterCode = '';
						me.filterApplied = 'A';
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'errorTitle', 'Error' ),
							msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
			}
		}
	},
	handleSavePreferences : function() {
		var me = this;
		me.savePreferences();
	},
	savePreferences : function() {
		var me = this, objPref = {}, arrCols = null, objCol = null;
		var strUrl = me.urlGridPref;
		var grid = me.getUploadSummaryGridView();
		var arrColPref = new Array();
		var arrPref = new Array();
		if (!Ext.isEmpty(grid)) {
			arrCols = grid.getView().getGridColumns();
			for (var j = 0; j < arrCols.length; j++) {
				objCol = arrCols[j];
				if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
						&& objCol.itemId.startsWith('col_')
						&& !Ext.isEmpty(objCol.xtype)
						&& objCol.xtype !== 'actioncolumn'
						&& objCol.itemId !== 'col_groupaction')
				{
					arrColPref.push({
								colId : objCol.dataIndex,
								colDesc : objCol.text
							});
				}

			}
			objPref.pgSize = grid.pageSize;
			objPref.gridCols = arrColPref;
			arrPref.push(objPref);
		}
		if (arrPref)
			Ext.Ajax.request({
						url :  strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrPref),
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var isSuccess;
							var title, strMsg, imgIcon;
							if (responseData.d.preferences
									&& responseData.d.preferences.success)
								isSuccess = responseData.d.preferences.success;
							if (isSuccess && isSuccess === 'N') {
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
									me.getBtnSavePreferences()
											.setDisabled(false);
								title = getLabel('SaveFilterPopupTitle',
										'Message');
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
	saveFilterPreferences : function() {
		var me = this;
		var strUrl = me.urlGridFilterPref;
		var advFilterCode = null;
		var objFilterPref = {};
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var objQuickFilterPref = {};
		objQuickFilterPref.modelType = me.modelTypeFilterVal;
		objQuickFilterPref.dataStoreType = me.dataTypeFilterVal;
		objQuickFilterPref.categoryType = me.catTypeFilterVal;
		objQuickFilterPref.paymentTypeDesc = me.typeFilterDesc;
		objQuickFilterPref.paymentAction = me.actionFilterVal;
		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = objQuickFilterPref;

		if (objFilterPref)
			Ext.Ajax.request({
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
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
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
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
	handleType : function(btn)
	{
		var me = this;
		var modelStatusLabel = me.getModelStatusLabel()
		var datastorStatusLabel = me.getDatastorStatusLabel();
		var categoryStatusLabel = me.getCategoryStatusLabel();
		me.toggleSavePrefrenceAction( true );
		me.typeFilterVal = btn.code;
		me.typeFilterDesc = btn.btnDesc;
		if(me.typeFilterDesc === 'Model')
		{
			if( !Ext.isEmpty( me.typeFilterVal ) )
			{
				modelStatusLabel.setText(me.typeFilterVal);
				modelStatusLabel.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
				me.modelTypeFilterVal = btn.code;
			}
		}
		if(me.typeFilterDesc === 'Datastore')
		{
			if( !Ext.isEmpty( me.typeFilterVal ) )
			{
				datastorStatusLabel.setText(me.typeFilterVal);
				datastorStatusLabel.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
				me.dataTypeFilterVal = btn.code;
			}
		}
		if(me.typeFilterDesc === 'Category')
		{
			if( !Ext.isEmpty( me.typeFilterVal ) )
			{
				categoryStatusLabel.setText(me.typeFilterVal);
				categoryStatusLabel.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
				me.catTypeFilterVal = btn.code;
			}
		}
		if(me.typeFilterVal === 'All')
		{
			me.filterApplied = 'ALL';
			me.setDataForFilter();
			me.applyAdvancedFilter();
		}
		else
		{
			me.filterApplied = 'Q';
			me.setDataForFilter();
			me.applyQuickFilter();
		}
	},
	applyFilterData : function()
	{
		var me = this;
		me.getUploadSummaryGridView().refreshData();
	},
	onUploadSummaryInformationViewRender : function() {
		var me = this;
		var accSummInfoViewRef1 = me.getUploadSummaryInfoView();
		accSummInfoViewRef1.createSummaryLowerPanelView();
	},
	setSummaryInfo : function(grid)
	{
		var me = this;
		var uploadSummaryGrid = me.getUploadSummaryGridView();
		var uploadSummaryInfo = me.getUploadSummaryInfoView();
		var bankCountId = uploadSummaryInfo.down('panel[itemId="infoSummaryLowerPanel"] panel label[itemId="bankId"]');
		var clientCountId = uploadSummaryInfo.down('panel[itemId="infoSummaryLowerPanel"] panel label[itemId="clientId"]');
		var standardCountId = uploadSummaryInfo.down('panel[itemId="infoSummaryLowerPanel"] panel label[itemId="standardId"]');
		var dataStore = uploadSummaryGrid.store;
		dataStore.on( 'load', function( store, records )
		{
			var i = records.length - 1;
			if( i >= 0 )
			{
				bankCount = records[i].get('bankCount');
				bankCountId.setText(bankCount);
				clientCount = records[i].get('clientCount');
				clientCountId.setText(clientCount);
				standardCount = records[i].get('standardCount');
				standardCountId.setText(standardCount);
			}
			else
			{
				bankCountId.setText("# 0");
				clientCountId.setText("# 0");
				standardCountId.setText("# 0");
			}
		} );
	},
	createInterfaceMenuList : function(interafaceList){
		var me = this;
		var objTbar = me.getModelTypeToolBar();
		var infoArray = this.createInterfacList(interafaceList,me);
		objTbar.add({
					xtype : 'label',
					text : getLabel('model', 'Model'),
					cls : 'f13',
					flex : 1,
					padding : '6 0 0 8'
				    },{
					xtype : 'button',
					border : 0,
					filterParamName : 'modelMenu',
					itemId : 'modelMenuId',// Required
					cls : 'xn-custom-arrow-button cursor_pointer w1',
					padding : '6 0 0 0',
					menu  : Ext.create('Ext.menu.Menu', { 
						items : infoArray
					})
			})
	},
	createInterfacList : function(interafaceList,me){
		var startIndex = interafaceList.indexOf("{");
		var endIndex = interafaceList.indexOf("}");
		if(startIndex !== -1 && endIndex !== -1){
			var strInterfaceList = interafaceList.substring(startIndex+1,endIndex);
		}else{
			strInterfaceList = interafaceList;
		}
		var objArray = strInterfaceList.split(',');
		var infoArray = new Array();
		var splitArray = new Array();
		infoArray.push({
			text : getLabel('labelAll', 'All'),
			btnId : 'btnAll',
			btnValue : 'All',
			code : 'All',
			btnDesc : 'Model',
			parent : this,
			handler : function( btn, opts )
			{
				me.handleType(btn);
			}
		});
		for( var i = 0 ; i < objArray.length ; i++ )
		{
			splitArray = objArray[i].split('=')
			infoArray.push({
				text : getLabel('label'+i, objArray[i]),
				btnId : 'btn'+splitArray[0],
				btnValue : i,
				code : splitArray[0],
				btnDesc : 'Model',
				parent : this,
				handler : function( btn, opts )
				{
					me.handleType(btn);
				}
			});
		}
		return infoArray;
	},
	createDataStoreMenuList : function(dataStoreList){
		var me = this;
		var objTbar = me.getDataStoreTypeToolBar();
		var infoArray = this.createDataStoreList(dataStoreList,me);
		objTbar.add({
					xtype : 'label',
					text : getLabel('dataStore', 'DataStore'),
					cls : 'f13',
					flex : 1,
					padding : '6 0 0 8'
				    },{
					xtype : 'button',
					border : 0,
					filterParamName : 'dataStoreMenu',
					itemId : 'dataStoreMenuId',// Required
					cls : 'xn-custom-arrow-button cursor_pointer w1',
					padding : '6 0 0 0',
					menu  : Ext.create('Ext.menu.Menu', { 
						items : infoArray
					})
			})
	},
	createDataStoreList : function(dataStoreList,me){
		var startIndex = dataStoreList.indexOf("{");
		var endIndex = dataStoreList.indexOf("}");
		if(startIndex !== -1 && endIndex !== -1){
			var strInterfaceList = dataStoreList.substring(startIndex+1,endIndex);
		}else{
			strInterfaceList = dataStoreList;
		}
		var objArray = strInterfaceList.split(',');
		var infoArray = new Array();
		var splitArray = new Array();
		infoArray.push({
			text : getLabel('labelAll', 'All'),
			btnId : 'btnAll',
			btnValue : 'All',
			code : 'All',
			btnDesc : 'Datastore',
			parent : this,
			handler : function( btn, opts )
			{
				me.handleType(btn);
			}
		});
		for( var i = 0 ; i < objArray.length ; i++ )
		{
			splitArray = objArray[i].split('=')
			infoArray.push({
				text : getLabel('label'+i, splitArray[0]),
				btnId : 'btn'+splitArray[0],
				btnValue : i,
				code : splitArray[0],
				btnDesc : 'Datastore',
				parent : this,
				handler : function( btn, opts )
				{
					me.handleType(btn);
				}
			});
		}
		return infoArray;
	},
	createCategoryMenuList : function(categoryList){
		var me = this;
		var objTbar = me.getCategoryTypeToolBar();
		var infoArray = this.createCatMenuList(categoryList,me);
		objTbar.add({
					xtype : 'label',
					text : getLabel('category', 'Category'),
					cls : 'f13',
					flex : 1,
					padding : '6 0 0 8'
				    },{
					xtype : 'button',
					border : 0,
					filterParamName : 'categoryMenu',
					itemId : 'categoryMenuId',// Required
					cls : 'xn-custom-arrow-button cursor_pointer w1',
					padding : '6 0 0 0',
					menu  : Ext.create('Ext.menu.Menu', { 
						items : infoArray
					})
			})
	},
	createCatMenuList : function(categoryList,me){
		var startIndex = categoryList.indexOf("[");
		var endIndex = categoryList.indexOf("]");
		if(startIndex !== -1 && endIndex !== -1){
			var strInterfaceList = categoryList.substring(startIndex+1,endIndex);
		}else{
			strInterfaceList = categoryList;
		}
		var objArray = strInterfaceList.split(',');
		var infoArray = new Array();
		infoArray.push({
			text : getLabel('labelAll', 'All'),
			btnId : 'btnAll',
			btnValue : 'All',
			code : 'All',
			btnDesc : 'Category',
			parent : this,
			handler : function( btn, opts )
			{
				me.handleType(btn);
			}
		});
		for( var i = 0 ; i < objArray.length ; i++ )
		{
				infoArray.push({
					text : getLabel('label'+i, objArray[i]),
					btnId : 'btn'+objArray[i],
					btnValue : i,
					code : objArray[i],
					btnDesc : 'Category',
					parent : this,
					handler : function( btn, opts )
					{
						me.handleType(btn);
					}
				});
		}
		return infoArray;
	},
	handleCloneAction : function(btn){
		var me = this;
		var strUrl = "cloneUploadInterface.srvc";
		var objPanel = me.getClonePopUpDtlRef();
		var viewState = objPanel.down('hidden[itemId="viewStateVal"]').getValue();
		var cloneProcessCode = objPanel.down('textfield[itemId="interfaceCode"]').getValue();
		var form ;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',	viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'cloneProcessCode',	cloneProcessCode));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	closeClonePopup : function(btn){
		var me = this;
		me.getClonePopUpRef().close();
		var objPanel = me.getClonePopUpDtlRef();
		objPanel.down('textfield[itemId="interfaceCode"]').setValue("");
	},
	addUploadDefinition : function(){
		var me = this;
		var strUrl = "showUploadProcessForm.srvc";
		me.submitForm(strUrl);
	},
	submitForm : function(strUrl) {
		var me = this;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'pageMode',	'entry'));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	editUploadDefinition : function(strUrl,record,rowIndex){
		var me = this;
		var viewState = record.data.viewState;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',	viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'pageMode',	'Entry'));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	viewUploadDefinition : function(strUrl,record,rowIndex){
		var me = this;
		var viewState = record.data.viewState;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',	viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'pageMode',	'View'));
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
	showHistory : function(interfaceCode, url, id)
	{
		Ext.create( 'GCP.view.UploadDefinitionHistoryPopup',
		{
			historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
			interfaceCode : interfaceCode,
			identifier : id
		} ).show();

	}
});
