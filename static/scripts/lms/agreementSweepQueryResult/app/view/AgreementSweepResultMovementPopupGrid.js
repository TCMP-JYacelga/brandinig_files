Ext.define( 'GCP.view.AgreementSweepResultMovementPopupGrid',
{
	extend : 'Ext.panel.Panel',
	requires :['Ext.ux.gcp.SmartGrid'],
	xtype : 'agreementSweepResultMovementPopupGrid',
	initComponent : function()
	{
		var me = this;
		this.items =
		[{
			xtype: 'container',
			width: 'auto',
			layout: 'vbox',
			defaults: {
				labelAlign: 'top',
				labelSeparator: ''
			},
			items: [{
					xtype : 'panel',
					width : '100%',
					cls : 'ft-padding-bottom',
					itemId : 'movementGridPanel',
					items : []
				}			
				]
		}];
		this.callParent( arguments );
	},
	getMovementGridConfig : function()
	{
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap =
		{
				
			"ACMACCOUNT" : 200,
			"CLOSING_BALANCE" : 120,
			"TOTAL_DEBITS" : 150,
			"TOTAL_CREDITS" : 100,
			"OPENING_BALANCE" : 100	
				
		};
		arrColsPref =
		[
			{
				"colId" : "DEBIT_ACCOUNT_ID",
				"colHeader" : "Debit Account",
				"sortable" : false,
				"draggable" : false
			},
			{
				"colId" : "CREDIT_ACCOUNT_ID",
				"colHeader" : "Credit Account",
				"sortable" : false,
				"draggable" : false
			},
			{
				"colId" : "DEBIT_AMOUNT",
				"colHeader" : "Amount",
				"colType" : "number",
				"sortable" : false,
				"draggable" : false
			},
			{
				"colId" : "NARRATION",
				"colHeader" : "Narration",
				"sortable" : false,
				"draggable" : false
			}
		];
		

		storeModel =
		{
			fields :
			[
				'CREDIT_ACCOUNT', 'CREDIT_ACCOUNT_ID', 'DEBIT_ACCOUNT', 'DEBIT_ACCOUNT_ID', 'DEBIT_AMOUNT','NARRATION'
			],
			proxyUrl : 'checkManagementGridList/view.srvc',
			rootNode : 'd.commonDataTable',
			totalRowsNode : 'd.__count'
		};
		
		objConfigMap =
		{
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	getMovementColumns : function(arrColsPref,objWidthMap)
	{
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if(!Ext.isEmpty(arrColsPref))
		{
			for(var i = 0 ; i < arrColsPref.length ; i++)
			{
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.draggable = objCol.draggable;
				if(!Ext.isEmpty(objCol.colType))
				{
					cfgCol.colType = objCol.colType;
					if( cfgCol.colType === "number" )
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId] : 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	handleMovementGridLoading : function(arrCols, storeModel, movId, exeId)
	{
		var me = this;
		var pgSize = null;
		pgSize = 10;
		var objGridPanel = me.down('panel[itemId="movementGridPanel"]');
		var objMovementGrid = Ext.getCmp('moventDetailGrid');

		if(typeof objMovementGrid == 'undefined')
		{
			objMovementGrid = Ext.create('Ext.ux.gcp.SmartGrid',
			{
				id : 'moventDetailGrid',
				itemId : 'moventDetailGrid',
				cls : 't7-grid ',
				pageSize : pgSize,
				autoDestroy : true,
				stateful : false,
				showEmptyRow : false,
				hideRowNumbererColumn : false,
				showSummaryRow : false,
				showCheckBoxColumn : false,
				enableColumnHeaderMenu : false,
				rowList : [5, 10, 25, 50, 100, 500],
				minHeight : 100,
				maxHeight : 270,
				padding:'5 12 0 12',
				columnModel : arrCols,
				storeModel : storeModel,
				isRowMoreMenuVisible : false,
				isRowIconVisible : me.isDtlRowIconVisible,
				handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record)
				{
					me.handleRowIconClick(tableView, rowIndex, columnIndex, btn, event, record);
				},
				listeners :
				{
					render : function(grid)
					{
						me.handleLoadGridData(grid, objMovementGrid.pageSize, 1, 1, null, movId, exeId );
					},
					gridPageChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{	
						me.handleLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters, movId, exeId );
					},
					gridSortChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{
						me.handleLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters,movId, exeId );
					},
					pagechange : function(pager, current, oldPageNum)
					{
						me.handleLoadGridData(pager, current, oldPageNum);
					}
				}
			} );
			objMovementGrid.view.refresh();
			objGridPanel.add(objMovementGrid);
			objGridPanel.doLayout();
		}
	},
	handleLoadGridData : function(grid, pgSize, newPgNo, oldPgNo, sorters,movId,exeId)
	{
		var me = this;
		url = 'sweepQueryResultMovementDetailGrid.srvc';
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorters);
		var strUrl = strUrl + '&' + '$movId=' + movId + '&' + '$exeId='+ exeId +'&'+  csrfTokenName + '=' + csrfTokenValue;
		grid.loadGridData(strUrl, null);
	}
} );
