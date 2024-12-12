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
						title : getLabel('prfMstHistoryPopUpErrorTitle', 'Error'),
						html : 	getLabel('prfMstHistoryPopUpErrorMsg', 'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,
					this.identifier);
			this.title = getLabel('prfHolidayHistory', 'Holiday Profile Master History');

			this.items = [{

						xtype : 'panel',
						width : '100%',
						margin : '5 5 0 0',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									padding : '0 3 0 2',
									cls: 'frmLabel',
									text : getLabel('createHolidayProfile', 'Holiday Profile') + " : ",
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
									dataIndex : 'profile_Name',
									sortable : false,
									menuDisabled : true,
									text : getLabel('lbldesc', 'Description')
								}, {
									dataIndex : 'maker_id',
									sortable : false,
									menuDisabled : true,
									text : getLabel('prfMstMaker', 'Maker')
								}, {
									dataIndex : 'checker_id',
									sortable : false,
									menuDisabled : true,
									text : getLabel('prfMstChecker', 'Checker')
								}]
					}];

			this.buttons = [{
						text : getLabel('btnClose', 'Close'),
						cls:'ux_no-border ux_button-background-color ux_width-auto',
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
			url : 'services/common/history.json' + '?&' + '$histSeekPageId=history.seek.holidayProfileMst',
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
							fields : ['profile_Name', 'maker_id', 'checker_id', 'reject_remarks']
						});
				arrayData.loadData(historyData);
			},
			failure : function() {
				Ext.MessageBox.show({
							title : getLabel('prfMstHistoryPopUpErrorTitle', 'Error'),
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
