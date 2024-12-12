Ext.define('BANKUSER.controller.BankAdminUserPrinterController', {
	extend : 'Ext.app.Controller',
	views : ['BANKUSER.view.UserPrinterPrivilegePopUp'],
	refs : [{
				ref : 'userPrinterView',
				selector : 'UserPrinterPrivilegePopUp[itemId="printer_view"]'
			}, {
				ref : 'userPrinterGrid',
				selector : 'UserPrinterPrivilegePopUp smartgrid[itemId=grid_printer_view]'
			}],
	strUrl : '',
	userCategory : '',
	defaultPrinter : '',
	UserPrinterPrivilegePopUp : null,
	userPrinterVal : '',

	init : function() {
		var me = this;
		
				$(document).on('fetchprinters', function() {	
					me.fetchPrinters();
				});
		BANKUSER.getApplication().on({
					showPrinterList : function() {
						me.showPrinterListPopup()
					}
				});
		me.control({
			'UserPrinterPrivilegePopUp[itemId=printer_view] button[itemId=gridOkBtn]' : {
				click : me.handlePrinterPopupClose
			},
			'UserPrinterPrivilegePopUp[itemId=printer_view] smartgrid' : {
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(me, record, index,
						selectedRecords, jsonData) {
					var setEnabled = false;
					for ( var i = 0 ; i < selectedRecords.length ; i++ ) {
						if ( record.data === selectedRecords[i].data ) {
							setEnabled = true;
							break;
						}
					}
					$('#radio_' + index).attr('disabled', !setEnabled);
				},
				cellclick : function(gridview, td, cellIndex, record, tr,
						rowIndex, event, eOpts) {
					if (event.target.tagName == 'INPUT' && cellIndex ==1
							&& event.target.name.trim() == 'defaultPrinterRadio') {
						if (undefined != event.target.name) {
							me.defaultPrinter = record.get('printerCode');
							record.data.defaultPrinter = 'Y';
							$('#defaultPrinter').val(me.defaultPrinter);
							for(var j=0; j<selectedpk.length;j++) {
									if(selectedpk[j].data.printerCode != me.defaultPrinter){
										selectedpk[j].data.defaultPrinter = null;
									}
							}
						}
					}
				},
				afterrender:function(objGrid){
					var usermstselectpopup = objGrid.up("UserPrinterPrivilegePopUp");
					if(!Ext.isEmpty(usermstselectpopup.isAllAssigned))
					{
						me.updateSelectionForAll(true,objGrid);
					}
				}
			}
		});
	},
	setAllAssigned : function(isAllAssignedFlagVal) {
		var me = this;
		me.getUserPrinterGrid().isAllAssigned=isAllAssignedFlagVal;
		var userPrinterGrid = me.getUserPrinterGrid();
		me.updateSelectionForAll(false,userPrinterGrid);
	},
	updateSelectionForAll:function(onLoadFlag,grid){
		var me = this;
		var userPrinterPopUp = grid.up('UserPrinterPrivilegePopUp');
		var selectionModel = grid.getSelectionModel();
		if (selectionModel && !onLoadFlag)
		{
			var totalRec = userPrinterPopUp.getTotalModifiedRecordList(grid);
			if(userPrinterPopUp.isAllAssigned=='Y')
			{
				grid.selectAllRecords(true);
				grid.enableCheckboxColumn(true);
			}
			else if(userPrinterPopUp.isAllAssigned=='N')
			{
				grid.enableCheckboxColumn(false);
				var isPrevAssigned = userPrinterPopUp.isPrevAllAssigned;
				if(totalRec.length>0 || selectionModel.selected.length>=0)
				{
					if(isPrevAssigned=='Y'){
						grid.refreshData();
					}
					else
					{
						grid.setSelectedRecords(grid.getSelectedRecords(),false,true);
					}
				}
			}
		}
		
		if(userPrinterPopUp.isAllAssigned=='Y')
		{
			userPrinterPopUp.isPrevAllAssigned='Y';
		}
		else if(userPrinterPopUp.isAllAssigned=='N')
		{	
			userPrinterPopUp.isPrevAllAssigned='N';
		}
	},
	fetchPrinters : function() {
		var me = this;
		var printerGrid = me.getUserPrinterGrid();
		var paramValues = me.getParamValues();
		if (!Ext.isEmpty(printerGrid)) {
			//var tempdefaultPrinter = document.getElementById('defaultPrinter').value;
			var url = "userPrinterLinkageList.srvc";
			url = printerGrid
					.generateUrl(url, printerGrid.pageSize, 1, 1);
			var strUrl = url + '&' + '$viewState=' + paramValues.viewState + '&' + '$userSellerCode=' + paramValues.loggedInSeller + '&' + csrfTokenName + "=" + csrfTokenValue;
			if(!Ext.isEmpty(userPrinterVal))
			{
				strUrl = strUrl + '&' + "$autofilter=printerCode eq '" + userPrinterVal+"'";
			}
			userPrinterVal = '';	
			me.strUrl = strUrl;
			printerGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);		
					
		}
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var paramValues = me.getParamValues();
		var newUrl = "userPrinterLinkageList.srvc";
		var strUrl = grid.generateUrl(newUrl, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&' + '$viewState=' + paramValues.viewState + '&' + '$userSellerCode=' + paramValues.loggedInSeller + '&' + csrfTokenName + "=" + csrfTokenValue;
		grid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
	},
	handleAfterGridDataLoad : function(grid, jsonData) {
		var me = this;
		var store = grid.getStore();
		var records = store.data;
		grid.enableCheckboxColumn(false);
		var printerprivilegepopup = grid.up("UserPrinterPrivilegePopUp");
		var isAllAssigned = printerprivilegepopup.isAllAssigned;
		//var storedClients = document.getElementById('selectedClientList').value;
		if (!Ext.isEmpty(records)) {
			var items = records.items;
			var assignedRecords = new Array();
			if (!Ext.isEmpty(items)) {

				for (var i = 0; i < items.length; i++) {
					for(var j=0; j<selectedpk.length;j++) {
						if(items[i].data.printerCode===selectedpk[j].data.printerCode){
							items[i].data = selectedpk[j].data;
						}
						else{
							items[i].data.assigned = false;
							//items[i].data.defaultPrinter = null;
						}
					}
				}
					for (var i = 0; i < items.length; i++) {
						var record = items[i];
						if (!Ext.isEmpty(isAllAssigned) && isAllAssigned == 'Y') 
						{
							assignedRecords.push(record);
						} else if (record.data.assigned == true) {
							assignedRecords.push(record);
						}
						var isInSelectedr = false;
								for(var j=0; j<selectedpk.length;j++) {
									if(selectedpk[j].data.printerCode===record.data.printerCode){
										record.data.defaultPrinter = selectedpk[j].data.defaultPrinter;							
										isInSelectedr = true;			
										break;
									}
								}
								if(isInSelectedr){
									assignedRecords.push(record);
								}
					}
			}
			if (assignedRecords.length > 0){
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(assignedRecords);
							grid.resumeEvent('beforeselect');
						}
			if (assignedRecords.length > 0) {
				grid.setSelectedRecords(assignedRecords,false,true);
			} /*else {
				if (null != storedClients) {
					for (var i = 0; i < items.length; i++) {
						var record = items[i];
						var tempSelectedClients = new Array();
						tempSelectedClients = storedClients.split(",");
						if (tempSelectedClients
								.indexOf(record.get('ucrClient')) != -1) {
							assignedRecords.push(record);
						}
					}
					if (assignedRecords.length > 0) {
						grid.setSelectedRecords(assignedRecords,false,true);
					}
				}
			}*/
		}

		
	if (grid.mode == 'VIEW') {
			grid.enableCheckboxColumn(true);
		}
		else
		{
			if (!Ext.isEmpty(isAllAssigned))
			{ 
				if(isAllAssigned == 'Y')
				{
					grid.enableCheckboxColumn(true);
				}	
				else if (isAllAssigned == 'N') 
					grid.enableCheckboxColumn(false);
			} 
		}
	if(grid.mode == 'VIEW' ||grid.mode == 'VERIFY')	
		grid.getSelectionModel().setLocked(true);
		
	},
	handlePrinterPopupClose : function(btn) {
		var me = this;
		if (!Ext.isEmpty(me.getUserPrinterGrid())) {
			var gridRecords = me.getUserPrinterGrid().getSelectedRecords();
			me.setSelectedRecordsToHiddenField(selectedpk);
		}
		if (!Ext.isEmpty(me.getUserPrinterGrid()))
			me.getUserPrinterView().hide();	
		
		var filterContainer = me.UserPrinterPrivilegePopUp.down('[itemId="printerFilter"]');
		filterContainer.setValue("");
	},
	setSelectedRecordsToHiddenField : function(records) {
		var me = this;
		var selectedItems = "";
		var selectedDefault = "";
		var usermstselectpopup = me.getUserPrinterGrid();
		var isAllFlagSelected = usermstselectpopup.isAllAssigned;
		
		for (var index = 0; index < records.length; index++) {
			var value = records[index].get('printerCode');
	
			if(records[index].get('printerCode') == me.defaultPrinter)
			{
				selectedDefault = records[index].get('printerCode'); 
					// me.defaultPrinter =null;
			}
			selectedItems = selectedItems + value;
			if (index < records.length - 1) {
				selectedItems = selectedItems + ',';
			}
		}
		if(isAllFlagSelected!='Y'){
			if (undefined != document.getElementById('selectedPrinterList')) {
				var selectedRecordList = selectedItems;
				document.getElementById('selectedPrinterList').value = selectedRecordList;
				document.getElementById('defaultPrinter').value = selectedDefault;
			}
		}
	
	},
	getParamValues : function() {
		var me = this;
		var paramValues = {
			"viewState" : viewState,
			"loggedInSeller" : document.getElementById("sellerId").value
		};
		return paramValues;
	},
	
	showPrinterListPopup : function() {
		var me = this;
		
		var UserPrinterPrivilegePopUp = me.UserPrinterPrivilegePopUp;
			
			var colModel = [{
								colId : 'printerCode',
								colHeader : getLabel('printer','Printer'),
								width : 180,
								draggable : false,
								resizable : false,
								fnColumnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId ){
									var retVal = value;
									if (pageMode == 'VIEW' && btnOldView == 'TRUE') {
										if (record.raw.changeState == 3) {
											retVal = '<span class="newFieldGridValue">' + value + '</span>';
										}
										else if (record.raw.changeState == 1) {
											retVal = '<span class="modifiedFieldValue">' + value + '</span>';
										}
										else if (record.raw.changeState == 2) {
											retVal = '<span class="deletedFieldValue">' + value + '</span>';
										}
									}
									return retVal;
								}
							}, {
								colId : 'default_printer_flag',
								colHeader : getLabel('default','Default'),
								width : 100,
								align : 'center',
								draggable : false,
								resizable : false,
								sortable : false,
								fnColumnRenderer : function(checkedVal,
										metaData, record, rowIndex, colIndex) {
									var retVal = null;
									var isAssignedState = record
											.get('assigned');
									var isDefault = record.get('defaultPrinter');
									var strChecked ='checked';
									var setEnabled = false;									
									
									for(var j=0; j<selectedpk.length;j++) {
									if(selectedpk[j].data.printerCode===record.data.printerCode){						
										isAssignedState = true;
										if(selectedpk[j].data.defaultPrinter==='Y'){						
										isDefault = 'Y';
									}
									else
										isDefault = 'N';
									}
								}
									if (isAssignedState == true) {
										if (isDefault == 'Y') {
											retVal = '<input type="radio" name="defaultPrinterRadio" id = "radio_'
													+ rowIndex
													+ '" checked="'
													+ strChecked + '">';
											me.defaultPrinter = record.get('printerCode');
										} else {
											if (pageMode == 'VERIFY' || pageMode == 'VIEW' ) {
												retVal = '<input type="radio" name="defaultPrinterRadio" id = "radio_'
													+ rowIndex
													+ '" disabled="disabled" >';
											}
											else{
											retVal = '<input type="radio" name="defaultPrinterRadio" id = "radio_'
													+ rowIndex + '">';
											}
										}
									} else if (pageMode == 'VERIFY' || pageMode == 'VIEW' ) {
										retVal = '<input type="radio" name="defaultPrinterRadio" id = "radio_'
												+ rowIndex
												+ '" disabled="disabled" >';
									}else {
										
										retVal = '<input type="radio" name="defaultPrinterRadio" id = "radio_'
													+ rowIndex + '" disabled="disabled">';
													
									}
									return retVal;

								}
							}, {
								colId : 'assigned',
								colDesc : 'Status',
								colHeader : 'Status',
								width : 210,
								draggable : false,
								resizable : false,
								sortable : false,
								fnColumnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId ){
									if(true === value)
										return "Assigned";
									else
										return "Not Assigned";
								}
							}];
					var storeModel = {
						fields : ['assigned', 'printerCode','defaultPrinter','updated'],
						proxyUrl : '/userPrinterLinkageList.srvc',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					};
			if(Ext.isEmpty(UserPrinterPrivilegePopUp)){	
					UserPrinterPrivilegePopUp = Ext.create(
							'BANKUSER.view.UserPrinterPrivilegePopUp', {
								title :  getLabel('selectPrinter','Select Printer Code'),
								searchFlag : true,
								itemId : 'printer_view',
								colModel : colModel,
								storeModel : storeModel,
								mode : pageMode
								
							});
				me.fetchPrinters();
				me.UserPrinterPrivilegePopUp = UserPrinterPrivilegePopUp;
			}	
			UserPrinterPrivilegePopUp.show();
			UserPrinterPrivilegePopUp.center();
			var storeData = UserPrinterPrivilegePopUp.down('smartgrid').getStore();
		
	}
	
});

function getPrinterListPopup() {
	BANKUSER.getApplication().fireEvent('showPrinterList');
}
