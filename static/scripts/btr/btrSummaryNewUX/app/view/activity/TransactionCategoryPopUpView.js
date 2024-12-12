/**
 * @class GCP.view.activity.TransactionCategoryPopUpView
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.activity.TransactionCategoryPopUpView', {
	extend : 'Ext.window.Window',
	xtype : 'transactionCategoryPopUpView',
	itemId : 'transactionCategoryPopUpView',
	requires : ['GCP.view.activity.TransactionCategoryGridView',
			'GCP.view.activity.TransactionCategoryEntryView', 'Ext.tab.Panel',
			'Ext.button.Button'],
	modal : true,
	title : getLabel('typecodeset', 'Type Code Set'),
	closeAction : 'hide',
	width : 500,
	height : 580,
	transactionCategoryStoreData : null,
	overflow : 'auto',
	layout : 'fit',
	activeTab : 0,
	initComponent : function() {
		var me = this;
		var transactionCategoryTabView = null;
		transactionCategoryTabView = Ext.create('Ext.tab.Panel', {
			parent : this,
			tabStatus : "",
			itemId : 'transactionCategoryTabPanel',
			cls : 'accountSetGradient',
			items : [{
				title : getLabel('typecodeset', 'Type Code Set'),
				itemId : 'listingTab',
				items : [{
					xtype : 'transactionCategoryGridView',
					itemId : 'transactionCategoryGridView',
					transactionCategoryStoreData : me.transactionCategoryStoreData,
					parent : me
				}]
			}, {
				title : getLabel('newtypecodeset', 'New Type Code Set'),
				itemId : 'entryTab',
				items : [{
							xtype : 'transactionCategoryEntryView',
							itemId : 'transactionCategoryEntryView',
							parent : me
						}]
			}],
			bbar : ['->', {
				xtype : 'button',
				text : getLabel('save', 'Save'),
				clickedFrom : null,
				hidden : true,
				cls : 'xn-button ux_button-background-color ux_save-search-button',
				glyph : 'xf0c7@fontawesome',
				itemId : 'savebtn',
				margin : '6 0 0 0',
				parent : this,
				handler : function() {
					me.doHandleSaveClick();
				}

			}, {
				xtype : 'button',
				text : getLabel('cancel', 'Cancel'),
				cls : 'xn-button ux_button-background-color ux_cancel-button',
				glyph : 'xf056@fontawesome',
				margin : '0 0 0 10',
				itemId : 'cancelbtn',
				hidden : true,
				handler : function() {
					var tabPanel = me
				.down('tabpanel[itemId="transactionCategoryTabPanel"]');
				var entryForm = tabPanel
				.down('panel[itemId="transactionCategoryEntryView"]');
					entryForm.down('label[itemId="typeCodeErrorLabel"]').setText('');
					me.close();
				}
			}, '->'],
			listeners : {
				'tabchange' : function(tabPanel, tab) {
					var saveBtn = me.down('button[itemId="savebtn"]');
					var cancelBtn = me.down('button[itemId="cancelbtn"]');
					var mode = tab.mode;
					if (tab.itemId === 'entryTab') {
						if (mode === 'ADD') {
							me
									.down('panel[itemId="transactionCategoryEntryView"]')
									.fireEvent('clearTransactionCategoryFormFields');
						}
						if (!Ext.isEmpty(saveBtn) && !Ext.isEmpty(cancelBtn)) {
							saveBtn.show();
							cancelBtn.show();
						}
					} else {
						tabPanel.items.getAt(1).mode = 'ADD';
						if (!Ext.isEmpty(saveBtn) && !Ext.isEmpty(cancelBtn)) {
							saveBtn.hide();
							cancelBtn.hide();
						}

					}
					me.fireEvent('transactionCategoryTabChange', tabPanel, tab);
				}
			}
		});
		me.items = [transactionCategoryTabView];
		me.listeners = {
			'close' : function(window) {
			},
			'beforeshow' : function(window) {
				me.setTransactionCategoryActiveTab(me.activeTab);
			},
			'viewTransactionCategory' : function(record) {
				me.doHandleViewTransactionCategory(record);
			}
		}
		me.callParent(arguments);
	},
	setTransactionCategoryActiveTab : function(intActiveTab) {
		var me = this;
		var tabPanel = me
				.down('tabpanel[itemId="transactionCategoryTabPanel"]');
		if (tabPanel)
			tabPanel.setActiveTab(intActiveTab);
	},
	doHandleViewTransactionCategory : function(record) {
		var me = this;
		var tabPanel = me
				.down('tabpanel[itemId="transactionCategoryTabPanel"]');
		var tab = null;
		if (tabPanel) {
			tab = tabPanel.items.getAt(1);
			tab.mode = 'VIEW';
			tabPanel.down('panel[itemId="transactionCategoryEntryView"]')
					.fireEvent('setTransactionCategoryFormFields', record);
			tabPanel.setActiveTab(1);
		}
	},
	doHandleSaveClick : function() {
		var me = this;
		var tabPanel = me
				.down('tabpanel[itemId="transactionCategoryTabPanel"]');
		var entryForm = tabPanel
				.down('panel[itemId="transactionCategoryEntryView"]');
		var grid = tabPanel.down('grid[itemId="transactionCategoryGridView"]');
		var mode = tabPanel.items.getAt(1).mode;
		var data = null;
		if (entryForm && entryForm.validateEntryForm(mode)) {
			data = entryForm.getTransactionCategoryFormData();
			me.fireEvent('saveTransactionCategory', grid, data);
			entryForm.down('label[itemId="typeCodeErrorLabel"]').setText('');
			me.close();
		}
		else
		{
			errorMsg = getLabel('typeCodeErrorLabel',
						'Type Code Set Name and Type Code selection are mandatory!');
				entryForm.down('label[itemId="typeCodeErrorLabel"]').setText(errorMsg);
		}
	}
});
