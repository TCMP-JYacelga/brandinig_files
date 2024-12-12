/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define( 'GCP.view.BankAdminUserHistoryView',
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
	width : 600,
	maxWidth : 735,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	//height : 250,
	minHeight : 156,
	maxHeight : 550,
	/**
	 * @cfg {String} layout In order for child items to be correctly sized and
	 *      positioned, typically a layout manager must be specified through the
	 *      layout configuration option. layout may be specified as either as an
	 *      Object or as a String:
	 */
	//layout : 'fit',
	/**
	 * @cfg {boolean} modal True to make the window modal and mask everything
	 *      behind it when displayed, false to display it without restricting
	 *      access to other UI elements. Defaults to: false
	 */
	modal : true,
	resizable : false,
	cls:'non-xn-popup',
	draggable : false,
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
			this.title = getLabel( 'lbl.userHistory', 'User Master History' );
			this.items =
			[{

				xtype : 'panel',
				width : '100%',
				cls:'ft-padding-bottom',
				layout : 'hbox',
				items : [{
							xtype : 'label',
							text : getLabel('user', 'User') + " :"
						}, {
							xtype : 'label',
							text : this.userCode,
							padding : '0 3 0 2',
							width : '150'
						}]
			}, {
				xtype : 'grid',
				margin : '5 0 0 0',
				autoScroll : true,
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns : [{
							dataIndex : 'label',
							sortable : false,
							menuDisabled : true,
							width : '33%',
							text : getLabel('prfMstDescription', 'Description')
						}, {
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							width : '33%',
							text : getLabel('userMstMaker', 'Maker'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    if(val.length > 25)
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							width : '33%',
							text : getLabel('userMstChecker', 'Checker'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    if(val.length > 25)
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}]
			}];
			this.bbar =
			['->',
				{
					text : getLabel( 'btnClose', 'Close' ),
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
			url : 'services/common/history.json' + '?&' + '$histSeekPageId=history.seek.user',
			method : 'POST',
			jsonData : Ext.encode( id ),
			async : false,
			success : function( response )
			{
					var data = Ext.decode(response.responseText);
					data = data.d.history[0];
					var checkerStamp, checkerId, makerRequestState, checkerRequestState;
					if( ( data.requestState != 0 && data.requestState != 1 && data.requestState != 4 && data.requestState != 5 && data.requestState != 11 && data.requestState != 13 ) )
					{
						checkerId = data.checkerId;
						checkerRequestState = data.requestStateDesc;
						makerRequestState = data.lastRequestStateDesc;
						checkerStamp = data.checkerStamp;
					}
					else
					{
						makerRequestState = data.requestStateDesc;
					}
					var setRejectRemarks = "";
					if (!Ext.isEmpty(checkerRequestState)
							&& checkerRequestState
									.indexOf("Reject") > -1) {
						setRejectRemarks = data.rejectRemarks;
					}
					
					var historyData = [
							[getLabel('prfMstHistoryPopUpDescription',
											'Description'), data.makerId, checkerId],
							[getLabel('prfMstHistoryPopUpdateDate', 'Date Time'),
							 				data.makerStamp, checkerStamp],
							[getLabel('prfMstHistoryPopUpdateAction', 'Action'),
											makerRequestState, checkerRequestState],
							[getLabel('prfMstHistoryPopUpdateRemark', 'Remark'),
											'', setRejectRemarks]];
					arrayData = new Ext.data.ArrayStore({
								fields : ['label', 'makerVal', 'checkerVal']
							});
					arrayData.loadData(historyData);
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
