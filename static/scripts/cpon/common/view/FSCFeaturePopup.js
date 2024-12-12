var fieldJson = [];
Ext.define('GCP.view.FSCFeaturePopup', {
	extend: 'Ext.window.Window',
	xtype: 'fscFeaturePopup',
	width : 735,
	minHeight : 156,
	maxHeight : 550,
	cls : 'non-xn-popup',
	resizable : false,
	draggable : false,
	title: getLabel('lblFscOptions','SCF Options'),
	layout: 'fit',
	overflowY: 'auto',
	config: {
		layout: 'fit',
		modal : true,
		draggable : false,
		autoScroll : true,
		closeAction : 'hide',
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null,
		isAllSelected : null
	},
	listeners:{
	 resize : function(){
		this.center(); 
	 },
	 show:function(){
	    this.showCheckedSection();
	//this.render();
    }
	},
	loadFeaturs: function() {
	
		return featureData;
	},
	setBRFilterOptions: function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'SO','FSCFPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.isAssigned = feature.isAssigned;
			obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			if (feature.readOnly == true)
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
	setBRExportOptions : function(){
	var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'E','FSCFPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
			obj.featureId = feature.value;
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.33;
			obj.isAssigned = feature.isAssigned;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			if (feature.readOnly == true)
				obj.disabled = true;
			else
				obj.disabled = false;
			featureItems.push(obj);
			fieldJson.push(obj);
		});
		return featureItems;
	},
	setDaysTextField : function(feature){
		var panel = Ext.create('Ext.panel.Panel', {
			columnWidth:1,
			layout:'column'
		});
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.xtype = 'textfield';
			obj.featureId = feature.value;
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			//obj.columnWidth= 0.2;
			obj.width=40;
			obj.isAssigned = feature.isAssigned;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.value = feature.featureValue;
			}
			if (feature.readOnly == true)
				obj.disabled = true;
			else
				obj.disabled = false;
			obj.maxLength='3';
			obj.enforceMaxLength = true;
			panel.insert(0,obj);
			panel.insert(1,{xtype: 'label',cls : 'ux_font-size14-normal label-font-normal',columnWidth:0.3,text: getLabel('days','Days'),padding:'4 0 0 3',itemId:obj.featureId+'Label'});
		return panel;
	},
	setFilterRestrictionsOptions : function(featureId,featureType,featureSubsetCode){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,featureType,featureSubsetCode);
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
			obj.featureId = feature.value;
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.33;
			
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			count++;
			if(count % 3 == 1)
			{
				obj.cls= 'clearLeft';
			}
			if (feature.readOnly == true)
				obj.disabled = true;
			else
				obj.disabled = false;
			//obj.fieldStyle = 'height:25px !important';
			fieldJson.push(obj);
			if(obj.featureId == featureId){
				featureItems.push(self.setDaysTextField(feature));
			}
		});
		return featureItems;
	},
	setBRViewOptions : function(){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'O','FSCFPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
			obj.featureId = feature.value;
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.33;
			obj.id = obj.featureId;
			obj.isAssigned = feature.isAssigned;
			if (feature.readOnly == true)
				obj.disabled = true;
			else
				obj.disabled = false;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			if(obj.featureId == 'FSCFILRST'){
				
			}
			 else
				featureItems.push(obj);
				fieldJson.push(obj);
		});
		return featureItems;
	},
	comboBoxHandler : function(){
		/*var BRGRIV = Ext.getCmp('GR');
		var BRWIDV = Ext.getCmp('WGT');
		if(BRWIDV.getValue() == false && BRGRIV.getValue() == false)
		{
			BRWIDV.checked = true;
		}
		
		if(BRWIDV.getValue() == true && BRGRIV.getValue() == false)
		{
			BRWIDV.setDisabled(true);
		}
		else if(BRGRIV.getValue() == true && BRWIDV.getValue() == false)
		{
			BRGRIV.setDisabled(true);
		}
		else
		{
			BRWIDV.setDisabled(false);
			BRGRIV.setDisabled(false);
		}
		
		
		var element = Ext.getCmp('DFL');
		if(BRWIDV.getValue() && BRGRIV.getValue()){
			element.setDisabled(false);
			if(element.getValue() == null || element.getValue() == '')
			{
				element.setValue('BRWIDV');
			}
		}
		else{
			element.setDisabled(true);
			element.setValue('');
		}*/
	},
	
	

	radioButtonClickHandler : function(defaultOption,customOption,textAreaElm){
		var txtArea = Ext.getCmp(textAreaElm);
		var IRDFDISCLM = Ext.getCmp(defaultOption);
		var IRCSDISCLM = Ext.getCmp(customOption);
		if(undefined != IRDFDISCLM && IRDFDISCLM.getValue()){
			txtArea.setDisabled(true);
		}
		if(undefined != IRCSDISCLM && IRCSDISCLM.getValue()){
			txtArea.setDisabled(false);
		}
	},

	filterFeatures: function(data,featureType,subsetCode) {
	
	   var allFeatures = new Ext.util.MixedCollection();
	   allFeatures.addAll(data);
	   var featureFilter = new Ext.util.Filter({
			filterFn: function(item) {
				return item.featureSubsetCode == subsetCode && item.featureType == featureType;
			}
		});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},
	filterFeature: function(data,featureId) {
	   var allFeatures = new Ext.util.MixedCollection();
	   allFeatures.addAll(data);
	   var featureFilter = new Ext.util.Filter({
			filterFn: function(item) {
				return item.value == featureId;
			}
		});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},
	initComponent: function() {
	    var thisClass = this;
	    var strUrl = 'cpon/clientServiceSetup/cponPermissionFeatures';
		var colModel = thisClass.getColumns();
		
		featureGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							xtype : 'fscFeatureViewGrid',
							itemId : 'fscFeatureViewGrid',
							showPager : false,
							showAllRecords : true,
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							//padding : '5 0 0 0',
							minHeight : 10,
							cls : 't7-grid',
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
								gridPageChange : thisClass.handleLoadGridDataForSort,
								gridSortChange : thisClass.handleLoadGridDataForSort,
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
										//columnWidth : 0.20,
										featureId: 2,
										fieldLabel: getLabel(' ',' '),
										labelSeparator:' ',
										labelAlign : 'top',
										layout:'column',
										width: '100%',
										vertical: true,
										items: thisClass.setBRViewOptions()
									}]
				       		   }, {
				       			    xtype : 'panel',
				       			    cls : 'ft-padding-bottom',
				       			    items: [{
				       			    	xtype: 'checkboxgroup',
										itemId : 'BRFilterOptions',
										//columnWidth : 0.20,
										fieldLabel: getLabel('options','Options'),
										labelCls :'ux_font-size14',
										labelAlign : 'top',
										width: '100%',
										vertical: true,
										layout:'column',
										items: thisClass.setBRFilterOptions()
				       			    }]
								}, {
									xtype : 'panel',
									cls : 'ft-padding-bottom',
									items : [{
										xtype: 'checkboxgroup',
										featureId: 2,
										//columnWidth : 0.20,
										fieldLabel: getLabel('export','Export'),
										labelCls :'ux_font-size14',
										labelAlign : 'top',
										width: '100%',
										layout:'column',
										vertical: true,
										items: thisClass.setBRExportOptions()		
									}]
								},
								{
									xtype : 'panel',
									cls : 'ft-padding-bottom',
									items : [{
										xtype: 'checkboxgroup',
										featureId: 2,
										fieldLabel: getLabel('filterrs','Filter Restrictions'),
										labelCls :'ux_font-size14',
										layout:'column',
										labelWidth : 105,
										width: '100%',
										vertical: true,
										items: thisClass.setFilterRestrictionsOptions('FSCFILRST','FR','FSCFPRM')
									}]
								}]},{
			    	xtype: 'panel',
			    	cls : 'ft-padding-bottom',
					/*title: getLabel('privileges','Privileges'),
					collapsible : true,
					width : '100%',
					cls : 'xn-ribbon ux_border-bottom',
					collapseFirst : true,*/
					items: [featureGrid]
					
			    }]
	    }];
	  
	  thisClass.bbar=(viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
						|| viewmode == "VERIFY") ?['->',{ 
			        	  text: getLabel('cancel','Cancel'),
			        	  handler : function(btn,opts) {
			        		thisClass.close();
			        				}
			          }]:[
			          { 
			        	  text: getLabel('cancel','Cancel'),
			        	  handler : function(btn,opts) {
			        		thisClass.close();
			        				}
			          },'->',
			          { 
				        	 text: getLabel('submit','Submit'),
				        	  handler : function(btn,opts) {
				        	  	thisClass.saveItems();
				        		thisClass.close();
				        				}
				      }
			        ];
		this.callParent(arguments);
		//this.showCheckedSection();
		/*this.radioButtonClickHandler('IRDFDISCLM','IRCSDISCLM','redemptionDisclaimTextArea');
		this.radioButtonClickHandler('LDFDISCLM','LCSDISCLM','drawdownDisclaimTxt');
		this.radioButtonClickHandler('IDFDISCLM','ICSDISCLM','investDisclaimTextArea');
		this.radioButtonClickHandler('LRDFDISCLM','LRCSDISCLM','repayDisclaimTextArea');*/
	/*	this.comboBoxHandler();*/
		if(viewmode == 'VIEW' || viewmode == 'SUBMIT'){
			this.disabledAllElement();
		}
		if(viewmode == 'MODIFIEDVIEW'){
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
				if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || viewmode == "VERIFY"){
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
					align : 'center',
					colHeader : getLabel('assigned', 'Assigned'),
					width : 70,
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
			createAssignedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAssigned',
					align : 'center',
					colHeader : getLabel('assigned', 'Assigned'),
					width : 70,
					items : [{
						itemId : 'isAssigned',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							var panel = tableView.up('window');
							var target = panel.getTargetEl();
							if(record.data.readOnly === false){		
								var arrXY = target.getScroll();
							if (record.data.isAssigned === false) {
								record.set("isAssigned", true);
								target.scrollTo('top',arrXY.top);
							} else {
								record.set("isAssigned", false);
								record.set("isAutoApproved", false);
								target.scrollTo('top',arrXY.top);
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
			createViewAutoApproveActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'isAutoApproved',
			colHeader : getLabel('autoapprove', 'Auto Approve'),
			width : 270,
			align : 'center',
			items : [{
				itemId : 'isAutoApproved',
				fnIconRenderer : function(value, metaData, record, rowIndex,
						colIndex, store, view) {
					if (!record.get('isEmpty')) {
						if (record.data.readOnly === true) {
							if (record.data.isAutoApproved === true) {
								var iconClsClass = 'icon-checkbox-checked-grey';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked-grey';
								return iconClsClass;
							}
						} else {
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
			createAutoApproveActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					align: 'center',
					colId : 'isAutoApproved',
					colHeader : getLabel('autoapprove', 'Auto Approve'),
					width : 270,
					items : [{
						itemId : 'isAutoApproved',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							var panel = tableView.up('window');
							var target = panel.getTargetEl();
							if(record.data.readOnly === false){
								var arrXY = target.getScroll();
							if (record.data.isAutoApproved === false) {
								record.set("isAutoApproved", true);
								record.set("isAssigned", true);
								target.scrollTo('top',arrXY.top);
							} else {
								record.set("isAutoApproved", false);
								target.scrollTo('top',arrXY.top);
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
				grid.loadGridData(strUrl);
			},
			handleLoadGridDataForSort : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this.up('fscFeaturePopup');
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
				grid.loadGridData(strUrl);
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
	disabledAllElement : function(){
		var me = this;
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
						var element = me.down('checkboxfield[featureId='+featureId+']');
						
							if(element != null && element != undefined){
							//element.boxLabelCls =element.boxLabelCls+" newFieldValue";
							element.setReadOnly(true);
						}
						else if(featureId == 'DFL'){
							var element = me.down('combo[featureId='+featureId+']');
							element.setDisabled(true);
						}
						else {
								var element = me.down('textfield[featureId='+featureId+']');
								if(element != null && element != undefined){
									element.setReadOnly(true);
								}
								else{
								   var element = me.down('textareafield[featureId='+featureId+']');
									if(element != null && element != undefined){
										element.setReadOnly(true);
									}
								}
						}
		});
	},
	showCheckedSection : function(){
		/*if (!this.isSectionChecked("ALTR")) {
			var transactionParametersSection = Ext.getCmp('transactionParametersSection');
			transactionParametersSection.hide();
		} else {
			var transactionParametersSection = Ext.getCmp('transactionParametersSection');
			transactionParametersSection.show();
		}*/
	},
	isSectionChecked : function(featureId){
		
		if(selectedEntryFeatures == undefined)
			return false;
		var result = $.grep(selectedEntryFeatures, function(e){ return e == featureId; });
		return (result.length > 0);
	},
	
	saveItems : function() {
				var me = this;
				var grid = me.down('grid[itemId=fscFeatureViewGrid]');
				var records = grid.store.data;
				Ext.each(fieldJson, function(field, index) {
						var featureId = field.featureId;
						var element = me.down('checkboxfield[featureId='+featureId+']');
						if(element != null && element != undefined){
							field.featureValue = element.getValue();
						}
						else {
								var element = me.down('textfield[featureId='+featureId+']');
								if(element != null && element != undefined){
									field.featureValue = element.getValue();
								}
						}
						
						
				});
				
				if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
					me.fnCallback(records, fieldJson);
					me.close();
				}

			}
});