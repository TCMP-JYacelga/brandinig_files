/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define( 'GCP.view.AgreementNotionalMstHistoryView',
{
	extend : 'Ext.window.Window',
	productName : null,
	historyUrl : null,
	identifier : null,
	requires :
	[
		'Ext.grid.column.Action', 'Ext.grid.column.Date'
	],
	width : 650,
	height : 350,
	modal : true,
	config : {
		historyData : []
	},
	initComponent : function()
	{
		var me = this;
		
		var productlabel = getLabel( 'agreementDesc', 'Agreement Description' );
		var histTitle = getLabel( 'lbl.notionalAgreementHist', 'Notional Agreement History');
		
		
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('prfMstHistoryPopUpErrorTitle',
								'Error'),
						html : getLabel('prfMstHistoryPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = me.loadHistoryData(this.historyUrl, this.identifier);
			this.title = histTitle;

			this.items = [{

				xtype : 'panel',
				width : '100%',
				margin : '5 5 0 0',
				layout : 'hbox',
				items : [{
							xtype : 'label',
							padding : '0 3 0 2',
							text : productlabel
									+ " : ",
							width : '100'
						}, {
							xtype : 'label',
							padding : '0 3 0 2',
							text : me.productName,
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
							text : getLabel('prfMstHistoryPopUpDescription', 'Description')
						}, {
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstMaker', 'Maker')
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstChecker', 'Checker')
						}]
			}];

			this.buttons = [{
						text : getLabel('btnClose', 'Close'),
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf058@fontawesome',
						handler : function() {
							me.close();
						}
					}];
		}
		this.callParent();
	},

	loadHistoryData : function( historyUrl, id )
	{
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request({
			//url : historyUrl,
			url : 'services/common/history.json' + '?&' + '$histSeekPageId=history.seek.notionalSetup',
			method : 'POST',
			jsonData : Ext.encode(id),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				data = data.d.history[0];
				var checkerStamp, checkerId, makerRequestState, checkerRequestState;
				if( ( data.requestState != 0 && data.requestState != 1 && data.requestState != 4 && data.requestState != 5 ) )
				{
					checkerId = data.checkerId;
					checkerRequestState = data.requestStateDesc;
					makerRequestState = data.lastRequestStateDesc;
					checkerStamp = data.checkerStamp;
				    if (data.requestState === 6 && 'N' === data.isSubmitted && 'Y' === data.validFlag)
	                {
	                    checkerRequestState = getLabel('lbl.agreementnotionalmst.chkstate.expired', 'Expired');
	                }
	                else
	                    checkerRequestState = data.requestStateDesc;
				}
				else
				{
					makerRequestState = data.requestStateDesc;
				}
				
				var historyData = [
						[getLabel('prfMstHistoryPopUpDescription',
										'Description'), data.makerId, checkerId],
						[getLabel('prfMstHistoryPopUpdateDate', 'Date Time'),
						 				data.makerStamp, checkerStamp],
						[getLabel('prfMstHistoryPopUpdateAction', 'Action'),
										makerRequestState, checkerRequestState],
						[getLabel('prfMstHistoryPopUpdateRemark', 'Remark'),
										'', data.rejectRemarks]];
				arrayData = new Ext.data.ArrayStore({
							fields : ['label', 'makerVal', 'checkerVal']
						});
				arrayData.loadData(historyData);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('prfHistoryPopUpTitle', 'Error'),
							msg : getLabel('prfHistoryErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}

} );
