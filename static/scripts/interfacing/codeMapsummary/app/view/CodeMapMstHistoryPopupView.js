/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define( 'GCP.view.CodeMapMstHistoryPopupView',
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
	width : 550,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	//height : 366,
	minHeight : 156,
	maxHeight : 350,
	cls : 'non-xn-popup',
	/**
	 * @cfg {String} layout
	 * In order for child items to be correctly sized and positioned, typically a layout manager must be specified through 
	 * the layout configuration option.
	 * layout may be specified as either as an Object or as a String:
	 */
	draggable : false,
	/**
	 * @cfg {boolean} modal
	 * True to make the window modal and mask everything behind it when displayed, false to display it without restricting access to other UI elements.
	 * Defaults to: false
	 */
	modal : true,
	config : 
	{
		historyData : []
	},

	initComponent : function()
	{
		var me = this;
		if( Ext.isEmpty( me.historyUrl ) )
		{
			Ext.apply( me,
			{
				title : getLabel( 'lblerror', 'Error' ),
				html : getLabel( 'historyPopUpNoUrlError', 'Sorry no URl provided for History' )
			} );
		}
		else
		{
			var arrayData = me.loadHistoryData( me.historyUrl, me.identifier );
			me.title = getLabel( 'lbl.CodeMapMst', 'Code Map Master History' );
			me.items =
			[
				{
					xtype : 'grid',
					cls : 'x-grid-padding-top',
					autoScroll : true,
					forceFit : true,
					store : arrayData,
					defaultSortable : false,
					columns :
					[
						{
							dataIndex : 'label',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstDescription', 'Description')
						},
						{
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstMaker', 'Maker'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store)
							{
			                    if(val.length > 25)
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						},{
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstChecker', 'Checker'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store)
							{
			                    if(val.length > 25)
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}
					]
				}
			];
			this.bbar =
			['->',
				{
					text : getLabel( 'btnClose', 'Close' ),
					handler : function()
					{
						me.close();
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
				var data = Ext.decode(response.responseText);
				data = data.d.codeMapSummary[0];
				var checkerStamp, checkerId, makerRequestState, checkerRequestState, rejectRemarks;
				if (!Ext.isEmpty(data.makerStamp))
				{
					makerStamp = new Date(data.makerStamp);
					time = makerStamp.toLocaleTimeString();
					makerStamp = Ext.Date.format(makerStamp,strExtApplicationDateFormat);	
					makerStamp = makerStamp+' '+time;
				}
				if((data.requestState != 0
						&& data.requestState != 1
						&& data.requestState != 4
						&& data.requestState != 5))
				{
					checkerId = data.checkerId;
					checkerRequestState = data.statusDesc;
					makerRequestState = data.lastStatusDesc;
					if (!Ext.isEmpty(data.checkerStamp))
					{
						checkerStamp = new Date(data.checkerStamp);
						time = checkerStamp.toLocaleTimeString();
						checkerStamp = Ext.Date.format(checkerStamp,strExtApplicationDateFormat);
						checkerStamp=checkerStamp+' '+time;
					}
				} else {
					makerRequestState = data.statusDesc;
				}
				if(!Ext.isEmpty(checkerRequestState) && checkerRequestState.indexOf("Reject") > -1)
				{
                    rejectRemarks = data.rejectRemarks;
                }
                
				var historyData = [
					[getLabel('prfMstHistoryPopUpDescription', 'Description'), data.makerId, checkerId],
					[getLabel('prfMstHistoryPopUpdateDate', 'Date Time'), makerStamp, checkerStamp],
					[getLabel('prfMstHistoryPopUpdateAction', 'Action'), makerRequestState, checkerRequestState],
					[getLabel('prfMstHistoryPopUpdateRemark', 'Remark'), '', rejectRemarks]];
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
					msg : getLabel( 'lblDataError', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
		return arrayData;
	}

} );
