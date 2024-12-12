var fieldJson = [];
Ext.define('GCP.view.TradeFeaturePopup', {
	extend: 'Ext.window.Window',
	xtype: 'tradeFeaturePopup',
	width : 735,
	minHeight : 156,
	maxHeight : 550,
	cls : 'non-xn-popup',
	resizable : false,
	title: getLabel('tradefeatures','Trade Features'),
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	layout: 'fit',
	overflowY : 'auto',
	config: {
		layout: 'fit',
		modal : true,
		draggable : false,
		closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null,
		isAllSelected : null
	},
	listeners : {
		resize : function(){
			this.center();
		},
		show : function() {
		
		}
	},
	loadFeatures : function() {
		return featureDataTrade;
	},
	
	comboBoxHandler : function() {
		var GRIV = Ext.getCmp('ID');
		var WIDV = Ext.getCmp('DGE');
		var element = Ext.getCmp('DFUL');
		if (element) {
			if (WIDV.getValue() && GRIV.getValue()) {
				element.setDisabled(false);
			} else {
				element.setDisabled(true);
			}
		}
	},
	filterFeatures : function(data, featureType, subsetCode) {
		var allFeatures = new Ext.util.MixedCollection();
		allFeatures.addAll(data);
		var featureFilter = new Ext.util.Filter({
					filterFn : function(item) {
						return  item.featureType == featureType;
					}
				});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},	

	setOptions: function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data,'O','');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			
			if(feature.readOnly == true)
			obj.disabled = true;
			else
			obj.disabled = false;
			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.33;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	
	initComponent: function() {
	    var thisClass = this;
		var strUrl = 'cpon/clientServiceSetup/cponPermissionFeatures';
		var colModel = thisClass.getColumns();
		
		featureGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							xtype : 'tradeFeatureViewGrid',
							itemId : 'tradeFeatureViewGrid',
							showPager : false,
							showAllRecords : true,
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							//padding : '5 0 0 0',
							cls : 't7-grid',
							minHeight : 10,
							autoWidth: true,
							
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
									thisClass.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : thisClass.handleLoadGridData,
								gridSortChange : thisClass.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							}
						});
	
	    thisClass.items = [{
	    	xtype: 'container',
			items: [{
					xtype: 'panel',
					items: [{	
								xtype : 'panel',
								cls : 'ft-padding-bottom',
								items : [{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('options','Options'),
									layout:'column',
									width: '100%',
									labelCls : 'ux_font-size14',
									labelAlign : 'top',
									vertical: true,
									items: thisClass.setOptions()
									//hidden : Ext.isEmpty(thisClass.setOptions()) ? true : false
								}]
							}
					] },{
			    	xtype: 'panel',
					/*title: getLabel('privileges','Privileges'),
					collapsible : true,
					cls : 'xn-ribbon',
					collapseFirst : true,*/
					items: [featureGrid]
					
			    }]
	    }];
	  
	  thisClass.bbar=[
			         '->',
			          { 
			        	  text:getLabel('btnClose','Close'),
			        	  handler : function(btn,opts) {
			        		thisClass.close();
			        				}
			          }
			        ];
	    this.callParent(arguments);
		this.comboBoxHandler();
	    if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
			this.setOldNewValueClass();
		}
	
	},
	getColumns : function() {
				arrColsPref = [{
							"colId" : "name",
							"colDesc" : getLabel('lblType','Type')
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = 270;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
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
			
			createViewAssignedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAssigned',
					colHeader : getLabel('assign','Assign'),		
					width : 270,
					align: 'center',
					items : [{
						itemId : 'isAssigned',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
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
					colHeader : getLabel('autoapprove','Auto Approve'),	
					width : 270,
					align: 'center',
					items : [{
						itemId : 'isAutoApproved',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if(record.data.readOnly === true){
									if (record.data.isAutoApproved === true) {
									var iconClsClass = 'icon-checkbox-checked-grey'; 
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked-grey';
									return iconClsClass;
								}
								}else{
								if (record.data.isAutoApproved === true) {
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
			createAssignedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAssigned',
					colHeader : getLabel('assign','Assign'),		
					width : 270,
					align: 'center',
					items : [{
						itemId : 'isAssigned',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							if(record.data.readOnly === false){	
							if (record.data.isAssigned === false) {
								record.set("isAssigned", true);
							} else {
								record.set("isAssigned", false);
							}}
						},
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
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
					colHeader : getLabel('autoapprove','Auto Approve'),	
					width : 270,
					align: 'center',
					items : [{
						itemId : 'isAutoApproved',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							if(record.data.readOnly === false){	
							if (record.data.isAutoApproved === false) {
								record.set("isAutoApproved", true);
							} else {
								record.set("isAutoApproved", false);
							}}
						},
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
									if(record.data.readOnly === true){
										if (record.data.isAutoApproved === true) {
									var iconClsClass = 'icon-checkbox-checked-grey';
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked-grey';
									return iconClsClass;
								}
								}else{
								if (record.data.isAutoApproved === true) {
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
			setOldNewValueClass : function(){
				var me = this;
				Ext.each(fieldJson, function(field, index) {
					var featureId = field.featureId;
								var element = me.down('checkboxfield[featureId='+featureId+']');
								
									if(element != null && element != undefined){
										element.setReadOnly(true);
										if(viewmode == 'MODIFIEDVIEW'){
											element.boxLabelCls = me.getOldNewValueClass(field)+ " "+element.boxLabelCls;
										}
								}
								else {
									
										var element = me.down('textareafield[featureId='+featureId+']');
										if(element != null && element != undefined){
											element.setReadOnly(true);
											if(viewmode == 'MODIFIEDVIEW'){
												element.fieldCls = me.getOldNewValueClass(field);
											}
										}
										else{
										
										   var element = me.down('textfield[featureId='+featureId+']');
											if(element != null && element != undefined){
												element.setReadOnly(true);
												if(viewmode == 'MODIFIEDVIEW'){
													element.fieldCls = me.getOldNewValueClass(field);
												}
											}
										}
								}
				});
			},
			getOldNewValueClass : function(feature){
				
				if(feature.profileFieldType == 'MODIFIED')
					return "modifiedFieldValue ";
				else if(feature.profileFieldType == 'NEW')
					return "newFieldValue ";
				else if(feature.profileFieldType == 'DELETED')
					return "deletedFieldValue "; 
			},
			showCheckedSection : function() {
			},	
			isSectionChecked : function(featureId) {

				if (selectedEntryFeatures == undefined)
					return false;
				var result = $.grep(selectedEntryFeatures, function(e) {
							return e == featureId;
						});
				return (result.length > 0);
			},
		
				updateCheckboxSelection:function(grid, responseData, args) {
				var me=this;
				if(!(strTradePrevililegesList instanceof Array)){
				strTradePrevililegesList=jQuery.parseJSON(strTradePrevililegesList);
				}
				
				if(!Ext.isEmpty(strTradePrevililegesList)){
				var previousSelectedData=strTradePrevililegesList;
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
				grid.loadGridData(strUrl, me.updateCheckboxSelection, grid, false);
			}
	
});