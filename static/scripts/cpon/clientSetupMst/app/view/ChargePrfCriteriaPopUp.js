Ext.define('GCP.view.ChargePrfCriteriaPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'chargePrfCriteriaPopUp',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	width : 450,
	minHeight : 156,
	maxHeight : 550,
	cls : 'non-xn-popup',
	modal : true,
	draggable : false,
	resizable : false,
	layout : 'fit',
	closeAction : 'destroy',
	autoScroll : true,
	storeUrl : null,
	index : null,
	operator : null,
	listeners : {
		resize : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		this.title = 'Charge Units Criteria Values List';
		var strUrl = me.storeUrl;
		var colModel = me.getColumns();
		
		var submitButton = Ext.create('Ext.button.Button', {
				text : getLabel('submit', 'Submit'),
				itemId : 'btnSubmitPackage',
				//cls : 'ux_button-background-color ux_button-padding',
				handler : function() {
					var me = this.up('window') ; 
					if(!Ext.isEmpty(commssionAccGrid.getSelectedRecords())){
						  var desc = '';
						  var code = '';
						    for(var i =0; i < criteriaListValueDesc.length; i++){
							   	desc = desc + criteriaListValueDesc[i]  +  ',' ;
							 }
						    for(var i =0; i < comparisonValue.length; i++){
						    	code =   code + comparisonValue[i] +  ','  ;
							 }
						    desc = desc.slice(0,-1);
						    code = code.slice(0,-1);
				           document.getElementById('criteriaList[' + me.index
							+ '].comparisonValue').value = desc;
				           document.getElementById('criteriaList[' + me.index
									+ '].comparisonValueDesc').value = code;
						  me.close();
						 }
					    else{ me.close(); }
				}
		});
		
		var cancelButton = Ext.create('Ext.button.Button', {
			text : getLabel('cancel', 'Cancel'),
			//cls : 'ux_button-background-color ux_button-padding',
			handler : function() {
				me.close();
				
			}
		});
		
		if(pageMode != 'VIEW' || pageMode != 'MODIFIEDVIEW')
			this.bbar=[cancelButton,'->',submitButton];
		else
			this.bbar=['->',cancelButton];
		
		var isInoperator = false;
		
		if(me.operator === 'IN' )
		{
			isInoperator = true;
		}
		
		var commssionAccGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : false,
					itemId : 'criteriaGrid',
					cls : 't7-grid',
					scroll : 'vertical',
					minHeight : 40,
					maxHeight : 350,
					checkBoxColumnWidth : _GridCheckBoxWidth,
					hideRowNumbererColumn : true,
					pageSize : 5,
					showPager : true,
					columnModel : colModel,
					showCheckBoxColumn : true,
					storeModel : {
						fields : ['name', 'value','assigned'],
						proxyUrl : strUrl,
						rootNode : 'd.profiles',
						totalRowsNode : 'd.__count'
					},
					listeners : {
						render : function(grid) {
							me.handleLoadGridData(grid, strUrl, grid.pageSize,
									1, 1, null);
						},
						select : me.addSelected,
						deselect : me.removeDeselected,
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData, selectionFlag) {
							
						}
					},

					isRowIconVisible : me.isRowIconVisible,
					handleBeforeRowSelect : me.handleBeforeRowSelect
				});
		this.items = [commssionAccGrid];
		commssionAccGrid.on('cellclick', function(view, td, cellIndex, record,
						tr, rowIndex, e, eOpts) {
					var linkClicked = (e.target.tagName == 'SPAN');
					if(pageMode != 'VIEW' || pageMode != 'MODIFIEDVIEW')
					if (linkClicked) {
						var className = e.target.className;
						if (!Ext.isEmpty(className)
								&& className.indexOf('activitiesLink') !== -1) {
							me.saveData(record);
						}
					}
				});
		
		this.callParent(arguments);
		
	},
	
	handleBeforeRowSelect : function(grid, chkBox, record, index, eOpts) {
		var me = this.up('window') ;
		if(me.operator != 'IN' )
		{
			if(criteriaListValueDesc.length > 1)
				return false;
			
			if(criteriaListValueDesc.length == 1)
			{
			   if (!Ext.isEmpty(record))
				 if(criteriaListValueDesc[0] != record.data.value)
					return false;
			}
		}
	 return true;
		
	},
	saveData : function(record) {
		var me = this;
		var criteriaName = record.get('name');
		var criteriaValue = record.get('value');
		document.getElementById('criteriaList[' + me.index
				+ '].comparisonValueDesc').value = criteriaValue;
		document.getElementById('criteriaList[' + me.index
				+ '].comparisonValue').value = criteriaName;
		this.close();
	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [
					{
					"colId" : "value",
					"colDesc" : getLabel("chrgPrfCriteriaCode","Code"),
					width : 118
					},
					{
					"colId" : "name",
					"colDesc" : getLabel("chrgPrfCriteriaDescription","Descrption"),
					width : 240
					}];
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

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
			strRetValue = value;

		return strRetValue;
	},
	addSelected : function(row, record, index , eopts){
		var valueAllreadyPresent = false;
		for(var i=0; i<criteriaListValueDesc.length;i++) {
			if(criteriaListValueDesc[i]===record.data.value){	
				valueAllreadyPresent = true;			
				break;
			}
		}
		if(!valueAllreadyPresent) {
			criteriaListValueDesc.push(record.data.value);
			record.raw.assigned=true;
			valueAllreadyPresent = false;
		}
		
		var nameAllreadyPresent = false;
		for(var i=0; i<comparisonValue.length;i++) {
			if(comparisonValue[i]===record.data.name){	
				nameAllreadyPresent = true;			
				break;
			}
		}
		if(!nameAllreadyPresent) {
			comparisonValue.push(record.data.name);
			record.raw.assigned=true;
			nameAllreadyPresent = false;
		}
	},	
	
	removeDeselected : function(row, record, index , eopts){
		var index= -1;
		for(var i=0; i<criteriaListValueDesc.length;i++) {
			if(criteriaListValueDesc[i]===record.data.value){	
				index = i;		
				break;
			}
		}
		if (index > -1) {
			criteriaListValueDesc.splice(index, 1);
		}
		
		var index2= -1;	
		for(var i=0; i<comparisonValue.length;i++) {
			if(comparisonValue[i]===record.data.name){	
				index2 = i;		
				break;
			}
		}
		if (index2 > -1) {
			comparisonValue.splice(index2, 1);
		}
		
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		
		var me = this.up('window') ; 
		if(me == null)
		var me = this;
		
			if(pageMode === 'VIEW' || pageMode == 'MODIFIEDVIEW')
			{
				grid.getSelectionModel().setLocked(false);
			}
		
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$filter=' + sourceField;
		strUrl = strUrl + '&$index=' + me.index;
		strUrl = strUrl + '&$eventViewState=' + eventViewState;
		strUrl = strUrl + '&$viewState=' + prfViewState;
		strUrl = strUrl + '&$valueCodes=' + selectedValuesList;
		
		grid.loadGridData(strUrl, me.updateSelection, grid, false);
	},
	updateSelection : function(grid, responseData, args) {
		var me = this;
		
		if(null != selectedValuesList)
			var selectedItemsList = selectedValuesList;
			var codesArray = selectedItemsList.split(",");
			
			if (!Ext.isEmpty(grid)) {
				var store = grid.getStore();
				var records = store.data;
				if (!Ext.isEmpty(records)) {
					var items = records.items;
					var selectedRecords = new Array();
					if (!Ext.isEmpty(items)) {
							
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								
								for (var j = 0; j < codesArray.length; j++) {
									if(codesArray[j] === item.data.value)
										{
										   selectedRecords.push(item);
										}
								}
								
								for (var j = 0; j < criteriaListValueDesc.length; j++) {
								if(criteriaListValueDesc[j] === item.data.value)
									{
									    selectedRecords.push(item);
									}
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
			if(pageMode === 'VIEW' || pageMode == 'MODIFIEDVIEW')
			{
				grid.getSelectionModel().setLocked(true);
			}
	}
});
