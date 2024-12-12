Ext.define('GCP.view.POAcceptanceView', {
	extend : 'Ext.panel.Panel',
	xtype : 'pOAcceptanceView',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var strUrl = 'services/purchaseorderview/acceptanceDetails/('+viewState+')';
		var smartGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					hideRowNumbererColumn : true,
					cls : 't7-grid',
					padding : '0 10 0 10',
					minHeight : 0,
					showPager : true,
					pageSize : pageSize,
					columnModel : me.getColumns(),
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					enableColumnHeaderMenu : false,
					storeModel : {
						fields : ['poAcceptRefNumber','deductedAmount','acceptedAmount','remarks','displayState', 'identifier','viewState'],
						proxyUrl : strUrl,
						rootNode : 'd.acceptanceDetails',
						totalRowsNode : 'd.count'
					},
					listeners : {
						render : function(grid) {
							me.handleLoadGridData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {
						}
					}

				});
		me.items = [smartGrid];
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [{
					"colId" : "poAcceptRefNumber",
					"colDesc" : getLabel('reference', 'Reference'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "deductedAmount",
					"colDesc" : getLabel('deductedAmount', 'Deducted Amount'),
					"sortable" : false,
					"menuDisabled" : false,
					"colType" : 'number'
				}, {
					"colId" : "acceptedAmount",
					"colDesc" : getLabel('accAmount', 'Accepted Amount'),
					"sortable" : false,
					"menuDisabled" : false,
					"colType" : 'number'
				}, {
					"colId" : "remarks",
					"colDesc" : getLabel('remarks', 'Remarks'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "displayState",
					"colDesc" : getLabel('status', 'Status'),
					"sortable" : false,
					"menuDisabled" : false
				}];
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.menuDisabled = objCol.menuDisabled;
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
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		
		var strReturnValue = "";
		
		if(Ext.isEmpty(value)){
			return strReturnValue;
		}else if((colId === "col_deductedAmount" ||colId === "col_acceptedAmount") && !Ext.isEmpty(value)){
			return (currencyCode+" "+value);
		}else if((colId === 'col_poAcceptRefNumber') && !Ext.isEmpty(value)){
			return "<a href=\"#\" onclick=\"viewAcceptance('viewPOAccepFrmPO.form','frmMain','"+record.data.identifier +"');\"><u>"+value+"</u></a>";
		}else{
			return value;
		}
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$parentId='
				+ encodeURIComponent($('#viewState').val()) + '&$client=' +selectedClient;
		grid.loadGridData(strUrl, null, null, false);

	}
	
	
});