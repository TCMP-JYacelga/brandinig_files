Ext.define('GCP.controller.FieldMappingController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.FieldMappingEditGrid','Ext.ux.gcp.AutoCompleter'],
	views : ['GCP.view.FieldMappingView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'fieldMappingView',
				selector : 'fieldMappingView'
			},			
	        {
				ref : 'fieldMappingEditGrid',
				selector : 'fieldMappingView fieldMappingEditGrid grid[itemId="fieldMappingEditGridId"]'
			},
			{
				ref : 'fieldInfoEditGrid',
				selector : 'fieldMappingView fieldMappingEditGrid panel[itemId="fieldMappingEditGridView"]'
			},
			{
				ref : 'fieldMappingBandDetails',
				selector : 'fieldMappingBandDetails'
			}				
			],
	config : {
		listURL : 'customInterface/FieldMappingList.srvc',
		mapBandDetails : null,
		fieldTypes : 'ALL',
		selectedRecordForEdit : null,
		rowEditrContext : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		
		$(document).on('openCustomerFieldEntryPopup', function(event, actionName) {
			if (pageMode != 'View')
			{
				showAddCFieldPopUp();
			}
		});	
		$(document).on('openFilterFieldsGrid', function(event, btn) {
			me.openFilterFieldsGrid(btn);
		});
		$(document).on('openFieldMappingGrid', function(event, btn) {
			me.openFieldMappingGrid(btn);
		});
		$(document).on('openBandDetailGrid', function(event, btn) {
			me.openBandDetailGrid(btn);
		});		
		
		
		GCP.getApplication().on(
		{
			updateInterfaceFieldMapping : function()
			{
				me.updateInterfaceFieldMappingList();
			},
			showCodeMapPopup : function(interfaceCode, interfaceField)
			{
				me.showCodeMapPopup(interfaceCode, interfaceField);
			},
			invokeDiscard : function(interfaceCode, interfaceField, recKey)
			{
				me.invokeDiscard(interfaceCode, interfaceField, recKey);
			}
		} );
		
	
		me.control({
			'fieldMappingView' : {
				render : this.loadUploadInterfaceBandDetailList,
				beforerender : function(panel, opts) {
				},
				afterrender : function(panel, opts) {
				},			
				openCustomerFieldEntryPopup : function(btn) {
					//Entry Popup for Customer fields.
					if (pageMode != 'View')
						showAddCFieldPopUp();
				}				
			},					
			'fieldMappingEditGrid' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'fieldMappingEditGrid smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				}
				//gridPageChange : me.handleLoadGridData,
				//gridSortChange : me.handleLoadGridData,
				//gridRowSelectionChange : function(grid, record, recordIndex,
				//		records, jsonData) {
							
				//}
			}		
	});
	},
	
	loadUploadInterfaceBandDetailList : function()
	{		
		var me = this;
		/*var lowerPanel = me.getFieldBandListPanelRef();
		var fieldMappingBandDtl = me.getFieldMappingBandDetails();
		if( !Ext.isEmpty(fieldMappingBandDtl) && !Ext.isEmpty(lowerPanel))
		{
			fieldMappingBandDtl.remove(lowerPanel);
		}*/
		var strUrl = 'getUploadInterfaceBandDetailList.srvc?$viewState='+strViewState
				+ '&interfaceMapMasterViewState=' +  interfaceMapMasterViewState 
				+'&$inlinecount=none'+'&$top=20'+'&$skip=1'+'&'+ csrfTokenName + '=' + csrfTokenValue;
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
				while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
			strUrl = strUrl.substring(0, strUrl.indexOf('?'));
		Ext.Ajax.request(
		{
			url : strUrl,
			method : "POST",
			params:objParam,
			success : function(response)
			{
				var data = Ext.decode( response.responseText);
				if(!Ext.isEmpty(data))
				{
					var lstBandInfo = data.d.bandInfo;
					selectedBand = 	lstBandInfo[0].bandName;				
				}
			},
			failure : function(response)
			{
				console.log( 'Error Occured' );
			}
		} );		
	},
	handleSmartGridConfig : function() 
	{
		var me = this;
		var fieldMapEditGrid = me.getFieldMappingEditGrid();		
		if (Ext.isEmpty(fieldMapEditGrid)) 
		{
			if (objDefaultGridViewPref)
				me.loadSmartGrid(objDefaultGridViewPref);
		} 
		else 
		{
			me.handleLoadGridData(grid, grid.store.dataUrl, grid.pageSize, 1,
					1, null);
		}
	},
	loadSmartGrid : function(data) 
	{
		var me = this;
		var objPref = null, pgSize = null;
		cellEditGrid = null;
		var arrItems;
		var url;
		if (selectedBand != null)
			var url = me.listURL+'?$bandName='+selectedBand+'&$fieldTypes='+me.fieldTypes;
		else
			var url = me.listURL+'?$fieldTypes='+me.fieldTypes;		
		
		var cellEditPlugin = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1,
					listeners: {
				  'beforeedit': function(edit, e) {
					if (edit.context.field === 'columnFormat') 
					{
						return me.columnFormatBeforeEdit(edit, e);							
					}			
					if (edit.context.field === 'decimalValue') 
					{
						if(e.record.get('dataType') != 'DECIMAL' || e.record.get('mappingType') == '6')			
							return false;
						else
							return true;			
					}
					if (edit.context.field === 'seqNmbr') 
					{
						if(e.record.get('mappingType')=='1' || e.record.get('mappingType')=='4' || e.record.get('mappingType')=='5' || 
								e.record.get('mappingType')=='6' || e.record.get('mappingType')=='8' || e.record.get('mappingType')=='9')			
							return false;
						else
							return true;			
					}
					if (edit.context.field === 'mandatoryDesc') 
					{
						if(e.record.get('mappingType')=='8' || e.record.get('fieldType')=='1' || e.record.get('fieldType')=='3')			
							return false;
						else
							return true;			
					}
					if (edit.context.field === 'defaultValue') 
					{
						if(e.record.get('fieldSource')=='DEFAULT')			
							return true;
						else
							return false;			
					}
				  }
				}

				});
				
	var mandateStore = new Ext.data.SimpleStore({
			  fields: [ "code", "description" ],
			  data: [
			  [ "NO", getLabel("NO", "NO" ) ],
			  [ "YES", getLabel("YES", "YES")]
			  ]
			});
	
	
	
					var filterParamStore = Ext.create('Ext.data.Store',{
											fields : ['name', 'value'],
											proxy : {
												type : 'ajax',
												url : 'services/customInterface/filterParamValues?viewState='+strViewState,
												reader : {
													type : 'json'
													//root : 'd.codeMapDtlSummary'
												},
												actionMethods : {
													create : "POST",
													read : "POST",
													update : "POST",
													destroy : "POST"
												}
											},
											autoLoad : true
										});
	
	var sourceData = 
			  { "FILE" : getLabel("FILE" , "File"),
			   "DEFAULT" : getLabel("DEFAULT" , "Default") ,
			   "IGNORE" : getLabel("IGNORE" , "Ignore"),
			   "CODEMAP" : getLabel("CODEMAP" , "Code Map"),
			   "FILTER_PARAM" : getLabel("FILTER_PARAM" , "Filter Param")};
	
	var sourceStore = new Ext.data.SimpleStore({
			  fields: [ "code", "description" ],
			  data: [
			  [ "FILE", getLabel("FILE" , "File") ],
			  [ "DEFAULT", getLabel("DEFAULT" , "Default") ],
			  [ "IGNORE", getLabel("IGNORE" , "Ignore") ],
			  [ "CODEMAP", getLabel("CODEMAP" , "Code Map") ],
			  [ "FILTER_PARAM", getLabel("FILTER_PARAM" , "Filter Param") ]
			  ]
			});
	
	
			var	arrCols = [
            
			me.createActionColumn(),
            {
                text     : getLabel("fieldname","Field Name"),
                width    : 280,
                sortable : false,                
                dataIndex: 'interfaceField',
				editor : {
					xtype : 'textfield',
					fieldCls : 'grid-field',
					disabled: true,
					itemId : 'interfaceFieldElm'
				},
				fnColumnRenderer: function(value, metaData, record, rowIndex)
				{
					
					value = value.replace(/\s/g,'');
					var interfaceCode=record.data.interfaceCode.replace(/\s/g,'');
					var bandtype=record.data.bandType.replace(/\s/g,'');
					var a="lbl.interface."+interfaceCode+"."+bandtype+"."+value;	
					value=getCustomInterfaceLabel(a,value);
					return value;
				}
            },
            {
                text     : getLabel("source","Source"),
                width    : 135,
                sortable : false,                
                dataIndex: 'fieldSource',
				editor: {
					xtype: 'combobox',
					editable : false,
					displayField : 'description',
					valueField : 'code',
					itemId : 'fieldSource',
					store: sourceStore,
					name : 'fieldSource',
					fieldCls : 'grid-field',
					lazyRender: true,
					listeners:{
						"change" : function(obj, newValue, oldValue){
							var selectedRecord = me.selectedRecordForEdit;
							var row = obj.up('grid').store.indexOf(selectedRecord);
							var colFieldNameValue = "";
							if("CODEMAP" == newValue){
								$('#codeMap_btnrowIndex_'+row).removeClass('hidden');
								me.getFieldMappingEditGrid().rowEditor.editor.doLayout();
							}
							else{
								$('#codeMap_btnrowIndex_'+row).addClass('hidden');
							}
							
							var columns = me.rowEditrContext.grid.columns, column, record;
							record = me.rowEditrContext.record;
							if("FILTER_PARAM" == newValue || "IGNORE" == newValue){
								for(i=0; i < columns.length; i++)
								{
									column = columns[i];
									if(column.dataIndex == 'seqNmbr'){
										column.getEditor().setValue('');
									}
								}
							}
							
								
								for(i=0; i < columns.length; i++)
								{
									column = columns[i];
									if(column.dataIndex == 'fieldIdRef'){
										if("FILTER_PARAM" == newValue)
										{
											column.getEditor().setDisabled(false);
										}
										else
										{
											column.getEditor().setDisabled(true);
										}
									}
									if(column.dataIndex == 'interfaceField')
									{
										colFieldNameValue = column.field.rawValue;
									}
									if(column.dataIndex == 'defaultValue'){
										if("DEFAULT" == newValue)
										{
											column.getEditor().setDisabled(false);
											if("Instrument Amount" === colFieldNameValue)
											{
												column.getEditor().setFieldStyle('text-align:right');
												column.getEditor().fieldCls = column.getEditor().fieldCls + "amountBox";
											}else{
												column.getEditor().setFieldStyle('text-align:left');
										}
											
										}
										else
										{
											column.getEditor().setValue('');
											//console.log(selectedRecord.data.defaultValue);
											selectedRecord.data.defaultValue = '';
											//console.log(selectedRecord.data.defaultValue);
											column.getEditor().setDisabled(true);
										}
									}
								}
							
						}
					}
				},
				fnColumnRenderer: function(value, metaData, record, rowIndex)
				{
					
					if(value != null)
						value = sourceData[value];
					metaData.tdAttr = 'data-qtip="' + value + '"';
					return value;
				}
            },
			{
                text     : getLabel("sequence","Sequence"),
                width    : 90,
                sortable : false,                
                dataIndex: 'seqNmbr',
                align : 'right',
				editor: {
						xtype: 'textfield',
						allowBlank: true,
						itemId : 'seqNmbr',
						name : 'seqNmbr',
						fieldCls : 'grid-field'
					},
				renderer: function(value, metaData)
				{
					metaData.style = "border: 1px gray solid;";
					return value;
				}
            },
            {
                text     : getLabel("maxSize","Max Size"),
                width    : 83,
                sortable : false,
				align : 'right',				
                dataIndex: 'length',
				editor : {
					xtype : 'textfield',
					fieldCls : 'grid-field',
					disabled: true,
					itemId : 'maxSizeElm'
				}
            },
            {
                text     : getLabel("mandatory","Mandatory"),
                width    : 93,
                sortable : false,                
                dataIndex: 'mandatoryDesc',
				editor: {
					xtype: 'combobox',
					editable : false,
					displayField : 'description',
					valueField : 'code',
					itemId : 'mandatoryDesc',
					store: mandateStore,
					name : 'mandatoryDesc',				
					lazyRender: true,
					fieldCls : 'grid-field',
					disabled: true
				},
				renderer: function(value, metaData, record, rowIndex)
				{
					metaData.style = "border: 1px gray solid;";
					/*
					 * Field Type : 
					 * 
					 * 0 : Non Mandatory Model Field which can be mandatory at Interface level or not
					 * 1 : Mandatory Model field
					 * 2 : Non Mandatory Custom field
					 * 3 : Custom field which is mandatory
					 * 
					 */
					if (record.get('fieldType')=='1' || record.get('fieldType')=='3' )
					{
						value = "YES";						
					}
					else if( record.get('mandatory') == 'Y')
					{
						if( record.get('mandatoryDesc') == 'YES' )
						{
							value = "YES";	
						}
						else if( record.get('mandatoryDesc') == 'NO' )
						{
							value = "NO";
						}
					}
					else if ( record.get('mandatory') == 'N')
					{
						if( record.get('mandatoryDesc') == 'YES' )
						{
							value = "YES";	
						}
						else if( record.get('mandatoryDesc') == 'NO' )
						{
							value = "NO";
						}
					}
					
					return value;
				}
            },
            {
                text     : getLabel("format","Format"),
                width    : 160,
                sortable : false,                
                dataIndex: 'columnFormat',
				align : 'right',
				editor: {
					xtype: 'combobox',
					editable : false,
					displayField : 'description',
					valueField : 'code',
					
					store: null,
						
					lazyRender: true,
					fieldCls : 'grid-field'
				},
				fnColumnRenderer: function(value, metaData)
				{
					metaData.tdAttr = 'data-qtip="' + value + '"';
					return value;
				}
            },
           	{
                text     : getLabel("defaultValue","Default Value"),
                width    : 160,
                sortable : false,                
                dataIndex: 'defaultValue',
                align : 'left',
				editor: {
						xtype: 'textfield',
						allowBlank: true,
						itemId : 'defaultValue',
						name : 'defaultValue',
						fieldCls : 'grid-field'
				},
				fnColumnRenderer: function(value, metaData, record)
				{
					if(record.data.interfaceField == "Instrument Amount"){
						metaData.align = 'right';
					}else{
						metaData.align = 'left';
					}
					metaData.tdAttr = 'data-qtip="' + value + '"';
					return value;
				}
            },
			{
                text     : getLabel("filterParameter","Filter Parameter"),
                width    : 160,
                sortable : false,                
                dataIndex: 'fieldIdRef',
                align : 'left',
				editor: {
					xtype: 'combobox',
					editable : false,
					displayField : 'value',
					valueField : 'value',
					store: filterParamStore,
					lazyRender: true,
					fieldCls : 'grid-field'
				},
				fnColumnRenderer: function(value, metaData)
				{
					metaData.tdAttr = 'data-qtip="' + value + '"';
					return value;
				}
            },
			
			me.createDiscardColumn()
        ];
		
		 
		 Ext.each(arrCols, function(cols){
			cols.colId = cols.dataIndex;
			cols.colHeader = cols.text;
		 });
		 
		 
		cellEditGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'fieldMappingEditGridId',
			itemId : 'fieldMappingEditGridId',				
			pageSize : 1, // Need to change based on Records Size
			showPager : false,
			height : 'auto',
			autoScroll: true,
			autoDestroy : true,
			stateful : false,										
			cls:'ux_largepadding t7-grid',
			padding : '4 0 0 0',
			columnModel : arrCols,
			hideRowNumbererColumn : true,
			showCheckBoxColumn : false,
			cfgEnableRowLevelActionComboStyling : false,
			enableColumnHeaderMenu : false,
			storeModel : {
					fields : ['interfaceCode', 'processCode', 'bandName','checkMapping','mappingType', 'interfaceField', 'sourceFieldName',
						'dataType', 'length','mandatory','mandatoryDesc','columnFormat','decimalValue','seqNmbr','size','bandMappingDesc',
						'relativeXpath','absoluteXpath1','displayPath','dynamicFlag','fieldType','bandType','recordKeyNo','fieldRemarks','defaultValue',
						'constantValue','translationFunctionName','resetBandName','bandNameRef','fieldIdRef','codeMapRef','identifier','__metadata','fieldSource'],
						proxyUrl : url,
						rootNode : 'd.fieldMapping'					
			},
			enableRowEditing : true,
			loadGridData : me.loadGridData,			
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				cellclick : function(gridView, td, cellIndex, record, tr,
						rowIndex, eventObj) {
					var IconLinkClicked = (eventObj.target.tagName.toLowerCase() == 'button');
					if(IconLinkClicked){
						var btnName = eventObj.target.name;
						
						if(btnName == 'btnAddCodeMap'){
						//	me.showCodeMapPopup(record);
						}
					} else {
					var targetObj = {};
					targetObj.name = eventObj.target.name;
					targetObj.itemId = eventObj.target.name;
					targetObj.action = eventObj.target.name;
					
					}
				}
			},
			doBeforeRecordEdit : function(record, editor, grid, context) {
				me.doBindEvents(context.grid);
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				strRetValue = value;
				meta.tdAttr = 'data-qtip="' + strRetValue + '"';
				return strRetValue;
			}
		});	
		var editGirdView = me.getFieldInfoEditGrid();
		editGirdView.add(cellEditGrid);
		
		me.getFieldMappingEditGrid().rowEditor.on('beforeEdit',function(rowEditing, context) {
			me.rowEditrContext = context;
			var columns = context.grid.columns, column, record;
			record = context.record;
			me.selectedRecordForEdit = record;
			this.completeEdit();
			for(i=0; i < columns.length; i++)
			{
				column = columns[i];
				if(column.dataIndex == 'columnFormat'){
						if (record.data.dataType == 'DATE' || record.data.dataType == 'DECIMAL' || record.data.dataType =='DATETIME'){
							column.getEditor().setDisabled(false);
							column.getEditor().bindStore(me.getFormatStore(record.data.dataType));
							//column.getEditor().store = me.getFormatStore(record.data.dataType);
						}
						else{
							column.getEditor().setDisabled(true);
						}
				}
				if(column.dataIndex == 'defaultValue'){
						if (record.data.fieldSource == 'DEFAULT'){
							column.getEditor().setDisabled(false);
						}
						else{
							column.getEditor().setDisabled(true);
						}
				}
				if(column.dataIndex == 'fieldIdRef'){
						if (record.data.fieldSource == 'FILTER_PARAM'){
							column.getEditor().setDisabled(false);
						}
						else{
							column.getEditor().setDisabled(true);
						}
				}
					//column.getEditor().setValue(record.data.columnFormat);
			}
			
			});
		
		editGirdView.doLayout();
	},
	
	doBindEvents : function(grid, isDirty) {
		var me = this;
		var isFocused = false, lastField = null, editor = null;
		if (grid && grid.columns) {
			Ext.each(grid.columns, function(col) {
						editor = col && col.getEditor()
								? col.getEditor()
								: null;
						
						if (editor && editor.itemId !== 'displayType') {
							if (!isFocused) {
								isFocused = true;
								// editor.focus(true);
							}
							lastField = editor;
						}
						if (me.fieldValidationBinded !== true) {
							editor.on('blur', function(obj) {
										//me.validateField(obj);
									});
						}
					});
			lastField.on('blur', function(cmp) {
							
								grid.rowEditor.completeEdit();

							
						});
		}
	},
	createActionColumn : function( )
	{
		
		var objActionCol = {
			
			width : 108,
			colHeader: getLabel('actions', 'Actions'),
			text : getLabel('actions', 'Actions'),
			sortable : false,
			locked : true,
			lockable: false,
			hideable: false,
			visibleRowActionCount : 1,
			fnColumnRenderer: function(value, metaData, record, rowIndex)
			{
					
					var interfaceCode, interfaceField;
					interfaceCode = record.data.interfaceCode;
					interfaceField = record.data.interfaceField;
					interfaceCode = "'"+interfaceCode+"'";
					interfaceField = "'"+interfaceField+"'";
					if(record.data.fieldSource == 'CODEMAP'){
						strRetValue = '<button type=button name=btnAddCodeMap id=codeMap_btnrowIndex_'+rowIndex+' class="ft-button ft-button-dark"  autocomplete=off onclick="invokeShowCodeMap('+interfaceCode+','+interfaceField+')">'+getLabel("CODEMAP" , "Code Map")+'</button>';
						
						return strRetValue;
					}
					else{
						strRetValue = '<button type="button" name="btnAddCodeMap" id="codeMap_btnrowIndex_'+rowIndex+'" class="ft-button ft-button-dark hidden"  autocomplete="off" onclick="invokeShowCodeMap('+interfaceCode+','+interfaceField+')">'+getLabel("CODEMAP" , "Code Map")+'</button>';
						
						return strRetValue;
					}
					
			}
	};
		return objActionCol;
	},
	
	createDiscardColumn : function( )
	{
		
		var objActionCol = {
			
			width : 108,
			colHeader: getLabel('discardField', 'Discard'),
			text : getLabel('discardField', 'Discard'),
			dataIndex : 'discardField',
			sortable : false,
			locked : true,
			lockable: false,
			hideable: false,
			visibleRowActionCount : 1,
			fnColumnRenderer: function(value, metaData, record, rowIndex)
			{
					
					var interfaceCode, interfaceField, reckey;
					interfaceCode = record.data.interfaceCode;
					interfaceField = record.data.interfaceField;
					interfaceCode = "'"+interfaceCode+"'";
					interfaceField = "'"+interfaceField+"'";
					reckey = record.data.recordKeyNo;
					interfaceRecKey = "'"+reckey+"'";
					if(record.data.bandType == 'CUSTOM'){
						strRetValue = '<button type=button name=btnDiscardField id=discard_btnrowIndex_'+rowIndex+' class="ft-button ft-button-dark"  autocomplete=off onclick="invokeDiscard('+interfaceCode+','+interfaceField+','+interfaceRecKey+')">Discard</button>';
						
						return strRetValue;
					}
					else{
						strRetValue = '<button type="button" name="btnDiscardField" id="discard_btnrowIndex_'+rowIndex+'" class="ft-button ft-button-dark hidden"  autocomplete="off" onclick="invokeDiscard('+interfaceCode+','+interfaceField+','+interfaceRecKey+')">Discard</button>';
						
						return strRetValue;
					}
					
			}
	};
		return objActionCol;
	},
	// Smart Grid code copied here : To load the data
	loadGridData : function(strUrl, ptFunction, args, isLoading) {
		var me = this;
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
				while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
			strUrl = strUrl.substring(0, strUrl.indexOf('?'));
		var blnLoad = true;
		if (!Ext.isEmpty(isLoading))
			blnLoad = false;
		me.setLoading(blnLoad);
		Ext.Ajax.request({
			url : strUrl,
			method : 'POST',
			params:objParam,
			success : function(response) {
				var decodedJson = Ext.decode(response.responseText);
				if(!Ext.isEmpty(mappingDetailJSON) && !Ext.Object.isEmpty(mappingDetailJSON))
				{
					Ext.each(decodedJson.d.fieldMapping, function(value, key) {
						var fieldName = value.interfaceField;
						if(mappingDetailJSON[fieldName]!=undefined)
						{
						value.seqNmbr = mappingDetailJSON[fieldName].seqNmbr;
						value.fieldSource = mappingDetailJSON[fieldName].fieldSource;
						value.mandatory = mappingDetailJSON[fieldName].mandatory;
						if(value.mandatory == 'Y'){
							value.mandatoryDesc = 'YES';
						}
						value.defaultValue = mappingDetailJSON[fieldName].defaultValue;
						value.columnFormat = mappingDetailJSON[fieldName].columnFormat;
						}
					});
				}
				me.store.loadRawData(decodedJson);
				if (!Ext.isEmpty(ptFunction) && typeof ptFunction == 'function') {
					ptFunction(me, decodedJson, args);
				}
				me.setLoading(false);
			},
			failure : function() {
				me.setLoading(false);
				Ext.MessageBox.show({
							title : getLabel('errorPopUpTitle', 'Error'),
							msg : getLabel('errorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
	},	
	showCodeMapPopup : function(interfaceCode, interfaceField ){
		var codeMapPopup = Ext.create('GCP.view.CodeMapPopup',{
					itemId : 'paymentCategoryLimitPopup',
					title : getLabel('CodeMapDetails','Code Map Details'),
					colName : getLabel('inputValue','Input Value'),
					modelName : interfaceCode,
					fieldName : interfaceField
					
				});
				codeMapPopup.show();
				codeMapPopup.center();
	},
	invokeDiscard : function(interfaceCode, interfaceField, interfaceFieldRec){
		$( '.disabled' ).removeAttr( "disabled" );
		var frm = document.getElementById( 'frmMain' );
		frm.elements[ "custBandName" ].value = selectedBand;
		frm.action = "discardFileMappingCustomField.srvc" + '?viewState=' + encodeURIComponent( $('#viewState').val() ) 
			+ '&interfaceMapMasterViewState=' + encodeURIComponent( $('#interfaceMapMasterViewState').val() )
			+ '&fieldMappingViewState= ' + ''
			+ '&interfaceRecordKey='+interfaceFieldRec
			+ '&' + csrfTokenName + '='
			+ csrfTokenValue;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	},
	showAttachPath : function(record, rowIndex)
	{
		var me = this;
		var url = 'showXMLTreeView.popup';
		var frm = document.getElementById("frmMain");
		if (formatType === FormatType.XML) 
			url = 'showXMLTreeView.popup';
		else if (formatType === FormatType.SWIFT) 
			url = 'showSwiftTreeView.popup';
		else if (formatType === FormatType.FEDWIRE) 
			url = 'showFedFileTreeView.popup';
		else if (formatType === FormatType.BIGBATCH) 
			url = 'showBatchWireFileTreeView.popup';
		else if (formatType === 'Database')
		{
			url = 'showColumnList_first.popup';
		}
		/*if (formatType === FormatType.XML)
		{
			record.set('absoluteXpath1', record.get('displayPath'));
			record.set('relativeXpath', '');
		}			
		else 
		{
			if(record.get('mappingType')=='1' || record.get('mappingType')=='4' || record.get('mappingType')=='5' || 
					record.get('mappingType')=='6' || record.get('mappingType')=='8' || record.get('mappingType')=='9')
			{
				record.set('absoluteXpath1', record.get('displayPath'));
				record.set('relativeXpath', '');
			}				
			else
			{
				record.set('relativeXpath', record.get('displayPath'));
			}				
		}*/
			
		var strUrl = url + '?' + csrfTokenName + "="	+ csrfTokenValue;
		recordRef = record;
		var bandAbolutePath = "";
		if (!Ext.isEmpty(me.mapBandDetails) && !Ext.isEmpty(me.mapBandDetails.get(record.get('bandName'))))
			bandAbolutePath = me.mapBandDetails.get(record.get('bandName'));
			
		document.getElementById('txtMapPathComponent').value = 'displayPath';
		document.getElementById('txtPathComponent').value = "";
		document.getElementById('txtSequenceNumberComponent').value = "";
		document.getElementById('txtMapBandPath').value = bandAbolutePath;		
		document.getElementById('txtPathEntered1').value = record.get('absoluteXpath1');
		document.getElementById('mappedDatatype').value = record.get('dataType');
		
		document.getElementById('relativeComponent').value = 'relativeXpath';
		if( !Ext.isEmpty(record.get('relativeXpath')))
			document.getElementById('relativexpathmapping').value = record.get('relativeXpath');
		
		frm.action = strUrl;
		frm.target = "hWinSeek";
		frm.method = "POST";
		var strAttr;
		var intTop  = (screen.availHeight - 300)/2;
		var intLeft = (screen.availWidth - 600)/2;
		strAttr = "dependent=yes,scrollbars=yes,";
		strAttr = strAttr + "left=" + intLeft + ",";
		strAttr = strAttr + "top=" + intTop + ",";
		strAttr = strAttr + "width=600,height=400,resizable=1";
		window.open ("", "hWinSeek", strAttr);
		frm.submit();
		frm.target = "";	
	
	},
	createFormField : function(element, type, name, value)
	{
		var inputField;
		inputField = document.createElement( element );
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	updateInterfaceFieldMappingList : function()
	{
		var me = this;		
		var form = document.forms["frmMain"];
		var grid = this.getFieldMappingEditGrid();
		var isCheckedRemoved = false;
		if (!Ext.isEmpty(grid)) 
		{
			var mandatoryVal = 'N';
			var records = grid.store.data.items;
			var t0 = new Date().getTime();
			for (var index = 0; index < records.length; index++) 
			{
					if( null != records[index].data.mandatoryDesc )
					{
						if( "YES" == records[index].data.mandatoryDesc )
						{
							mandatoryVal = 'Y';							
						}
						else if( "NO" == records[index].data.mandatoryDesc)
						{
							mandatoryVal = 'N';														
						}							
					}
				
				
				
				// For Database
				if(formatType == 'Database'){
					if(null != records[ index ].data.absoluteXpath1 && '' != records[ index ].data.absoluteXpath1){
						records[ index ].data.seqNmbr = index +1;
					}
					else{
						records[ index ].data.seqNmbr = null;
					}
				}
				
				form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].mandatory', mandatoryVal));
				createFormFields(index,records,form);			
						
			}
			
			
		}
	},
		
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) 
	{
		var me = this;		
		var strUrl = url;
		fieldMappingGridRef = me.getFieldMappingEditGrid();	
//		strUrl = strUrl + '?$viewState='+encodeURIComponent(viewState)+'&$bandName='+bandName+'&$fieldTypes='+me.fieldTypes+'&'+csrfTokenName+'='+csrfTokenValue;
		strUrl = url + '&$viewState='+strViewState
				+ '&interfaceMapMasterViewState=' +  interfaceMapMasterViewState 
				+'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl);
		

	},
	/*setBandName : function(grid, data, args)
	{
		var me = this;
		if(!Ext.isEmpty(data) && !Ext.isEmpty(data.d) && !Ext.isEmpty(data.d.fieldMapping))
			selectedBand = data.d.fieldMapping[0].bandName
	},*/
	openBandDetailGrid : function(btn)
	{
		var me = this;
		var fieldMappingGrid = me.getFieldMappingEditGrid();
		var strUrl = me.listURL;
		if(!Ext.isEmpty(btn.name) && !Ext.isEmpty(fieldMappingGrid))
		{
			selectedBand = btn.name;
			me.loadFieldMappDynamicFieldItem();
			strUrl = strUrl + '?$viewState='+encodeURIComponent(strViewState)
					+ '&interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
					+'&$bandName='+selectedBand+'&$fieldTypes='+me.fieldTypes+'&'+csrfTokenName+'='+csrfTokenValue;
			fieldMappingGrid.loadGridData(strUrl, null);
		}
		
		/*me.getFieldBandListPanelRef().items.each(function(item) 
		{
			item.removeCls('xn-custom-heighlight');
			item.addCls('xn-account-filter-btnmenu');
		});
		btn.addCls('xn-custom-heighlight xn-account-filter-btnmenu');*/
	},
	openFilterFieldsGrid : function(btn)
	{
		var me = this;
		var strUrl = me.listURL + '?$bandName='+selectedBand+'&$fieldTypes='+btn.name;
		var editGrid = me.getFieldMappingEditGrid();
		editGrid.destroy(true);
		if (objDefaultGridViewPref)
			me.loadFieldsGrid(objDefaultGridViewPref, strUrl);
			
		/*me.getFieldMappingInfoToolBar().items.each(function(item) 
		{
			item.removeCls('xn-custom-heighlight');
			item.addCls('xn-account-filter-btnmenu');
			if (item.code ==='view')
				item.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
		});
		
		me.getFieldMappingFieldsToolBar().items.each(function(item) 
		{
			item.removeCls('xn-custom-heighlight');
			item.addCls('xn-account-filter-btnmenu');
		});
		if (!btn.code)
			btn.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
		
		me.getFieldMappingCreateItemPanel().hide();*/		
	},
	openFieldMappingGrid : function(btn)
	{
		var me = this;		
		/*me.getFieldMappingInfoToolBar().items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
				});
		
		me.getFieldMappingFieldsToolBar().items.each(function(item) 
				{
					item.removeCls('xn-custom-heighlight');
				});
		if (!btn.code)
			btn.addCls('xn-custom-heighlight xn-account-filter-btnmenu');	*/
		var editGrid = me.getFieldMappingEditGrid();
		editGrid.destroy(true);
		me.handleSmartGridConfig();
		
		//me.getFieldMappingCreateItemPanel().show();
	},
	getFormatStore : function(dataType){
		var optionsValue = null;
		if(dataType==='DATE')
		{
			optionsValue = arrDateFormat;
		}
		else if(dataType==='DATETIME')
		{
			optionsValue = arrDateTimeFormats;
		}
		else if(dataType==='DECIMAL')
		{
			optionsValue = arrDecimalFormats;
		}
	
		objStore = Ext.create('Ext.data.Store', {
					fields : ['code', 'description'],
					autoLoad : true,
					data : optionsValue && optionsValue.length > 0
							? optionsValue
							: []
					});
		return objStore;
	}
});

function setCheckBoxValue(rowIndex, checkbox)
{
     if(checkbox.checked == true)     
		fieldMappingGridRef.store.data.items[rowIndex].data.checkMapping = "Y";
     else
        fieldMappingGridRef.store.data.items[rowIndex].data.checkMapping = "N";
}

function callUpdateInterfaceFieldMapping()
{
	GCP.getApplication().fireEvent('updateInterfaceFieldMapping');	
}

function invokeShowCodeMap(interfaceCode, interfaceField)
{
	GCP.getApplication().fireEvent('showCodeMapPopup', interfaceCode, interfaceField);
}

function invokeDiscard(interfaceCode, interfaceField, reckey)
{
	GCP.getApplication().fireEvent('invokeDiscard', interfaceCode, interfaceField, reckey);
}
function createFormFields(index,records,form)
{
	var me = this;
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].interfaceCode', records[index].data.interfaceCode));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].processCode', records[index].data.processCode));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].checkMapping', "Y"));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].bandName', records[index].data.bandName));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].bandType', records[index].data.bandType));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].recordKeyNo', records[index].data.recordKeyNo));// This should pass in encrypted format(in veiw state)
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].interfaceField', records[index].data.interfaceField));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].mappingType', records[index].data.mappingType));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].columnFormat', records[index].data.columnFormat));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].decimalValue', records[index].data.decimalValue));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].seqNmbr', records[index].data.seqNmbr));
	if( "Y" == records[index].data.checkMapping && ("" == records[index].data.size || null == records[index].data.size ) )
	{
		records[index].data.size = records[index].data.length;
	}
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].size', records[index].data.length));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].dataType', records[index].data.dataType));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].length', records[index].data.length));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].absoluteXpath1', records[index].data.absoluteXpath1));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].relativeXpath', records[index].data.relativeXpath));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].displayPath', records[index].data.displayPath));
	//Setting Additional Advance Mapping Fields
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].fieldRemarks', records[index].data.fieldRemarks));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].defaultValue', records[index].data.defaultValue));
	//form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].constantValue', records[index].data.constantValue));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].translationFunctionName', records[index].data.translationFunctionName));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].resetBandName', records[index].data.resetBandName));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].bandNameRef', records[index].data.bandNameRef));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].fieldIdRef', records[index].data.fieldIdRef));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].codeMapRef', records[index].data.codeMapRef));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].fieldType', records[index].raw.fieldType));
	form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].fieldSource', records[index].data.fieldSource));
}