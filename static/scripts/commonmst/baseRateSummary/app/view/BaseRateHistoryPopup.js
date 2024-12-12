Ext.define('GCP.view.BaseRateHistoryPopup', {
	extend : 'Ext.window.Window',
	productName : null,
	historyUrl : null,
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
	config : {
		historyData : []
	},
	initComponent : function() {
		var me = this;

		var productlabel = getLabel('baseRateTypes', 'Base Rate Type');
		var histTitle = getLabel('baseRateTypesHist', 'Base Rate Type History');

		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('prfMstHistoryPopUpErrorTitle',
								'Error'),
						html : getLabel('prfMstHistoryPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = me
					.loadHistoryData(this.historyUrl, this.identifier);
			this.title = histTitle;

			this.items = [{

						xtype : 'panel',
						width : '100%',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									cls : 'ux_font-size14 label-color',
									text : productlabel + " : ",
									width : '100'
								}, {
									xtype : 'label',
									style : { fontWeight: 'normal !important' },
									cls : 'ux_font-size14 label-font-normal',
									html : "&nbsp" + me.productName,
									width : '150'
								}]
					}, {
						xtype : 'grid',
						padding : '12 0 0 0',
						cls : 'x-grid-padding-top',
						autoScroll : true,
						forceFit : true,
						store : arrayData,
						defaultSortable : false,
						columns : [{
									dataIndex : 'label',
									sortable : false,
									menuDisabled : true,
									text : getLabel('prfMstDescription',
											'Description')
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

			this.buttons = [{
						text : getLabel('btnClose', 'Close'),
						cls : 'xn-button ux_cancel-button footer-btns-inner client-history-xbtn-left',
						glyph : 'xf058@fontawesome',
						handler : function() {
							me.close();
						}
					}];
		}

		this.callParent();
	},

	loadHistoryData : function(historyUrl, id) {
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request({
			//url : historyUrl,
			url : 'services/common/history.json' + '?&'
					+ '$histSeekPageId=history.seek.baseRate',

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
});