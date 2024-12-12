/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 *
 *
 * @class GCP.view.HistoryPopup
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 735,
	maxWidth : 735,
	identifier : null,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	minHeight : 156,
	maxHeight : 550,
	/**
	 * @cfg {String} layout In order for child items to be correctly sized and
	 *      positioned, typically a layout manager must be specified through the
	 *      layout configuration option. layout may be specified as either as an
	 *      Object or as a String:
	 */
	layout : 'fit',
	/**
	 * @cfg {boolean} modal True to make the window modal and mask everything
	 *      behind it when displayed, false to display it without restricting
	 *      access to other UI elements. Defaults to: false
	 */
	modal : true,
	cls:'xn-popup',
	resizable : false,
	draggable : false,
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	
	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('instrumentHistoryPopUpErrorTitle',
								'Error'),
						html : getLabel('instrumentHistoryPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {
			this.title = getLabel('templateHistoryTitle', 'Template History');
			this.items = [{
				xtype : 'grid',
				cls : 't7-grid',
				scroll : 'vertical',
				margin : '0 0 4 0',
				autoHeight : true,
				autoScroll : true,
				forceFit : true,
				store : Ext.create('Ext.data.Store', {
							fields : ['zone', 'version', "recordKeyNo",
									"userCode", "logDate", "requestState",
									"phdClient", "logNumber", "pirNumber",
									"pirSerial", "avmLevel", 'remarks',
									"__metadata"],
							proxy : {
								type : 'ajax',
								url : this.historyUrl,
								actionMethods : {
									read : "POST",
								},
								extraParams:{$id:this.identifier},
								reader : {
									type : 'json',
									root : 'd.paymentsHistory'
								}
							},
							autoLoad : true
						}),
				columns : [{
							xtype : 'rownumberer',
							text : "Seq. No.",
							width : 75,
							resizable : false,
							sortable : false,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + (rowIndex+1) + '"';
			                    return (rowIndex+1);
							}
						}, {
							dataIndex : 'userCode',
							text : getLabel('instrumentsHistoryColumnUserId','User ID'),
							width : 120,
							menuDisabled : true,
							sortable : false,
							draggable : false,
							resizable: false,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}, {
							dataIndex : 'logDate',
							text : getLabel('instrumentsHistoryColumnDateTime','Date Time'),
							width : 180,
							menuDisabled : true,
							sortable : false,
							draggable : false,
							resizable: false,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}, {
							dataIndex : 'remarks',
							text : getLabel('instrumentsHistoryColumnRejectRemark','Reject Remark'),
							width : 200,
							menuDisabled : true,
							sortable : false,
							draggable : false,
							resizable: false,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}, {
							dataIndex : 'requestState',
							text : getLabel('instrumentsHistoryColumnStatus','Status'),
							width : 220,
							menuDisabled : true,
							sortable : false,
							draggable : false,
							resizable: false,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}],
				listeners: {
					viewready : function( view, eOpts ){
						thisClass.center();
					}
				}
			}];
			this.bbar = [{
				xtype : 'button',
				id : 'btnTxnHistoryPopupClose',
				tabIndex : '1',
				cls : 'ft-button ft-button-light',
				text : getLabel( 'btnCancel', 'Cancel' ),
				handler : function()
				{
					thisClass.close();
				}
			}];
		}

		this.callParent();
	}
});
