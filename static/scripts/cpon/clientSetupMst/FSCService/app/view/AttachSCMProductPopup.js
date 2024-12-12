var selectedArray = new Array();
var productCcyCode = null;
Ext.define('CPON.view.AttachSCMProductPopup', {
			extend : 'Ext.window.Window',
			xtype : 'attachPackagePopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 620,
			autoHeight : true,
			modal : true,
			draggable : true,
			closeAction : 'destroy',
			autoScroll : true,
			title : getLabel('addscmproduct','Add SCF Package'),
			config : {
				filterVal : null
			},
			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				
				packageFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text w14 xn-suggestion-box',
					itemId : 'packageFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					enableQueryParam:false,
					cfgSeekId : 'validSCMProductSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					cfgProxyMethodType : 'POST'
				});
				
				
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							padding : '5 0 0 0',
							minHeight : 150,
							pageSize : 5,
							columnModel : colModel,
							hideRowNumbererColumn : true,
							storeModel : {
								fields : ['productDescription','productCode','identifier','productCcyCode','financingServices'],
								proxyUrl : 'cpon/clientServiceSetup/getAllSCMProducts.json',
								rootNode : 'd.profile',
								totalRowsNode : 'd.__count'
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
				adminListView.on('cellclick', function(view, td, cellIndex, record,
						tr, rowIndex, e, eOpts) {	
						var ccyCode = record.data.productCcyCode;	
						if (td.className.match('x-grid-cell-col_defaultClientLimitCode')){
							var grid = adminListView;
							var col = grid.down('gridcolumn[itemId="'
										+ "col_defaultClientLimitCode" + '"]');
							if (col && col.getEditor()) {
									var store = (col.getEditor().store)
											? col.getEditor().store
											: null;
									if (store) {
									store.removeFilter();
									
										store.filter([
											{property: "featureType", value: ccyCode}
										]);
									}
								}	
						}	
				});						
				
				me.items = [{
					xtype : 'container',
					layout : 'hbox',
					items : [packageFilterfield,
						{
							xtype : 'button',
							itemId : 'btnSearchPackage',
							text : getLabel('search', 'Search'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							margin : '4 0 0 15',
							handler : function() {
								me.searchPackages();
							}
						}
					]
				},adminListView];
				
				me.buttons = [ {
							xtype : 'button',
							text :'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ getLabel('cancel', 'Cancel'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf056@fontawesome',
							handler : function() {
								me.close();
							}
				},
							{
							xtype : 'button',
							text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('submit', 'Submit'),
							itemId : 'btnSubmitPackage',
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf058@fontawesome',
							handler : function() {
								if(!Ext.isEmpty(adminListView.getSelectedRecords())){
									this.fireEvent("submitProducts",adminListView.getSelectedRecords(), selectedArray);
								}else{
									me.close();
								}
							}
						}];
				me.callParent(arguments);
			},
			
			searchPackages : function() {
					adminListView.refreshData();
				},
			
			addSelected : function(row, record, index , eopts){
				var allreadyPresent = false;
				var index;
				for(var i=0; i<selectedArray.length;i++) {
					if(selectedArray[i].data.productCode===record.data.productCode){	
						allreadyPresent = true;		
						index = i;	
						break;
					}
				}
				if(!allreadyPresent) {
					selectedArray.push(record);
					allreadyPresent = false;
				}else{
					selectedArray.splice(index, 1, selectedArray[i]);
				}

			},	
			
			removeDeselected : function(row, record, index , eopts){
				var index= -1;
				for(var i=0; i<selectedArray.length;i++) {
					if(selectedArray[i].data.productCode===record.data.productCode){	
						index = i;		
						break;
					}
				}
				if (index > -1) {
					selectedArray.splice(index, 1);
				}
			},	
					
			getColumns : function() {
				var me = this;
				var packageStore = Ext.create(
					'Ext.data.Store',
					{
						fields : ['package_name','package_id'],
						async : false,
						proxy : {
							type : 'ajax',
							url : 'cpon/clientServiceSetup/getPaymentPackages.json',
							actionMethods : {
								create : "POST",
								read : "POST",
								update : "POST",
								destroy : "POST"
							},
							reader : {
								type : 'json',
								root : 'd.profile'
							},
							extraParams:{
								id:encodeURIComponent(parentkey)
							},
							noCache:false
						},
						listeners: {
							load : function(){
								packageStore.insert(0,[{"package_name":"Select","package_id":null}]);
							}
						},
						autoLoad : true
					});
				var limitStore = Ext.create(
					'Ext.data.Store',
					{
						fields : ['name','value','featureType'],
						async : false,
						proxy : {
							type : 'ajax',
							url : 'cpon/clientServiceSetup/getLimitCodes.json',
							actionMethods : {
								create : "POST",
								read : "POST",
								update : "POST",
								destroy : "POST"
							},
							reader : {
								type : 'json'
							},
							extraParams:{
								id:encodeURIComponent(parentkey),
								profileId:fscFeatureProfileId							
							},
							noCache:false
						},
						listeners: {
							load : function(){
								limitStore.insert(0,[{"value":"Select","name":null}]);
								
									
							}
						},
						autoLoad : true
					});
					var defComboEditor = new Ext.form.field.ComboBox({
							store: packageStore,
							displayField: 'package_name',
							valueField: 'package_id',
							editable : false
							//valueNotFoundText : 'Select'
					});
					
					var limitComboEditor = new Ext.form.field.ComboBox({
							store: limitStore,
							displayField: 'value',
							valueField: 'name',
							editable : false
							//valueNotFoundText : 'Select'
					});
					
				
				arrColsPref = [{
							"colId" : "productDescription",
							"colDesc" : getLabel('scmProduct','SCF Package')
						},{
							"colId" : "defaultPaymentPackage",
							"colDesc" : getLabel('defaultPaymentPackage','Default Payment Method'),
							"editor": defComboEditor
						},{
							"colId" : "defaultClientLimitCode",
							"colDesc" : getLabel('defaultClientLimitCode','Default Client Limit Code'),
							"editor": limitComboEditor
						}];
						
						
						
				objWidthMap = {
					"productDescription" : 130,
					"defaultPaymentPackage" : 145,
					"defaultClientLimitCode" : 160
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
					productCcyCode = selectedArray[i].data.productCcyCode;
					if(record.data.productCode === selectedArray[i].data.productCode){
						 
						if(colId === "col_defaultPaymentPackage")
						{
							value = selectedArray[i].data.defaultPaymentPackage;
							var grid = adminListView;
							var col = grid.down('gridcolumn[itemId="'
										+ colId + '"]');
							var retValue = value;
							if (col && col.getEditor()) {
									var store = (col.getEditor().store)
											? col.getEditor().store
											: null;
									if (store) {
										var rec = store.findRecord('package_id',
												value);
										if (rec && !Ext.isEmpty(rec.data.package_name))
											retValue = rec.data.package_name;
									}
								}
							value = retValue;			
						}
						else if(colId === "col_defaultClientLimitCode"){
							value = selectedArray[i].data.defaultClientLimitCode;
							var grid = adminListView;
							var col = grid.down('gridcolumn[itemId="'
										+ colId + '"]');
							var retValue = value;
							if (col && col.getEditor()) {
									var store = (col.getEditor().store)
											? col.getEditor().store
											: null;
									if (store) {
										var rec = store.findRecord('value',
												value);
										if (rec && !Ext.isEmpty(rec.data.value))
										{
											var limCcy = rec.data.featureType;
											retValue = rec.data.value;
										}
										
									}
								}
							value = retValue;
						}	
										
					}	
				}
					strRetValue = value;
				return strRetValue;
			},
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&$filter=validFlag eq \'Y\'';
				if (!Ext.isEmpty(packageFilterfield.getValue()))
				{
					strUrl = strUrl + ' and productDescription lk \''+ packageFilterfield.getValue() +'\'';
				}
				grid.loadGridData(strUrl, me.up('attachPackagePopup').updateSelection, null, false);
			},
			
			handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&$filter=validFlag eq \'Y\'';
				if (!Ext.isEmpty(packageFilterfield.getValue()))
				{
					strUrl = strUrl + ' and productDescription lk \''+ packageFilterfield.getValue() +'\'';
				}
				grid.loadGridData(strUrl, me.updateSelection, null, false);
			},
			updateSelection : function(grid, responseData, args) {
				var me = this;
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
								for(var j=0; j<selectedArray.length;j++) {
									if(selectedArray[j].data.productCode===item.data.productCode){	
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
			}				
		});
