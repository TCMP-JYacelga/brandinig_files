/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define( 'GCP.view.SweepTxnHistory',
{
	extend : 'Ext.window.Window',
	historyUrl : null,
	identifier : null,
	requires :
	[
		'Ext.grid.column.Action', 'Ext.grid.column.Date'
	],
	/**
	 * @cfg {number} width
	 * width of component in pixels.
	 */
	width : 700,
	/**
	 * @cfg {number} height
	 * width of component in pixels.
	 */
	height : 250,
	/**
	 * @cfg {String} layout
	 * In order for child items to be correctly sized and positioned, typically a layout manager must be specified through 
	 * the layout configuration option.
	 * layout may be specified as either as an Object or as a String:
	 */
	//layout : 'fit',
	/**
	 * @cfg {boolean} modal
	 * True to make the window modal and mask everything behind it when displayed, false to display it without restricting access to other UI elements.
	 * Defaults to: false
	 */
	modal : true,
	cls:'t7-popup',

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
			this.title = getLabel( 'lbl.sweepTxn', 'Sweep Transaction History' );
			this.items =
			[
				{
					xtype : 'grid',
					margin : '5 0 0 0',
					autoScroll : true,
					forceFit : true,
					store : arrayData,
					defaultSortable : false,
					columns :
					[
						{
							xtype : 'rownumberer',
							sortable : false,
							menuDisabled : true,
							text : "#"
						},
						{
							dataIndex : 'makerId',
							sortable : false,
							menuDisabled : true,
							text : getLabel( 'instrumentsHistoryColumnUserId', 'User ID' )
						},
						{
							dataIndex : 'makerStamp',
							sortable : false,
							menuDisabled : true,
							text : getLabel( 'instrumentsHistoryColumnDateTime', 'Date Time' )
							
						},
						{
							dataIndex : 'rejectRemarks',
							sortable : false,
							menuDisabled : true,
							text : getLabel( 'instrumentsHistoryColumnRejectRemark', 'Reject Remark' )
						}
					]
				}
			];
			this.buttons =
			[
				{
					text : getLabel( 'btnOk', 'Ok' ),
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
				data = data.d.sweepTxnList[0];
				
				var makerStamp, checkerStamp, checkerId, time;
				if (!Ext.isEmpty(data.makerStamp)) {
					makerStamp = new Date(data.makerStamp);
					time = makerStamp.toLocaleTimeString();
					makerStamp = Ext.Date.format(makerStamp,
							strExtApplicationDateFormat);
					makerStamp = makerStamp + ' ' + time;
				}
				if (!Ext.isEmpty(data.checkerId)) {
					checkerId = data.checkerId;
				}
				var historyData = [
									[data.makerId, makerStamp , data.rejectRemarks]
								  ];
				
				
				arrayData = new Ext.data.ArrayStore({
					fields : ['makerId', 'makerStamp', 'rejectRemarks']
				});
				
				arrayData.loadData( historyData );

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
