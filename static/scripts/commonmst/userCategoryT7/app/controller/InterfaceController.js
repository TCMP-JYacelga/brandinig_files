Ext.define('GCP.controller.InterfaceController', {
	extend: 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	refs: [{
		ref : 'interfaceView',
		selector : 'usermstselectpopup[itemId=interface_view]'
	}, {
		ref: 'interfaceGrid',
		selector: 'usermstselectpopup smartgrid[itemId=grid_interface_view]'
	}, {
		ref: 'interfaceSearchField',
		selector: 'usermstselectpopup[itemId=interface_view] textfield[itemId=text_interface_view]'
	}],
	strUrl: '',
	userMstSelectPopup: null,
	
	init: function() {
		var me = this;
		GCP.getApplication().on({
					showcategoryinterface: function(module) {
						me.showInterfacePopup(module);
					}
		});
		me.control({
			'usermstselectpopup button[itemId=gridOkBtn]': {
				click: me.handlePopupClose
			},
			'usermstselectpopup[itemId=interface_view] smartgrid': {
				gridPageChange: me.handleLoadGridData,
				gridSortChange: me.handleLoadGridData
			},
			'usermstselectpopup[itemId=interface_view] button[itemId=btn_interface_view]': {
				click: me.fetchInterfaceList
			}
		});
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		if(!Ext.isEmpty(grid)) {
			url = grid.generateUrl(url, grid.pageSize, newPgNo, oldPgNo);
			var strUrl = url + '&categoryId='+userCategory;
			me.strUrl = strUrl;
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
		}
	},
	showInterfacePopup: function(module) {
			var me = this;
			var userMstSelectPopup = me.userMstSelectPopup;
			if (Ext.isEmpty(userMstSelectPopup)) {
				var colModel = [{
							colId : 'interfaceCode',
							colDesc : getLabel('interface','Interface'),
							colHeader : getLabel('interface','Interface')
						}, {
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader : getLabel('status','Status')
						}];
				var storeModel = {
					fields : ['interfaceCode', 'interfaceDesc', 'isAssigned', 'clientDescription', 'assignmentStatus', 'subsidiaries','interfaceModelFlag'],
					proxyUrl : 'services/userCategory/interfaces.json',
					rootNode : 'd.details',
					totalRowsNode : '__count'
				};

				userMstSelectPopup = Ext.create(
						'GCP.view.UserMstSelectPopup', {
							title : locMessages.INTERFACE_TITLE,
							searchFlag : true,
							itemId : 'interface_view',
							colModel : colModel,
							storeModel : storeModel,
							mode : mode
						});
				me.userMstSelectPopup = userMstSelectPopup;
				me.fetchInterfaceList(module);
			} 
			userMstSelectPopup.show();
			userMstSelectPopup.center();
	},
	fetchInterfaceList: function(module) {
		var me = this;
		if(module != undefined && module!= null){
			moduleCode = module;
			module = "";
		}
		var searchField = '';
		var filterParam = "";
		var interfaceGrid = me.getInterfaceGrid();
		if(!Ext.isEmpty(interfaceGrid)) {
			var url = "services/userCategory/interfaces.json";
			url = interfaceGrid.generateUrl(url, interfaceGrid.pageSize, 1, 1);
			if(!Ext.isEmpty(me.getInterfaceSearchField())) {
				searchField = me.getInterfaceSearchField().getValue();
				filterParam = 'interfaceCode'+ ' ' + 'eq '+ '\''+searchField+ '\'';
			}
			var strUrl = url + '&categoryId='+userCategory+'&module='+moduleCode+'&filterParam='+filterParam+'&$filter='+searchField;
			interfaceGrid.url = strUrl;
			interfaceGrid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
		}
	},
	handleAfterGridDataLoad: function(grid, jsonData) {
		var me = this;
		var store = grid.getStore();
		var records = store.data;
		
		if (!Ext.isEmpty(records)) {
						var items = records.items;
						var assignedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var record = items[i];
								if(record.get('isAssigned') == true) {
									assignedRecords.push(record);
								}
							}
						}
						if (assignedRecords.length > 0)
							grid.getSelectionModel().select(assignedRecords);
			}
		
		if(grid.mode == 'view') {
			grid.getSelectionModel().setLocked(true);
		}
	},
	handlePopupClose: function(btn) {
		var me = this;
		if(!Ext.isEmpty(me.getInterfaceGrid())) {
			var gridRecords = me.getInterfaceGrid().getSelectedRecords();
			me.handlePopupCloseForInterface(gridRecords);
		}
		if(!Ext.isEmpty(me.getInterfaceView()))
			me.getInterfaceView().hide();
	},
	handlePopupCloseForInterface: function(records) {
		if(!Ext.isEmpty(records)){
			var objArray = new Array();
			for (var index = 0; index < records.length; index++) {
				var interfaceCode = records[index].get('interfaceCode');
				objArray.push({
					"interfaceCode": interfaceCode
				});
			}
			
				var arr = Ext.encode(objArray);
				if(!Ext.isEmpty(document.getElementById('selectedRecordsForInterface')))
					document.getElementById('selectedRecordsForInterface').value = arr;
		}
			if(!Ext.isEmpty(document.getElementById('popupInterfaceSelectedFlag')))
				document.getElementById('popupInterfaceSelectedFlag').value = "Y"; 
		
	}
});