/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define( 'GCP.view.LoanCenterHistoryPopupView',
{
	extend : 'Ext.window.Window',
	historyUrl : null,
	identifier : null,
	requires :
	[
		'Ext.grid.column.Action', 'Ext.grid.column.Date'
	],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	//width : 550,
	width : 835,
	maxWidth : 835,
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
	draggable : false,
	cls:'xn-popup',
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	initComponent : function()
	{
		var thisClass = this;
		
		if( Ext.isEmpty( this.historyUrl ) )
		{
			Ext.apply( this,
			{
				title : getLabel( 'lblerror', 'Error' ),
				html : getLabel( 'lblnourl', 'Sorry no URl provided for History' )
			} );
		}
		else
		{
			var arrayData = thisClass.loadHistoryData( this.historyUrl, this.identifier );
			this.title = getLabel( 'loanCenterHist', 'Loan History' );
			this.items =
			[
				{
					xtype : 'grid',
					cls : 't7-grid',
					scroll : 'vertical',
					maxHeight : 400,
					forceFit : true,
					store : arrayData,
					columns :
					[
						{
							xtype : 'rownumberer',
							text : 'Seq. No.',
							menuDisabled : true,
							sortable : false,
							draggable : false,
							resizable: false,
							width: 75,
							renderer : function(val, meta, rec, rowIndex, colIndex, store) {
								meta.tdAttr = 'title="' + (rowIndex + 1) + '"';
								return (rowIndex + 1);
							}
						},
						{
							dataIndex : 'userCode',
							text : getLabel( 'instrumentsHistoryColumnUserId', 'User' ),
							menuDisabled : true,
							sortable : false,
							draggable : false,
							resizable: false,
							width : 160,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						},
						{
							dataIndex : 'logDate',
							//xtype : 'datecolumn',
							text : getLabel( 'instrumentsHistoryColumnDateTime', 'Date Time' ),
							menuDisabled : true,
							sortable : false,
							draggable : false,
							resizable: false,
							//format : 'F j, H:i:s A',
							width : 210,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						},
						{
							dataIndex : 'rejectRemarks',
							text : getLabel( 'instrumentsHistoryColumnRejectRemark', 'Reject Remark' ),
							menuDisabled : true,
							sortable : false,
							draggable : false,
							resizable: false,
							width : 200,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
				                    meta.tdAttr = 'title="' + val + '"';
				                    return val;
				            }
						},
						{
							dataIndex : 'requestStateDesc',
							text : getLabel( 'instrumentsHistoryColumnStatus', 'Status' ),
							menuDisabled : true,
							sortable : false,
							draggable : false,
							resizable: false,
							width : 200,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}
					]
				}
			];
			this.bbar =
			[
				{
					xtype : 'button',
					id : 'btnLoanCenterHistoryPopupClose',
					tabIndex : '1',
					cls : 'ft-button ft-button-light',
					text : getLabel( 'btnOk', 'Close' ),
					handler : function()
					{
						thisClass.close();
					}
				}
			];
		}

		this.callParent();
	},

	loadHistoryData : function( historyUrl, id )
	{
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request(
		{
			url : historyUrl,
			method : 'POST',
			jsonData : Ext.encode( id ),
			async : false,
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				data = data.d.history;
				for(var i=0;i<data.length;i++) {
					var time, makerStamp;					
					makerStamp = new Date(data[i].logDate);
					time = makerStamp.toLocaleTimeString();
					makerStamp = Ext.Date.format(makerStamp, strExtApplicationDateFormat);	
					data[i].logDate = makerStamp+' '+time;
				}	
				arrayData = new Ext.data.ArrayStore(
				{
					fields :
					[
						'version', 'recordKeyNo', 'userCode', 'logDate', 'status', 'requestStateDesc', 'rejectRemarks', '__metadata'
					]
				} );
				arrayData.loadData( data );

			},
			failure : function()
			{
				var errMsg = "";
				Ext.MessageBox.show(
				{
					title : getLabel( 'lblerror', 'Error' ),
					msg : getLabel( 'lblerrordata', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
		return arrayData;
	}

} );
