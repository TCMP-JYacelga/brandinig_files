/**
 * @class GCP.view.tranCategoryEntryView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.tranCategoryEntryView', {
	extend : 'Ext.form.Panel',
	cls : 'form-pnl-cls',
	xtype : 'tranCategoryEntryView',
	requires : ['GCP.view.tranCategoryEntryGridView',
			'Ext.form.field.Text', 'Ext.container.Container', 'Ext.form.Label'],
	itemId : "transactionCategoryEntryView",
	padding : '15 0 0 0',
	minHeight : 300,
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'container',
			itemId : 'containerId',
			cls : 'xn-filter-toolbar',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'container',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.5,
				padding : '0 0 0 6',
				items : [{
							xtype : 'label',
							text : getLabel('typecodesetname',
									'Type Code Set Name'),
							cls : 'f13 ux_font-size14 ux_required',
							padding : '0 15 0 0',
							itemId : 'nickName'
						}, {
							xtype : 'textfield',
							padding : '6 0 0 0',
							width : 165,
							itemId : 'nickNameTextField'

						}]

			}]
		}, {
			xtype : 'container',
			cls : 'xn-filter-toolbar',
			padding : '0 0 0 6',
			layout : 'vbox',
			items : [{
						xtype : 'label',
						itemId : 'typeCodeErrorLabel',
						height : 15,
						cls : 'error-msg-color'
					}]
		}, {
			xtype : 'tranCategoryEntryGridView',
			itemId : 'transactionCategoryEntryGridView',
			margin : '20 0 0 0'
		}];
		me.on('clearTransactionCategoryFormFields', function() {
					me.doClearTransactionCategoryFormFields('ADD');
				});
		me.on('setTransactionCategoryFormFields', function(record) {
					me.doSetTransactionCategoryFormFields(record);
				});
		me.callParent(arguments);
	},
	doClearTransactionCategoryFormFields : function(mode) {
		var me = this;
		var nickNameTextField = me
				.down('textfield[itemId="nickNameTextField"]');
		var saveButton = me.parent.down('button[itemId="savebtn"]');
		var grid = me.down('grid[itemId="transactionCategoryEntryGridView"]');
		var store = grid ? grid.getStore() : null;
		var strLabel = mode === 'VIEW'
				? getLabel('update', 'Update')
				: getLabel('save', 'Save');

		if (!Ext.isEmpty(nickNameTextField)) {
			nickNameTextField.setDisabled(false);
			nickNameTextField.setValue("");
		}
		if (!Ext.isEmpty(saveButton))
			saveButton.setText(strLabel);

		if (!Ext.isEmpty(store)) {
			store.each(function(record) {
						record.set('typeCodeCheckbox', false);
					});
		}
	},
	setTransactionCategoryFormFields : function(record) {
		var me = this;
		me.doClearTransactionCategoryFormFields('VIEW');
		var nickNameTextField = me
				.down('textfield[itemId="nickNameTextField"]');
		var saveButton = me
				.up('panel[itemId="transactionCategoryTabPanel"] button[itemId="savebtn"]');
		var grid = me.down('grid[itemId="transactionCategoryEntryGridView"]');
		var store = grid ? grid.getStore() : null;
		var arrTypeCode = record.get('typeCodes');

		if (!Ext.isEmpty(nickNameTextField)) {
			nickNameTextField.setDisabled(true);
			nickNameTextField.setValue(record.get('txnCategory') || '');
		}
		if (!Ext.isEmpty(arrTypeCode)) {
			store.each(function(rec) {
						if (Ext.Array.contains(arrTypeCode, rec.get('CODE'))) {
							rec.set('typeCodeCheckbox', true);
						}
					});
		}
	},
	validateEntryForm : function(strMode) {
		var me = this;
		var nickNameField = me.down('textfield[itemId="nickNameTextField"]');
		var grid = me.down('grid[itemId="transactionCategoryEntryGridView"]');
		var transactionCategoryGrid = me.parent
				.down('grid[itemId="transactionCategoryGridView"]');
		var store = grid ? grid.getStore() : null;
		var retValue = true;
		var strNickName = nickNameField ? nickNameField.getValue() : '';

		if (Ext.isEmpty(strNickName))
			retValue = false;
		if (store && Ext.isEmpty(store.findRecord('typeCodeCheckbox', true)))
			retValue = false;
		store = transactionCategoryGrid
				? transactionCategoryGrid.getStore()
				: null;
		if (store && !Ext.isEmpty(store.findRecord('txnCategory', strNickName))
				&& strMode !== 'VIEW')
			retValue = false;
		return retValue;
	},
	getTransactionCategoryFormData : function() {
		var me = this;
		var nickNameField = me.down('textfield[itemId="nickNameTextField"]');
		var grid = me.down('grid[itemId="transactionCategoryEntryGridView"]');
		var store = grid ? grid.getStore() : null;
		var arrRecords = null;

		var recData = {};
		recData['txnCategory'] = nickNameField.getValue() || '';
		recData['typeCodes'] = [];

		arrRecords = store.queryBy(function(record) {
					return record.get('typeCodeCheckbox') === true;
				}) || [];
		arrRecords.each(function(record) {
					recData['typeCodes'].push(record.get('CODE'));
				});
		return recData;
	}
});