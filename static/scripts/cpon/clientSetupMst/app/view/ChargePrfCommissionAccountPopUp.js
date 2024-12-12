Ext.define('GCP.view.ChargePrfCommissionAccountPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'chargePrfCommissionAccountPopUp',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	width : 650,
	minHeight : 156,
	maxHeight : 550,
	cls : 'non-xn-popup',
	modal : true,
	draggable : false,
	resizable : false,
	closeAction : 'hide',
	autoScroll : true,
	layout : 'fit',
	listeners : {
		resize : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		this.title = getLabel("billingChargeunitcommAcc","Charge Units Commission Accounts");
		var strUrl = 'services/chargeUnits/getCommissionAccounts';
		var colModel = me.getColumns();
		var commssionAccGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : false,
					itemId : 'accountGrid',
					showCheckBoxColumn : false,
					minHeight : 40,
					maxHeight : 350,
					cls : 't7-grid',
					scroll : 'vertical',
					showPager : true,
					pageSize : 5,
					rowList : [5, 10, 15, 20, 25, 30],
					columnModel : colModel,
					storeModel : {
						fields : ['commAcctNmbr', 'commAcctId','commAcctCcyCode',
								'commAcctbranchCode', 'commAcctInternalID'],
						proxyUrl : strUrl,
						rootNode : 'd.profiles',
						totalRowsNode : 'd.__count'
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
					},

					isRowIconVisible : me.isRowIconVisible
				});
		this.items = [commssionAccGrid];
		commssionAccGrid.on('cellclick', function(view, td, cellIndex, record,
						tr, rowIndex, e, eOpts) {
					var linkClicked = (e.target.tagName == 'SPAN');
					if (linkClicked) {
						var className = e.target.className;
						if (!Ext.isEmpty(className)
								&& className.indexOf('activitiesLink') !== -1) {
							me.saveData(record);
						}
					}
				});
		this.bbar = ['->',{
					xtype : 'button',
					text : getLabel('cancel', 'Cancel'),
					//cls : 'xn-button',
					handler : function() {
						me.close();
					}
				}];
		this.callParent(arguments);
	},
	saveData : function(record) {
		var accNo = record.get('commAcctNmbr');
		var accCcy = record.get('commAcctCcyCode');
		var accBranch = record.get('commAcctbranchCode');
		var accIntId = record.get('commAcctInternalID');
		$('#commAcctNmbr').val(accNo);
		$('#commAcctCcyCode').val(accCcy);
		$('#commAcctbranchCode').val(accBranch);
		$('#commAcctInternalID').val(accIntId);
		this.close();
	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [{
					"colId" : "commAcctNmbr",
					"colDesc" : getLabel("lblBillingAccNo","Account")
				}, {
					"colId" : "commAcctId",
					"colDesc" : getLabel("lblBillingAccId","Account ID")
				},{
					"colId" : "commAcctCcyCode",
					"colDesc" : getLabel("lblBillingAccCcy","Currency")
				}, {
					"colId" : "commAcctbranchCode",
					"colDesc" : getLabel("lblBillingBranchCode","Branch Code")
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

				cfgCol.width = 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_commAcctNmbr') {
			strRetValue = '<span class="activitiesLink underlined cursor_pointer">'
					+ value + '</span>';
		} else
			strRetValue = value;

		return strRetValue;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;		
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		grid.loadGridData(strUrl, null, null, false);
	}
});