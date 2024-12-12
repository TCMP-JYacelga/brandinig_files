/**
 * @class GCP.view.PaymentQueueChangeDatePopup
 * @extends Ext.window.Window
 * @author Anil Pahane
 * @author Vinay Thube
 */
Ext.define('GCP.view.PaymentQueueChangeDatePopup', {
	extend : 'Ext.window.Window',
	width : 420,
	height : 320,
	modal : true,
	config : {
		strRemark : null
	},
	requires : ['Ext.ux.gcp.DateHandler', 'Ext.form.field.Text',
			'Ext.form.field.Date', 'Ext.form.field.TextArea',
			'Ext.button.Button'],
	batchCount : 0,
	instCount : 0,
	cls : 'non-xn-popup',
	batchOrInstrument : 'batch',
	initComponent : function() {
		var me = this;
		var strDateFormat = !Ext.isEmpty(strExtApplicationDateFormat)
				? strExtApplicationDateFormat
				: 'm/d/Y';
		var dtMinDate = new Date(Ext.Date.parse(dtNextBuisnessDate,
				strDateFormat));
		me.title = getLabel("paymentDateChange", "Payment Date Change");
		me.items = [{
			xtype : 'container',
			layout : 'vbox',
			padding : '10 0 0 0',
			items : [{
						xtype : 'textfield',
						itemId : 'boOfBatchesField',
						fieldLabel : getLabel('noOfBatches',
								'Number of Batches'),
						labelSeparator : "",
						padding : '10 0 0 0',
						labelWidth : 150,
						width : 350,
						readOnly : true,
						value : me.batchCount,
						hidden : me.batchOrInstrument === 'batch' ? false : true
					}, {
						xtype : 'textfield',
						itemId : 'noOfInstrumentsField',
						fieldLabel : getLabel('noOfInstuments',
								'Number of Instruments'),
						labelSeparator : "",
						padding : '10 0 0 0',
						readOnly : true,
						labelWidth : 150,
						width : 350,
						value : me.instCount,
						hidden : me.batchOrInstrument === 'batch' ? false : true
					}, {
						xtype : 'datefield',
						showToday : false,
						itemId : 'effectiveDateField',
						fieldLabel : getLabel('newEffectiveDate',
								'New Effective Date'),
						labelSeparator : "",
						fieldCls : 'xn-valign-middle xn-form-text',
						padding : '10 0 0 0',
						labelWidth : 150,
						required : true,
						editable : false,
						minValue : dtMinDate,
						format : strDateFormat,
						width : 350,
						onExpand : function() {
							this.picker.setValue(this.getValue() ? this
									.getValue() : dtMinDate);
						}
					}, {
						xtype : 'textarea',
						itemId : 'remarkField',
						fieldLabel : getLabel('remark', 'Remarks'),
						labelSeparator : "",
						padding : '10 0 0 0',
						labelWidth : 150,
						width : 350,
						height : 65,
						maxLength : 500,
						enforceMaxLength : true
					}]
		}];

		me.bbar = [{
					text : getLabel('btnCancel', 'Cancel'),
					handler : function() {
						me.close();
					}
				},'->', {
					text : getLabel('btnSave', 'Save'),
					handler : function() {
						var dateField = me
								.down('datefield[itemId="effectiveDateField"]');
						var remarkField = me
								.down('textarea[itemId="remarkField"]');
						if (dateField && !Ext.isEmpty(dateField.getRawValue())) {
							me.fireEvent('queueDateChange', dateField
											.getRawValue(), remarkField
											.getValue());
							me.close();
						}

					}
				}];
		me.callParent();
	}
});
