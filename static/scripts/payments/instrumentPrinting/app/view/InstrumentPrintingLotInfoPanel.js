Ext.define( 'GCP.view.InstrumentPrintingLotInfoPanel',
{
	extend : 'Ext.panel.Panel',
	requires :['Ext.ux.gcp.SmartGrid'],
	xtype : 'InstrumentPrintingLotInfoPanel',
	itemId : 'gridInstPrintLotInfo',
	parentRecord : null,
	reportGridOrder : null,
	clientId : null,
	productId : null,
	initComponent : function()
	{
		var me = this;
		this.items = me.loadLotInfoSmartGrid()
		this.callParent( arguments );
	},
	loadLotInfoSmartGrid : function()
	{
		var me = this;
		var objConfigMap = me.getInstPrintLotInfoConfig();
		var arrCols = new Array();
		arrCols = me.getActDtlColumns(objConfigMap.arrColsPref, objConfigMap.objWidthMap);
		
		return me.handleActivityDtlSmartGridLoad(arrCols, objConfigMap.storeModel);
	},
	getInstPrintLotInfoConfig : function()
	{
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap =
		{
			'accNmbr' : 150,
			'lotNmbr' : 150,
			'totalInstr' : 85,
			'startInstNmbr' : 100,
			'endInstNmbr' : 100,
			'totalPrintedInst' : 140,
			'totalWastedInst' : 140,
			'totalUnusedInst' : 140,
			'assignmentDate'  : 170,
			'assignedClosedFlag' : 100
				
		};
		arrColsPref =
		[
			{
				'colId' : 'accNmbr',
				'colHeader' : getLabel('accNmbr','Account Number'),
				'resizable' : false,
				'sortable':true
			},
			{
				'colId' : 'lotNmbr',
				'colHeader' : getLabel('lotNmbr','Lot No'),
				'resizable' : false,
				'sortable':true
			},
			{
				'colId' : 'totalInstr',
				'colHeader' : getLabel('totalInstr','Total Inst'),
				'resizable' : false,
				'sortable':true,
				'colType' :'number'
			},
			{
				'colId' : 'startInstNmbr',
				'colHeader' : getLabel('startInst','Start Inst #'),
				'resizable' : false,
				'sortable':true,
				'colType' :'number'
			},
			{
				'colId' : 'endInstNmbr',
				'colHeader' : getLabel('endInst','End Inst#'),
				'resizable' : false,
				'sortable':true,
				'colType' :'number'
			},
			{
				'colId' : 'totalPrintedInst',
				'colHeader' : getLabel('totalPrintedInst','Total Printed Inst'),
				'resizable' : false,
				'sortable':true,
				'colType' :'number'
			},
			{
				'colId' : 'totalWastedInst',
				'colHeader' : getLabel('totalWastedInst','Total Wasted Inst'),
				'resizable' : false,
				'sortable':true,
				'colType' :'number'
			},
			{
				'colId' : 'totalUnusedInst',
				'colHeader' : getLabel('totalUnusedInst','Total Unused Inst'),
				'resizable' : false,
				'sortable':true,
				'colType' :'number'
			},
			{
				'colId' : 'assignmentDate',
				'colHeader' : getLabel('lotAssignmentDate','Lot Assignment Date'),
				'resizable' : false,
				'sortable':true
			},
			{
				'colId' : 'assignedClosedFlag',
				'colHeader' : getLabel('requestStateDesc','Status'),
				'resizable' : false,
				'sortable':false
			}
		];
		

		storeModel =
		{
			fields :
			[
				'accNmbr', 'lotNmbr', 'startInstNmbr', 'endInstNmbr', 'totalPrintedInst', 'totalInstr',
				'totalWastedInst','totalUnusedInst','assignmentDate', 'assignedClosedFlag'
			],
			proxyUrl : 'getInstrumentPrintingLotInfoList.json',
			rootNode : 'd.lotInfoDetails',
			totalRowsNode : 'd.metadata.__count'
		};
		
		objConfigMap =
		{
			'objWidthMap' : objWidthMap,
			'arrColsPref' : arrColsPref,
			'storeModel' : storeModel
		};
		return objConfigMap;
	},
	getActDtlColumns : function(arrColsPref, objWidthMap)
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
				cfgCol.resizable = objCol.resizable;
				if(!Ext.isEmpty(objCol.colType))
				{
					cfgCol.colType = objCol.colType;
					if( cfgCol.colType === 'number' )
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId] : 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	
	handleActivityDtlSmartGridLoad : function(arrCols, storeModel, parentRecord)
	{
		var me = this;
		var pgSize = null;
		var userActivityDtlGrid = null;
		pgSize = 5;
		var instPrintLotInfoGrid = Ext.getCmp('instPrintLotInfoGrid');

		if(typeof instPrintLotInfoGrid == 'undefined')
		{
			instPrintLotInfoGrid = Ext.create('Ext.ux.gcp.SmartGrid',
			{
				id : 'instPrintLotInfoGrid',
				itemId : 'instPrintLotInfoGrid',
				cls : 't7-grid ft-padding-bottom',
				pageSize : pgSize,
				autoDestroy : true,
				stateful : false,
				showEmptyRow : false,
				showSummaryRow : false,
				showPager : true,
				showCheckBoxColumn : false,
				rowList : [5],
				minHeight : 100,
				maxHeight : 270,
				padding : '5 0 0 0',
				columnModel : arrCols,
				storeModel : storeModel,
				isRowMoreMenuVisible : false,
				enableColumnAutoWidth : false,
				handleMoreMenuItemClick : function(tableView, rowIndex, columnIndex, btn, event, record)
				{
					me.handleRowIconClick(tableView, rowIndex, columnIndex, btn, event, record);
				},
				listeners :
				{
					render : function(grid)
					{
						me.handleActDtlLoadGridData(grid, instPrintLotInfoGrid.pageSize, 1, 1, null);
					},
					gridPageChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{	
						me.handleActDtlLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters);
					},
					gridSortChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{
						me.handleActDtlLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters);
					},
					resize : function (){
						$('#lotInfo').dialog('option','position','center');
					}	
				}
			} );
			instPrintLotInfoGrid.view.refresh();
		}
		return instPrintLotInfoGrid;
	},
	handleActDtlLoadGridData : function(grid, pgSize, newPgNo, oldPgNo, sorters)
	{
		var me = this;
		var record = me.parentRecord;
		url = 'services/getInstrumentPrintingLotInfoList.json';
		var id =  record.get('identifier');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorters);
		var strUrl = strUrl + '&' + 'identifier=' + Ext.encode(id) + '&' +  csrfTokenName + '=' + csrfTokenValue + '&' +'clientId=' + record.data.clientId+ '&'+ 'productId='+ record.data.product ;
		me.reportGridOrder = strUrl;
		me.clientId = record.data.clientId;
		me.productId = record.data.product;
		grid.loadGridData(strUrl,me.lotInfoServiceCallBack, null);
	},
	lotInfoServiceCallBack: function(me, data, args,flag){
		var clientName = data.d.lotInfoDetails[0].clientName;
		var productName = data.d.lotInfoDetails[0].productDesc;
		showLotInfoDetail(clientName, productName);
		
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		if(!Ext.isEmpty(value)) {
			meta.tdAttr = 'title="' + value + '"';
		}
		return value;
	}
} );
