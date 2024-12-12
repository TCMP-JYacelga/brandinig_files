Ext.define( 'GCP.view.InstrumentPrintingDetailViewPanel',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'instrumentPrintingDetailViewPanel',
	parentRecord : null,
	parent : null,
	reportGridOrder : null,
	initComponent : function()
	{
		var me = this;
		var instrumentDtlGrid = me.loadGrid();
		this.items = instrumentDtlGrid;
		this.callParent( arguments );
	},
	loadGrid : function() {
		var me = this;
		var objConfigMap = me.getInstrumentPrintDtlConfiguration();
		var arrCols = new Array();
		arrCols = me.getDtlColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		return  me.handleInstrumentPrintDtlSmartGridLoad(arrCols, objConfigMap.storeModel);
	},
	getInstrumentPrintDtlConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			'pdtReference' : 180,
			'instrNmbr' : 100,
			'pdtBenefName' : 150,
			'decodeStatus' : 200,
			'pdtInstrumentAmount' : 120,
			'pdtPackageDesc': 180,
			'pdtProductCcy' : 145,
			'instrumentDate': 140,
			/*'pdtBenDeliveryModeDesc': 180,*/
			'pdtPriPayLoc': 145,
			'pdtPickupBranch': 140,
			'pdtAuthPersonName': 220,
			'pdtAuthPersonIdType': 220,
			'pdtAuthPersonId': 170,
			'whtApplicable': 140,
			'whtTotalAmount': 120,
			'receiverTaxId': 140,
			'whtFormCode': 100,
			'certificateRefNo': 150
		};
		
		arrColsPref = [
		{
			'colId' : 'pdtReference',
			'colDesc' : getLabel('phdReferenceDtl','Instr Ref #'),
			'resizable' : false,
			'sortable':true
		},
		{
			'colId' : 'instrNmbr',
			'colDesc' : getLabel('instrNmbr','Instr #'),
			'resizable' : false,
			'sortable':true
		},
		{
			'colId' : 'pdtBenefName',
			'colDesc' : getLabel('pdtBenefName','Receiver Name'),
			'resizable' : false,
			'sortable':true
		},{
			'colId' : 'decodeStatus',
			'colDesc' : getLabel('status','Status'),
			'resizable' : false,
			'sortable':false
		},{
			'colId' : 'pdtInstrumentAmount',
			'colDesc' : getLabel('pdtInstrumentAmount','Instr. Amount'),
			'resizable' : false,
			'colType' :'number',
			'sortable':true
		},{
			'colId' : 'pdtPackageDesc',
			'colDesc' : getLabel('pdtPackageDesc','Payment Package'),
			'resizable' : false,
			'sortable':true
		},{
			'colId' : 'pdtProductCcy',
			'colDesc' : getLabel('pdtProductCcy','Product Currency'),
			'resizable' : false,
			'sortable':true
		},{
			'colId' : 'instrumentDate',
			'colDesc' : getLabel('instrumentDate','Instr Date'),
			'resizable' : false,
			'sortable':true
		},/*{
			'colId' : 'pdtBenDeliveryModeDesc',
			'colDesc' : getLabel('pdtBenDeliveryModeDesc','Delivery Mode'),
			'resizable' : false,
			'sortable':true
		},*/{
			'colId' : 'pdtPriPayLoc',
			'colDesc' : getLabel('pdtPriPayLoc','Payment Location'),
			'resizable' : false,
			'sortable':true
		},{
			'colId' : 'pdtPickupBranch',
			'colDesc' : getLabel('pdtPickupBranch','Pickup Branch'),
			'resizable' : false,
			'sortable':true
		},{
			'colId' : 'pdtAuthPersonName',
			'colDesc' : getLabel('pdtAuthPersonName','Authorized Person Name'),
			'resizable' : false,
			'sortable':true
		},{
			'colId' : 'pdtAuthPersonIdType',
			'colDesc' : getLabel('pdtAuthPersonIdType','Authorized Person ID Type'),
			'resizable' : false,
			'sortable':true
		},{
			'colId' : 'pdtAuthPersonId',
			'colDesc' : getLabel('pdtAuthPersonId','Authorized Person Id'),
			'resizable' : false,
			'sortable':true
		}, {
			'colId' : 'whtApplicable',
			'colDesc' : getLabel('whtApplicable', 'WHT Applicable'),
			'sortable' : true,
			'resizable' : false
		}, {
			'colId' : 'whtTotalAmount',
			'colDesc' : getLabel('whtTotalAmount', 'WHT Amount'),
			'sortable' : true,
			'resizable' : false
		}, {
			'colId' : 'receiverTaxId',
			'colDesc' : getLabel('receiverTaxId', "Receiver's Tax ID"),
			'sortable' : true,
			'resizable' : false
		}, {
			'colId' : 'whtFormCode',
			'colDesc' : getLabel('whtFormCode', 'Form Code'),
			'sortable' : true,
			'resizable' : false
		}, {
			'colId' : 'certificateRefNo',
			'colDesc' : getLabel('certificateRefNo', 'Certificate Ref No'),
			'sortable' : true,
			'resizable' : false
		}];
		storeModel={
			fields : ['pdtReference', 'pdtSerial', 'pdtBenefName','instrNmbr', 'printNmbr',
			          'decodeStatus', 'pdtInstrumentAmount', 'phdReference','status','pdtProductCcy',
			          'instrumentDate','pdtPackageDesc','pdtBenDeliveryModeDesc','pdtPriPayLoc', 'pdtPickupBranch',
			          'pdtAuthPersonId', 'pdtAuthPersonIdType', 'pdtAuthPersonName','whtApplicable','whtTotalAmount','receiverTaxId','whtFormCode','certificateRefNo'],
			proxyUrl : 'services/getInstrumentPrintDetail.json',
			rootNode : 'd.list',
		    totalRowsNode : 'd.__count'
		}

		objConfigMap = {
			'objWidthMap' : objWidthMap,
			'arrColsPref' : arrColsPref,
			'storeModel' : storeModel
		};
		return objConfigMap;
	},

	getDtlColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.resizable = objCol.resizable;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === 'number')
						cfgCol.align = 'right';
				}
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	handleInstrumentPrintDtlSmartGridLoad : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		var instrumentPrintDtlGrid = null;
		pgSize = 5;
		var instrumentPrintDtlGrid = Ext.getCmp('instrPrintViewDtlGrid');

		if (typeof instrumentPrintDtlGrid == 'undefined') {
			instrumentPrintDtlGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
						id : 'instrPrintViewDtlGrid',
						itemId : 'instrPrintViewDtlGrid',
						pageSize : pgSize,
						autoDestroy : true,
						stateful : false,
						showEmptyRow : false,
						cls : 't7-grid',
						padding : '5 0 0 0',
						showCheckBoxColumn : false,
						hideRowNumbererColumn : false,
						enableColumnAutoWidth : false,
						minHeight : 50,
						maxHeight : 300,
						columnModel : arrCols,
						storeModel : storeModel,
						isRowMoreMenuVisible : false,
						handleRowIconClick : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							me.handleRowIconClick(tableView, rowIndex,
									columnIndex, btn, event, record);
						},
						listeners : {
							render : function(grid) {
								me.handleDtlLoadGridData(grid,grid.store.dataUrl,
										grid.pageSize, 1, 1, null);
							},
							gridPageChange : function(grid, strUrl, pageSize,
									newPgNo, oldPgNo, sorters) {
								me
										.handleDtlLoadGridData(grid,grid.store.dataUrl,
												pageSize, newPgNo, oldPgNo,
												sorters);
							},
							gridSortChange : function(grid, strUrl, pageSize,
									newPgNo, oldPgNo, sorters) {
								me
										.handleDtlLoadGridData(grid,grid.store.dataUrl,
												pageSize, newPgNo, oldPgNo,
												sorters);
							},
							resize : function (){
								$('#instrPrintViewPopup').dialog('option','position','center');
							}
						}
					});
		}
		
		return instrumentPrintDtlGrid;
	},
	handleDtlLoadGridData : function(grid,url, pgSize, newPgNo, oldPgNo,
			sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl  + '&' + csrfTokenName + '='
				+ csrfTokenValue + '&identifier=' + me.parentRecord.data.identifier;
		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null);
	},	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		if(colId === 'col_whtApplicable')
		{
			value = ('Y' === value) ? getLabel('yes','Yes') : getLabel('no','No');
		}
		if(!Ext.isEmpty(value)) {
			meta.tdAttr = 'title="' + value + '"';
		}
		return value;
	}
} );
