Ext.define( 'GCP.controller.EndClientDocumentController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.EndClientDocumentView', 'GCP.view.EndClientDocumentGridView','GCP.view.EndClientDocumentActionBarView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'agentDocumentListView',
				selector : 'endClientDocumentView'
			}, {
				ref : 'endClientDocumentListDtlView',
				selector : 'endClientDocumentView endClientDocumentGridView panel[itemId="endClientDocumentListDtlView"]'
			}, {
				ref : "documentTypeFilter",
				selector : 'endClientDocumentView endClientDocumentGridView combobox[itemId="documentTypeFilter"]'
			}, {
				ref : "entityTypeFilter",
				selector : 'endClientDocumentView endClientDocumentGridView combobox[itemId="entityTypeFilter"]'
			} ,{
				ref : "contentTypeFilter",
				selector : 'endClientDocumentView endClientDocumentFilterView combobox[itemId="contentTypeFilter"]'
			},{
				ref : "deleteBtn",
				selector : 'endClientDocumentView endClientDocumentGridView button[itemId="btnDelete"]'
			},{
				ref : 'endClientDocumentListGridView',
				selector : 'endClientDocumentGridView'
			},{
				ref : 'grid',
				selector : 'endClientDocumentGridView smartgrid'
			},{
				ref : 'discardBtn',
				selector : 'endClientDocumentGridView toolbar[itemId="documentListActionBar"] button[itemId="btnDiscard"]'
			}			
			],
	config : {
		filterData : []
		},
	init : function() {
		var me = this;
		
		me.control({		
				
			'endClientDocumentView' : {
				render : function() {
				
					//me.getEndClientDocumentListGridView().down(itemId='actionBarContainer').addCls('button-grey-effect');
					
				},
				handleCancelButtonAction : function() {
					
					me.handleCancelButtonAction('agentSetupList.srvc');
				},
				handleNextButtonAction : function() {						
							me.handleNextButtonAction('docUploadAndSubmitPage.srvc');					
				}
				
			},				
			'endClientDocumentGridView' : {
				render : function(panel) {
					me.handleSmartGridLoading();
				},
				
			addDocumentListEntry : function () {
				//me.addAccountEntry('showAgentAccountEntryForm.srvc');		
			}
			},
			'endClientDocumentGridView smartgrid' : {
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
			'endClientDocumentView endClientDocumentFilterView' : {
				render : function() {
					//me.setInfoTooltip();
				}
			},			
			'endClientDocumentView endClientDocumentFilterView  combobox[itemId="documentTypeFilter"]' : {			
			filterDocumentType :function( btn, opts )
			{					
				me.documentType= btn.value;
				document.getElementById("documentTypeId").value = btn.value;
			}
			},
			'endClientDocumentView endClientDocumentFilterView  combobox[itemId="contentTypeFilter"]' : {			
			filterContentType :function( btn, opts )
			{					
				me.contentType= btn.value;
				document.getElementById("contentTypeId").value = btn.value;		
				var selectedContentType = me.contentType;
				var documentTypeStore;
				if(selectedContentType=="")
				{
					documentTypeStore = Ext.create('Ext.data.Store', {
											autoLoad: true,
											fields : ["CODE", "DESCR"],
												proxy : {
												type : 'ajax',
												url : 'services/userseek/getTaxonomyDocumentType.json',
												extraParams: {													
													 '$filtercode1' : 1
												},										
											reader : {
													type : 'json',
													root : 'd.preferences'
												},
												listeners: {
										            load: function( store, records, successful, eOpts ) {
										                store.insert(0, {"CODE" : "","DESCR" :"Select"})
										                }
										            }	
												}			        
										});	
					}
				else
			{		
				documentTypeStore = Ext.create('Ext.data.Store', {
											autoLoad: true,
											fields : ["CODE", "DESCR"],
												proxy : {
												type : 'ajax',
												url : 'services/userseek/getDocumentTypeBasedOnContent.json',
												extraParams: {
													'$filtercode1':  selectedContentType,
													'$filtercode2':  1
												},
											
											reader : {
													type : 'json',
													root : 'd.preferences'
												},
												listeners: {
										            load: function( store, records, successful, eOpts ) {
										                store.insert(0, {"CODE" : "","DESCR" :"Select"})
										                }
										            }	
												}			        
										});	
				}
				documentTypeStore.insert(0, {"CODE" : "","DESCR" :"Select"});
				
				me.getDocumentTypeFilter().bindStore(documentTypeStore);			
			
				var objFilterPanel = me.getEndClientDocumentListGridView();	
				objAutocompleter = objFilterPanel.down( ' combobox[itemId="documentTypeFilter"]' );
				objAutocompleter.setValue( 'Select' );
				if(me.contentType == '') {
				me.documentType = '';
				}
			
			}
			},
			'endClientDocumentView endClientDocumentFilterView  combobox[itemId="entityTypeFilter"]' : {
				filterEntityType :  function( btn, opts )
				{	
									
					me.entityType=btn.value;
					document.getElementById("entityType").value = btn.value;
					selectedEntityType = me.entityType;
				
				}	
			
			},
			'endClientDocumentView endClientDocumentFilterView filefield[itemId="upload"]' : {
				uploadFileAction  : function( f , newValue )
				{	
					var me = this;
					var errors = false;
					errors = me.validateMandatoryFields();
					if(errors){
						return;
					}				
						        	
		        	var parentForm = document.forms[ "formMain" ];
					var grid = me.getGrid();
		        	parentForm.method = 'POST';
		        	parentForm.action = strUrl;
		              	var strUrl = 'uploadEndClientDocument.srvc';
		        
		        		 var domFileItem = document.getElementsByName("file")[0];
		        		 if(domFileItem.files.length == 1) {
		        			 var uploadFile = domFileItem.files[0];
		        			 var formData = new FormData(parentForm);
		        			 formData.append('file', uploadFile, uploadFile.name);				        		
		        			//send formData with an Ajax-request to the Target-Url
		                     xhr = new XMLHttpRequest();
		                     xhr.open('POST', 'uploadEndClientDocument.srvc', true);
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
		                    $('#blockUIDiv').block({
								overlayCSS : {
									opacity : 0
								},
								baseZ : 2000,
								message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
								css : {
								}
							});
		                     xhr.send(formData);
		        		 } 
		        
				}							
			},
			'endClientDocumentView endClientDocumentFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'endClientDocumentGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'endClientDocumentGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			
			'endClientDocumentView endClientDocumentGridView button[itemId="btnDelete"]' : {
				click : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
	});
	
	},//end of init()
	
	doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
			
			var clickedId = e.target.id ;
			
			 if( clickedId == 'retrieveDocument')
			{
				me.retrieveFileNetDocument(record);
			}		
	},
	retrieveFileNetDocument : function( record )
	{
		var me = this;		
		me.submitRequest( 'retrieveDocument', record );
	},
	validateMandatoryFields : function() {
		var me = this;
		var errors = false;
		clearAndHideErrorDiv();
		var errorArray = new Array();
		var entityType = me.entityType;
		var contentType = me.contentType;
		var documentType = me.documentType;
		if(Ext.isEmpty(entityType) || "Select" == entityType){
		
	    	errorArray.push(getLabel('lblEntityTypeRequired','Entity Type is Required.'));
		}
		if(Ext.isEmpty(contentType) || "Select" == contentType){
		
	    	errorArray.push(getLabel('lblContentTypeRequired','Content Type is Required.'));
		}
		if(Ext.isEmpty(documentType) || "Select" == documentType) {
			
			errorArray.push(getLabel('lblDocumentTypeRequired','Document Type is Required.'));
		}
		if(errorArray.length > 0 ){
			createErrorDiv();
			for(i=0; i < errorArray.length;i++){
				addErrorToDiv(errorArray[i]);
			}
			showErrorDiv();
			$('#messageArea').addClass("ft-error-message");
			$('#boldError').addClass("ft-bold-font");
			return true;
		}
		return false;
			
	},
	submitRequest : function(str, record) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'formMain';
		form.id = 'formMain';
		form.method = 'POST';
		if (str == 'retrieveDocument') {
			strUrl = "retrieveEndClientFileNetDocument.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'objectId',
					record.get('objectId')));		
			}		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
				csrfTokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	
	handleGroupActions : function(btn, record) {
		var me = this;
		var strUrl = Ext.String.format('cpon/endClientDocumentMaster/discard');	
			this.preHandleGroupActions(strUrl, '',record);
	},
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
	
		var viewState = document.getElementById('viewState').value;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl() + '&$viewState='	+ encodeURIComponent(viewState)+  '&'+csrfTokenName+'='	+ tokenValue;
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
		var documentStore;
		var objFilterDocumentType = me.getDocumentTypeFilter();
		var objFilterContentType = me.getContentTypeFilter();
		var objFilterEntityType = me.getEntityTypeFilter();
		objFilterDocumentType.setValue("");
		objFilterContentType.setValue("");
		objFilterEntityType.setValue("");
		me.entityType = "";
		me.documentType="";
		me.contentType="";
		if(me.contentType == "")
		{
			documentStore = Ext.create('Ext.data.Store', {
									autoLoad: true,
									fields : ["CODE", "DESCR"],
										proxy : {
										type : 'ajax',
										url : 'services/userseek/getTaxonomyDocumentType.json',
										extraParams: {													
											 '$filtercode1' : 1
										},										
									reader : {
											type : 'json',
											root : 'd.preferences'
										},
										listeners: {
								            load: function( store, records, successful, eOpts ) {
								                store.insert(0, {"CODE" : "","DESCR" :"Select"})
								                }
								            }	
										}			        
								});	
			}
		else {			
			documentStore = Ext.create('Ext.data.Store', {
										autoLoad: true,
										fields : ["CODE", "DESCR"],
											proxy : {
											type : 'ajax',
											url : 'services/userseek/getDocumentTypeBasedOnContent.json',
											extraParams: {
												'$filtercode1':  me.contentType,
												'$filtercode2':  1
											},
										
										reader : {
												type : 'json',
												root : 'd.preferences'
											},
											listeners: {
									            load: function( store, records, successful, eOpts ) {
									                store.insert(0, {"CODE" : "","DESCR" :"Select"})
									                }
									            }	
											}			        
									});	
			
		}	
	documentStore.insert(0, {"CODE" : "","DESCR" :"Select"});
		
		objFilterDocumentType.bindStore(documentStore);	
		//me.getDocumentTypeFilter().reset();
		objFilterDocumentType.value= "Select";		
		
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
		$('#messageArea').addClass("ft-error-message");
		$('#boldError').addClass("ft-bold-font");
		
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

		var entityTypeVal = null, documentTypeVal = null, contentTypeVal = null, jsonArray = [];

		if (!Ext.isEmpty(me.entityType)) {
			entityTypeVal = me.entityType;
		}
		
		if (!Ext.isEmpty(me.contentType)) {
			contentTypeVal = me.contentType;
		}
		if (!Ext.isEmpty(me.documentType)) {
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
		if (!Ext.isEmpty(contentTypeVal)) {
			jsonArray.push({
						paramName : 'contentType',
						paramValue1 : contentTypeVal,
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
			strUrl = strUrl + me.getFilterUrl() + '&$viewState='+encodeURIComponent(viewState);
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},

	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActionColumn());
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
					"sortable":false
				},{
					"colId" : "contentTypeDesc",
					"colDesc" : getLabel('lblContenType', 'Content Type'),					
					"sortable":false
				}, {
					"colId" : "documentTypeDesc",
					"colDesc" : getLabel('lblDocumentType', 'Document Type'),					
					"sortable":false
				},{
					"colId" : "fileName",
					"colDesc" : getLabel('lblFileName', 'File Name'),				
					"sortable":false
				},{
					"colId" : "objectId",
					"colDesc" : getLabel('lblObjectId', 'Document Reference'),				
					"sortable":false
				}, {
					"colId" : "uploadedTimeStamp",
					"colDesc" : getLabel('uploadedTimestamp', 'Time Stamp'),					
					"sortable":true
				}];		
	
		
		var storeModel = {
			fields : ['identifier','entityType','enterpriseTypeId','contentTypeId','documentTypeId','infoTypeId','fileName','objectId','uploadedBy','uploadedTimeStamp', 'isDeleted', 
			          			'entityTypeDesc','enterpriseTypeDesc','infoTypeDesc','contentTypeDesc','documentTypeDesc','viewState'],
			proxyUrl : 'services/endClientDocumentMst.json',
			rootNode : 'd.documentList',
			totalRowsNode : 'd.__count'
		};

		arrCols = me.getColumns(arrColsPref);
		documentListGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			//id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : _GridSizeMaster,
			stateful : false,			
			hideRowNumbererColumn : true,
			showEmptyRow : false,	
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			checkBoxColumnWidth : 39,
			enableColumnAutoWidth : true,
			showSorterToolbar : false,
			enableColumnHeaderMenu:false,
			cls: 't7-grid',
			//isRowIconVisible : me.isRowIconVisible,
			
			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu, event, record) 
			{
				me.handleRowIconClick(grid, rowIndex, cellIndex, menu, event, record);
			}

		});

	
		var endClientDocumentListDtlView = me.getEndClientDocumentListDtlView();
		endClientDocumentListDtlView.add(documentListGrid);
		endClientDocumentListDtlView.doLayout();
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
			colHeader: getLabel('actions', 'Actions'),
			width : 108,			
			align : 'center',
			locked : true,
			items : [
			{
				itemId : 'btnDelete',
				itemLabel : getLabel('deleteToolTip', 'Delete Record'),
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('deleteToolTip', 'Delete Record')
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
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
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
	
		return true;
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
		if (actionName === 'btnDelete'){			
		 me.handleGroupActions(btn,record);
		} 
	},
	
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
			var me = this;
			var grid = me.getGrid();
		var selectedRecordCount = grid.getSelectedRecords().length;
		  if(selectedRecordCount>0)
		me.getDeleteBtn().enable();
		 else
		me.getDeleteBtn().disable();
			
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
		var objFilterContentType = me.getContentTypeFilter();
		var objFilterEntityType = me.getEntityTypeFilter();
		
		if(flag && selectedRecord.length == 1){
			record = selectedRecord[0];
			objFilterEntityType.setValue(record.get('entityType'));
			objFilterContentType.setValue(record.get('contentTypeId'));
			objFilterDocumentType.setValue(record.get('documentTypeId'));
			me.documentType = record.get('documentTypeId');
			me.entityType = record.get('entityType');	
			me.contentType = record.get('contentTypeId');	
			objFilterEntityType.setDisabled(true);
			objFilterEntityType.setReadOnly(false);
			objFilterContentType.setDisabled(true);
			objFilterContentType.setReadOnly(false);
			objFilterDocumentType.setDisabled(true);
			objFilterDocumentType.setReadOnly(false);
			isUpdate = true;
			$('#objectId').val(record.get('objectId'));
			$('#documentTypeId').val(record.get('documentTypeId'));
			$('#contentTypeId').val(record.get('contentTypeId'));
			$('#entityType').val(record.get('entityType'));			
		}
		else{
			objFilterEntityType.setDisabled(false);
			objFilterContentType.setDisabled(false);
			objFilterDocumentType.setDisabled(false);
			$('#objectId').val('');
			me.resetFilter();			
			isUpdate = false;
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
		form.name = 'formMain';
		form.id = 'formMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'detailViewState',
				detailViewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', '$viewState',
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
	
	handleNextButtonAction : function(strUrl) {
		var me = this;
		var viewState = viewState;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'formMain';
		form.id = 'formMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', '$viewState',
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
		form.name = 'formMain';
		form.id = 'formMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
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
	handleActionBar : function(){
		/*var me = this;
		var actionBar = me.getActionBar();
		actionBar.hide();
		if(!(pageMode === "VIEW" || pageMode === "MODIFIEDVIEW")){
			actionBar.show();
			actionBar.getComponent('btnDiscard').show(true);
		}*/
	}
	
});