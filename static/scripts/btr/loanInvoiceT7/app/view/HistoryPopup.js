/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	invoiceNumber : null,
	identifier : null ,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 550,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	height : 250,
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
						title : getLabel('historyPopUpErrorTitle',
								'Error'),
						html : getLabel('historyPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,this.identifier);
			this.title = getLabel('loanInvoiceHistoryTitle', 'Loan Invoice History');

			this.items = [{

				xtype : 'panel',
				width : '100%',
				margin : '5 5 0 0',
				layout : 'hbox',
				items : [{
							xtype : 'label',
							padding : '0 3 0 2',
							text : getLabel('invoiceNmbr', 'Invoice No.')
									+ " : ",
							width : '100'
						}, {
							xtype : 'label',
							padding : '0 3 0 2',
							text : this.invoiceNumber,
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
							text : getLabel('HistoryDescription', 'Description')
						}, {
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('HistoryMstMaker', 'Maker')
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('HistoryMstChecker', 'Checker')
						}]
			}];

			this.buttons = [{
						text : getLabel('btnOk', 'Ok'),
						cls : 'ux_button-background-color ux_button-padding',
						handler : function() {
							thisClass.close();
						}
					}];
		}

		this.callParent();
	},

	loadHistoryData : function(historyUrl,identifier) {
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request({
			url : historyUrl,
			method : 'POST',
			jsonData : Ext.encode(identifier),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				data = data.d.invoice[0];
				var makerStamp, checkerStamp, checkerId, makerRequestState, checkerRequestState,time;
				if (!Ext.isEmpty(data.makerStamp)) {
					makerStamp = new Date(data.makerStamp);
					time = makerStamp.toLocaleTimeString();
					makerStamp = Ext.Date.format(makerStamp,strExtApplicationDateFormat);	
					makerStamp = makerStamp+' '+time;
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
				if (!Ext.isEmpty(data.checkerStamp))
				{
					checkerStamp = new Date(data.checkerStamp);
					time = checkerStamp.toLocaleTimeString();
					checkerStamp = Ext.Date.format(checkerStamp,strExtApplicationDateFormat);
					checkerStamp=checkerStamp+' '+time;
				}

				var historyData = [
						[
								getLabel('HistoryPopUpDescription',
										'Description'), data.makerId, checkerId],
						[getLabel('HistoryPopUpdateDate', 'Date Time'),
						 		makerStamp,checkerStamp],
						[getLabel('HistoryPopUpdateAction', 'Action'),
						 		makerRequestState, checkerRequestState],
						[getLabel('HistoryPopUpdateRemark', 'Remark'),
								'', data.rejectRemarks]];
				arrayData = new Ext.data.ArrayStore({
							fields : ['label', 'makerVal', 'checkerVal']
						});
				arrayData.loadData(historyData);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('HistoryPopUpTitle', 'Error'),
							msg : getLabel('HistoryErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
