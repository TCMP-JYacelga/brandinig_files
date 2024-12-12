/**
 * @class GCP.view.summary.AccountSetPopUpView
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.summary.AccountSetPopUpView', {
	extend : 'Ext.window.Window',
	xtype : 'accountSetPopUpView',
	itemId : 'accountSetPopUpView',
	requires : ['GCP.view.summary.AccountSetGridView', 'GCP.view.summary.AccountSetEntryView',
			'Ext.tab.Panel', 'Ext.button.Button'],
	modal : true,
	title : getLabel('accSet', 'Account Set'),
	closeAction : 'hide',
	width : 530,
	height : 570,
	accountSetStoreData : null,
	overflow : 'auto',
	layout : 'fit',
	activeTab : 0,
	initComponent : function() {
		var me = this;
		var accountSetTabView = null;
		accountSetTabView = Ext.create('Ext.tab.Panel', {
			parent : this,
			tabStatus : "",
			itemId : 'accountSetTabPanel',
			cls : 'accountSetGradient',
			items : [{
						title : getLabel('accSet', 'Account Set'),
						itemId : 'listingTab',
						items : [{
									xtype : 'accountSetGridView',
									itemId : 'accountSetGridView',
									accountSetStoreData : me.accountSetStoreData,
									parent : me

								}]
					}, {
						title : getLabel('newAccSet', 'New Account Set'),
						itemId : 'entryTab',
						items : [{
									xtype : 'accountSetEntryView',
									itemId : 'accountSetEntryView',
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
					var tabPanel = me.down('tabpanel[itemId="accountSetTabPanel"]');
					var entryForm = tabPanel.down('panel[itemId="accountSetEntryView"]');
					entryForm.down('label[itemId="accsetErrorLabel"]').setText('');
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
							me.down('panel[itemId="accountSetEntryView"]')
									.fireEvent('clearAccountSetFormFields');
						}
						if (!Ext.isEmpty(saveBtn) && !Ext.isEmpty(cancelBtn)) {
							saveBtn.show();
							cancelBtn.show();
						}
					} else {
						tabPanel.items.getAt(1).mode = 'ADD';
						if (!Ext.isEmpty(saveBtn) && !Ext.isEmpty(cancelBtn)) {
							saveBtn.show();
							cancelBtn.show();
						}

					}
					me.fireEvent('accountSetTabChange', tabPanel, tab);
				}
			}
		});
		me.items = [accountSetTabView];
		me.listeners = {
			'close' : function(window) {
			},
			'beforeshow' : function(window) {
				me.setAccountSetActiveTab(me.activeTab);
				me.down('button[itemId="savebtn"]').show();
				 me.down('button[itemId="cancelbtn"]').show();
			},
			'viewAccountSet' : function(record) {
				me.doHandleViewAccountSet(record);
			}
		}
		me.callParent(arguments);
	},
	setAccountSetActiveTab : function(intActiveTab) {
		var me = this;
		var tabPanel = me.down('tabpanel[itemId="accountSetTabPanel"]');
		if (tabPanel)
			tabPanel.setActiveTab(intActiveTab);
	},
	doHandleViewAccountSet : function(record) {
		var me = this;
		var tabPanel = me.down('tabpanel[itemId="accountSetTabPanel"]');
		var tab = null;
		if (tabPanel) {
			tab = tabPanel.items.getAt(1);
			tab.mode = 'VIEW';
			tabPanel.down('panel[itemId="accountSetEntryView"]').fireEvent(
					'setAccountSetFormFields', record);
			tabPanel.setActiveTab(1);
		}
	},
	doHandleSaveClick : function() {
		var me = this;
		var errorMsg = null;
		
		var tabPanel = me.down('tabpanel[itemId="accountSetTabPanel"]');
		var act = tabPanel.getActiveTab();
		var entryForm = tabPanel.down('panel[itemId="accountSetEntryView"]');
		var grid = tabPanel.down('grid[itemId="accountSetGridView"]');
		
		var mode = tabPanel.items.getAt(1).mode;
		var data = null;
		
		if(act && entryForm && act.getItemId() == 'entryTab')
		{
			if (entryForm && entryForm.validateEntryForm(mode)) {
				data = entryForm.getAccountSetFormData();
				me.fireEvent('saveAccountSet', grid, data);
				entryForm.down('label[itemId="accsetErrorLabel"]').setText('');
				me.close();
			}
			else
			{
				errorMsg = getLabel('selectAccountSetName',
							'Account Set Name and Account selection are mandatory!');
					entryForm.down('label[itemId="accsetErrorLabel"]').setText(errorMsg);
			}
		}
		else if(act && grid && act.getItemId() == 'listingTab')
		{
			me.fireEvent('saveAccountSetOrder',grid);
			me.close();
		}
	}
});
