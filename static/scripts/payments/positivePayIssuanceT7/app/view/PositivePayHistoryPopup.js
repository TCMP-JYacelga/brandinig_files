/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.PositivePayHistoryPopup',{
	extend : 'Ext.window.Window',
	checker : null,
	checkerDate : null,
	maker : null,
	makerDate :null,
	rejectRemark : null,
	requestState : null,
	requestStateDesc : null,
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
	cls:'xn-popup',
	resizable : false,
	draggable : false,
	/**
	 * @cfg {String} layout In order for child items to be correctly sized and
	 *      positioned, typically a layout manager must be specified through the
	 *      layout configuration option. layout may be specified as either as an
	 *      Object or as a String:
	 */
	/**
	 * @cfg {boolean} modal True to make the window modal and mask everything
	 *      behind it when displayed, false to display it without restricting
	 *      access to other UI elements. Defaults to: false
	 */
	modal : true,
	config : {
		historyData : []
	},
	listeners : {
		resize : function(){
			this.center();
		}
	},
	initComponent : function ()
	{
		var thisClass = this;
		var arrayData = thisClass.loadHistoryData(this.historyUrl, this.identifier);
		this.title =  getLabel('uploadHistoryTitle','Positive Pay Issuance History');
		this.items = [
		     {
				xtype : 'grid',
				cls : 't7-grid',
				scroll : 'vertical',
				forceFit : true,
				store : arrayData,
				columns : [
				{
					xtype : 'rownumberer',
					text: "#",
					width : 32
				},
				{
					dataIndex : 'userCode',
					text : getLabel('instrumentsHistoryColumnUserId','User ID'),
					width : 150
				},
				{
					dataIndex : 'responseDate',
					text : getLabel('instrumentsHistoryColumnDateTime','Date Time'),
					width : 220
				},
				{
					dataIndex : 'remarks',
					text : getLabel('instrumentsHistoryColumnRejectRemark','Reject Remark'),
					width : 140,
					renderer: function(val, meta, rec, rowIndex, colIndex, store)
					{
	                    if(val.length > 28)
	                    meta.tdAttr = 'title="' + val + '"';
	                    return val;
					}
				},
				{
					dataIndex : 'requestStateDesc',
					text : getLabel('instrumentsHistoryColumnStatus','Status'),
					width : 220
				}]
			}];
		this.bbar = [{
					text : 'Close',//getLabel('btnOk','Ok'),
					handler : function() {
						thisClass.close();
					}
				}];
		this.callParent();
	},
	
	
	loadHistoryData : function()
	{
		var me = this;
		var historyData;
		var userId = me.maker;
		var userDateTime = me.makerDate;
		var rejectRemarks = me.rejectRemark;
		var statusDesc = me.requestStateDesc;
		
		if( me.requestState === 1 || me.requestState === 2 )
		{
			if( ! Ext.isEmpty( me.checker ) )
			{
				userId = me.checker;
				userDateTime = me.checkerDate;
			}
		}
		if( me.requestState === 1 || me.requestState === 0 )
		{
			rejectRemarks = '';
		}
		
		historyData =
		[
		 	[ userId, userDateTime, rejectRemarks, statusDesc ]
		];
		
		arrayData = new Ext.data.ArrayStore(
		{
			fields : ["userCode", "responseDate", "remarks", "requestStateDesc" ]
		});
		arrayData.loadData(historyData);
		return arrayData;
	}
});
