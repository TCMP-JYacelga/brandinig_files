/**
 * Positive Pay Verify Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show positive pay verification screen
 */
Ext.define('GCP.view.PositivePayIssuanceVerifyPopup',{
	extend : 'Ext.window.Window',
	action : null,
	grid : null,
	selectedRecords : null,
	actionUrl : null,
	actionType : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date', 'Ext.data.JsonStore'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 800,
	maxWidth : 1024,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	//height : 250,
	minHeight : 150,
	maxHeight : 600,
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
	resizable : false,
	draggable : true,
	autoScroll: false,
	overflowX : 'auto',
	initComponent : function() {
		var thisClass = this;
		var arrayData = this.selectedRecords;
		var grid = this.grid;
		var strAction = this.action;
		var strActionUrl = this.actionUrl;
		var strActionType = this.actionType;
		this.title = null;
		var btnSubmit =null;
		if(strAction === 'accept'){
			this.title = getLabel('positivePayIssuanceVerifyApprove', 'Issuance Approve Review');
			btnSubmit = getLabel('btnApprove', 'Approve');
		}
		else if(strAction === 'submit'){
			this.title = getLabel('positivePayIssuanceVerifySubmit', 'Issuance Submit Review');
			btnSubmit = getLabel('btnOk', 'Submit');
		}
        var dataStore = new Ext.data.JsonStore({
            autoLoad: false,
   			 fields:['version', 'requestState', 'accountNumber','acctName','approveIssuance',
							'amount', 'checkerId', 'checkerStamp', 'clientId',
							'corporationId', 'currSessionNo', 'description',
							'identifier', '__metadata', 'fileName', 'beanName',
							'issuanceId', 'issuanceDate', 'makerId',
							'makerStamp', 'payeeName', 'recordKeyNo',
							'decisionStatus', 'rejectRemarks', 'voidIndicator',
							'corporationDesc', 'clientDesc', 'serialNumber',
							'sellerCode', 'acctNmbr','acctName','currencySymbol'],
          	data : arrayData
        });
		this.items = [ {
			xtype: 'panel',
			autoScroll: true,
			width : 770,
			minHeight: 102,
			items : [{
			 			xtype : 'grid',
			 			maxHeight : 500,
						minHeight : 85,
						width : 1750,
			 			scroll : false,
			 			cls : 't7-grid',
			 			store : dataStore,
			 			defaultSortable : false,
			 			//autoScroll: true,
			 	 		columns :  [ {
			 					dataIndex : "issuanceDate",
			 					text : "Issue Date",
			 					width : 125,
			 					"hidden" : false
			 				}, {
			 					dataIndex : "acctNameNumber",
			 					text : "Account",
			 					width : 125,
			 					"hidden" : false,
			 					renderer: function(value, metaData, record, row, col, store, gridView){
			 						var strRetValue = value;
			 						if (!record.get('isEmpty') && !Ext.isEmpty(record.get('accountNumber'))
			 								&& !Ext.isEmpty(record.get('acctName'))) {
			 							strRetValue = record.get('acctNmbr');
			 						}
			 						return strRetValue;
			 					}
			 				},{
			 					dataIndex : "acctName",
			 					text : "Account Name",
			 					width : 150,
			 					"hidden" : false
			 				},
			 				{
			 					dataIndex : "serialNumber",
			 					text : "Check No.",
			 					width : 100,
			 					"hidden" : false
			 				}, {
			 					dataIndex : "payeeName",
			 					text : "Payee Name",
			 					width : 250,
			 					"hidden" : false
			 				}, {
			 					dataIndex : "voidIndicator",
			 					text : "Void",
			 					width : 60,
			 					"hidden" : false,
			 					renderer: function(value, metaData, record, row, col, store, gridView){
			 						var strRetValue = value;
			 						if (!record.get('isEmpty') && !Ext.isEmpty(record.get('voidIndicator'))) {
			 							if(record.get('voidIndicator') === 'Y')
			 								strRetValue = "Yes";
			 							else
			 								strRetValue = "No";
			 						}
			 						return strRetValue;
			 					}
			 				}, {
			 					dataIndex : "amount",
			 					"colType" : "amount",
			 					text : "Amount",
			 					width : 140,
			 					"hidden" : false,
			 					"align" : 'right',
			 					renderer: function(value, metaData, record, row, col, store, gridView){
			 						var strRetValue = value;
			 						if (!record.get('isEmpty') && !Ext.isEmpty(record.get('currencySymbol'))
			 						 	&& !Ext.isEmpty(record.get('amount'))) {
			 							strRetValue = record.get('currencySymbol')+ " " + record.get('amount');
			 						}
			 						return strRetValue;
			 					}
			 				}, {
			 					dataIndex : "decisionStatus",
			 					text : "Status",
			 					width : 200,
			 					"hidden" : false,
			 					"sortable" : false
			 				}, {
			 					dataIndex : "clientDesc",
			 					text : "Company Name",
			 					width : 170,
			 					"hidden" : false
			 				}, {
			 					dataIndex : "fileName",
			 					text : "File Name",
			 					width : 170,
			 					"hidden" : false
			 				}, {
			 					dataIndex : "makerStamp",
			 					text : "Create Date",
			 					width : 125,
			 					"hidden" : false
			 				},{
			 					dataIndex : "makerId",
			 					text : "Created By",
			 					width : 140,
			 					"hidden" : false
			 				}]
			        	 
			         }
			 ]}
		];

		this.bbar = [{
					text : getLabel('btnClose', 'Close'),
					cls : 'ft-button-light',
					handler : function() {
						thisClass.close();
					}
				}, '->',{
					text : btnSubmit,
					cls : 'ft-button-primary',
					handler : function() {
						GCP.getApplication().fireEvent( 'verifyOkBtnClick', strActionUrl, '', grid, arrayData, strActionType, strAction );
						thisClass.close();
					}
				}];
		this.callParent();
	}
});

