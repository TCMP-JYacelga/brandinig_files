Ext.define('GCP.view.RealTimeResGrid', {
	extend : 'Ext.panel.Panel',
	border : false,
	xtype : 'realTimeResGrid',
	requires : ['Ext.ux.gcp.SmartGrid'],
	autoHeight : true,
	cls : 'xn-panel xn-ribbon xn-no-rounded-border x-portlet ux-header-width',
	padding : '5 5 5 5',
	/*title : 'Transactions',
	collapsible: true,*/
	strDisplayMode : null,
	entryType : 'PAYMENT111',

	initComponent : function() {
		var me = this, grid = null, actionBar = null;
		if (typeof strEntryType != 'undefined'
				&& !Ext.isEmpty(strEntryType)
				&& (strEntryType === 'CHECK' || strEntryType === 'LOAN'))
			me.entryType = strEntryType;
		else
			me.entryType = 'LOAN';
		grid = me.createGrid();
		
		if (!Ext.isEmpty(me.strDisplayMode) && me.strDisplayMode === 'VIEW')
			me.items = [/*
						 * { xtype : 'container', items : [{ xtype : 'label',
						 * text : 'Transactions', cls : 'font_bold', padding :
						 * '5 0 0 3' }, grid] }
						 */];
		else
			me.items = [{
						xtype : 'container',
						cls: 'ux_panel-transparent-background',
						items : [/*
									 * { xtype : 'label', text : 'Transactions',
									 * cls : 'font_bold', padding : '5 0 0 3' },
									 */ grid]
					}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	createGrid : function() {
		var me = this;
		var grid = null, arrCols = null;
		var pgSize = (typeof serverTxnPageSize != 'undefined')? serverTxnPageSize : 10;
		arrCols = me.getColumns();
		
		grid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridInstrumentDetails',
			itemId : 'gridInstrumentDetails',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			showPager : false,
			padding : '0 0 0 0',
		//	rowList : [5, 10, 15, 20, 25, 30],
			minHeight : 100,
			maxHeight : 310 ,
			columnModel : arrCols,
			enableColumnAutoWidth : false,
			showCheckBoxColumn : false,
			enableColumnHeaderMenu : false,
			storeModel : {
				fields : ['requestReference', 'paymentType', 'invoiceNo',
						'obligorID', 'obligationID', 'creditAccNo', 'loanAdvanceAmnt',
						'identifier', '__metadata', 'requestStateDesc', 'hostResponseMsg','loanIntRefN'
						],
				//proxyUrl : 'LoanCenterGridList/viewRes.srvc',
				//proxyUrl :'realTimeIntRes/viewRes.srvc',  
				proxyUrl :'realTimeIntRes/viewResList.srvc',
				
				rootNode : 'd.realTimeIntRes',
				totalRowsNode : 'd.__count'
			},
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData
			}
		});
		return grid;
	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var objWidthMap = {
			"requestReference" : 150,
			"obligorID" : 170,
			"obligationID" : 170,
			"paymentType" : 160,
			"loanAdvanceAmnt" : 120,
			"requestStateDesc" : 190,
			"hostResponseMsg" : 240
		};
		var arrColsPref = me.getColumnPreferences();
		
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.draggable =false;
				//cfgCol.resizable =false;
				cfgCol.menuDisabled = true;
				if (!Ext.isEmpty(objCol.colType))
					cfgCol.colType = objCol.colType;
				if (objCol.colId === 'amount' || objCol.colId === 'count')
					cfgCol.align = 'right';
				cfgCol.fnColumnRenderer = me.columnRenderer;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_amount') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('currency'))) {
					strRetValue = '<a title="'
							+ getLabel('iconBatchFcy', 'Multiple Currencies')
							+ '" class="iconlink grdlnk-notify-icon icon-gln-fcy"></a>';
				} else {
					strRetValue = record.get('currency') + ' ' + value;
				}
			}
		} else if (colId === 'col_productType') {
			strRetValue = value;
			if (record.get('isConfidential') == "N") {
				strRetValue += '<a title="'
						+ getLabel('iconBatchConfidential', 'Confidential')
						+ '" class="grid-row-action-icon icon-confidential xn-icon-16x16"></a> ';
			}
			if (!Ext.isEmpty(record.get('isClone'))
					&& (!Ext.isEmpty(record.get('uploadRef')))
					&& record.get('isClone') != "Y") {
				strRetValue += '<a title="'
						+ getLabel('iconBatchFileUpload', 'Import')
						+ '" class="grid-row-action-icon icon-fileupload xn-icon-16x16"></a>';
			}
		} else
			strRetValue = value;
		if (!Ext.isEmpty(value))
			meta.tdAttr = 'title="' + value + '"';
		return strRetValue;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		//var strUrl = strUrl + '&' + 'recKeyNo=' +trackNumber +  '&' +  csrfTokenName + '=' + csrfTokenValue;
		var strUrl = strUrl + '&' + 'identifier=' +strRecKey +  '&' +  csrfTokenName + '=' + csrfTokenValue;
		//var strUrl = strUrl + '&' + 'identifier=' +Ext.encode(arrIdentifier) +  '&' +  csrfTokenName + '=' + csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},
	
	refreshData : function() {
		var me = this;
		var grid = me.down('smartgrid[itemId="gridInstrumentDetails"]');
		if (!Ext.isEmpty(grid))
			grid.refreshData();
	},
	getColumnPreferences : function() {
		var me = this;
		var mapColLayout = {
			"ACHLAYOUT" : ["col1", "col3", "col4", "col5", "col8", "col9"],
			"ACHIATLAYOUT" : ["col1", "col3", "col4", "col6", "col8", "col9"],
			"TAXLAYOUT" : ["col1", "col16", "col4", "col10", "col9"],
			"WIRELAYOUT" : ["col1", "col3", "col4", "col7", "col10", "col9"],
			"ACCTRFLAYOUT" : ["col1", "col2", "col3", "col4", "col5", "col6"],
			"CHECKSLAYOUT" : ["col1", "col17", "col4", "col14", "col15", "col9"],
			"MIXEDLAYOUT" : ["col1", "col2", "col3", "col4", "col5", "col6", "col7"],
			"MIXEDADMIN" : ["col1", "col3", "col4", "col10", "col11", "col9"]
		};
		var strLayout = (typeof strLayoutType != 'undefined' && !isEmpty(strLayoutType))
				? strLayoutType
				: 'MIXEDLAYOUT';
		var mapColumns = {
			'PAYMENT' : {
				"col1" : {
					"colId" : "txnReference",
					"colDesc" : "Transaction Reference"
				},
				"col2" : {
					"colId" : "debitAccount",
					"colDesc" : "Debit Account"
				},
				"col3" : {
					"colId" : "creditAccount",
					"colDesc" : "Credit  Account"
				},
				"col4" : {
					"colId" : "amount",
					"colDesc" : "Amount",
					"colType" : "number"
				},
				"col5" : {
					"colId" : "status",
					"colDesc" : "Status"
				},
				"col6" : {
					"colId" : "hostMessage",
					"colDesc" : "Host Message"
				}
			},
			'CHECK' : {
				"col7" : {
					"colId" : "requestReference",
					"colDesc" : "Tracking No."
				},
				"col1" : {
					"colId" : "account",
					"colDesc" : "Account"
				},
				"col2" : {
					"colId" : "checkNmbr",
					"colDesc" : "Check Number"
				},
				"col3" : {
					"colId" : "type",
					"colDesc" : "Request Type"
				},
				"col4" : {
					"colId" : "amount",
					"colDesc" : "Amount",
					"colType" : "number"
				},
				"col5" : {
					"colId" : "status",
					"colDesc" : "Status"
				},
				"col6" : {
					"colId" : "hostMessage",
					"colDesc" : "Host Message"
				}
			},
			'LOAN' : {
				"col1" : {
					"colId" : "requestReference",
					"colDesc" : "Tracking No.",
					"colWidth" : 150
				},
				"col2" : {
					"colId" : "obligorID",
					"colDesc" : "Obligor ID",
					"colWidth" : 170
				},
				"col3" : {
					"colId" : "obligationID",
					"colDesc" : "Obligation ID",
						"colWidth" : 170
				},
				"col4" : {
					"colId" : "paymentType",
					"colDesc" : "Payment Request Type",
					"colWidth" : 160
				},
				"col5" : {
					"colId" : "loanAdvanceAmnt",
					"colDesc" : "Amount",
					"colType" : "number",
					"colWidth" : 120
				},
				"col6" : {
					"colId" : "requestStateDesc",
					"colDesc" : "Status",
					"colWidth" : 190
				},
				"col7" : {
					"colId" : "hostResponseMsg",
					"colDesc" : "Host Message",
					"colWidth" : 240
				}
			}
		};
		var arrCols = mapColLayout[strLayout];
		var retArr = new Array();
		if (arrCols) {
			Ext.each(arrCols, function(item) {
						if (mapColumns[me.entryType]
								&& mapColumns[me.entryType][item])
							retArr.push(mapColumns[me.entryType][item]);
					});
		}
		return retArr;
	}
});