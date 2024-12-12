/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
/**
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
	//width : 550,
	width : 735,
	maxWidth : 735,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	//height : 200,
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
			this.title = getLabel('instrumentsHistoryTitle', 'Forecast History');
			this.items = [{
				xtype : 'grid',
				cls : 't7-grid',
				scroll : 'vertical',
				autoScroll : true,
				forceFit : true,
				store : Ext.create('Ext.data.Store', {
							fields : ['zone', 'version', "recordKeyNo",
									"userCode", "logDate", "requestState",
									"phdClient", "logNumber", "pirNumber",
									"pirSerial", "avmLevel", 'remarks',
									"__metadata",'statusDesc','rejectRemarks'],
							proxy : {
								type : 'ajax',
								url : this.historyUrl,
								actionMethods : {
									read : "POST",
								},
								extraParams:{id:this.identifier},
								reader : {
									type : 'json',
									root : 'd.history'
								}
							},
							autoLoad : true
						}),
				columns : [{
							xtype : 'rownumberer',
							text : "#",
							width : 30
						}, {
							dataIndex : 'userCode',
							text : getLabel('instrumentsHistoryColumnUserId',
									'User ID'),
									width : 100
						}, {
							dataIndex : 'logDate',
							//xtype : 'datecolumn',
							text : getLabel('instrumentsHistoryColumnDateTime',
									'Date Time'),
							//format : 'n/j/Y, H:i A',
							width : 170
						},{
							dataIndex : 'rejectRemarks',
							text : getLabel(
									'instrumentsHistoryColumnRejectRemark',
									'Reject Remark'),
									width : 200,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    if(val.length > 36)
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
			            }
						}, {
							dataIndex : 'statusDesc',
							text : getLabel('instrumentsHistoryColumnStatus',
									'Status'),
									width : 100
						}]
			}];
			this.bbar = ['->',{
				text : getLabel('btnClose', 'Close'),
				//cls : 'ux_no-border ux_button-background-color ux_button-padding ux_width-auto',
				handler : function() {
					thisClass.close();
				}
			}];
		}

		this.callParent();
	}
});
