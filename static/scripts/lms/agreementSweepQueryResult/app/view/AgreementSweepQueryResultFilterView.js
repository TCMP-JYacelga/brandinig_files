Ext.define('GCP.view.AgreementSweepQueryResultFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'agreementSweepQueryResultFilterView',
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		movementStore = Ext.create('Ext.data.Store', {
			fields : [ 'key', 'value' ],
			data : [

			{
				"key" : "A",
				"value" : getLabel('lblAll', 'All')
			}, {
				"key" : "Crt",
				"value" : getLabel('lblCreated', 'Created')
			}, {
				"key" : "NoT",
				"value" : getLabel('lblNoTransfer', 'No Transfer')
			}, {
				"key" : "F",
				"value" : getLabel('lblFailed', 'Failed')
			}

			]
		});

		this.items = [ {

			xtype : 'container',
			itemId : 'mainContainer',
			width : 'auto',
			layout : 'vbox',
			cls : 'filter-container-cls',
			margin : 5,
			defaults : {
				padding : 2,
				labelAlign : 'top',
				labelSeparator : ''
			},
			items : [
					{
						xtype : 'textfield',
						name : 'clientCode',
						itemId : 'clientCodeId',
						fieldLabel : getLabel( 'lbl.notionalMst.client', 'Client Code'),
						editable : false,
						allowBlank : false,
						value : '',
						padding : '6 0 0 0'
					},
					{
						xtype : 'tbspacer',
						width : 20
					},
					{
						xtype : 'textfield',
						name : 'agreementCode',
						itemId : 'agreementCodeItemId',
						fieldLabel : getLabel( 'agreementCode', 'Agreement Code'),
						editable : false,
						allowBlank : false,
						value : '',
						padding : '6 0 0 0'
					},
					{
						xtype : 'tbspacer',
						width : 20
					},
					{
						xtype : 'textfield',
						name : 'agreementName',
						itemId : 'agreementNameItemId',
						fieldLabel : getLabel('agreementDesc', 'Agreement Name'),
						editable : false,
						allowBlank : false,
						value : '',
						padding : '6 0 0 0'
					},
					{
						xtype : 'tbspacer',
						width : 20
					},
					{
						xtype : 'textfield',
						name : 'exeStatus',
						itemId : 'exeStatusItemId',
						fieldLabel : getLabel('executionStatus', 'Execution Status'),
						editable : false,
						allowBlank : false,
						value : '',
						padding : '6 0 0 0'
					},
					{
						xtype : 'tbspacer',
						width : 20
					},
					{
						xtype : 'textfield',
						name : 'exeDtAndTime',
						itemId : 'exeDtAndTimeitemId',
						fieldLabel : getLabel('executionDateAndTime', 'Execution Date Time'),
						editable : false,
						allowBlank : false,
						value : '',
						padding : '6 0 0 0'
					},
					{
						xtype : 'tbspacer',
						width : 20
					},
					{
						xtype : 'combobox',
						fieldCls : 'xn-form-field inline_block',
						triggerBaseCls : 'xn-form-trigger',
						padding : '5 5 1 5',
						matchFieldWidth : true,
						itemId : 'movementId',
						store : movementStore,
						valueField : 'key',
						displayField : 'value',
						editable : false,
						value : 'Movement',
						parent : this,
						listeners : {
							select : function(combo, record, index) {
								this.parent.fireEvent('filterMovementType',
										combo, record, index);
							}
						}
					} ]
		} ];
		this.callParent(arguments);
	}
});