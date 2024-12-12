/**
 * History Pop-up is an User Interface Component, extends Ext Window component. Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
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
    identifier : null,
    csrfTokenName : null,
	layout : 'fit',
	/**
	 * @cfg {boolean} modal True to make the window modal and mask everything behind it when displayed, false to display it without
	 *      restricting access to other UI elements. Defaults to: false
	 */
	modal : true,
	cls:'xn-popup',
	resizable : false,
	draggable : false,

	config : {
		historyData : []
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
			this.title = getLabel('agreementFrequencyHist', 'Agreement Scheduling History');
			this.items = [ {
				xtype : 'grid',
				scroll : 'vertical',
				cls : 't7-grid',
				forceFit : true,
				store : Ext.create('Ext.data.Store', {
					fields : [ 'version', 'parentRecordKeyNo', 'userCode', 'logDate', 'statusDesc', 'logNumber', 'remarks', '__metadata' ],
					proxy : {
						type : 'ajax',
						url : this.historyUrl,
                        actionMethods : {
                            read : "POST",
                        },
						extraParams:{id:this.identifier},
						reader : {
							type : 'json'
							//root : 'd.paymentsHistory'
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
					width : 125,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
	                    meta.tdAttr = 'title="' + val + '"';
	                    return val;
		            }
				}, {
					dataIndex : 'logDate',
					// xtype : 'datecolumn',
					text : getLabel('instrumentsHistoryColumnDateTime', 'Date Time'),
					// format : 'n/j/Y, H:i A',
					menuDisabled : true,
					width : 170,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
	                    meta.tdAttr = 'title="' + val + '"';
	                    return val;
		            }
				}, {
					dataIndex : 'remarks',
					text : getLabel('instrumentsHistoryColumnRejectRemark', 'Reject Remark'),
					menuDisabled : true,
					width : 175,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
	                    meta.tdAttr = 'title="' + val + '"';
	                    return val;
		            }
				}, {
					dataIndex : 'statusDesc',
					text : getLabel('instrumentsHistoryColumnStatus', 'Status'),
					menuDisabled : true,
					width : 100,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
	                    meta.tdAttr = 'title="' + val + '"';
	                    return val;
		            }

				} ]
			} ];
			this.bbar = [ {
				text : getLabel('btnClose', 'Close'),
				handler : function() {
					thisClass.close();
				}
			} ];
		}

		this.callParent();
	
	}

});
