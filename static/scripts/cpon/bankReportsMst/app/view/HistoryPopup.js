/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
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
	minHeight : 156,
	maxHeight : 550,
	resizable : false,
	draggable : false,
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
	cls:'non-xn-popup',
	config : {
		historyData : []
	},
	listeners : {
		'resize' : function(){
			this.center();
		}
	},

	initComponent : function() {
		var thisClass = this;
		
		var productlabel = getLabel('bankReport', 'Bank Report Name');
		var histTitle = getLabel('bankreportHis', 'Bank Report History');
		
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
				//margin : '5 5 0 0',
				layout : 'hbox',
				items : [{
							xtype : 'label',
							cls : 'ux_font-size14 label-color',
							text : productlabel
									+ " : "
							//width : 100
						}, {
							xtype : 'label',
							margin : '0 0 0 0',
							style : { fontWeight: 'normal !important' },
							cls : 'ux_font-size14 label-font-normal',
							html : "&nbsp" + thisClass.productName
						}]
			}, {
				xtype : 'grid',
				padding : '12 0 0 0',
				autoScroll : true,
				cls : 'x-grid-padding-top',
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
							text : getLabel('prfMstMaker', 'Maker')
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
						cls : 'xn-button ux_cancel-button footer-btns-inner client-history-xbtn-left',
						handler : function() {
							thisClass.close();
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
			url : 'cpon/common/history.json' + '?&' + '$histSeekPageId=history.seek.BankReport',
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
							cls : 'ux_popup',
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
