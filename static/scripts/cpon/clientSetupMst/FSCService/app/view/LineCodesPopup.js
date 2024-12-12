var selectedArray = new Array();
var productCcyCode = null;
Ext.define('CPON.view.LineCodesPopup', {
			extend : 'Ext.window.Window',
			xtype : 'lineCodesPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 550,
			minHeight : 156,
			maxHeight : 550,
			modal : true,
			resizable : false,
			draggable : false,
			cls : 'non-xn-popup',
			closeAction : 'hide',
			title : getLabel('lineCode','Line Code'),
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null
			},
			listeners : {
						resize : function(){
							this.center();
						}
					},
			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							width : 'auto',
							cls : 't7-grid',
							height : 'auto',
							minHeight : 'auto',
							showPager : true,
							rowList : [5, 10, 15, 20, 25, 30],
							pageSize : 5,
							columnModel : colModel,
							itemId : 'lineGridId',
							hideRowNumbererColumn : true,
							checkBoxColumnWidth : _GridCheckBoxWidth,
							storeModel : {
								fields : ['name','value','readOnly','featureId','updated','featureSubsetCode','isAssigned','profileId'],
								proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
								rootNode : 'd.filter',
								totalRowsNode : 'd.count'
							},
							enableCellEditing:true,
							/*selType: 'cellmodel',
							plugins: [
								Ext.create('Ext.grid.plugin.CellEditing', {
									clicksToEdit: 1
								})
							],*/
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
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});	
				
				me.items = [adminListView];
				
				me.bbar =(viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
						|| viewmode == "VERIFY" || clientType == 'S')?['->',{
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							handler : function() {
								me.close();
							}
						}]: [ {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							handler : function() {
								me.close();
							}
				},'->',
							{
							xtype : 'button',
							text : getLabel('btnDone', 'Done'),//getLabel('submit', 'Submit'),
							//cls : 'company-id-xbtn-left',
							itemId : 'btnSubmitPackage',
							handler : function() {
								if(!Ext.isEmpty(adminListView.getSelectedRecords())){
									var isValid = me.validateLineItems(adminListView.getSelectedRecords(), selectedArray);
									if(!isValid)
									{
										me.close();
										return;
									}										
									
									var records = adminListView.getSelectedRecords();
									
									var grid = me.down('smartgrid[itemId=lineGridId]');
									var blnIsUnselected = records.length < grid.store
									.getTotalCount() ? true : false;
										
									if (!Ext.isEmpty(me.fnCallback)
											&& typeof me.fnCallback == 'function') {
										me.fnCallback(selectedArray,true);
										selectedr=[];
										me.close();
									}
								}else{
									popupLineItemsSelectedValue = 'Y';
									me.close();
								}
							}
						}];
				me.callParent(arguments);
			},
			
			validateLineItems : function(records, selectedArray)
			{
				var me = this;
				var showError = false;
				var errorMsg = null;
				for (var index = 0; index < records.length; index++) {
				
					if(Ext.isEmpty(records[index].data.value))
					{
						showError = true;
						errorMsg = "Selected records must have all values filled or select at least one record";
						break;
					}
					else
					{
						var regex = /^\d*(\.\d{0,2}){0,1}$/;
						if (!regex.test(records[index].data.value))
						{
							showError = true;
							errorMsg = "Line Amount is invalid for selected records";
							break;
						}
					}
			   }
				if(showError){
					Ext.Msg.alert("Error", errorMsg);
					return false;
				}
				return true;
			},
			
			handleBeforeSelect : function(me, record, index, eOpts) {
				if (record.data.readOnly === true)
					return false;
			},
			
			addSelected : function(row, record, index , eopts){
				var allreadyPresent = false;
				var index;
				for(var k=0; k<selectedArray.length;k++) {
					if(selectedArray[k].featureId===record.data.featureId){	
						allreadyPresent = true;		
						index = k;	
						break;
					}
				}
				if(!allreadyPresent) {
					selectedArray.push(record);
					allreadyPresent = false;
				}else{
					selectedArray.splice(index, 1);
				}
			},	
			
			removeDeselected : function(row, record, index , eopts){
				var index= -1;
				for(var o=0; o<selectedArray.length;o++) {
					if(selectedArray[o].data.featureId===record.data.featureId){	
						index = o;		
						break;
					}
				}
				if (index > -1) {
					selectedArray.splice(index, 1);
				}
			},	
					
			getColumns : function() {
				var me = this;
										
					var lineAmountEditor = new Ext.form.field.Number({
						value : "999999.99",
						enforceMaxLength : "true",
						maxLength : 16,
						disabled : (viewmode==("VIEW" || "MODIFIEDVIEW" || "VERIFY" ) || clientType == 'S') ? true : false
					});
					
				arrColsPref = [{
							"colId" : "name",
							"colDesc" : getLabel('limitCode','Line Code')
						},{
							"colId" : "featureSubsetCode",
							"colDesc" : getLabel('CCyCode','Currency')
							
						},{
							"colId" : "value",
							"colDesc" : getLabel('lineAmount','Line Amount'),
							"editor": lineAmountEditor
						}];
						
				objWidthMap = {
		"configurableFlag" : 100,
			"name" : 150,
			"featureSubsetCode" : 90,
			"value" : 230
		};
				
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.editor = objCol.editor;
						if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

						cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				return arrCols;
			},
		columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				for(var i=0; i< selectedArray.length; i++){
					
					if(record.data.featureId === selectedArray[i].data.featureId){
				
						if(colId === "col_value"){	
							if(selectedArray[i].data.value > 0)
								value = selectedArray[i].data.value;
						}				
					}	
				}
				
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
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var win = me.up('lineCodesPopup');
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				if (!Ext.isEmpty(win.profileId)) {
					var url = Ext.String.format(
							'&featureType={0}&module={1}&profileId={2}',
							win.featureType, win.module, win.profileId);
					strUrl = strUrl + url;
				} else {
					var url = Ext.String.format('&featureType={0}&module={1}',
							win.featureType, win.module);
					strUrl = strUrl + url;
				}
				if(pagemode == "VERIFY")
				{
					strUrl = strUrl+ '&assigned=Y';
				}
				
				grid.loadGridData(strUrl, me.up('lineCodesPopup').updateSelection, null, false);
			},
			
			handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
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
				
				
				grid.loadGridData(strUrl, me.updateSelection, null, false);
			},
			updateSelection : function(grid, responseData, args) {
				var me = this;

				var selectedRecords = new Array();
				if(grid.getSelectionModel().isLocked()){
							grid.getSelectionModel().setLocked(false);
						}
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;

						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
							
								var assignedList = responseData.d.selectedValues;
								for (var j = 0; j < assignedList.length; j++) {
									if (assignedList[j].featureId === item.data.featureId) {
										isInSelectedr = true;
										break;
									}
								}
								
								for (var j = 0; j < selectedArray.length; j++) {
									if (selectedArray[j].data.featureId === item.data.featureId) {
										
										item.data.value = selectedArray[j].data.value;
										isInSelectedr = true;
										break;
									}
								}

								if (isInSelectedr) {
									selectedRecords.push(item);
								}
							}
						}

						if (selectedRecords.length > 0) {
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
				if (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
						|| pagemode == "VERIFY"  || clientType == 'S') {
					grid.getSelectionModel().setLocked(true);
				}
			}				
		});
