var isDeselcted = false;
Ext.define('GCP.view.UserMstSelectPopup', {
	extend : 'Ext.window.Window',
	requires : ['Ext.ux.gcp.SmartGrid'],
	xtype : 'usermstselectpopup',
	modal : true,
	width : 480,
	//minHeight : 620,
	// autoScroll : true,
	autoHeight : true,
	title : '',
	keyNode : '',
	closeAction : 'hide',
	config : {
		searchFlag : false,
		layout : 'fit',
		module : '',
		subsidaries : '',
		service : '',
		userMode : '',
		userCategory : '',
		userCorporation : '',
		userCode : '',
		isAllAssigned : 'N',
		isPrevAllAssigned : 'N'
	},
	listeners:{
		show : function(){
			this.center();
		},
		resize : function(){
			this.center();
		}
	},
	initComponent : function() {

		var me = this;
		var searchContainer = null;
		if (me.getSearchFlag() == true) {
			searchContainer = Ext.create('Ext.container.Container', {
						docked : 'top',
						padding : '0 0 5 0',
						layout : {
							type : 'hbox',
							pack : 'end'
						},
						items : [{
									xtype : 'textfield',
									placeHolder : locMessages.SEARCH,
									itemId : 'text_' + me.itemId
								}, {
									xtype : 'button',
									text : locMessages.SEARCH,
									itemId : 'btn_' + me.itemId,
									height : 25,
									handler : function(btn) {
										alert("click implementation pending");
									}
								}]
					});
		}
		me.items = [searchContainer];

		me.buttons = [{
					text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+locMessages.OK,
					glyph : 'xf058@fontawesome',
					cls : 'ux_button-background-color ux_button-padding',
					itemId : 'gridOkBtn',
					handler : function(btn) {
						me.handlePopupClose(btn);
					}
				}];

		me.on('render', me.handleSmartGridLoading);

		me.callParent(arguments);
	},
	handleSmartGridLoading : function() {
		var me = this;
		var userMstGrid = me.down('smartgrid');
		var arrConfig = new Array();
		var showCheckBoxColumn = true;
		arrConfig = me.getServiceSpecificConfigData();
		if (!Ext.isEmpty(userMstGrid)) {
			me.handleLoadGridData(userMstGrid, userMstGrid.store.dataUrl,
					userMstGrid.pageSize, 1, 1, null);
		} else {
			if (me.userMode == 'VIEW' || me.userMode == 'SUBMIT') {
				showCheckBoxColumn = false;
			}
			me.createSmartGrid(arrConfig, showCheckBoxColumn);
		}
	},
	getServiceSpecificConfigData : function() {
		var me = this;
		var colModel = null;
		var storeModel = null;
		var itemId = null;
		switch (me.service) {
			case 'packages' :
				colModel = [{
							colId : 'packageDescription',
							colDesc : 'Package',
							colHeader : 'Package',
							sortable : true
						}, {
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}];
				storeModel = {
					fields : ['isAssigned', 'entitlementName',
							'assignmentStatus', 'packageDescription',
							'clientDescription'],
					proxyUrl : 'services/catAssignedPackageList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				}

				if (me.module == "02") {
					itemId = "pay_packages_grid";
				} else if (me.module == "05") {
					itemId = "coll_packages_grid";
				}
				else if (me.module == "09") {
					itemId = "trade_package_grid";
				}
				else if (me.module == "10") {
					itemId = "forcast_package_grid";
				}
				break;
			case 'paycollAccounts' :
				colModel = [{
							colId : 'entitlementName',
							colDesc : 'Account No',
							colHeader : 'Account No',
							sortable : true
						},
						
						{
							colId : 'accountName',
							colDesc : 'Account Name',
							colHeader : 'Account Name',
							sortable : false
						},
						{
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}];
				storeModel = {
					fields : ['isAssigned', 'entitlementName','accountName',
							'assignmentStatus', 'clientDescription'],
					proxyUrl : 'services/catAssignedPaymentAccountsList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				};

				if (me.module == "02") {
					itemId = "pay_accounts_grid";
				} else if (me.module == "05") {
					itemId = "coll_accounts_grid";
				}
				break;
			case 'brAccounts' :
				colModel = [{
							colId : 'entitlementName',
							colDesc : 'Account No',
							colHeader : 'Account No',
							sortable : true
						},
						{
							colId : 'accountName',
							colDesc : 'Account Name',
							colHeader : 'Account Name',
							sortable : false
						} 
						,
						
						{
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}	
						
						];
				storeModel = {
					fields : ['isAssigned', 'entitlementName','accountName',
							'assignmentStatus', 'clientDescription'],
					proxyUrl : 'services/catAssignedBRAccountsList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				};
				break;
				
			case 'portalAccounts' :
				colModel = [{
							colId : 'entitlementName',
							colDesc : 'Account No',
							colHeader : 'Account No',
							sortable : true
						}, {
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}];
				storeModel = {
					fields : ['isAssigned', 'entitlementName',
							'assignmentStatus', 'clientDescription'],
					proxyUrl : 'services/catAssignedPortalAccountsList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'payTemplates' :
				colModel = [{
							colId : 'entitlementName',
							colDesc : 'Template Name',
							colHeader : 'Template Name',
							sortable : true
						}, {
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}, {
							colId : 'clientDescription',
							colDesc : 'Company Name',
							colHeader : 'Company Name',
							sortable : true
						}];
				storeModel = {
					fields : ['isAssigned', 'entitlementName',
							'assignmentStatus', 'clientDescription'],
					proxyUrl : 'services/catAssignedTemplateList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'lmsAccounts' :
				colModel = [{
							colId : 'entitlementName',
							colDesc : 'Account No',
							colHeader : 'Account No',
							sortable : true
						}, {
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}];
				storeModel = {
					fields : ['isAssigned', 'entitlementName',
							'assignmentStatus'],
					proxyUrl : 'services/catAssignedLMSAccountsList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'notionalList' :
				 colModel = [{
					colId : 'templateReference',
					colDesc : 'Agreement Code',
					colHeader : 'Agreement Code',
					sortable : true,
					width : 120
				}, {
					colId : 'entitlementType',
					colDesc : 'Agreement Name',
					colHeader : 'Agreement Name',
					sortable : true,
					width : 150
				},{
					colId : 'assignmentStatus',
					colDesc : 'Status',
					colHeader : 'Status',
					sortable : false
				}];
				storeModel = {
						fields : [ 'templateReference', 'entitlementType', 'entitlementName', 'entitlementCode', 'isAssigned', 'assignmentStatus'  ],
					proxyUrl : 'services/catAssignedNotionalList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				};
				break;
				
			case 'sweepList' :
				 colModel = [{
						colId : 'templateReference',
						colDesc : 'Agreement Code',
						colHeader : 'Agreement Code',
						sortable : true,
						width : 120
					}, {
						colId : 'entitlementType',
						colDesc : 'Agreement Name',
						colHeader : 'Agreement Name',
						sortable : true,
						width : 150
					},{
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status',
						sortable : false
					}];
					storeModel = {
							fields : [ 'templateReference', 'entitlementType', 'entitlementName', 'entitlementCode', 'isAssigned', 'assignmentStatus' ],
					proxyUrl : 'services/catAssignedSweepList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'scmProducts' :
				colModel = [{
							colId : 'packageDescription',
							colDesc : 'SCM Product',
							colHeader : 'SCM Product',
							sortable : true
						},{
							colId : 'anchorClientDescription',
							colDesc : 'Anchor Client',
							colHeader : 'Anchor Client',
							sortable : false
						}, {
							colId : 'assignmentStatus',
							colDesc : 'Status',
							colHeader : 'Status',
							sortable : false
						}];
				storeModel = {
					fields : ['isAssigned', 'packageDescription',
							'assignmentStatus', 'entitlementName','anchorClientDescription'],
					proxyUrl : 'services/catAssignedSCMProductList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				};
				break;
			default :
		}

		objConfigMap = {
			"colModel" : colModel,
			"storeModel" : storeModel,
			"itemId" : itemId
		};
		return objConfigMap;
	},
	createSmartGrid : function(arrConfig, showCheckBoxColumn) {
		var me = this;
		var pgSize = null;
		var popupSmartGrid = null;
		pgSize = _GridSizeMaster;
		popupSmartGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					pageSize : pgSize,
					stateful : false,
					padding : '5 0 0 0',
					rowList : _AvailableGridSize,
					itemId : arrConfig.itemId,
					minHeight : 100,
					columnModel : arrConfig.colModel,
					storeModel : arrConfig.storeModel,
					showEmptyRow : false,
					showCheckBoxColumn : showCheckBoxColumn,
					showHeaderCheckbox : false,
					mode : me.userMode,
					selectedRecordList : new Array(),
					deSelectedRecordList : new Array(),
					listeners : {
						select : function(row, record, index, eopts) {
							isDeselcted = false;
							me.addSelected(row, record, index, eopts, me);
						},
						deselect : function(row, record, index, eopts) {
							isDeselcted = true;
							me.removeDeselected(row, record, index, eopts, me);
						},
						render : function(grid) {
							me.handleLoadGridData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : function(grid, url, pgSize, newPgNo,
								oldPgNo, sorter) {
							me.handleLoadGridData(grid, url, pgSize, newPgNo,
									oldPgNo, sorter);
						},
						gridSortChange : function(grid, url, pgSize, newPgNo,
								oldPgNo, sorter) {
								me.handleLoadGridData(grid, url, pgSize, newPgNo,
									oldPgNo, sorter);
						},
						afterrender:function(objGrid){
							if(!Ext.isEmpty(me.isAllAssigned))
							{
								me.updateSelectionForAll(true,objGrid);
							}
						}
					}
				});
	popupSmartGrid.on('resize', function() {
			 me.doLayout();
			});
		me.items.add(popupSmartGrid);
		me.doLayout();
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getServiceSpecificUrl();
		grid
				.loadGridData(strUrl, me.handleGridAfterDataLoad, null, false,
						this);
	},
	getServiceSpecificUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		var searchFieldVal = '';
		if (Ext.isEmpty(me.subsidaries) && $('#allClientSelectedFlag').val() === 'Y') {
			me.subsidaries = allCategoryClients;
		}
		switch (me.service) {
			case 'packages' :
			case 'paycollAccounts' :
				strQuickFilterUrl = '&categoryCode=' + me.userCategory
						+ '&userCode=' + me.userCode + '&subsidaries='
						+ me.subsidaries + '&corporationCode='
						+ me.userCorporation + '&module=' + me.module;
				break;
			case 'notionalList' :
				strQuickFilterUrl = '&categoryCode=' + me.userCategory
						 + '&userCode=' + me.userCode 
						 + '&corporationCode='+ me.userCorporation
						 + '&sellerCode='+ me.userSeller + '&csrfTokenName='
						 + csrfTokenValue;
				break;
			case 'sweepList' :
				strQuickFilterUrl = '&categoryCode=' + me.userCategory
					 + '&userCode=' + me.userCode
					 + '&corporationCode='+ me.userCorporation
					 + '&sellerCode='+ me.userSeller + '&csrfTokenName='
					 + csrfTokenValue;
				break;
			default :
				strQuickFilterUrl = '&categoryCode=' + me.userCategory
						+ '&userCode=' + me.userCode + '&subsidaries='
						+ me.subsidaries + '&corporationCode='
						+ me.userCorporation;
		}

		return strQuickFilterUrl;
	},
	handleGridAfterDataLoad : function(grid) {
		var me = this;
		if (me.service == "lmsAccounts" || me.service == "scmProducts" || me.service == "notionalList" || me.service == "sweepList" ) {
			me.handleSCMLMSAfterGridDataLoad(grid);
		} else {
			me.handleNONSCMLMSAfterGridDataLoad(grid);
		}
	},
	getIsAllAssigned : function(grid){
		var me = this;
		var allFlagElemId = '';
		var allChecked = 'N';
		switch (me.service) {
		   	case 'lmsAccounts':
		   		    			allFlagElemId = 'allLMSAccSelectedFlag';
					break;
		   	case 'scmProducts':
		   	        			allFlagElemId ='allSCMProductSelectedFlag';
					break;
			case 'packages' :if (me.module == '02') {
								allFlagElemId = 'allPayPckgsSelectedFlag';
						 	}
							else if(me.module == '05')
							{
								allFlagElemId = 'allCollPckgsSelectedFlag';
							}
							else if(me.module == '09')
							{
								allFlagElemId = 'allTradePackagesSelectedFlag';
							}
			        break;
			case 'paycollAccounts':if (me.module == '02') {
								allFlagElemId = 'allPayAccSelectedFlag';
		 					}
							else if(me.module == '05')
							{
								allFlagElemId = 'allCollAccSelectedFlag';
							}
					break;
			case 'payTemplates':
								allFlagElemId = 'allPayTemplatesSelectedFlag';
					break;
			case 'brAccounts' :
								allFlagElemId = 'allBRAccSelectedFlag';
				    break;
			case 'portalAccounts' :
				allFlagElemId = 'allPortalAccSelectedFlag';
    break;
			default : break;	
		}
		if(!Ext.isEmpty(allFlagElemId))
				allChecked = document.getElementById(allFlagElemId).value;
		
		return allChecked;
		
	},
	setAllAssigned : function(isAllAssignedFlagVal) {
		var me = this;
		me.isAllAssigned=isAllAssignedFlagVal;
		var userMstGrid = me.down('smartgrid');
		me.updateSelectionForAll(false,userMstGrid);
	},
	updateSelectionForAll:function(onLoadFlag,grid){
		var me = this;
		var selectionModel = grid.getSelectionModel();
		if (selectionModel && !onLoadFlag)
		{
			var totalRec = me.getTotalModifiedRecordList(grid);
			if(me.isAllAssigned=='Y')
			{
				grid.selectAllRecords(true);
				grid.enableCheckboxColumn(true);
			}
			else if(me.isAllAssigned=='N')
			{
				grid.enableCheckboxColumn(false);
				var isPrevAssigned = me.isPrevAllAssigned;
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
		
		if(me.isAllAssigned=='Y')
		{
			me.isPrevAllAssigned='Y';
		}
		else if(me.isAllAssigned=='N')
		{	
			me.isPrevAllAssigned='N';
		}
	},
	handleNONSCMLMSAfterGridDataLoad : function(grid) {
		var me = this;
		var isAllAssigned = me.getIsAllAssigned(grid);
		var store = grid.getStore();
		var records = store.data;
		var keyNode = grid.keyNode;
		grid.enableCheckboxColumn(false);
		if (!Ext.isEmpty(records)) {
			var items = records.items;
			var assignedRecords = new Array();
			var unassignedRecords = new Array();
			if (!Ext.isEmpty(items)) {
				for (var i = 0; i < items.length; i++) {
					var record = items[i];
//					if (!Ext.isEmpty(isAllAssigned) && isAllAssigned == 'Y') {
//						assignedRecords.push(record);
//					} else 
						if ((record.get('assigned') == true || record
							.get('isAssigned') == true)
							&& (!me.checkIfRecordExist(
									grid.deSelectedRecordList, keyNode,
									record.data[keyNode]))) {
						assignedRecords.push(record);
					} else if (me.checkIfRecordIsSelected(grid, record)) {
						assignedRecords.push(record);
					}
				}
			}
			if (assignedRecords.length > 0) {
			
				
				 if(isAllAssigned == 'N')
				 {
				 grid.selectedRecordList=new Array();
				for(var iCount=0;iCount<assignedRecords.length;iCount++)
					{
						grid.selectedRecordList.push(assignedRecords[iCount]);
					}
					grid.setSelectedRecords(assignedRecords,false,true);
					}
				
					else 
					{
					grid.setSelectedRecords(assignedRecords,false,true);
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
		//previsAllAssigned = isAllAssigned;
	},
	handleSCMLMSAfterGridDataLoad : function(grid) {
		var me = this;
		var storedValues = null;
		var isAllAssigned = me.getIsAllAssigned(grid);
		var store = grid.getStore();
		var records = store.data;
		var keyNode = grid.keyNode;
		grid.enableCheckboxColumn(false);
		if (me.service == "lmsAccounts") {
			storedValues = document.getElementById('selectedLMSAccList').value;
		} else if (me.service == "scmProducts") {
			storedValues = document.getElementById('selectedSCMProductList').value;
		} else if(me.service == "notionalList"){
			storedValues = document.getElementById('selectedNotionalList').value;
		} else if(me.service == "sweepList"){
			storedValues = document.getElementById('selectedSweepList').value;
		}
		if (!Ext.isEmpty(records)) {
			var items = records.items;
			var assignedRecords = new Array();

			if (!Ext.isEmpty(items)) {
				for (var i = 0; i < items.length; i++) {
					var record = items[i];
					if (!Ext.isEmpty(isAllAssigned) && isAllAssigned == 'Y') {
						assignedRecords.push(record);
					} else if ((record.get('assigned') == true || record.get('isAssigned') == true)
							&& (!me.checkIfRecordExist(grid.deSelectedRecordList, keyNode,
									record.data[keyNode]))) {
						assignedRecords.push(record);
					} else if (me.checkIfRecordIsSelected(grid, record)) {
						assignedRecords.push(record);
					}
				}
			}
			if (assignedRecords.length > 0) {
				grid.setSelectedRecords(assignedRecords,false,true);
			} else {
				if (null != storedValues) {
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						var tempLMSAccts = new Array();
						tempLMSAccts = storedValues.split(",");
						if (tempLMSAccts.indexOf(record.get('entitlementName')) > -1) {
							assignedRecords.push(item);
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
	addSelected : function(row, record, index, eopts) {
		var me = this;
		var grid = me.down('smartgrid');
		var keyNode = 'entitlementName';
		var alreadyPresent = me.checkIfRecordExist(grid.selectedRecordList,
				keyNode, record.data[keyNode]);
		/* Add to Grid Selection List */
		if (!alreadyPresent ) {
			grid.selectedRecordList.push(record);
			alreadyPresent = false;
		}
		/* Remove From De Selected List */
		me.removeElementIfExist(grid.deSelectedRecordList, keyNode,
				record.data[keyNode]);
	},
	removeDeselected : function(row, record, index, eopts) {
		var me = this;
		var grid = me.down('smartgrid');
		var keyNode = 'entitlementName';
		/* Remove Ellement From Grid Selection List */
		var index = -1;
		me.removeElementIfExist(grid.selectedRecordList, keyNode,
				record.data[keyNode]);

		var alreadyPresent = me.checkIfRecordExist(grid.deSelectedRecordList,
				keyNode, record.data[keyNode]);
		/* Add to Grid Selection List */
		if (!alreadyPresent && (record.data['isAssigned'] == true)) {
			grid.deSelectedRecordList.push(record);
			alreadyPresent = false;
		}
	},
	removeElementIfExist : function(arrayList, keyNode, keyNodeValue) {
		var index = -1;
		if (!Ext.isEmpty(arrayList)) {
			for (var i = 0; i < arrayList.length; i++) {
				var rowRecord = arrayList[i];
				if (rowRecord.data[keyNode] === keyNodeValue) {
					index = i;
					break;
				}
			}
			if (index > -1) {
				arrayList.splice(index, 1);
			}
		}
	},
	checkIfRecordExist : function(arrayList, keyNode, keyNodeValue) {
		var isRecordPresent = false;
		if (!Ext.isEmpty(arrayList)) {
			for (var i = 0; i < arrayList.length; i++) {
				var rowRecord = arrayList[i];
				if (rowRecord.data[keyNode] === keyNodeValue) {
					isRecordPresent = true;
					break;
				}
			}
		}
		return isRecordPresent;
	},
	checkIfRecordIsSelected : function(grid, record) {
		var me = this;
		var isRecordPresent = false;
		var keyNode = 'entitlementName';
		if (!Ext.isEmpty(grid.selectedRecordList)) {
			for (var i = 0; i < grid.selectedRecordList.length; i++) {
				var rowRecord = grid.selectedRecordList[i];
				if (rowRecord.data[keyNode] === record.get(keyNode)) {
					isRecordPresent = true;
					break;
				}
			}
		}
		return isRecordPresent;
	},
	addSCMLMSSelectedRecords : function(records) {
		var me = this;
		var selectedItems = "";
		for (var index = 0; index < records.length; index++) {
			var value = records[index].get('entitlementName');
			selectedItems = selectedItems + value;
			if (index < records.length - 1) {
				selectedItems = selectedItems + ',';
			}
		}
		var selectedRecordList = selectedItems;

		if (me.service == "lmsAccounts") {
			document.getElementById('selectedLMSAccList').value = selectedRecordList;
			document.getElementById('lmsAccountsPopupSelectedFlag').value = 'Y';
			
			if(isDeselcted)
			{
				document.getElementById('allLMSAccSelectedFlag').value = "N";
				var imgElement = document.getElementById('chkAllLMSAccSelectedFlag');
				imgElement.src = "static/images/icons/icon_unchecked.gif";
			}
		} else if (me.service == "scmProducts") {
			document.getElementById('selectedSCMProductList').value = selectedRecordList;
			document.getElementById('scmProductPopupSelectedFlag').value = 'Y';
			
			if(isDeselcted)
			{
				document.getElementById('allSCMProductSelectedFlag').value = "N";
				var imgElement = document.getElementById('chkAllSCMProductSelectedFlag');
				imgElement.src = "static/images/icons/icon_unchecked.gif";
			}
		} else if(me.service == "notionalList") {
			document.getElementById('selectedNotionalList').value = selectedRecordList;
			document.getElementById('notionalAgreementPopupSelectedFlag').value = 'Y';
			
			if(isDeselcted)
			{
				document.getElementById('allNotionalAgreeSelectedFlag').value = "N";
				var imgElement = document.getElementById('chkAllNotionalAgreeSelectedFlag');
				imgElement.src = "static/images/icons/icon_unchecked.gif";
			}
		} else if(me.service == "sweepList") {
			document.getElementById('selectedSweepList').value = selectedRecordList;
			document.getElementById('sweepAgreementPopupSelectedFlag').value = 'Y';
			
			if(isDeselcted)
			{
				document.getElementById('allSweepAgreeSelectedFlag').value = "N";
				var imgElement = document.getElementById('chkAllSweepAgreeSelectedFlag');
				imgElement.src = "static/images/icons/icon_unchecked.gif";
			}
		}

	},
	handlePopupClose : function(btn) {
		var me = this;
		if (me.service == "lmsAccounts" || me.service == "scmProducts" || me.service == "notionalList" || me.service == "sweepList") {
			me.handleSCMLMSAccPopupClose(btn);
		} else {
			me.handleNONSCMLMSPopupClose(btn);
		}
	},
	handleSCMLMSAccPopupClose : function(btn) {
		var me = this;
		if (!Ext.isEmpty(me.down('smartgrid')) && me.isAllAssigned!='Y') {
			var gridRecords = me.down('smartgrid').getSelectedRecords();
			if (!Ext.isEmpty(gridRecords)) {
				me.addSCMLMSSelectedRecords(gridRecords);
			} else {
				if (me.service == "lmsAccounts") {
					document.getElementById('selectedLMSAccList').value = null;
				} else if (me.service == "scmProducts") {
					document.getElementById('selectedSCMProductList').value = null;
				} else if (me.service == "notionalList") {
					document.getElementById('selectedNotionalList').value = null;
				} else if (me.service == "sweepList") {
					document.getElementById('selectedSweepList').value = null;
				}
			}
		}
		me.close();
	},
	handleNONSCMLMSPopupClose : function(btn) {
		var me = this;
		if (!Ext.isEmpty(me.down('smartgrid'))  && me.isAllAssigned!='Y') {
			var usermstselectpopup = me.down('smartgrid')
					.up("usermstselectpopup");
					
			var objSelectedRecords = me.down('smartgrid').selectedRecordList;
			var objDeSelectedRecordList = me.down('smartgrid').deSelectedRecordList;
			var keyNode = 'entitlementName';
			var jsonObj = {
				"selectedRecords" : me.getKeyNodeValueList(objSelectedRecords,keyNode),
				"deSelectedRecords" : me.getKeyNodeValueList(
						objDeSelectedRecordList, keyNode)
			}
			me.persistHiddenFieldValues(jsonObj);
		}
		me.close();
	},
	persistHiddenFieldValues : function(jsonObj) {
		var me = this;
		if (jsonObj != null) {
			switch (me.service) {
				case 'packages' :
					if (me.module == '02') {
						document.getElementById('selectedPayPckgsList').value = Ext
								.encode(jsonObj);
						if (null != document
								.getElementById('paymentpackagesPopupSelectedFlag')
								&& undefined != document
										.getElementById('paymentpackagesPopupSelectedFlag')) {
							document
									.getElementById('paymentpackagesPopupSelectedFlag').value = 'Y';
						}
						
						if(isDeselcted)
						{
							document.getElementById('allPayPckgsSelectedFlag').value = "N";
							var imgElement = document.getElementById('chkAllPayPckgsSelectedFlag');
							imgElement.src = "static/images/icons/icon_unchecked.gif";
						}
						
					} else if (me.module == '05') {
						document.getElementById('selectedCollPckgsList').value = Ext
								.encode(jsonObj);
						if (null != document
								.getElementById('collectionpackagesPopupSelectedFlag')
								&& undefined != document
										.getElementById('collectionpackagesPopupSelectedFlag')) {
							document
									.getElementById('collectionpackagesPopupSelectedFlag').value = 'Y';
						}
						if(isDeselcted)
						{
							document.getElementById('allCollPckgsSelectedFlag').value = "N";
							var imgElement = document.getElementById('chkAllCollPckgsSelectedFlag');
							imgElement.src = "static/images/icons/icon_unchecked.gif";
						}
					}
					else if (me.module == '09') {
						document.getElementById('selectedTradePackageList').value = Ext
								.encode(jsonObj);
						if (null != document
								.getElementById('tradePackagePopupSelectedFlag')
								&& undefined != document
										.getElementById('tradePackagePopupSelectedFlag')) {
							document
									.getElementById('tradePackagePopupSelectedFlag').value = 'Y';
						}
						
						if(isDeselcted)
						{
							document.getElementById('allTradePackagesSelectedFlag').value = "N";
							var imgElement = document.getElementById('chkAllTradePackagesSelectedFlag');
							imgElement.src = "static/images/icons/icon_unchecked.gif";
						}
						
					}
					else if (me.module == '10') {
						document.getElementById('selectedForecastPackageList').value = Ext
								.encode(jsonObj);
						if (null != document
								.getElementById('forecastPackagePopupSelectedFlag')
								&& undefined != document
										.getElementById('forecastPackagePopupSelectedFlag')) {
							document
									.getElementById('forecastPackagePopupSelectedFlag').value = 'Y';
						}
						if(isDeselcted)
						{
							document.getElementById('allForecastPackagesSelectedFlag').value = "N";
							var imgElement = document.getElementById('chkAllForecastPackagesSelectedFlag');
							imgElement.src = "static/images/icons/icon_unchecked.gif";
						}
					}
					break;
				case 'paycollAccounts' :
					if (me.module == '02') {
						document.getElementById('selectedPayAccList').value = Ext
								.encode(jsonObj);
						if (null != document
								.getElementById('paymentAccountsPopupSelectedFlag')
								&& undefined != document
										.getElementById('paymentAccountsPopupSelectedFlag')) {
							document
									.getElementById('paymentAccountsPopupSelectedFlag').value = 'Y';
						}
						
						if(isDeselcted)
						{
							document.getElementById('allPayAccSelectedFlag').value = "N";
							var imgElement = document.getElementById('chkAllPayAccSelectedFlag');
							imgElement.src = "static/images/icons/icon_unchecked.gif";
						}
						
					} else if (me.module == '05') {
						document.getElementById('selectedCollAccList').value = Ext
								.encode(jsonObj);
						if (null != document
								.getElementById('collectionAccountsPopupSelectedFlag')
								&& undefined != document
										.getElementById('collectionAccountsPopupSelectedFlag')) {
							document
									.getElementById('collectionAccountsPopupSelectedFlag').value = 'Y';
						}
						if(isDeselcted)
						{
							document.getElementById('allCollAccSelectedFlag').value = "N";
							var imgElement = document.getElementById('chkAllCollAccSelectedFlag');
							imgElement.src = "static/images/icons/icon_unchecked.gif";
						}
					}
					break;
				case 'payTemplates' :
					document.getElementById('selectedPayTemplList').value = Ext
							.encode(jsonObj);
					if (null != document
							.getElementById('templatePopupSelectedFlag')
							&& undefined != document
									.getElementById('templatePopupSelectedFlag')) {
						document.getElementById('templatePopupSelectedFlag').value = 'Y';
					}
					if(isDeselcted)
					{
						document.getElementById('allPayTemplatesSelectedFlag').value = "N";
						var imgElement = document.getElementById('chkAllPayTemplatesSelectedFlag');
						imgElement.src = "static/images/icons/icon_unchecked.gif";
					}
					break;
				case 'brAccounts' :
					document.getElementById('selectedBRAccList').value = Ext
							.encode(jsonObj);
					if (null != document
							.getElementById('brAccountsPopupSelectedFlag')
							&& undefined != document
									.getElementById('brAccountsPopupSelectedFlag')) {
						document.getElementById('brAccountsPopupSelectedFlag').value = 'Y';
					}
					if(isDeselcted)
					{
						document.getElementById('allBRAccSelectedFlag').value = "N";
						var imgElement = document.getElementById('chkAllBrAccSelectedFlag');
						imgElement.src = "static/images/icons/icon_unchecked.gif";
					}
					break;
				case 'portalAccounts' :
					document.getElementById('selectedPortalAccList').value = Ext
							.encode(jsonObj);
					if (null != document
							.getElementById('portalAccountsPopupSelectedFlag')
							&& undefined != document
									.getElementById('portalAccountsPopupSelectedFlag')) {
						document.getElementById('portalAccountsPopupSelectedFlag').value = 'Y';
					}
					if(isDeselcted)
					{
						document.getElementById('allPortalAccSelectedFlag').value = "N";
						var imgElement = document.getElementById('chkAllportalAccSelectedFlag');
						if(imgElement!=null) 
						imgElement.src = "static/images/icons/icon_unchecked.gif";
					}
					break;
				default :
			}

		}

	},
	getKeyNodeValueList : function(arrayList, keyNode) {
		var strRecords = '';
		if (!Ext.isEmpty(arrayList)) {
			for (var i = 0; i < arrayList.length; i++) {
				var rowRecord = arrayList[i];
				strRecords = strRecords + rowRecord.data[keyNode] + ",";
			}
		}
		return strRecords;
	},
	getTotalModifiedRecordList : function(grid){
		var totalModifiedRecordList =  new Array();
		for ( var i = 0; i < grid.selectedRecordList.length; i++) {
				var rowRecord = grid.selectedRecordList[i];
				totalModifiedRecordList.push(rowRecord);
		}
		for ( var i = 0; i < grid.deSelectedRecordList.length; i++) {
				var rowRecord = grid.deSelectedRecordList[i];
				totalModifiedRecordList.push(rowRecord);
		}
		return totalModifiedRecordList;
	}
});