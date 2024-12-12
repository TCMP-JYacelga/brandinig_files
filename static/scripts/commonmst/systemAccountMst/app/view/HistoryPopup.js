/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	productDesc : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 550,
	draggable : false,
	resizable : false,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	height : 300,
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
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('bankHistoryPopUpErrorTitle', 'Error'),
						html : 	getLabel('bankHistoryPopUpErrorMsg', 'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,
					this.identifier);
			this.title = getLabel('systemAccountTitle', 'System Account Master History');

			this.items = [{

						xtype : 'panel',
						width : '100%',
						margin : '5 5 0 0',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									padding : '0 3 0 2',
									cls: 'frmLabel',
									text : getLabel('accountName', 'Account Name') + " : ",
									width : '100'
								}, {
									xtype : 'label',
									padding : '0 3 0 2',
									cls: 'frmLabel',
									text : thisClass.productDesc,
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
									dataIndex : 'product_description',
									sortable : false,
									menuDisabled : true,
									text : getLabel('bankHistoryPopUpDescription', 'Description')
								}, {
									dataIndex : 'maker_id',
									sortable : false,
									menuDisabled : true,
									text : getLabel('bankMaker', 'Maker')
								}, {
									dataIndex : 'checker_id',
									sortable : false,
									menuDisabled : true,
									text : getLabel('bankChecker', 'Checker')
								}]
					}];

			this.buttons = [{
						text : getLabel('btnOk', 'Ok'),
						cls:'ux_no-border ux_button-background-color ux_width-auto',
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
			url : historyUrl,
			method : 'POST',
			jsonData : Ext.encode(id),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				data = data.d.profile[0];
				var makerStamp, checkerStamp, checkerId, makerRequestState, checkerRequestState, time, remarks;
			
			
				if (!Ext.isEmpty(data.makerStamp)) {
					makerStamp = data.makerStamp;
				}
				if (data.requestState != 0 && data.requestState != 1 && data.requestState != 4 && data.requestState != 5 ) {
                    checkerId = data.checkerId;
					checkerRequestState = data.requestStateDesc;
					makerRequestState = data.lastRequestStateDesc;	
					checkerStamp = data.checkerStamp
					
				} else {
					makerRequestState = data.requestStateDesc;
				}
				if (!Ext.isEmpty(checkerRequestState)
						&& checkerRequestState
								.indexOf("Reject") > -1) {
					remarks = data.rejectRemarks;
				}
				var historyData = [
				[ getLabel('bankHistoryPopUpDescription', 'Description'), data.makerId, checkerId],
				[ getLabel('bankHistoryPopUpdateDate', 'Date Time'), makerStamp, checkerStamp],
				[ getLabel('bankHistoryPopUpdateAction', 'Action'), makerRequestState, checkerRequestState],
				[ getLabel('bankHistoryPopUpdateRemark', 'Remark'), '', remarks]];
				arrayData = new Ext.data.ArrayStore({fields : ['product_description', 'maker_id', 'checker_id', 'reject_remarks']});
				arrayData.loadData(historyData);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('errorTitle', 'Error'),
							msg : getLabel('errorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
