/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	chargeReceiptNo : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 550,
	maxWidth : 735,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	//height : 366,
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
	/**
	 * @cfg {boolean} modal True to make the window modal and mask everything
	 *      behind it when displayed, false to display it without restricting
	 *      access to other UI elements. Defaults to: false
	 */
	modal : true,
	config : {
		historyData : []
	},

	initComponent : function() {
		var thisClass = this;
		
		var fieldlabel = getLabel('chargeReceipt', 'Charge Receipt No');
		var histTitle = getLabel('whtHist', 'WHT Refund History');
		
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('prfMstHistoryPopUpErrorTitle',
								'Error'),
						html : getLabel('prfMstHistoryPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl, this.identifier);
			this.title = histTitle;

			this.items = [{

				xtype : 'panel',
				width : '100%',
				layout : 'hbox',
				cls : 'ft-padding-bottom',
				items : [{
							xtype : 'label',
							cls : 'ux_font-size14 label-color',
							text : fieldlabel
									+ " : ",
							width : '100'
						}, {
							xtype : 'label',
							style : { fontWeight: 'normal !important' },
							cls : 'ux_font-size14 label-font-normal',
							html : "&nbsp" + thisClass.chargeReceiptNo,
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
				                    if(val.length > 33)
				                    meta.tdAttr = 'title="' + val + '"';
				                    return val;
				            }
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstChecker', 'Checker'),
							renderer : function(val, meta, rec, rowIndex, colIndex, store) {
				                    if(val.length > 33)
				                    meta.tdAttr = 'title="' + val + '"';
				                    return val;
				            }
						}]
			}];

			this.bbar = ['->',{
						text : getLabel('btnClose', 'Close'),
						handler : function() {
							thisClass.close();
						}
					}];
		}

		this.callParent();
	},

	loadHistoryData : function(historyUrl, id) {
		var arrayData = new Array();
		Ext.Ajax.request({
			//url : historyUrl,
			url : 'cpon/common/history.json' + '?&' + '$histSeekPageId=history.seek.whtrefund',
			method : 'POST',
			jsonData : Ext.encode(id),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				data = data.d.history[0];
				var checkerStamp, checkerId, makerRequestState, checkerRequestState, rejectRemarks;
				if ((data.requestState != 0 && data.requestState != 1
						&& data.requestState != 4 && data.requestState != 5)) {
					checkerId = data.checkerId;
					checkerRequestState = data.requestStateDesc;
					makerRequestState = data.lastRequestStateDesc;
					if (3 === data.requestState) {
						checkerRequestState = 'Refunded';
					} else if (7 === data.requestState) {
						checkerRequestState = 'Refund Rejected';
					}
					if (0 === data.lastRequestState) {
						makerRequestState = 'Refund Requested'
					}

					checkerStamp = data.checkerStamp;
					if (7 === data.requestState) {
						rejectRemarks = data.rejectRemarks;
					}
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
										'', rejectRemarks]];
				arrayData = new Ext.data.ArrayStore({
							fields : ['label', 'makerVal', 'checkerVal']
						});
				arrayData.loadData(historyData);
			},
			failure : function() {
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
});
