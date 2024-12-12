var selectedr = new Array();
Ext.define('GCP.view.WidgetSelectionPopup', {
			extend : 'Ext.window.Window',
			xtype : 'widgetSelectionPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			modal : true,
			draggable : false,
			autoScroll : true,
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null,
				title : null,
				columnName : null
			},

			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/cponFeatures';
				var colModel = me.getColumns();
				widgetListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : 5,
							stateful : false,
							showEmptyRow : false,
							//padding : '5 0 0 0',
							rowList : _AvailableGridSize,
							minHeight : 150,
							xtype : 'widgetListView',
							itemId : 'widgetListViewId',
							profileId : me.profileId,
							featureType : me.featureType,
							module : me.module,
							showCheckBoxColumn : true,
							columnModel : colModel,
							storeModel : {
								fields : ['name', 'value','isAssigned','readOnly'],
								proxyUrl : strUrl,
								rootNode : 'd.filter',
								totalRowsNode : 'd.count'
							},
							listeners : {
								render : function(grid) {
									me.handlePagingData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								beforeselect : me.handleBeforeSelect,
								beforedeselect : me.handleBeforeSelect,
								select : me.addSelected,
								deselect : me.removeDeselected,
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handlePagingData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							}

						});

				this.items = [widgetListView];
				this.buttons = [{
							xtype : 'button',
							text : getLabel('btnOk', 'Ok'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							handler : function() {
								me.saveItems();
							}
						}, {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf056@fontawesome',
							handler : function() {
								selectedr=[];
								me.close();
							}
						}];
				this.callParent(arguments);
			},
			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [{
										colDesc : me.columnName,
										colId : 'name',
										width : 330
									}];
					if (!Ext.isEmpty(arrColsPref)) {
						for (var i = 0; i < arrColsPref.length; i++) {
							objCol = arrColsPref[i];
							cfgCol = {};
							cfgCol.colHeader = objCol.colDesc;
							cfgCol.colId = objCol.colId;
							cfgCol.width = objCol.width;
							cfgCol.fnColumnRenderer = me.columnRenderer;
							arrCols.push(cfgCol);	
						}
					}
					return arrCols;
				},

			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
				view, colId) {
				var strRetValue = "";
				if(record.raw.updated === 1 && viewmode === 'MODIFIEDVIEW')
					strRetValue='<span class="newFieldValue">'+value+'</span>';
				else if(record.raw.updated === 2 && viewmode === 'MODIFIEDVIEW')
					strRetValue='<span class="modifiedFieldValue">'+value+'</span>';
				else if(record.raw.updated === 3 && viewmode === 'MODIFIEDVIEW')
					strRetValue='<span class="deletedFieldValue">'+value+'</span>';
				else 
					strRetValue = value;
				
				return strRetValue;
			},
			handleBeforeSelect : function(me, record, index, eOpts){
				if(record.data.readOnly === true )
					return false;
			},
			addSelected : function(row, record, index , eopts){
				var allreadyPresent = false;
				for(var i=0; i<selectedr.length;i++) {
					if(selectedr[i]===record.data.value){	
						allreadyPresent = true;			
						break;
					}
				}
				if(!allreadyPresent) {
					selectedr.push(record.data.value);
					record.raw.isAssigned=true;
					allreadyPresent = false;
				}
			},	
			
			removeDeselected : function(row, record, index , eopts){
				var index= -1;
				for(var i=0; i<selectedr.length;i++) {
					if(selectedr[i]===record.data.value){	
						index = i;		
						break;
					}
				}
				if (index > -1) {
					selectedr.splice(index, 1);
				}
			},
			saveItems : function() {
				var me = this;
				var records = selectedr;
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(records);
					selectedr=[];
					me.close();
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
				if(pagemode == "VERIFY")
				{
					strUrl = strUrl+ '&assigned=Y';
				}
				
				if (me.ownerCt.isAllSelected == "Y") {
					strUrl = strUrl + '&isAllSelected=Y';
				}
				grid.loadGridData(strUrl, me.up('widgetSelectionPopup').updateLoadSelection, grid, false);
			},

			handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo,
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
				
				if(pagemode == "VERIFY")
				{
					strUrl = strUrl+ '&assigned=Y';
				}
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
					
			},

			updateSelection : function(grid, responseData, args) {
				var me = this;
				if (me.isAllSelected == "Y") {
					var selectedArray = responseData.d.filter;
					for ( var i = 0; i < selectedArray.length; i++) {
						selectedr.push(selectedArray[i].value);
					}
				} else {
					var selectedArray = responseData.d.selectedValues;
					for ( var i = 0; i < selectedArray.length; i++) {
						selectedr.push(selectedArray[i].value);
					}
				}
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
								for(var j=0; j<selectedr.length;j++) {
									if(selectedr[j]===item.data.value){	
										isInSelectedr = true;			
										break;
									}
								}
								if(isInSelectedr){
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0){
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
				if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
					grid.getSelectionModel().setLocked(true);
				}
			},
			updateLoadSelection : function(grid, responseData, args) {
				var me = this;
				if (me.isAllSelected == "Y") {
					var selectedArray = responseData.d.filter;
					for ( var i = 0; i < selectedArray.length; i++) {
						selectedr.push(selectedArray[i].value);
					}
				} else {
					var selectedArray = responseData.d.selectedValues;
					for ( var i = 0; i < selectedArray.length; i++) {
						selectedr.push(selectedArray[i].value);
					}
				}
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
								for(var j=0; j<selectedr.length; j++) {
									if(selectedr[j]===item.data.value){	
										isInSelectedr = true;			
										break;
									}
								}
								if(isInSelectedr){
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0){
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
				if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
					grid.getSelectionModel().setLocked(true);
				}
			}
		});