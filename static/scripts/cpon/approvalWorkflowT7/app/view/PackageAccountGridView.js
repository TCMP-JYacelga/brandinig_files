Ext.define('GCP.view.PackageAccountGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	cls : 'xn-panel xn-no-rounded-border',
	xtype:'pkgAccGridView',
	initComponent : function() {
	
		var me = this;
		this.title = me.title;
		var strUrl = 'services/approvalMatrixWorkflowDetailList.json';
		var colModel = me.getColumns();
		pkgAccListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			padding : '12 0 0 0',
			cls:'t7-grid',
			itemId :'pkgAccGrid',
			minHeight : 'auto',
			maxHeight : 220 ,
			showPager : false,
			columnModel : colModel,
			enableColumnAutoWidth : false,
			enableColumnHeaderMenu : false,
			handleMoreMenuItemClick : function(view, rowIndex, cellIndex, menu,
					eventObj, record) {
				var btn = null;
				if( menu.itemId =='btnDelete' ){
					btn = 'delete';
					me.fireEvent('handlePkgAccRowIconClick', btn, record);
				}else if( menu.itemId =='btnEdit' ){
					btn = 'edit';
					me.fireEvent('handlePkgAccRowIconClick', btn, record);
				}
			},			
			storeModel : {
				fields : ['packageName','accountNmbrDesc', 'accountName', 'axmName', 
				'identifier','customAxmCode','approverCount','accountNmbr','packageId','displayField'],
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
				boxready : function() {
					this.doLayout();	
				},
				cellclick : function(view, td, cellIndex, record,
												tr, rowIndex, e, eOpts) {/*
					var IconLinkClicked = (e.target.tagName == 'A');	
					if(IconLinkClicked){
						var className = e.target.className;
						var btn = null;
						if(className=='grid-row-action-icon icon-delete'){
							btn = 'delete';
							me.fireEvent('handlePkgAccRowIconClick', btn, record);
						}else if(className=='grid-row-action-icon icon-edit'){
							btn = 'edit';
							me.fireEvent('handlePkgAccRowIconClick', btn, record);
						}else{
						 
						}
					}
				*/}
			}

			/*isRowIconVisible : me.isRowIconVisible*/
		});
					
		if (entryType != 'VIEW')
				{
					this.items = [/*{
						xtype : 'toolbar',
						cls : ' ux_panel-transparent-background',
						items : ['->',{
			xtype : 'button',
			border : 0,
			text : getLabel('addpkgacc',
					'Add  specific Authorization Matrix for Product Package  & Account Combination'),
			cls : 'cursor_pointer',
			parent : this,
			padding : '4 0 1 0',
			itemId : 'btnCustomizePkgAcc',
						handler : function() {
							 me.fireEvent('addPkgAccAssignmentPopup');
						}
		}]
					},*/ pkgAccListView];
				}
				else
				{
					this.items = [pkgAccListView];
				}
					
		this.callParent(arguments);
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [{
					"colId" : "packageName",
					"colDesc" : getLabel('paymentpackagename','Payment Package Name'),
					"sortable" : false,
					"menuDisabled": false,
					"draggable" : false,
					"width": 400
				},{
					"colId" : "displayField",
					"colDesc" : getLabel('account','Account'),
					"sortable" : false,
					"menuDisabled": false,
					"draggable" : false,
					"width": 300
				}, {
					"colId" : "accountName",
					"colDesc" : getLabel('accountname', 'Account Name'),
					"sortable" : false,
					"menuDisabled": false,
					"draggable" : false,
					"width": 300
				}, {
					"colId" : "axmName",
					"colDesc" : getLabel('approvalmatrix', 'Approval Matrix'),
					"sortable" : false,
					"menuDisabled": false,
					"draggable" : false,
					"width": 300
				}];
		if (entryType != 'VIEW')
			arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.menuDisabled = objCol.menuDisabled;
				cfgCol.width = objCol.width;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				//cfgCol.width = 120;
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
		strUrl = strUrl + "&$qParam=2";
		grid.loadGridData(strUrl, me.postHandleLoadGridData, null, false, me);
	},
	
	postHandleLoadGridData : function() {
		var me = this;
		me.enableEntryButtons();
		$(document).trigger('gridDataLoaded', ['packageAccountGrid']);
	},
	
	enableEntryButtons : function() {
		packageAccountGridRender = true;
		disableGridButtons(false);
	},
	
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},

/*	createActionColumn : function() {

		var objActionCol = {
			colId : 'action',
			colHeader : 'Actions',
			width : 80,
			locked : true,
			sortable : false,
			fnColumnRenderer: function(value, metaData, record,
									rowIndex, colIndex, store){ 
				return '<a class="grid-row-action-icon icon-delete" title="Delete"></a>'
				+' '+'<a class="grid-row-action-icon icon-edit" title="Edit"></a>';
			}
		};
		return objActionCol;
	},*/
	
	createActionColumn : function()
	{
			var objActionCol =
			{
				colType : 'actioncontent',
				colId : 'actioncontent',
				colHeader : getLabel('action', 'Actions'),
				visibleRowActionCount : 1,
				width : 108,
				locked : true,
				lockable : false,
				sortable : false,
				hideable : false,
				resizable : false,
				draggable : false,
				items :
				[
				 	{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit Record'),
						text : getLabel('editToolTip', 'Edit Record'),
						maskPosition : 2
					},				 
					{
						itemId : 'btnDelete',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('deleteToolTip', 'Delete Record'),
						text : getLabel('deleteToolTip', 'Delete Record'),
						maskPosition : 1
					}
				 ]
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
				
				meta.tdAttr = 'title="' + strRetValue + '"';
				return strRetValue;
			}
	
});