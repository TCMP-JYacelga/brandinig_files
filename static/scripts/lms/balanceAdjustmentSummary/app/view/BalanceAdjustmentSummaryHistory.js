/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define( 'GCP.view.BalanceAdjustmentSummaryHistory',
{
	extend : 'Ext.window.Window',
	historyUrl : null,
	clientDesc : null,
	isClient : true,
	identifier : null,
	requires :
	[
		'Ext.grid.column.Action', 'Ext.grid.column.Date'
	],
	/**
	 * @cfg {number} width
	 * width of component in pixels.
	 */
	//width : 700,
	width : 550,
	maxWidth : 735,
	/**
	 * @cfg {number} height
	 * width of component in pixels.
	 */
	//height : 250,
	minHeight : 156,
	maxHeight : 550,
	resizable : false,
	draggable : false,
	cls : 'non-xn-popup',
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
	config : {
		historyData : []
	},

	initComponent : function()
	{
		var thisClass = this;
		var clientlabel = getLabel( 'lbl.notionalMst.client', 'Company Name' )
		if( Ext.isEmpty( this.historyUrl ) )
		{
			Ext.apply( this,
			{
				title : getLabel( 'filterPopupTitle', 'Error' ),
				html : getLabel( 'lblnourl', 'Sorry no URl provided for History' )
			} );
		}
		else
		{
			var arrayData = thisClass.loadHistoryData( this.historyUrl, this.identifier, this.clientDesc );
			this.title = getLabel( 'lms.balanceAdjustment', 'Balance Adjustment' );
			this.items =
			[
				{

				xtype : 'panel',
				width : '100%',
				layout : 'hbox',
				cls : 'ft-padding-bottom',
				items : [{
							xtype : 'label',
							cls : 'ux_font-size14 label-color',
							text : clientlabel
									+ " : ",
							width : '100'
						}, {
							xtype : 'label',
							style : { fontWeight: 'normal !important' },
							cls : 'ux_font-size14',
							html : "&nbsp" + thisClass.clientDesc,
 							padding : '0 0 0 0',
							width : '150'
						}]
			}, {
				xtype : 'grid',
				cls : 'x-grid-padding-top',
				autoScroll : true,
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns : [{
							dataIndex : 'label',
							sortable : false,
							menuDisabled : true,
							text : getLabel('description', 'Description')
						}, {
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('maker', 'Maker'),
							renderer : function(val, meta, rec, rowIndex, colIndex, store) {
				                    if(val.length > 29)
				                    meta.tdAttr = 'title="' + val + '"';
				                    return val;
				            }
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('checker', 'Checker'),
							renderer : function(val, meta, rec, rowIndex, colIndex, store) {
				                    if(val.length > 29)
				                    meta.tdAttr = 'title="' + val + '"';
				                    return val;
				            }
						}]
				}
			];
			this.bbar = ['->',{
						text : getLabel('btnClose', 'Close'),
						//glyph : 'xf058@fontawesome',
						handler : function() {
							thisClass.close();
						}
					}];
		}

		this.callParent();
	},

	loadHistoryData : function( historyUrl, id )
	{
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request(
		{
			//url : historyUrl,
			url : 'cpon/common/history.json' + '?&' + '$histSeekPageId=history.seek.balAdjustment',
			method : 'POST',
			jsonData : Ext.encode( id ),
			async : false,
			success : function( response )
			{
				var data = Ext.decode(response.responseText);
				data = data.d.history[0];
				var checkerStamp, checkerId, makerRequestState, checkerRequestState;
				if( ( data.requestState != 0 && data.requestState != 1 && data.requestState != 4 && data.requestState != 5 ) )
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
				
				var historyData = [
						[getLabel('description',
										'Description'), data.makerId, checkerId],
						[getLabel('historyPopUpdateDate', 'Date Time'),
						 				data.makerStamp, checkerStamp],
						[getLabel('historyPopUpdateAction', 'Action'),
										makerRequestState, checkerRequestState],
						[getLabel('historyPopUpdateRemark', 'Remark'),
										'', data.rejectRemarks]];
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
					title : getLabel( 'filterPopupTitle', 'Error' ),
					msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
		return arrayData;
	}

} );
