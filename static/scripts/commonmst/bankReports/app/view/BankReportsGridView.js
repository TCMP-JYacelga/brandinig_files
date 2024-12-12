Ext.define('GCP.view.BankReportsGridView',{
	extend : 'Ext.panel.Panel',
	xtype : 'bankReportsGridView',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.form.field.ComboBox','Ext.form.Label',
	'Ext.layout.container.HBox','Ext.container.Container','GCP.view.BRActionBarView','Ext.panel.Panel',
	'Ext.form.RadioGroup','Ext.form.field.Text','Ext.menu.Menu'],

	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.BRActionBarView', {
					itemId : 'gridActionBar',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.title = me.title;
		var strUrl = 'services/userCategory/bankReportsFields';
		var colModel = me.getColumns();
		bankReportsGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : 5,
			xtype : 'bankReportGrid',
			itemId : 'bankReportGrid',
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : true,
			rowList : [ 5, 10, 15, 20, 25, 30 ],
			padding : '5 0 0 0',
			minHeight : 0,
			columnModel : colModel,
			storeModel : {
				fields : [ 'bankReportDesc','identifier',
						'assignmentStatus', 'distributionType' ],
				proxyUrl : strUrl,
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			},
			checkBoxColumnRenderer : function(value, metaData,
					record, rowIndex, colIndex, store, view) {

			}

		});
		this.items = [
				{
								xtype : 'container',
								flex:1,
								layout : {
									type : 'hbox',
									pack : 'end'
								},
								items : [{
									xtype : 'button',
									border : 0,
									itemId : 'widgetSearchTxnId',
									text : getLabel('searchOnPage',
											'Search on Page'),
									cls : 'xn-custom-button cursor_pointer',
									margin : '3 0 0 10',
									menu : Ext.create('Ext.menu.Menu', {
												items : [{
													xtype : 'radiogroup',
													itemId : 'matchCriteria',
													vertical : true,
													columns : 1,
													items : [{
														boxLabel : getLabel(
																'exactMatch',
																'Exact Match'),
														name : 'searchOnPageOption',
														inputValue : 'exactMatch'
													}, {
														boxLabel : getLabel(
																'anyMatch',
																'Any Match'),
														name : 'searchOnPageOption',
														inputValue : 'anyMatch',
														checked : true
													}]

												}]
											})

								}, {
									xtype : 'textfield',
									itemId : 'searchTxnTextField',
									cls : 'w10',
									padding : '2 0 0 5'

								}]
			},{
			xtype : 'panel',
			width : '100%',
			cls : 'xn-panel',
			autoHeight : true,
			margin : '5 0 0 0',
			itemId : 'payServiceDtlView',
			items : [{
						xtype : 'container',
						itemId : 'actionBarContainer',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'ux_font-size14',
									padding : '5 0 0 3'
								},
								actionBar, 
								{
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}, bankReportsGrid ];
		this.callParent(arguments);
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [ {
			"colId" : "bankReportDesc",
			"colDesc" : "Report Name",
			"width" : 150
		}, {
			"colId" : "assignmentStatus",
			"colDesc" : "Assigned",
			"width" : 100
		}, {
			"colId" : "distributionType",
			"colDesc" : "Type",
			"width" : 100
		}, {
			"colId" : "filterCount",
			"colDesc" : "Report Filter",
			"width" : 100
		} ];
		if (!Ext.isEmpty(arrColsPref)) {
			for ( var i = 0; i < arrColsPref.length; i++) {
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

	columnRenderer : function(value, meta, record, rowIndex,
			colIndex, store, view, colId) {
		var strRetValue = "";
			strRetValue = value;
		
		return strRetValue;
	}
});
