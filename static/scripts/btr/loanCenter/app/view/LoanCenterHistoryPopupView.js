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
	width : 550,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	height : 200,
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
					autoScroll : true,
					forceFit : true,
					store : arrayData,
					columns :
					[
						{
							xtype : 'rownumberer',
							text : '#'
						},
						{
							dataIndex : 'userCode',
							text : getLabel( 'instrumentsHistoryColumnUserId', 'User ID' )
						},
						{
							dataIndex : 'logDate',
							xtype : 'datecolumn',
							text : getLabel( 'instrumentsHistoryColumnDateTime', 'Date Time' ),
							format : 'F j, H:i:s A'
						},
						{
							dataIndex : 'rejectRemarks',
							text : getLabel( 'instrumentsHistoryColumnRejectRemark', 'Reject Remark' )
						},
						{
							dataIndex : 'requestStateDesc',
							text : getLabel( 'instrumentsHistoryColumnStatus', 'Status' )
						}
					]
				}
			];
			this.buttons =
			[
				{
					text : getLabel( 'btnOk', 'Ok' ),
					cls : 'xn-button ux_button-background-color ux_cancel-button',
					glyph : 'xf056@fontawesome',
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

				arrayData = new Ext.data.ArrayStore(
				{
					fields :
					[
						'version', 'recordKeyNo', 'userCode',
						{
							name : 'logDate',
							type : 'date',
							dateFormat : 'time'
						}, 'status', 'requestStateDesc', 'rejectRemarks', '__metadata'
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
