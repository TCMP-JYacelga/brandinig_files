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
	//width : 650,
	width : 735,
	maxWidth : 735,
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
	resizable : false,
	cls:'xn-popup',
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
			this.title = getLabel('instrumentsHistoryTitle', 'Payments History');
			this.items = [{
				xtype : 'grid',
				scroll : 'vertical',
				cls : 't7-grid',
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
								reader : {
									type : 'json',
									root : 'd.paymentsHistory'
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
						}, /*{
							dataIndex : 'zone',
							text : getLabel('instrumentsHistoryColumnTimeZone',
									'Time Zone'),
							width : 100
						}, */{
							dataIndex : 'remarks',
							text : getLabel(
									'instrumentsHistoryColumnRejectRemark',
									'Reject Remark'),
							width : 200
						}, {
							dataIndex : 'requestState',
							text : getLabel('instrumentsHistoryColumnStatus',
									'Status'),
							width : 100

						}]
			}];
			this.bbar = ['->',{
				text : 'Close',//getLabel('btnOk', 'Ok'),
				handler : function() {
					thisClass.close();
				}
			}];
		}

		this.callParent();
	}
});
