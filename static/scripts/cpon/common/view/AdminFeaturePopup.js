Ext.define('GCP.view.AdminFeaturePopup', {
			extend : 'Ext.window.Window',
			xtype : 'adminFeaturePopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			cls : 'non-xn-popup',
			width : 480,
			minHeight : 156,
			maxHeight : 550,
			draggable : false,
			resizable : false,
			closeAction : 'hide',
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null,
				title : null,
				isAllSelected : null
			},

			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/cponPermissionFeatures';
				var colModel = me.getColumns();

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							showPager : false,
							showAllRecords : true,
							xtype : 'adminFeatureView',
							itemId : 'adminFeatureViewId',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							scroll : 'both',
							//padding : '5 0 0 0',
							minHeight : 150,
							maxHeight : 420,
							width  : (screen.width) > 1024 ? 457 : 464,
							columnModel : colModel,
							storeModel : {
								fields : ['name', 'isAssigned', 'value',
										'isAutoApproved', 'profileId','readOnly'],
								proxyUrl : strUrl,
								rootNode : 'd.filter',
								totalRowsNode : 'd.__count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});

				this.items = [adminListView];
				this.bbar = (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
						|| viewmode == "VERIFY") ?['->',{
								xtype : 'button',
								text : getLabel('cancel', 'Cancel'),
								handler : function() {
									me.close();
								}
								}]: [{
								xtype : 'button',
								text : getLabel('cancel', 'Cancel'),
								handler : function() {
									me.close();
								}
								},'->',{
								xtype : 'button',
								text : getLabel('btnDone', 'Done'),
								handler : function() {
									me.saveItems();
								}
							}  ];
				this.callParent(arguments);
			},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "name",
							"colDesc" : getLabel('privileges', 'Privileges')
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = 200;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				if(viewmode == 'VIEW'  || viewmode =="MODIFIEDVIEW" || pagemode == "VERIFY"){
					arrCols.push(me.createViewAssignedActionColumn());
					arrCols.push(me.createViewAutoApproveActionColumn());
				}else{
					arrCols.push(me.createAssignedActionColumn());
					arrCols.push(me.createAutoApproveActionColumn());
				}
				return arrCols;
			},
			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
				view, colId) {
				var strRetValue = "";
				if (!Ext.isEmpty(record.raw) && !Ext.isEmpty(record.raw.featureId)) {
					value = getLabel(record.raw.featureId, value);
				}
				
				if(record.raw.updated != 0 && (record.raw.isChangedUpdated == "M" || record.raw.isChangedAutoApproved == "M" 
					|| record.raw.isChangedUpdated == "N" || record.raw.isChangedAutoApproved == "N"))
				{
					strRetValue = '<span id="Advpopup'+rowIndex+'">'+value+'</span>';
					if(record.raw.isChangedUpdated == "M"){
						admPrivList[rowIndex] = "modifiedFieldValue";
					}
					else if(record.raw.isChangedUpdated == "N"){
						admPrivList[rowIndex] = "newFieldGridValue";
					}
					if(record.raw.isChangedAutoApproved == "M"){
						admPrivAutoAppList[rowIndex] = "modifiedFieldValue";
					}
					else if(record.raw.isChangedAutoApproved == "N"){
						admPrivAutoAppList[rowIndex] = "newFieldGridValue";
					}
				}
				else 
				{
					strRetValue = '<span id="Advpopup'+rowIndex+'">'+value+'</span>';
					admPrivList[rowIndex] = null;
					admPrivAutoAppList[rowIndex] = null;
				}
				return strRetValue;
			},
	
			createViewAssignedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAssigned',
					align: 'center',
					colHeader : getLabel('assigned', 'Assigned'),
					width : 70,
					items : [{
						itemId : 'isAssigned',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							view.restoreScrollState();
							if (!record.get('isEmpty')) {
								if(record.data.readOnly === true){
									if (record.data.isAssigned === true) {
									var iconClsClass = 'icon-checkbox-checked-grey'; 
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked-grey';
									return iconClsClass;
								}
								}else{
								if (record.data.isAssigned === true) {
									var iconClsClass = 'icon-checkbox-checked';
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked';
									return iconClsClass;
								}
								}
							}
						}
					}]
				};
				return objActionCol;
			},

			createViewAutoApproveActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAutoApproved',
					align: 'center',
					colHeader : getLabel('autoapprove', 'Auto Approve'),
					width : 70,
					items : [{
						itemId : 'isAutoApproved',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							view.restoreScrollState();
							if (!record.get('isEmpty'))
							{
								if(record.data.value!='PREGENREPORT' && record.data.value!='REPNDWLD' && record.data.value!='BROADCAST_MSG' && record.data.value!='FADM-000002'
									&& record.data.value!='CRU' && record.data.value!='REU' && record.data.value!='USERACTIVITY' && record.data.value!='NEWDASHBOARD')
								{								
									if(record.data.readOnly === true)
									{
										if (record.data.isAutoApproved === true)
										{
											var iconClsClass = 'icon-checkbox-checked-grey'; 
											return iconClsClass;
										}
										else
										{
											var iconClsClass = 'icon-checkbox-unchecked-grey';
											return iconClsClass;
										}
									}
									else
									{
										if (record.data.isAutoApproved === true)
										{
											var iconClsClass = 'icon-checkbox-checked';
											return iconClsClass;
										}
										else
										{
											var iconClsClass = 'icon-checkbox-unchecked';
											return iconClsClass;
										}
									}
								}
							}
						}
					}]
				};
				return objActionCol;
			},
			createAssignedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAssigned',
					align: 'center',
					colHeader : getLabel('assigned', 'Assigned'),
					width : 70,
					items : [{
						itemId : 'isAssigned',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							if(record.data.readOnly === false){		
							if (record.data.isAssigned === false) {
								tableView.saveScrollState();
								record.set("isAssigned", true);
								tableView.restoreScrollState();
							} else {
								tableView.saveScrollState();
								record.set("isAssigned", false);
								tableView.restoreScrollState();
							}}
							tableView.saveState();
						},
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							view.restoreScrollState();
							if (!record.get('isEmpty')) {
								if(record.data.readOnly === true){
									if (record.data.isAssigned === true) {
									var iconClsClass = 'icon-checkbox-checked-grey'; 
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked-grey';
									return iconClsClass;
								}
								}else{
								if (record.data.isAssigned === true) {
									var iconClsClass = 'icon-checkbox-checked'; 
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked';
									return iconClsClass;
								}
								}
							}
						}
					}]
				};
				return objActionCol;
			},
			createAutoApproveActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAutoApproved',
					align: 'center',
					colHeader : getLabel('autoapprove', 'Auto Approve'),
					width : 110,
					items : [{
						itemId : 'isAutoApproved',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							if(record.data.readOnly === false){	
							if (record.data.isAutoApproved === false) {
								tableView.saveScrollState();
								record.set("isAutoApproved", true);
								tableView.restoreScrollState();
							} else {
								tableView.saveScrollState();
								record.set("isAutoApproved", false);
								tableView.restoreScrollState();
							}}
							tableView.saveState();
						},
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							view.restoreScrollState();
							if (!record.get('isEmpty'))
							{
								if(record.data.value!='ALERTMONITOR' && record.data.value!='FIU' && record.data.value!='MSG' && record.data.value!='MNGALERTS' && record.data.value!='PREGENREPORT' && record.data.value!='REPNDWLD'  && record.data.value!='BROADCAST_MSG' && record.data.value!='FADM-000002'
									&& record.data.value!='CRU' && record.data.value!='REU' && record.data.value!='USERACTIVITY'  && record.data.value!='NEWDASHBOARD')
								{								
									if(record.data.readOnly === true)
									{
											if (record.data.isAutoApproved === true)
											{
												var iconClsClass = 'icon-checkbox-checked-grey';
												return iconClsClass;
											}
											else
											{
												var iconClsClass = 'icon-checkbox-unchecked-grey';
												return iconClsClass;
											}
									}
									else
									{
										if (record.data.isAutoApproved === true)
										{
											var iconClsClass = 'icon-checkbox-checked';
											return iconClsClass;
										}
										else
										{
											var iconClsClass = 'icon-checkbox-unchecked';
											return iconClsClass;
										}
									}
								}
							}
						}
					}]
				};
				return objActionCol;
			},

			saveItems : function() {
				var me = this;
				var grid = me.down('grid[itemId=adminFeatureViewId]');
				var records = grid.store.data;
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(records);
					me.close();
				}

			},
			updateCheckboxSelection:function(grid, responseData, args) {
				var me=this;
				if(!(selectedAdminFeatureList instanceof Array)){
				selectedAdminFeatureList=jQuery.parseJSON(selectedAdminFeatureList);
				}
				
				if(!Ext.isEmpty(selectedAdminFeatureList)){
				var previousSelectedData=selectedAdminFeatureList;
				if (!Ext.isEmpty(grid)) {
				var store = grid.getStore();
				var records = store.data;
				if (!Ext.isEmpty(records)){
					var items = records.items;
					if (!Ext.isEmpty(items)) {
						for ( var index = 0; index < items.length; index++) {
							var item = items[index].data;
							item.isAssigned=false;
							item.isAutoApproved=false;
						}
						
						for(var index=0; index < previousSelectedData.length; index++){
							var currentData=previousSelectedData[index];
								for ( var i = 0; i < items.length; i++) {
									var item = items[i].data;
									if(currentData.value==item.value){
										item.isAssigned=currentData.isAssigned;
										item.isAutoApproved=currentData.isAutoApproved;
									}
								}
						}
						}
					}
			    	}
		    	}
			},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				if (!Ext.isEmpty(me.profileId)) {
					var url = Ext.String.format(
							'&featureType={0}&module={1}&profileId={2}',
							me.featureType, me.module, me.profileId);
					strUrl = strUrl + url;
				} else {
					var url = Ext.String.format('&featureType={0}&module={1}',
							me.featureType, me.module);
					strUrl = strUrl + url;
				}
				if (me.isAllSelected == "Y") {
					strUrl = strUrl + '&isAllSelected=Y';
				}
				// isCustomReportHideFlag is defined in ConfigureClientServicesList.jsp.
				if( isCustomReportHideFlag == "Y")
				{
					strUrl = strUrl + '&isCustomReportHideFlag=Y';
				}
				
				// isReportCenterHideFlag flag to hide/unhide Report Center option on popup 
				if( isReportCenterHideFlag == "Y")
				{
					strUrl = strUrl + '&isReportCenterHideFlag=Y';
				}
				
				grid.loadGridData(strUrl, me.updateCheckboxSelection, grid, false);
			}
		});