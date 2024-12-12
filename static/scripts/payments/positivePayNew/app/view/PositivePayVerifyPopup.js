/**
 * Positive Pay Verify Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show positive pay verification screen
 */
Ext.define('GCP.view.PositivePayVerifyPopup',{
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
	minHeight : 100,
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
	autoScroll: true,
	overflowX : 'auto',
	initComponent : function() {
		var thisClass = this;
		var arrayData = this.selectedRecords;
		var grid = this.grid;
		var isApprove = false;
		var strAction = this.action;
		var strActionUrl = this.actionUrl;
		var strActionType = this.actionType;
		this.title = null;
		if(strAction === 'accept'){
			this.title = getLabel('positivePayVerifyApprove', 'Decision Approve Review');
			isApprove = true;
		}
		else if(strAction === 'submit'){
			this.title = getLabel('positivePayVerifySubmit', 'Decision Submit Review');
		}
        var dataStore = new Ext.data.JsonStore({
            autoLoad: false,
   			 fields: [
          		'accountNmbr','accountName', 'instNmbr', 'instDate', 'amount',
          			'exceptionReason', 'decision', 'defaultAction', 'beneficiaryName',
          			'issueType1', 'alertFlag', 'hasReachedCutOff', 'checkImgNmbr'
          	],
          	data : arrayData
        });
		this.items = [{
			xtype: 'panel',
			autoScroll: true,
			width : 770,
			items : [{
			xtype : 'grid',
			maxHeight : 600,
			minHeight : 150,
			cls : 't7-grid',
			store : dataStore,
			defaultSortable : false,
			autoScroll: true,
	 		columns :  [ {
							dataIndex : "accountNmbr",
							text : getLabel('accountNmbr','Account'),
							sortable : false,
							menuDisabled : true,
							width : 110
						},{
							dataIndex : "accountName",
							text : getLabel('accountName','Account Name'),
							width : 110,
							sortable : false,
							menuDisabled : true,
							hidden:false
						},{
							dataIndex : "instNmbr",
							text :  getLabel('instNmbr','Check No.'),
							sortable : false,
							menuDisabled : true,
							width : 130,
							renderer: function(value, metaData, record, row, col, store, gridView){
								var strRetValue;
								strRetValue = value;
								if(!Ext.isEmpty(record.get('alertFlag')) && record.get('alertFlag') === '1' )
								{
									if(!Ext.isEmpty(record.get('hasReachedCutOff')) && record.get('hasReachedCutOff') === '0')
										strRetValue = '<a style="color:red">' + value + '</>';
									else
										strRetValue = value;
								}
								else
								{
									strRetValue = value;
								}
								var CheckImageNumber = record.get("checkImgNmbr");
							    if(isGranularPermissionFlag === "Y" ) {
									if(record.data.viewCheckImg === "Y") {
										if(value !== '' && !isHidden('viewCheckImage') && ((CheckImageNumber != null) && (CheckImageNumber !== ""))) {
											strRetValue = strRetValue
											+ ' '
											+ '<a title="Image" class="grid-row-action-icon icon-money" style="cursor: default !important;"></a>';
											return strRetValue;
										} else {
											return strRetValue;
										}
									}
							    } else {
								   if(value !== '' && !isHidden('viewCheckImage') && ((CheckImageNumber !== null) && (CheckImageNumber !== ""))) {
										strRetValue = strRetValue
										+ ' '
										+ '<a title="Image" class="grid-row-action-icon icon-money" style="cursor: default !important;"></a>';
										return strRetValue;
									} else {
										return strRetValue;
									}
								}
								return strRetValue;
							}
						},{
							dataIndex : "instDate",
							text :  getLabel('lblIssueDate','Issue Date'),
							sortable : false,
							menuDisabled : true,
							width : 90
						},{
							dataIndex : "amount",
							text :  getLabel('lblAmount','Amount'),
							"colType" : "number",
							"align" : 'right',
							sortable : false,
							menuDisabled : true,
							width : 120,
							renderer: function(value, metaData, record, row, col, store, gridView){
								var strRetValue;
								strRetValue = '$'+value;
								if(record.get('issueType1') === "EXCEPTION")
								{
									strRetValue = '<a style="color:red">' + strRetValue + '</>';
								}
								return strRetValue;
							}
						},{
							dataIndex : "exceptionReason",
							text :  getLabel('exceptionReason','Exception Reason'),
							sortable : false,
							menuDisabled : true,
							width : 200
						},{
							dataIndex : "decision",
							text :  getLabel('lblDecision','Decision'),
							sortable : false,
							menuDisabled : true,
							width : 140,
							renderer: function(value, metaData, record, row, col, store, gridView){
								if('P'===value)
								{
								  value = "Pay";
								}
								else if('R'===value)
								{
								  value = "Return";
								}
								else
								{
								  value="None";
								}
								var strRetValue;
								strRetValue = value;
								if(!Ext.isEmpty(record.get('alertFlag')) && record.get('alertFlag') === '1' )
								{
									if(!Ext.isEmpty(record.get('hasReachedCutOff')) && record.get('hasReachedCutOff') === '0')
										strRetValue = '<a style="color:red">' + value + '</>';
									else
										strRetValue = value;
								}
								else
								{
									strRetValue = value;
								}
								return strRetValue;
							}
						},{
							dataIndex : "decisionReason",
							text :  getLabel('lblDecisionreason','Decision Reason'),
							sortable : false,
							menuDisabled : true,
							width : 200
						},{
							dataIndex : "decisionStatus",
							text : getLabel('lblStatus','Status'),
							width : 120,
							sortable : false,
							menuDisabled : true
						},{
							dataIndex : "defaultAction",
							text :  getLabel('defDecision','Default Decision'),
							sortable : false,
							menuDisabled : true,
							width : 110,
							renderer: function(value, metaData, record, row, col, store, gridView){
								if('P'===value)
								{
								  value = "Pay";
								}
								else if('R'===value)
								{
								  value = "Return";
								}
								return value;
							}
						},{
							dataIndex : "beneficiaryName",
							text : getLabel('beneficiaryName','Payee'),
							width : 100,
							renderer: function(value, metaData, record, row, col, store, gridView){
								var strRetValue;
								strRetValue = value;
								if(record.get('issueType1') === "EXCEPTION")
								{
									strRetValue = '<a style="color:red">' + strRetValue + '</>';
								}
								if(record.get('beneStatus') === "WhiteListed")
								{
									strRetValue = '<a style="color:green">' + strRetValue + '</>';
								}
								return strRetValue;
							}
						}]
		} ]}];

		this.bbar = [{
					text : getLabel('btnClose', 'Close'),
					cls : 'ft-button-light',
					handler : function() {
						thisClass.close();
					}
				},'->',{
					text : getLabel('btnOk', 'Submit'),
					hidden: (isApprove) ? true : false,
					cls : 'ft-button-primary',
					handler : function() {
						GCP.getApplication().fireEvent( 'verifyOkBtnClick', strActionUrl, '', grid, arrayData, strActionType, strAction );
						thisClass.close();
					}
				},
				{
					text : getLabel('btnApprove', 'Approve'),
					hidden : (isApprove) ? false : true ,
					cls : 'ft-button-primary',
					handler : function() {
						GCP.getApplication().fireEvent( 'verifyOkBtnClick', strActionUrl, '', grid, arrayData, strActionType, strAction );
						thisClass.close();
					}
				}];
		this.callParent();
	}

});

