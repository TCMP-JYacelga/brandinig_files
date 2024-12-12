var selectedr = new Array();
Ext.define('GCP.view.BRFeatureAccountsPopup', {
			extend : 'Ext.window.Window',
			xtype : 'accountSelectionPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			modal : true,
			draggable : true,
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
				var strUrl = 'cpon/clientServiceSetup/brAccountsData';
				var colModel = me.getColumns();
				widgetListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : _GridSizeMaster,
							stateful : false,
							showEmptyRow : false,
							showPager : true,
							xtype : 'widgetListView',
							itemId : 'brAccountFeaturePopup',
							profileId : me.profileId,
							featureType : me.featureType,
							module : me.module,
							showCheckBoxColumn : true,
							padding : '5 0 0 0',
							rowList : _AvailableGridSize,
							minHeight : 150,
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
							margin : '0 10 0 0',
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf058@fontawesome',
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
				if(record.raw.updated === 1 && viewmode === 'MODIFIEDVIEW' )
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
				var grid = me.down('grid[itemId=brAccountFeaturePopup]');
				var records = selectedr;
				var blnIsUnselected = selectedr.length < grid.store
				.getTotalCount() ? true : false;
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(records,blnIsUnselected);
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
				grid.loadGridData(strUrl, me.up('accountSelectionPopup').updateLoadSelection, grid, false);
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
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
					
			},

			updateSelection : function(grid, responseData, args) {
				var me = this;
				if (args.ownerCt.isAllSelected == "Y") 
				{
					var selectedArray = responseData.d.filter;
					for ( var i = 0; i < selectedArray.length; i++) {
						selectedr.push(selectedArray[i].value);
					}
				} else {
					if(grid.featureType == 'IA')
						{
							selectedr = new Array();
							var options_arr;
							if(Ext.isEmpty($('#selectedIntraDayAccnts').val()))
							{
								options_arr = responseData.d.selectedValues;
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount].value);
								}
							}
							else
							{
								options_arr = $('#selectedIntraDayAccnts').val().split(",");
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount]);
								}
							}
							
						}
						if(grid.featureType == 'PA')
						{
							selectedr = new Array();
							if(Ext.isEmpty($('#selectedPrevDayAccnts').val()))
							{
								options_arr = responseData.d.selectedValues;
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount].value);
								}
							}
							else
							{
								options_arr = $('#selectedPrevDayAccnts').val().split(",");
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount]);
								}
							}
							
						}
						if(grid.featureType == 'BA')
						{
							selectedr = new Array();
							if(Ext.isEmpty($('#selectedAccounts').val()))
							{
								options_arr = responseData.d.selectedValues;
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount].value);
								}
							}
							else
							{
								options_arr = $('#selectedAccounts').val().split(",");
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount]);
								}
							}
							
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
								if (!Ext.isEmpty(selectedr))
								{
									for(var j=0; j<selectedr.length;j++) {
									if(selectedr[j]===item.data.value){	
										isInSelectedr = true;			
										break;
									}
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
				if (args.ownerCt.isAllSelected == "Y") 
				{
					var selectedArray = responseData.d.filter;
					for ( var i = 0; i < selectedArray.length; i++) {
						selectedr.push(selectedArray[i].value);
					}
				} else {
						if(grid.featureType == 'IA')
						{
							selectedr = new Array();
							var options_arr;
							if(Ext.isEmpty($('#selectedIntraDayAccnts').val()))
							{
								options_arr = responseData.d.selectedValues;
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount].value);
								}
							}
							else
							{
								options_arr = $('#selectedIntraDayAccnts').val().split(",");
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount]);
								}
							}
							
						}
						if(grid.featureType == 'PA')
						{
							selectedr = new Array();
							if(Ext.isEmpty($('#selectedPrevDayAccnts').val()))
							{
								options_arr = responseData.d.selectedValues;
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount].value);
								}
							}
							else
							{
								options_arr = $('#selectedPrevDayAccnts').val().split(",");
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount]);
								}
							}
							
						}
						if(grid.featureType == 'BA')
						{
							selectedr = new Array();
							if(Ext.isEmpty($('#selectedAccounts').val()))
							{
								options_arr = responseData.d.selectedValues;
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount].value);
								}
							}
							else
							{
								options_arr = $('#selectedAccounts').val().split(",");
								for(var iCount=0;iCount<options_arr.length;iCount++)
								{
									selectedr.push(options_arr[iCount]);
								}
							}
							
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
								if (!Ext.isEmpty(selectedr))
								{
									for(var j=0; j<selectedr.length; j++) {
										if(selectedr[j]===item.data.value){	
											isInSelectedr = true;			
											break;
										}
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