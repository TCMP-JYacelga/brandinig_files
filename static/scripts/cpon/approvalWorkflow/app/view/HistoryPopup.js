/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 550,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	height : 400,
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
		
		var histTitle = getLabel('matrixHist', 'Approval Workflow History');
		
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

			this.items = [ {
				xtype : 'grid',
				margin : '5 0 0 0',
				height : 400,
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
							text : getLabel('prfMstMaker', 'Maker')
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstChecker', 'Checker')
						}]
			}];

			this.buttons = [{
						text : getLabel('btnOk', 'OK'),
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf0c7@fontawesome',
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
				var makerStamp, checkerStamp, checkerId, makerRequestState, checkerRequestState;
				if (!Ext.isEmpty(data.makerStamp)) {
					var dtFormat = strExtApplicationDateFormat;
					makerStamp = new Date(Ext.Date.parse(data.makerStamp,
							'F j, H:i:s A'));
					makerStamp = Ext.Date.format(makerStamp, dtFormat);
				}
				if (!Ext.isEmpty(data.checkerId)) {
					checkerId = data.checkerId;
					checkerRequestState = data.requestStateDesc;
					makerRequestState = data.lastRequestStateDesc;
				}
				else
				{
					makerRequestState = data.requestStateDesc;
				}
				if (!Ext.isEmpty(data.checkerStamp)) {
					var dtFormat = strExtApplicationDateFormat;
					checkerStamp = new Date(Ext.Date.parse(data.checkerStamp,
							'd/m/Y'));
					checkerStamp = Ext.Date.format(checkerStamp, dtFormat);
				}

				var historyData = [

	
			 [globalUserDescriptionLabel, data.makerDescription, data.checkerDescription],

			[ getLabel('prfMstHistoryPopUpdateDate', 'Date Time'),data.makerStamp, data.checkerStamp],
			[getLabel('prfMstHistoryPopUpdateAction', 'Action'),makerRequestState, checkerRequestState],
			[getLabel('prfMstHistoryPopUpdateRemark', 'Remark'),'', '']];
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
