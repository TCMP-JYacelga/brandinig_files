Ext.define( 'GCP.controller.AgentDocumentListController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.AgentDocumentListView', 'GCP.view.AgentDocumentListGridView','GCP.view.AgentDocumentListActionBarView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'agentDocumentListView',
				selector : 'agentDocumentListView'
			}, {
				ref : 'agentDocumentListDtlView',
				selector : 'agentDocumentListView agentDocumentListGridView panel[itemId="agentDocumentListDtlView"]'
			}, {
				ref : "documentTypeFilter",
				selector : 'agentDocumentListView agentDocumentListFilterView combobox[itemId="documentTypeFilter"]'
			}, {
				ref : "entityTypeFilter",
				selector : 'agentDocumentListView agentDocumentListFilterView combobox[itemId="entityTypeFilter"]'
			},{
				ref : "btnUpload",
				selector : 'agentDocumentListView agentDocumentListFilterView button[itemId="btnUpload"]'
			},			
			{
				ref : 'agentDocumentListGridView',
				selector : 'agentDocumentListGridView'
			},{
				ref : 'grid',
				selector : 'agentDocumentListGridView smartgrid'
			},{
				ref : 'discardBtn',
				selector : 'agentDocumentListGridView toolbar[itemId="documentListActionBar"] button[itemId="btnDiscard"]'
			},{
				ref : 'actionBar',
				selector : 'agentDocumentListGridView panel[itemId="agentDocumentListDtlView"] container[itemId="actionBarContainer"] toolbar[itemId="documentListActionBar"]'
			}			
			],
	config : {
		filterData : [],
		strGridViewUrl : 'agentDocumentList.srvc',
		documentType : 'ALL',
		entityType : 'ALL'
	},
	init : function() {
		var me = this;
		var itemFile = null;
		
		me.control({		
		
			'agentDocumentListView' : {
				render : function() {
					//me.getAgentDocumentListGridView().down('panel[itemId=btnActionToolBar]').addCls('button-grey-effect');
					me.handleAddAccountLabel();
				
				},
				handleCancelButtonAction : function() {
					
					me.handleCancelButtonAction('agentSetupList.srvc');
				},
				handleNextButtonAction : function() {						
							me.handleNextButtonAction('docUploadAndSubmitPage.srvc');					
				}
				
			},				
			'agentDocumentListGridView' : {
				render : function(panel) {
					me.handleSmartGridLoading();
				},
				
			addDocumentListEntry : function () {
				me.addAccountEntry('showAgentAccountEntryForm.srvc');		
			}
			},
			'agentDocumentListGridView smartgrid' : {
				'cellclick' : me.doHandleCellClick,
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
			},
			'agentDocumentListView agentDocumentListFilterView' : {
				render : function() {
					me.setInfoTooltip();
				}			
			},
			'agentDocumentListView agentDocumentListFilterView  combobox[itemId="documentTypeFilter"]' : {			
			filterDocumentType :function( btn, opts )
			{					
				me.documentType= btn.value;
				document.getElementById("documentTypeId").value = btn.value;
			}
			},
			'agentDocumentListView agentDocumentListFilterView  combobox[itemId="entityTypeFilter"]' : {
				filterEntityType :  function( btn, opts )
				{					
					me.entityType=btn.value;
					document.getElementById("entityType").value = btn.value;
				}
			},
			'agentDocumentListView agentDocumentListFilterView filefield[itemId="upload"]' : {
				uploadFileAction  : function( f , newValue )
				{
					var me = this;
					var errors = false;
					errors = me.validateMandatoryFields();
					if(errors){
						return;
					}
		        	var parentForm = document.forms[ "frmMain" ];
		        	var grid = me.getGrid();
		        	parentForm.method = 'POST';
		        	parentForm.action = strUrl;
		        	/*parentForm.appendChild(createFormField('INPUT', 'HIDDEN',
		        			csrfTokenName, tokenValue));
		        	parentForm.appendChild(createFormField('INPUT', 'HIDDEN',
		        				'viewState', viewState));
		        	parentForm.appendChild(createFormField('INPUT', 'HIDDEN',
		        				'pageMode', pageMode));
		        	parentForm.appendChild(createFormField('INPUT', 'HIDDEN',
	        				'pageMode', pageMode));*/
		        	var strUrl = 'uploadAgentDocument.srvc';
		        
		        		 var domFileItem = document.getElementsByName("file")[0];
		        		 if(domFileItem.files.length == 1) {
		        			 var uploadFile = domFileItem.files[0];
		        			 var formData = new FormData(parentForm);
		        			 formData.append('file', uploadFile, uploadFile.name);				        		
		        			//send formData with an Ajax-request to the Target-Url
		                     xhr = new XMLHttpRequest();
		                     xhr.open('POST', 'uploadAgentDocument.srvc', true);
		                     xhr.onload = function() {		                    	
		                       if (xhr.status === 200) {
		                         //console.log('Upload Done', xhr.responseText);
		                    	 me.handleError(xhr);
		                         me.resetFilter();		                        
		                         grid.refreshData();
								grid.getSelectionModel().deselectAll();
								me.enableValidActionsForGrid();			
		                         me.applyFilter();
		                         $.unblockUI();
		                       } else {
		                         //alert('An error occurred!');
		                         $.unblockUI();
		                       }
		                     };
		                    $.blockUI();
		                     xhr.send(formData);
		        		 } 
		        
				}				
			},
			'agentDocumentListView agentDocumentListFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'agentDocumentListGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'agentDocumentListGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'agentDocumentListGridView toolbar[itemId=documentListActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'agentDocumentListGridView panel[itemId="agentDocumentListDtlView"]' : {
				render : function() {
					me.handleActionBar();
				}
			}
			
	});
	
	},//end of init()
	
	handleAddAccountLabel : function() {		
		if (pageMode === 'VIEW') {
			// this.getClientAccountView().query('label[text= ]')[0].hide(true);
			//this.getAgentDocumentListGridView().query('panel[itemId=btnActionToolBar]')[0].hide(true);
		}
	},
	
	doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
			
			var clickedId = e.target.id ;
			
			 if( clickedId == 'retrieveDocument')
			{
				me.retrieveFileNetDocument(record);
			}		
	},
	validateMandatoryFields : function() {
		var me = this;
		var errors = false;
		clearAndHideErrorDiv();
		var errorArray = new Array();
		var entityType = me.entityType;
		var documentType = me.documentType;
		if(Ext.isEmpty(entityType) || "ALL" == entityType){
		
	    	errorArray.push(getLabel('lblEntityTypeRequired','EntityType is Required.'));
		}
		if(Ext.isEmpty(documentType) || "ALL" == documentType) {
			
			errorArray.push(getLabel('lblDocumentTypeRequired','Document Type is Required.'));
		}
		if(errorArray.length > 0 ){
			createErrorDiv();
			for(i=0; i < errorArray.length;i++){
				addErrorToDiv(errorArray[i]);
			}
			showErrorDiv();
			return true;
		}
		return false;
			
	},
	retrieveFileNetDocument : function( record )
	{
		var me = this;		
		me.submitRequest( 'retrieveDocument', record );
	},
	submitRequest : function(str, record) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		if (str == 'retrieveDocument') {
			strUrl = "retrieveFileNetDocument.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'objectId',
					record.get('objectId')));		
			}		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
				csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
		
	enableValidActionsForGrid : function() {
		var me = this;
		var grid = me.getGrid();
		var discardActionEnabled = false;	
		var blnEnabled = false;

		if (Ext.isEmpty(grid.getSelectedRecords())) {
			discardActionEnabled = false;		
		} else {
			Ext.each(grid.getSelectedRecords(), function(item) {					
						
						if(disableDiscardActionFlag == 'true')
						{
							discardActionEnabled = true;
						}
						else
						{
							discardActionEnabled = true;
						}
					});
		}

		
		var discardBtn = me.getDiscardBtn();
		
		if (discardActionEnabled) {
			discardBtn.setDisabled(blnEnabled);
		}
		else
		{
			discardBtn.setDisabled(!blnEnabled);
		}
		
		var selectedRecordCount = grid.getSelectedRecords().length;
		if(selectedRecordCount == 1){
		me.setFilterForUpdate (true);
		}
		else {
			me.setFilterForUpdate(false);
		}

	},
	
	setFilterForUpdate :  function  (flag) {
		var me = this;
		var grid = me.getGrid();
		var record;
		var selectedRecord = grid.getSelectedRecords();
		var objFilterDocumentType = me.getDocumentTypeFilter();
		var objFilterEntityType = me.getEntityTypeFilter();
		
		if(flag && selectedRecord.length == 1){
			record = selectedRecord[0];
			objFilterEntityType.setValue(record.get('entityType'));
			objFilterDocumentType.setValue(record.get('documentTypeId'));
			me.documentType = record.get('documentTypeId');
			me.entityType = record.get('entityType');			
			objFilterEntityType.setDisabled(true);
			objFilterDocumentType.setDisabled(true);
			isUpdate = true;
			$('#objectId').val(record.get('objectId'));
			$('#documentTypeId').val(record.get('documentTypeId'));
			$('#entityType').val(record.get('entityType'));			
		}
		else{
			objFilterEntityType.setDisabled(false);
			objFilterDocumentType.setDisabled(false);
			$('#objectId').val('');
			me.resetFilter();			
			isUpdate = false;
		}
		
	},
	
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/documentMaster/{0}',
				strAction);	
			this.preHandleGroupActions(strUrl, '',record);
	},
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl() + '&viewState='	+ encodeURIComponent(viewState)+ "&" + csrfTokenName + "=" + csrfTokenValue;
	/*	if (!Ext.isEmpty(viewmode) && 'MODIFIEDVIEW' == viewmode)
			strUrl += '&$viewmode=' + viewmode;*/
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false,me);
	},
	enableEntryButtons:function(grid, data, scope){
		var me=this;
		//me.getAgentDocumentListView().down('panel[itemId=btnActionToolBar]').removeCls('button-grey-effect');
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		var strMasterFilterUrl = '';
		var strUrl = '';
		var isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithFilterParams(me);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
			isFilterApplied = true;
		}

		return strUrl;
	},
	
	resetFilter : function()
	{
		var me = this;
		var objFilterDocumentType = me.getDocumentTypeFilter();
		var objFilterEntityType = me.getEntityTypeFilter();
		objFilterDocumentType.setValue('');
		objFilterEntityType.setValue('');
		me.entityType = "";
		me.documentType="";
	},
	
	handleError : function(response){
		
    	var jsonObj = Ext.decode(response.responseText);
    	clearAndHideErrorDiv();
    	var businessError = jsonObj.BUSINESSERROR;
    	if(null != businessError) {
    	var errorList = businessError.errors;        	
    	if(null != errorList && errorList.length > 0 ) {
    		
    		createErrorDiv();        	
    	for(i=0; i < errorList.length;i++){
    		addErrorToDiv(errorList[i].defaultMessage);
    	}
    	showErrorDiv();
    	}
    	}
    	$('#viewState').val(jsonObj.viewState);
    
	},

	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var isFilterApplied = false;
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
		return strTemp;
	},

	setDataForFilter : function() {
		var me = this;	

		var entityTypeVal = null, documentTypeVal = null, jsonArray = [];

		if (!Ext.isEmpty(me.entityType) && "ALL" != me.entityType) {
			entityTypeVal = me.entityType;
		}
		
		if (!Ext.isEmpty(me.documentType) && "ALL" != me.documentType) {
			documentTypeVal = me.documentType;
		}	

		if (!Ext.isEmpty(entityTypeVal)) {
			jsonArray.push({
						paramName : 'entityType',
						paramValue1 : entityTypeVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(documentTypeVal)) {
			jsonArray.push({
						paramName : 'documentTypeId',
						paramValue1 : documentTypeVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		me.filterData = jsonArray;
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl() + '&viewState='+encodeURIComponent(viewState)+ "&" + csrfTokenName + "=" + csrfTokenValue;
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},

	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if(pageMode === 'VIEW' ){
			//arrCols.push(me.createViewActionColumn());
		}
		else{
			//arrCols.push(me.createActionColumn());
		}
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.hidden = objCol.hidden;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.sortable=objCol.sortable;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	handleSmartGridLoading : function() {

		var me = this;
		var pgSize = null;
		pgSize = 10;

		var arrColsPref = [{
					"colId" : "entityTypeDesc",
					"colDesc" : getLabel('lblEntityType', 'Entity Type'),					
					"sortable":true
				}, {
					"colId" : "documentTypeDesc",
					"colDesc" : getLabel('lblDocumentType', 'Document Type'),					
					"sortable":true
				},{
					"colId" : "fileName",
					"colDesc" : getLabel('lblFileName', 'File Name'),				
					"sortable":true
				},{
					"colId" : "objectId",
					"colDesc" : getLabel('lblObjectId', 'Document Reference'),				
					"sortable":true
				}, {
					"colId" : "uploadedTimeStamp",
					"colDesc" : getLabel('uploadedTimestamp', 'Time Stamp'),					
					"sortable":true
				}];		
	
		
		var storeModel = {
			fields : ['identifier','entityType','enterpriseTypeId','contentTypeId','documentTypeId','infoTypeId','fileName','objectId','uploadedBy','uploadedTimeStamp', 'isDeleted', 
			          			'entityTypeDesc','enterpriseTypeDesc','infoTypeDesc','contentTypeDesc','documentTypeDesc','viewState'],
			proxyUrl : 'cpon/agentSetup/agentDocumentList.srvc',
			rootNode : 'd.documentList',
			totalRowsNode : 'd.__count'
		};

		arrCols = me.getColumns(arrColsPref);
		documentListGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : _GridSizeMaster,
			stateful : false,			
			hideRowNumbererColumn : true,
			padding : '3 10 10 10',
			showEmptyRow : false,	
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			enableColumnAutoWidth : true,
			isRowIconVisible : me.isRowIconVisible,
			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},
			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu, event, record) 
			{
				me.handleRowIconClick(grid, rowIndex, cellIndex, menu, event, record);
			}

		});

	
		var agentDocumentListDtlView = me.getAgentDocumentListDtlView();
		agentDocumentListDtlView.add(documentListGrid);
		agentDocumentListDtlView.doLayout();
	},
	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {		
		var strRetValue = "";
		if (record.get('isEmpty')) {
			if (rowIndex === 0 && colIndex === 0) {
				meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
				return getLabel('gridNoDataMsg',
						'No records found !!!');											
			}
		}
		if( colId === 'col_fileName' ){
			strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="retrieveDocument">' + value+'</a>';
			return strRetValue;
		}
		else{			
			return value;
		}
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			visibleRowActionCount : 1,
			width : 50,			
			align : 'right',
			locked : true,
			items : [
			{
				itemId : 'btnEdit',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('editToolTip', 'Modify Record'),
				itemLabel : getLabel('editToolTip','Modify Record')
			}]
		};
		return objActionCol;

	},
	
	createViewActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
						
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

	preHandleGroupActions : function(strUrl, remark, record) {
	
		var me = this;
		var checkBeforeAction = true;
		var grid = this.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			for (var index = 0; index < records.length; index++) {				
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : viewState
						});
			
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			if(arrayJson.length > 0 ) {
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							//me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
							me.enableValidActionsForGrid();							
							var errorMessage = '';
							if (response.responseText != '[]') {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										viewState = data.parentIdentifier;
									}
									if(!Ext.isEmpty(data.listActionResult))
									{
								        Ext.each(data.listActionResult[0].errors, function(error, index) {
									         errorMessage = errorMessage +  error.code +' : '+ error.errorMessage +"<br/>";
									        });
									}
								}
								if ('' != errorMessage
										&& null != errorMessage) {
									Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
								}
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
			}
		}

	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
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
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);		
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
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var checkBeforeAction = true;
		
		var actionName = btn.itemId;
		if (actionName === 'btnView') {
			checkBeforeAction = me.checkIfAccountSaved(record);
			if(checkBeforeAction)
			me.submitForm('viewAgentAccountMaster.srvc', record, rowIndex);
		} else if (actionName === 'btnEdit'){			
			checkBeforeAction = me.checkIfAccountNotAssigned(record,"EDIT");		
			if(checkBeforeAction)
			me.submitForm('editAgentAccountMaster.srvc', record, rowIndex);
		} 
	},
	checkIfAccountNotAssigned : function (record, strAction) {
		var me = this;
		var accountAssignedFlag = record.data.accountAssignedFlag;
		var accountUsage = record.data.accountUsageCode;
		var errorMessageKey =null;
		if("DISABLE" == strAction){
			errorMessageKey = "checkIfAccountAssignedDisable";
		}
		else if("EDIT" == strAction){
			errorMessageKey = "checkIfAccountAssignedEdit";
		}
		if("SUBAC" == accountUsage) {
		if(!Ext.isEmpty(accountAssignedFlag) && "Y" == accountAssignedFlag ){
			Ext.MessageBox.show({
				title : getLabel('rowIconError','Error'),
				msg : getLabel(errorMessageKey, 'Sub Account is already assigned to End Client. Record cannot be modified.'),
				buttons : Ext.MessageBox.OK,
				cls:'t7-popup',
				icon : Ext.MessageBox.ERROR
			});
			return false;
		}
		else {
			return true;
		}
		
		}
		else {
			return true;
		}
	
	},
	checkIfAccountSaved : function (record) {
		var me = this;
		var dataAccountNumber = record.data.accountNumber;
		if(Ext.isEmpty(dataAccountNumber)){
			Ext.MessageBox.show({
				title : getLabel(
						'rowIconError',
						'Error'),
				msg : getLabel(
						'checkIfAccountSaved',
						'Account Number is not saved to system. Record cannot be viewed.'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});
			return false;
		}
		else {
			return true;
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		//var viewState = record.data.identifier;
		var detailViewState = record.data.identifier;
		var accountUsageCode = record.data.accountUsageCode;
		var updateIndex = rowIndex;
		//var viewMode = viewMode;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'detailViewState',
				detailViewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'calledFrom',
				pageMode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'pageMode',
				pageMode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'accountUsageCode',
				accountUsageCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'profileFieldType',record.raw.profileFieldType));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'agentDocumentListFilterView-1046_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var accountStyle = '';
							var accountNumber = '';
							var status = '';

							if (!Ext.isEmpty(me.getAccountStyleFilter())
									&& !Ext.isEmpty(me.getAccountStyleFilter()
											.getValue())) {
								accountStyle = me.getAccountStyleFilter().getValue();
							} else {
								accountStyle = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getAccountNumberFilter())
									&& !Ext.isEmpty(me.getAccountNumberFilter()
											.getValue())) {
								accountNumber = me.getAccountNumberFilter().getValue();
							} else {
								accountNumber = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getStatusFilter())
									&& !Ext.isEmpty(me.getStatusFilter()
											.getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}

							tip.update(getLabel('accountStyle', 'Account Style') + ' : ' + accountStyle
									+ '<br/>' + getLabel('accountNumber', 'Account Number') + ' : '
									+ accountNumber + '<br/>'
									+ getLabel('status', 'Status') + ' : '
									+ status);
						}
					}
				});
	},
	searchOnPage : function() {
		var me = this;
		var searchValue = me.getSearchTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getGrid();
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
	addAccountEntry : function(strUrl) {
		var me = this;
		var viewState = document.getElementById('viewState').value;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	handleNextButtonAction : function(strUrl) {
		var me = this;
		var viewState = viewState;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				pageMode));	
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	handleCancelButtonAction : function(strUrl) {
		var me = this;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	getAccSubTypeValues : function(combo, newValue, oldValue, eOpts) {
		var me = this;
		var accSubTypeCombo = me.getAccSubTypeCombo();
		if (!Ext.isEmpty(accSubTypeCombo)) {
			var accSubTypeComboStore = accSubTypeCombo.getStore();
			accSubTypeComboStore.proxy.extraParams = {
				$qfilter : combo.getValue()
			};
			accSubTypeComboStore.load();
		}

	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	handleActionBar : function(){
		var me = this;
		var actionBar = me.getActionBar();
		actionBar.hide();
		if(!(pageMode === "VIEW" || pageMode === "MODIFIEDVIEW")){
			actionBar.show();
			actionBar.getComponent('btnDiscard').show(true);
		}
	}
	
});