Ext.define('GCP.view.PackageGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	cls : 'xn-panel xn-no-rounded-border',
	xtype:'packageGridView',
	initComponent : function() {
	
		var me = this;
		this.title = me.title;
		var strUrl = 'services/approvalMatrixWorkflowDetailList.json';
		var colModel = me.getColumns();
		packageListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			padding : '5 0 0 0',
			itemId :'packageGrid',
			minHeight : 150,
			height : 150,
			showPager : false,
			columnModel : colModel,
			storeModel : {
				fields : ['packageName', 'axmName', 'identifier','customAxmCode','approverCount','packageId'],
				proxyUrl : strUrl,
				rootNode : 'd.accounts',
				totalRowsNode : 'd.__count'
			},
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
				},
				cellclick : function(view, td, cellIndex, record,
							tr, rowIndex, e, eOpts) {
					var IconLinkClicked = (e.target.tagName == 'A');	
					if(IconLinkClicked){
						var className = e.target.className;
						var btn = null;
						if(className=='button-icon icon-button-reject middleAlign cursor_pointer'){
							btn = 'delete';
							me.fireEvent('handlePackageRowIconClick', btn, record);
						}else if(className=='grid-row-action-icon icon-edit cursor_pointer'){
							btn = 'edit';
							me.fireEvent('handlePackageRowIconClick', btn, record);
						}else{
						 
						}
					}
				}
			},
			isRowIconVisible : me.isRowIconVisible
		});

		if (entryType != 'VIEW')
				{
					this.items = [{
						xtype : 'toolbar',
						cls : ' ux_panel-transparent-background xn-custom-toolbar',
						items : ['->',{
			xtype : 'button',
			border : 0,
			text : getLabel('addpackage',
					'Add  specific Approval Matrix for all accounts in a  Product Package'),
			cls : 'cursor_pointer button_underline',
			parent : this,
			padding : '4 0 1 0',
			itemId : 'btnCustomizePackage',
						handler : function() {
							 me.fireEvent('addPackageAssignmentPopup');
						}
		}]
					}, packageListView];
				}
				else
				{
					this.items = [packageListView];
				}
					
		this.callParent(arguments);
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [ {
					"colId" : "packageName",
					"colDesc" : "Package Name"
				}, {
					"colId" : "axmName",
					"colDesc" : "Approval Matrix"
				}];
		if (entryType != 'VIEW')
			arrCols.push(me.createActionColumn())
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

				cfgCol.width = 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);

			}
		}
		return arrCols;
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + "&$filter=" + encodeURIComponent(matrixId);
		strUrl = strUrl + "&$qParam=1";
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		packageGridRender=true;
		enableDisableGridButtons(false);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},

	createActionColumn : function() {

		var objActionCol = {
			colId : 'action',
			colHeader : 'Actions',
			width : 80,
			locked : true,
			sortable : false,
			fnColumnRenderer: function(value, metaData, record,
									rowIndex, colIndex, store){ 
				return '<a class="button-icon icon-button-reject middleAlign cursor_pointer" title="Delete"></a>'
				+' '+'<a class="grid-row-action-icon icon-edit cursor_pointer" title="Edit"></a>';
			}
		};
		return objActionCol;
	},

			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
					view, colId) {
				var strRetValue = "";
				if (colId === 'col_axmName') {
					if (!Ext.isEmpty(record.get('customAxmCode')) && record.get('customAxmCode') == 'MAKERCHECKER') {
						strRetValue = getLabel('makerchecker','Maker-Checker');
					}
					else
						strRetValue = value;
				}
				else
					strRetValue = value;
		
				return strRetValue;
			}
	
});
