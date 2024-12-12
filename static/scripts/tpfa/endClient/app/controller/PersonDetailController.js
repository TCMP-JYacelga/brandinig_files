Ext.define('ENC.controller.PersonDetailController', {
	extend : 'Ext.app.Controller',
	views : ['ENC.view.EndClientPersonDetailView'],
	refs : [{
				ref : 'personDtlView',
				selector : 'endClientPersonDetailView panel[itemId="personDtlView"]'
			},{
				ref : 'grid',
				selector : 'endClientPersonDetailView smartgrid'
			}],
	config : {},
	init : function() {
		var me = this;
		$(document).on('OnDeleteMultipleRow', function() {
					me.preHandleGroupActions('services/personDetail/discard','',null)
				});
		me.control({
			'endClientPersonDetailView' : {
				render : function(panel) {
					me.handleSmartGridLoading();
					
				}
			},
			
			'endClientPersonDetailView smartgrid' : {
			  
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
					grid.store.on('load',function(store){
						
							me.checkStoreCount(store.getTotalCount());
						
						
					});
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
				}
		});
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var viewState = document.getElementById('viewState').value;
		strUrl = strUrl + '&$viewState='+viewState;
		//if('MODIFIEDVIEW' === viewmode)
		//strUrl = strUrl+'&$select=' + "OLD";
		grid.loadGridData(strUrl, me.enableEntryButtons, null,
								false);
	},
	
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
	 arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 180;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	handleSmartGridLoading : function() {
		var me = this;

		var objWidthMap = {
			"FirstName" : 150,
			"LastName" : 150,
			"EndClientPersonDesc" : 170,
			"ResidentFlag" : 130,
			"Telephone" : 130,
			"Email" : 200
			
		};

			var arrColsPref = [{
			"colId" : "FirstName",
			"colDesc" : getLabel('firstName', 'First Name'),
			"sortable" : false
			},{
			"colId" : "LastName",
			"colDesc" : getLabel('surName', 'Surname'),
			"sortable" : false
			},{
			"colId" : "personType",
			"colDesc" : getLabel('relType', 'Relation Type'),
			"sortable" : false
			}, {
			"colId" : "ResidentFlag",
			"colDesc" : getLabel('saRes', 'SA Resident'),
			"sortable" : false
			}, {
			"colId" : "Telephone",
			"colDesc" : getLabel('landline', 'Landline'),
			"sortable" : false
			},{
			"colId" : "Email",
			"colDesc" : getLabel('email', 'Email'),
			"sortable" : false
			}];
			
		var storeModel = {
				fields : ['RelatedPersonType','Initials','FirstName','LastName','ResidentFlag','PassportNumber','ResidentId','DateOfBirth','TelCountryCode', 'Telephone','Email','CityOfBirth','CountryOfBirth','CountryOfCitizenship','TaxRegisteredFlag','CountryOfTaxResidence','TIN','IndCountryOfCitizenship1','IndCountryOfCitizenship2','IndCountryOfCitizenship3','IndCountryOfCitizenship4','IndCountryOfTaxResidence1','IndCountryOfTaxResidence2','IndCountryOfTaxResidence3','IndCountryOfTaxResidence4','IndTIN1','IndTIN2','IndTIN3','IndTIN4','viewState','RecordKeyNo','ParentRecordKey','Version','personType'], 
				proxyUrl : 'services/personDetail.json',
			rootNode : 'd.profile',
			totalRowsNode : 'd.count'
		};
		
		arrCols = me.getColumns(arrColsPref, objWidthMap);
		var pgSize = null;
		pgSize = 10;
		if (pageMode !== 'VIEW' && pageMode !== 'VERIFY'){
		personDetailGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			enableColumnHeaderMenu:false,
			pageSize : pgSize,
			stateful : false,
			showPager : true,
			showEmptyRow : false,
			showSorterToolbar : false,
			cls: 't7-grid',
			rowList : _AvailableGridSize,
			minHeight : 5,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			checkBoxColumnWidth : 41,			
			hideRowNumbererColumn : true,
			handleMoreMenuItemClick : function(gridView, rowIndex, cellIndex, menu,
			     eventObj, record) {
				 me.handleRowActionClicked(gridView, rowIndex, cellIndex, menu,
			     eventObj, record);
				}
			}
		);
		}
		else {
		personDetailGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			enableColumnHeaderMenu:false,
			pageSize : pgSize,
			stateful : false,
			showPager : true,
			showEmptyRow : false,
			showSorterToolbar : false,
			cls: 't7-grid',
			rowList : _AvailableGridSize,
			enableColumnAutoWidth : true,
			minHeight : 5,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			showCheckBoxColumn : false,
			hideRowNumbererColumn : true,
			handleMoreMenuItemClick : function(gridView, rowIndex, cellIndex, menu,
			     eventObj, record) {
				 me.handleRowActionClicked(gridView, rowIndex, cellIndex, menu,
			     eventObj, record);
	          }
		
			}
		);
		}
		
		
		var personDtlView = me.getPersonDtlView();
		personDtlView.add(personDetailGrid);
		personDtlView.doLayout();
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			var strRetValue  = value;
				if(colId === 'col_ResidentFlag')
			{
				if(record.data.ResidentFlag === 'N')
				{
					strRetValue = "No";
				}
				else if(record.data.ResidentFlag === 'Y' )
				{
					strRetValue = "Yes";
				}
							
			}
				else if(colId === 'col_FirstName')
			{
					strRetValue = record.data.Initials+" "+ record.data.FirstName;
			}
		return strRetValue;
		
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = null;
			if(pageMode !== 'VIEW' && pageMode !== 'VERIFY')
			{
			objActionCol = {
				colType : 'actioncontent',
				colHeader: getLabel('actions', 'Actions'),
				colId : 'action',
				sortable: false,
				width : 108,
				align : 'center',
				locked : true,
				items : [
				         {
							itemId : 'btnEdit',
							itemLabel : getLabel('editToolTip', 'Modify Record'),
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel('editToolTip', 'Modify Record'),
							fnClickHandler:'editButton'
							
						}, {
							itemId : 'btnDelete',
							itemLabel : getLabel('deleteToolTip', 'Delete Record'),
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('deleteToolTip', 'Delete Record')
							
						},
						{
							itemId : 'btnView',
							itemLabel : getLabel('viewToolTip', 'View Record'),
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewToolTip', 'View Record')
						}]
				}
			}
			else
			{
				objActionCol = {
						colType : 'actioncontent',
						colHeader: getLabel('actions', 'Actions'),
						colId : 'action',
						sortable: false,
						width : 108,
						align : 'right',
						locked : true,
						items : [
								{
									itemId : 'btnView',
									itemLabel : getLabel('viewToolTip', 'View Record'),
									itemCls : 'grid-row-action-icon icon-view',
									toolTip : getLabel('viewToolTip', 'View Record')
								}]
			}
			};
			return objActionCol;
        
	},
		
  handleGroupActions : function(btn, record) {
 
		var me = this;
		var strUrl;
	
	strUrl = Ext.String.format('services/personDetail/discard'
					);
		this.preHandleGroupActions(strUrl, '',record);
		
	},
	preHandleGroupActions : function(strUrl, remark, record) {
		var me = this;
		
			var grid = this.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var viewState = document.getElementById('viewState').value;
			var records = grid.getSelectedRecords();
			if(records!= '' || record!='')
			{
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
				
			for (var index = 0; index < records.length; index++) {
						arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							recordDesc : records[index].data.viewState,
							userMessage : viewState
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							var errorMessage = '';
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
									
										parentkey = data.parentIdentifier;
										document.getElementById('viewState').value = data.parentIdentifier;
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
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
						
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
	handleRowActionClicked:function(gridView, rowIndex, cellIndex, menu,
	eventObj, record){
		 var me=this;
			var actionName = menu.itemId;
		if (actionName === 'btnEdit') {
			 showEndClientDetailPopup(record,'EDIT')
	 }
	 else if(actionName === 'btnDelete') {
	 me.handleGroupActions(menu.text,record);
	 }
	 else if(actionName === 'btnView') {
	 	 if(MODE === 'VIEW' || MODE === 'VERIFY')
		 {
			 showEndClientDetailViewPopup(record);
		 }
		 else
		 showEndClientDetailPopup(record,'VIEW');

	 }
	},
	
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
			var me = this;
		 if (null != document.getElementById("delEndClientDetails")) {
		  if(selectedRecords.length>0 )
			document.getElementById("delEndClientDetails").disabled = false;
		 else
		  document.getElementById("delEndClientDetails").disabled = true;
		 }
		
	},
	
	 isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
	    	if(MODE === 'VIEW'  || MODE === 'MODIFIEDVIEW'){
	    		if(itmId=="btnEdit" || itmId =="btnDelete")
	    		return false;
	    	}
	    	return true;
	 },
	 
	 checkStoreCount : function(storeCount)
	 {
		 if((storeCount == 0)&&((pageMode == 'VIEW' )|| (pageMode == 'VERIFY')))
		 {
			$('#contentId2').addClass('hidden');
		 }
		 if(storeCount >= 20){
			if(pageMode !== 'VIEW' && pageMode !== 'VERIFY')
			  document.getElementById("addEndClientDetails").disabled = true;
		}
		else if(pageMode !== 'VIEW' && pageMode !== 'VERIFY') {
			if(document.getElementById("addEndClientDetails") != null)
				document.getElementById("addEndClientDetails").disabled = false;
		}
	 }

});