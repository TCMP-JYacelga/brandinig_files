/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	identifier : null,
	childIdentifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	width : 650,
	maxWidth : 735,
	//height : 270,
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
	cls:'xn-popup',
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

		var histTitle = getLabel('reconHistory', 'Reconciliation History');

		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('prfMstHistoryPopUpErrorTitle',
								'Error'),
						html : getLabel('prfMstHistoryPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,
					this.identifier, this.childIdentifier);
			this.title = histTitle;

			this.items = [{
						xtype : 'grid',
						cls : 't7-grid',
						//height : 300,
						//autoScroll : true,
						scroll : 'vertical',
						forceFit : true,
						store : arrayData,
						defaultSortable : false,//'userCode', 'logDate', 'rejectRemarks', 'reconState'
						columns : [{
									dataIndex : 'userCode',
									sortable : false,
									menuDisabled : true,
									width : '25%',
									text : getLabel('usrName',
											'User Name')
								}, {
									dataIndex : 'logDate',
									sortable : false,
									menuDisabled : true,
									text : getLabel('histDate', 'Date'),
									width : '35%'
									
								}, {
									dataIndex : 'rejectRemarks',
									sortable : false,
									menuDisabled : true,
									text : getLabel('histRemark', 'Remark'),
									width : '35%'
									
								},{
									dataIndex : 'reconState',
									sortable : false,
									menuDisabled : true,
									text : getLabel('histAction', 'Action'),
									width : '35%'
									
								}]
					}];
			this.bbar = [{
						text : getLabel('btnClose', 'Close'),//getLabel('btnOk', 'OK'),
						handler : function() {
							thisClass.close();
						}
					}];
		}

		this.callParent();
	},

	loadHistoryData : function(historyUrl, id, childIdentifier) {
		var me = this;
		var arrayData = new Array();
		var arrayJson = new Array();
		arrayJson.push({
						identifier :id,
						childIdentifier :childIdentifier
					});
		var historyData =new Array();
		arrayData = new Ext.data.ArrayStore({
							fields : ['userCode', 'logDate', 'rejectRemarks', 'reconState']
						});
		Ext.Ajax.request({
		//	url : historyUrl,
			url : 'services/invoiceReconsList/receiptHistory?'+csrfTokenName+'='+tokenValue,
			method : 'POST',
			jsonData : Ext.encode(arrayJson),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				for(i = 0; i < data.length; i++)
				{
					 historyData.push([data[i].userCode, data[i].logDate, data[i].rejectRemarks, 
					 getLabel(data[i].reconState,data[i].reconState)]);
				}
				arrayData.loadData(historyData);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('prfHistoryPopUpTitle', 'Error'),
							msg : getLabel('prfHistoryErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							buttonText: {
					            ok: getLabel('btnOk', 'OK')
								},
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
