Ext.define('GCP.controller.SubsidiaryController', {
	extend : 'Ext.app.Controller',
	refs : [{
				ref : 'subsidiaryView',
				selector : 'userSelectSubsidiariesPopUp[itemId=subsidiary_view]'
			}, {
				ref : 'subsidiaryGrid',
				selector : 'userSelectSubsidiariesPopUp smartgrid[itemId=grid_subsidiary_view]'
			}],
	strUrl : '',
	userCategory : '',
	defaultClient : '',
	userSelectSubsidiariesPopUp : null,

	init : function() {
		var me = this;
		GCP.getApplication().on({
					showsubsidiarypopup : function() {
						me.showSubsidiaryPopup()
					}
				});
		me.control({
			'userSelectSubsidiariesPopUp[itemId=subsidiary_view] button[itemId=gridOkBtn]' : {
				click : me.handleSubPopupClose
			},
			'userSelectSubsidiariesPopUp[itemId=subsidiary_view] smartgrid' : {
				gridPageChange : me.handleLoadGridData,
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
					if (event.target.tagName == 'INPUT'
							&& event.target.name.trim() == 'defaultClientRadio') {
						if (undefined != event.target.name) {
							me.defaultClient = record.get('ucrClient');
							$('#defaultClient').val(me.defaultClient);
						}
					}
				},
				afterrender:function(objGrid){
					var usermstselectpopup = objGrid.up("userSelectSubsidiariesPopUp");
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
		me.getSubsidiaryView().isAllAssigned=isAllAssignedFlagVal;
		var subsidiaryGrid = me.getSubsidiaryGrid();
		me.updateSelectionForAll(false,subsidiaryGrid);
	},
	updateSelectionForAll:function(onLoadFlag,grid){
		var me = this;
		var userSubsidiariesPopUp = grid.up('userSelectSubsidiariesPopUp');
		var selectionModel = grid.getSelectionModel();
		if (selectionModel && !onLoadFlag)
		{
			var totalRec = userSubsidiariesPopUp.getTotalModifiedRecordList(grid);
			if(userSubsidiariesPopUp.isAllAssigned=='Y')
			{
				grid.selectAllRecords(true);
				grid.enableCheckboxColumn(true);
			}
			else if(userSubsidiariesPopUp.isAllAssigned=='N')
			{
				grid.enableCheckboxColumn(false);
				var isPrevAssigned = userSubsidiariesPopUp.isPrevAllAssigned;
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
		
		if(userSubsidiariesPopUp.isAllAssigned=='Y')
		{
			userSubsidiariesPopUp.isPrevAllAssigned='Y';
		}
		else if(userSubsidiariesPopUp.isAllAssigned=='N')
		{	
			userSubsidiariesPopUp.isPrevAllAssigned='N';
		}
	},
	showSubsidiaryPopup : function() {
		var me = this;
		var localIsAllAssigned = $('#allClientSelectedFlag').val();
		var userSelectSubsidiariesPopUp = me.userSelectSubsidiariesPopUp;
		if (Ext.isEmpty(userCategory) || userCategory == "NONE") {
			Ext.Msg.show({
						title : locMessages.ERROR,
						msg : locMessages.SELECT_CATEGORY,
						width : 300,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
		} else {
			if (me.userCategory != userCategory) {
				me.userCategory = userCategory;
				var tempDefClient = document.getElementById('defaultClient').value;
				if (Ext.isEmpty(userSelectSubsidiariesPopUp)) {
					var colModel = [{
								colId : 'clientAssignDesc',
								colHeader : getLabel('subsidiary','Subsidiary'),
								width : 140
							}, {
								colId : 'defaultClient',
								colHeader : getLabel('default','Default'),
								width : 80,
								align : 'center',
								fnColumnRenderer : function(checkedVal,
										metaData, record, rowIndex, colIndex) {
									var retVal = null;
									var isAssignedState = record
											.get('isAssigned');
									var isDefault = record.get('defaultClient');
									var strChecked = checkedVal === true
											? 'checked'
											: '';
									var gridSelectedRecords = document.getElementById('selectedRecords').value.split(',');
									var setEnabled = false;									
									for(var i=0; i<gridSelectedRecords.length; i++){
										if(record.data.ucrClient === gridSelectedRecords[i]) {
											setEnabled = true;
											break;
										}
									}

									if (isAssignedState == true) {
										if (!Ext.isEmpty(strChecked)
												&& isDefault == true) {
											retVal = '<input type="radio" name="defaultClientRadio" id = "radio_'
													+ rowIndex
													+ '" checked="'
													+ strChecked + '">';
										} else {
											retVal = '<input type="radio" name="defaultClientRadio" id = "radio_'
													+ rowIndex + '">';
										}
									} else if (!Ext.isEmpty(tempDefClient)
											&& isDefault == true) {
										retVal = '<input type="radio" name="defaultClientRadio" id = "radio_'
												+ rowIndex
												+ '" checked="checked">';
									} else if (setEnabled) {
										retVal = '<input type="radio" name="defaultClientRadio" id = "radio_'
												+ rowIndex
												+ '">';
									} else if (userMode == 'ADD' || userMode == 'ADDCHNGCAT' ) {
										retVal = '<input type="radio" name="defaultClientRadio" id = "radio_'
												+ rowIndex
												+ '">';
									} else {
										retVal = '<input type="radio" name="defaultClientRadio" id = "radio_'
												+ rowIndex
												+ '" disabled="disabled" >';
									}

									if (userMode == 'VIEW')
										return retVal;
									else
										return retVal;

								}
							}, {
								colId : 'assignmentStatus',
								colDesc :  getLabel('status','Status'),
								colHeader :  getLabel('status','Status')
							}];
					var storeModel = {
						fields : ['isAssigned', 'clientAssignDesc',
								'ucrClient', 'assignmentStatus', {
									name : 'defaultClient',
									type : 'boolean'
								}],
						proxyUrl : 'services/catAssignedClientList.json',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					};

					userSelectSubsidiariesPopUp = Ext.create(
							'GCP.view.UserSelectSubsidiariesPopUp', {
								title :  getLabel('selectSubsidiay','Select Subsidiary'),
								searchFlag : false,
								itemId : 'subsidiary_view',
								colModel : colModel,
								storeModel : storeModel,
								mode : userMode,
								isAllAssigned : localIsAllAssigned
							});

					me.fetchSubsidiaryForCategory();
				}
				else
				{
					me.setAllAssigned(localIsAllAssigned);
				}
				me.userSelectSubsidiariesPopUp = userSelectSubsidiariesPopUp;
			}
			else
			{
				if (!Ext.isEmpty(userSelectSubsidiariesPopUp)) {
					me.setAllAssigned(localIsAllAssigned);
				}
			}
			userSelectSubsidiariesPopUp.show();
			userSelectSubsidiariesPopUp.center();
		}
	},
	fetchSubsidiaryForCategory : function() {
		var me = this;
		var subsidiaryGrid = me.getSubsidiaryGrid();
		if (!Ext.isEmpty(subsidiaryGrid)) {
			var tempdefaultClient = document.getElementById('defaultClient').value;
			var url = "services/catAssignedClientList.json";
			url = subsidiaryGrid
					.generateUrl(url, subsidiaryGrid.pageSize, 1, 1);
			var strUrl = url + "&categoryCode=" + userCategory + "&userCode="
					+ userCode + "&sellerCode=" + userSeller
					+ '&corporationCode=' + userCorporation + '&defaultClient='
					+ tempdefaultClient;
			me.strUrl = strUrl;
			subsidiaryGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);
		}
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var tempdefaultClient = document.getElementById('defaultClient').value;
		var newUrl = "services/catAssignedClientList.json";
		var strUrl = grid.generateUrl(newUrl, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + "&categoryCode=" + userCategory + "&userCode="
				+ userCode + "&sellerCode=" + userSeller + '&corporationCode='
				+ userCorporation + '&defaultClient=' + tempdefaultClient;
		grid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
	},
	handleAfterGridDataLoad : function(grid, jsonData) {
		var me = this;
		var store = grid.getStore();
		var records = store.data;
		grid.enableCheckboxColumn(false);
		var usermstsubsidpopup = grid.up("userSelectSubsidiariesPopUp");
		var isAllAssigned = usermstsubsidpopup.isAllAssigned;
		var storedClients = document.getElementById('selectedClientList').value;
		if (!Ext.isEmpty(records)) {
			var items = records.items;
			var assignedRecords = new Array();
			if (!Ext.isEmpty(items)) {
				if (1 == items.length) {
					var record = items[0];
					if (record.get('isAssigned') == true) {
						assignedRecords.push(record);
						me.defaultClient = record.get('ucrClient');
						$('#defaultClient').val(me.defaultClient)
					}
				}
				else
				{
					for (var i = 0; i < items.length; i++) {
						var record = items[i];
						if (!Ext.isEmpty(isAllAssigned) && isAllAssigned == 'Y') 
						{
							assignedRecords.push(record);
						} else if (record.get('isAssigned') == true) {
							assignedRecords.push(record);
						}
					}
				}
			}
			if (assignedRecords.length > 0) {
				grid.setSelectedRecords(assignedRecords,false,true);
			} else {
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
			}
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
	},
	handleSubPopupClose : function(btn) {
		var me = this;
		if (!Ext.isEmpty(me.getSubsidiaryGrid())) {
			var gridRecords = me.getSubsidiaryGrid().getSelectedRecords();
			me.setSelectedRecordsToHiddenField(gridRecords);
		}
		if (!Ext.isEmpty(me.getSubsidiaryView()))
			me.getSubsidiaryView().hide();
	},
	setSelectedRecordsToHiddenField : function(records) {
		var me = this;
		var selectedItems = "";
		var usermstselectpopup = me.getSubsidiaryView();
		var isAllFlagSelected = usermstselectpopup.isAllAssigned;
		
		for (var index = 0; index < records.length; index++) {
			var value = records[index].get('ucrClient');
			selectedItems = selectedItems + value;
			if (index < records.length - 1) {
				selectedItems = selectedItems + ',';
			}
		}
		
		if (!Ext.isEmpty(selectedItems)) {
			if(isAllFlagSelected!='Y'){
			if (undefined != document.getElementById('selectedRecords')) {
				var selectedRecordList = selectedItems;
				globalsubsidaries = selectedRecordList;
				document.getElementById('selectedRecords').value = selectedRecordList;
				}
			}
		}
		
		
	}
});