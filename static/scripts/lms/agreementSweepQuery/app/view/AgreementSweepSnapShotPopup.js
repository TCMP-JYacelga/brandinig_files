Ext.define( 'GCP.view.AgreementSweepSnapShotPopup',
{
	extend : 'Ext.panel.Panel',
	requires :['Ext.ux.gcp.SmartGrid'],
	xtype : 'agreementSweepSnapShotPopup',
	itemId : 'sweepSnapshotGrid',
	listeners : {
		'resize' : function(){
			$('#executionSnapShotView').dialog('option','position','center');
		}
	},
	initComponent : function()
	{
		var me = this;
		this.items =
		[{
			xtype: 'container',
			width: 'auto',
			cls : 't7-popup',
			layout: 'vbox',
			defaults: {
				labelAlign: 'top',
				labelSeparator: ''
			},
			items: [{
					xtype : 'panel',
					width : '100%',
					itemId : 'snapShotGridPanel',
					items : []
				}			
				]
		}];
		this.callParent( arguments );
	},
	getSnapShotGridConfig : function()
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
			"TOTAL_DEBITS" : 105,
			"TOTAL_CREDITS" : 110,
			"OPENING_BALANCE" : 125
				
		};
		arrColsPref =
		[
			{
				"colId" : "ACMACCOUNT",
				"colHeader" : getLabel('acmAccount','Account'),
				"sortable" : false,
				"draggable" : false
			},
			{
				"colId" : "OPENING_BALANCE",
				"colHeader" : getLabel("acmBalanceBefore","Balance Before"),
				"colType" : "number",
				"sortable" : false,
				"draggable" : false
			},
			{
				"colId" : "TOTAL_DEBITS",
				"colHeader" : getLabel("acmTotalDeb", "Total Debits"),
				"colType" : "number",
				"sortable" : false,
				"draggable" : false
			},
			{
				"colId" : "TOTAL_CREDITS",
				"colHeader" :  getLabel("acmTotalCr","Total credits") ,
				"colType" : "number",
				"sortable" : false,
				"draggable" : false
			},
			{
				"colId" : "CLOSING_BALANCE",
				"colHeader" : getLabel("acmclosingBal","Balance After"),
				"colType" : "number",
				"sortable" : false,
				"draggable" : false
			}
		];
		

		storeModel =
		{
			fields :
			[
				'ACMACCOUNT', 'CLOSING_BALANCE', 'TOTAL_DEBITS', 'TOTAL_CREDITS', 'OPENING_BALANCE'
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
	getSnapGridColumns : function(arrColsPref,objWidthMap,record)
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
	handleSnapShotGridLoading : function(arrCols, storeModel, parentRecord)
	{
		var me = this;
		var pgSize = null;
		pgSize = 10;
		var objGridPanel = me.down('panel[itemId="snapShotGridPanel"]');
		var objSnapGrid = Ext.getCmp('snapShotGrid');

		if(typeof objSnapGrid == 'undefined')
		{
			objSnapGrid = Ext.create('Ext.ux.gcp.SmartGrid',
			{
				id : 'snapShotGrid',
				itemId : 'snapShotGrid',
				cls : 't7-grid ft-padding-bottom',
				pageSize : pgSize,
				autoDestroy : true,
				stateful : false,
				enableColumnHeaderMenu : false,
				showEmptyRow : false,
				hideRowNumbererColumn : false,
				showSummaryRow : false,
				//padding : '0 0 12 0',
				showCheckBoxColumn : false,
				rowList : [5, 10, 25, 50, 100, 500],
				minHeight : 100,
				maxHeight : 270,
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
						me.handleLoadGridData(grid, objSnapGrid.pageSize, 1, 1, null, parentRecord );
					},
					gridPageChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{	
						me.handleLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters, parentRecord );
					},
					gridSortChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{
						me.handleLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters, parentRecord );
					},
					pagechange : function(pager, current, oldPageNum)
					{
						me.handleLoadGridData(pager, current, oldPageNum);
					}
				}
			} );
			objSnapGrid.view.refresh();
			objGridPanel.add(objSnapGrid);
			objGridPanel.doLayout();
		}
	},
	handleLoadGridData : function(grid, pgSize, newPgNo, oldPgNo, sorters, record)
	{
		var me = this;
		url = 'sweepQuerySnapShotGrid.srvc';
		var id =  record.get('AGEREXECID');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorters);
		var strUrl = strUrl + '&' + '$identifier=' + record.get('AGEREXECID') + '&' +  csrfTokenName + '=' + csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		strRetValue = value;
		meta['tdAttr'] = 'data-qtip="' + (strRetValue) + '"';	
		return strRetValue;		
	}
	} );