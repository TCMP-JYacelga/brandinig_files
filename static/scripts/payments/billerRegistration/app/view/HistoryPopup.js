/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular biller.
 */
/**
 * @class GCP.view.HistoryPopup
 * @extends Ext.window.Window
 * @author Bhasker Reddy
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	identifier : null,
	requires : [ 'Ext.grid.column.Action', 'Ext.grid.column.Date' ],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 735,
	maxWidth : 735,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	minHeight : 156,
	maxHeight : 550,
	/**
	 * @cfg {String} layout In order for child items to be correctly sized and positioned, typically a layout manager must be
	 *      specified through the layout configuration option. layout may be specified as either as an Object or as a String:
	 */
	layout : 'fit',
	/**
	 * @cfg {boolean} modal True to make the window modal and mask everything behind it when displayed, false to display it without
	 *      restricting access to other UI elements. Defaults to: false
	 */
	modal : true,
	resizable : false,
	cls : 'xn-popup',
	draggable : false,
	listeners : {
		resize : function() {
			this.center();
		}
	},

	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
				title : getLabel('instrumentHistoryPopUpErrorTitle', 'Error'),
				html : getLabel('instrumentHistoryPopUpErrorMsg', 'Sorry no URl provided for History')
			});
		}
		else {
			this.title = getLabel('billerHistoryTitle', 'Biller History');
			this.items = [ {
				xtype : 'grid',
				scroll : 'vertical',
				cls : 't7-grid',
				forceFit : true,
				store : Ext.create('Ext.data.Store', {
					fields : [ 'version', 'parentRecordKeyNo', 'userCode', 'logDate', 'statusDesc', 'clientCode', 'logNumber',
							'billerCode', 'remarks', '__metadata' ],
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
				columns : [ {
					xtype : 'rownumberer',
					text : '#',
					menuDisabled : true,
					width : 35
				}, {
					dataIndex : 'userCode',
					text : getLabel('billerHistoryColumnUser', 'User Name'),
					menuDisabled : true,
					width : 125
				}, {
					dataIndex : 'logDate',
					// xtype : 'datecolumn',
					text : getLabel('instrumentsHistoryColumnDateTime', 'Date Time'),
					// format : 'n/j/Y, H:i A',
					menuDisabled : true,
					width : 170
				}, {
					dataIndex : 'remarks',
					text : getLabel('instrumentsHistoryColumnRejectRemark', 'Reject Remark'),
					menuDisabled : true,
					width : 175
				}, {
					dataIndex : 'statusDesc',
					text : getLabel('instrumentsHistoryColumnStatus', 'Status'),
					menuDisabled : true,
					width : 100

				} ]
			} ];
			this.bbar = [ {
				// getLabel('btnOk', 'Ok'),
				text : getLabel('btncancel','Cancel'),
				handler : function() {
					thisClass.close();
				}
			} ];
		}

		this.callParent();
	}
});
