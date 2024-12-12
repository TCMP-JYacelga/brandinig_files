/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define( 'GCP.view.LmsCmtmAccountStoreHistoryView',
{
	extend : 'Ext.window.Window',
	productName : null,
	historyUrl : null,
	identifier : null,
	agreementCode : null,
	requires :
	[
		'Ext.grid.column.Action', 'Ext.grid.column.Date'
	],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	//width : 700,
	width : 550,
	maxWidth : 735,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	//height : 250,
	minHeight : 156,
	maxHeight : 550,
	resizable : false,
	draggable : false,
	cls : 'non-xn-popup',
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
	config : {
		historyData : []
	},

	initComponent : function()
	{
		var thisClass = this;
		var productlabel = getLabel( 'lbl.CashTreasuryMgmtAccount', 'Cash Treasury Management Account' );
		var histTitle = getLabel( 'lbl.CashTreasuryMgmtAccountHist', 'Cash Treasury Management Account History');
		var agreementlabel = getLabel('lbl.lmsCmtmAccountStore.agreement','Agreement Code');
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
			var arrayData = thisClass.loadHistoryData( this.historyUrl, this.identifier, this.agreementCode );
			this.title =histTitle;
			this.items =
			[{

				xtype : 'panel',
				width : '100%',
				layout : 'hbox',
				cls : 'ft-padding-bottom',
				items : [{
							xtype : 'label',
							cls : 'ux_font-size14 label-color',
							text : agreementlabel
									+ " : ",
							width : '100'
						}, {
							xtype : 'label',
							style : { fontWeight: 'normal !important' },
							cls : 'ux_font-size14 label-font-normal',
							html : "&nbsp" + thisClass.agreementCode + "&nbsp",
 							padding : '0 0 0 0',
							width : '150'
						},{
							xtype : 'label',
							cls : 'ux_font-size14 label-color',
							text : productlabel
									+ " : ",
							width : '100'
						},
						{	
							xtype : 'label',
							style : { fontWeight: 'normal !important' },
							cls : 'ux_font-size14 label-font-normal',
							html : "&nbsp" +thisClass.productName ,
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
							text : getLabel('prfMstDescription', 'Description')
						}, {
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstMaker', 'Maker'),
							renderer : function(val, meta, rec, rowIndex, colIndex, store) {
				                    if(val.length > 29)
				                    meta.tdAttr = 'title="' + val + '"';
				                    return val;
				            }
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstChecker', 'Checker'),
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
		var thisClass = this;
		var arrayData = new Array();
		Ext.Ajax.request(
		{
			url : historyUrl,
			//url : '/getLmsCmtmAccountStoreList/history.srvc',
			method : 'POST',
			jsonData : Ext.encode( id ),
			async : false,
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				data = data.d.lmsCmtmAccountStoreList[ 0 ];
				thisClass.productName = data.accountNmbr;
				var makerStamp, checkerStamp, checkerId, makerRequestState, checkerRequestState,time;
				if (!Ext.isEmpty(data.makerStamp)) {
					makerStamp = data.makerStamp;
				}
				if ((data.requestState!= 0 && data.requestState!= 1 && data.requestState!= 4 && data.requestState!= 5)) {
					checkerId = data.checkerId;
					checkerRequestState = data.requestStateDesc;
					makerRequestState = data.lastRequestStateDesc;
				}
				else
				{
					makerRequestState = data.requestStateDesc;
				}
				if ((data.requestState!= 0 && data.requestState!= 1 && data.requestState!= 4 && data.requestState!= 5)) {
					checkerStamp = data.checkerStamp;
				}

				var setRejectRemarks = "";
				if(!Ext.isEmpty(checkerRequestState) && checkerRequestState.indexOf("Reject") > -1)
				{
					setRejectRemarks = data.rejectRemarks;
				}

				var historyData = [
						[getLabel('prfMstDescription',
										'Description'), data.makerId, checkerId],
						[getLabel('instrumentsHistoryColumnDateTime', 'Date Time'),
						 				data.makerStamp, checkerStamp],
						[getLabel('action', 'Action'),
										makerRequestState, checkerRequestState],
						[getLabel('remark', 'Remark'),
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
