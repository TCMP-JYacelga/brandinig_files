/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define( 'GCP.view.AgreementFlexibleDtlHistoryView',
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
	layout : 'fit',
	/**
	 * @cfg {boolean} modal
	 * True to make the window modal and mask everything behind it when displayed, false to display it without restricting access to other UI elements.
	 * Defaults to: false
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
			this.title = getLabel( 'lbl.NotionalAgreement', 'Notional Agreement' );
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
							text : "#"
						},
						{
							dataIndex : 'makerId',
							text : getLabel( 'instrumentsHistoryColumnUserId', 'User ID' )
						},
						{
							dataIndex : 'makerStamp',
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
				data = data.d.notionalList[0];
				
				var makerStamp, checkerStamp, checkerId, makerRequestState, checkerRequestState,time;
				if (!Ext.isEmpty(data.makerStamp)) {
					makerStamp = new Date(data.makerStamp);
					time = makerStamp.toLocaleTimeString();
					makerStamp = Ext.Date.format(makerStamp,strExtApplicationDateFormat);	
					makerStamp = makerStamp+' '+time;
				}
				
				if (!Ext.isEmpty(data.checkerId)) {
					checkerId = data.checkerId;
					checkerRequestState = data.requestStateDesc;
					makerRequestState = data.lastRequestStateDesc;
				}
				else
				{
					makerRequestState = data.requestStateDesc;
				}
				if (!Ext.isEmpty(data.checkerStamp))
				{
					checkerStamp = new Date(data.checkerStamp);
					time = checkerStamp.toLocaleTimeString();
					checkerStamp = Ext.Date.format(checkerStamp,strExtApplicationDateFormat);
					checkerStamp=checkerStamp+' '+time;
				}
				
				var historyData = [
									[data.makerId, makerStamp , data.rejectRemarks,makerRequestState],
									[checkerId,checkerStamp,data.rejectRemarks,checkerRequestState]
								  ];
				
				
				arrayData = new Ext.data.ArrayStore({
					fields : ['makerId', 'makerStamp', 'rejectRemarks','requestStateDesc']
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
