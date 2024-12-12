/**
 * @class GCP.view.summary.AccountSetEntryView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.summary.AccountSetEntryView', {
	extend : 'Ext.form.Panel',
	cls : 'form-pnl-cls',
	xtype : 'accountSetEntryView',
	requires : ['GCP.view.summary.AccountSetEntryGridView',
			'Ext.form.field.ComboBox', 'Ext.form.field.Text',
			'Ext.container.Container', 'Ext.form.Label'],
	itemId : "accountSetEntryView",
	padding : '15 0 0 0',
	minHeight : 300,
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var facilities = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					proxy : {
						type : 'ajax',
						url : 'services/userseek/facilitylist.json',
						reader : {
							type : 'json',
							root : 'd.preferences'
						}
					},
					autoLoad : true,
					listeners : {
						load : function(store, records, options) {
							store.insert(0, {
										"CODE" : "all",
										"DESCR" : "All"
									});
						}
					}
				});

		var combo = Ext.create('Ext.form.field.ComboBox', {
					store : facilities,
					itemId : 'facilityCombo',
					fieldCls : 'xn-form-field',
					triggerBaseCls : 'xn-form-trigger',
					queryMode : 'local',
					displayField : 'DESCR',
					editable : false,
					valueField : 'CODE',
					padding : '6 5 0 0',
					width : 165,
					allowBlank : true,
					value : 'all'
				});
		combo.on('change', function(combo, newValue, oldValue, eOpts) {
					me.filterGridData(newValue);
				});

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
									text : getLabel('accSetName',
											'Account Set Name'),
									cls : 'f13 ux_font-size14 ux_required',
									padding : '0 15 0 0',
									itemId : 'nickName'
									
								}, {
									xtype : 'textfield',
									padding : '6 0 0 0',
									width : 165,
									itemId : 'nickNameTextField'

								}]

					}, {
						xtype : 'container',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						flex : 0.5,
						items : [{

									xtype : 'label',
									text : getLabel('facility', 'Facility'),
									cls : 'f13 ux_font-size14'
								}, combo]
					}

			]
		}, {
			xtype : 'label',
			itemId : 'accsetErrorLabel',
			height : 15,
			padding : '0 0 0 6',
			cls : 'error-msg-color'
		}, {
			xtype : 'accountSetEntryGridView',
			itemId : 'accountSetEntryGridView',
			margin : '10 0 0 0'
		}];
		me.on('clearAccountSetFormFields', function() {
					me.doClearAccountSetFormFields('ADD');
				});
		me.on('setAccountSetFormFields', function(record) {
					me.doSetAccountSetFormFields(record);
				});
		me.callParent(arguments);
	},
	doClearAccountSetFormFields : function(mode) {
		var me = this;
		var nickNameTextField = me
				.down('textfield[itemId="nickNameTextField"]');
		var saveButton = me.parent.down('button[itemId="savebtn"]');
		var grid = me.down('grid[itemId="accountSetEntryGridView"]');
		var store = grid ? grid.getStore() : null;
		var facilityCombo = me.down('combobox[itemId="facilityCombo"]');
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
						record.set('accountIdCheckbox', false);
					});
		}
		if (!Ext.isEmpty(facilityCombo))
			facilityCombo.reset();
	},
	doSetAccountSetFormFields : function(record) {
		var me = this;
		me.doClearAccountSetFormFields('VIEW');
		var nickNameTextField = me
				.down('textfield[itemId="nickNameTextField"]');
		var saveButton = me
				.up('panel[itemId="accountSetTabPanel"] button[itemId="savebtn"]');
		var grid = me.down('grid[itemId="accountSetEntryGridView"]');
		var store = grid ? grid.getStore() : null;
		var arrAccountId = record.get('accounts');

		if (!Ext.isEmpty(nickNameTextField)) {
			nickNameTextField.setDisabled(true);
			nickNameTextField.setValue(record.get('accountSetName') || '');
		}
		if (!Ext.isEmpty(arrAccountId)) {
			store.each(function(rec) {
						if (Ext.Array.contains(arrAccountId, rec
										.get('accountId'))) {
							rec.set('accountIdCheckbox', true);
						}
					});
		}
	},
	validateEntryForm : function(strMode) {
		var me = this;
		var nickNameField = me.down('textfield[itemId="nickNameTextField"]');
		var grid = me.down('grid[itemId="accountSetEntryGridView"]');
		var accountSetGrid = me.parent
				.down('grid[itemId="accountSetGridView"]');
		var store = grid ? grid.getStore() : null;
		var retValue = true;
		var strNickName = nickNameField ? nickNameField.getValue() : '';

		if (Ext.isEmpty(strNickName))
			retValue = false;
		if (store && Ext.isEmpty(store.findRecord('accountIdCheckbox', true)))
			retValue = false;
		store = accountSetGrid ? accountSetGrid.getStore() : null;
		if (store
				&& !Ext
						.isEmpty(store
								.findRecord('accountSetName', strNickName))
				&& strMode !== 'VIEW')
			retValue = false;
		return retValue;
	},
	getAccountSetFormData : function() {
		var me = this;
		var nickNameField = me.down('textfield[itemId="nickNameTextField"]');
		var grid = me.down('grid[itemId="accountSetEntryGridView"]');
		var store = grid ? grid.getStore() : null;
		var arrRecords = null;

		var recData = {};
		recData['accountSetName'] = nickNameField.getValue() || '';
		recData['accounts'] = [];

		arrRecords = store.queryBy(function(record) {
					return record.get('accountIdCheckbox') === true;
				}) || [];
		arrRecords.each(function(record) {
					recData['accounts'].push(record.get('accountId'));
				});
		return recData;
	},
	filterGridData : function(strValue) {
		var me = this;
		var grid = me.down('grid[itemId="accountSetEntryGridView"]');
		if (strValue === 'all') {
			grid.getStore().clearFilter();
		} else {
			grid.getStore().clearFilter();
			grid.getStore().filter('facilityCode', strValue);
		}
	}
});