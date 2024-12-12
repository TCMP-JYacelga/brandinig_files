Ext.define('GCP.view.SearchTransactionAddTemplatePopUpView', {
	extend : 'Ext.window.Window',
	xtype : 'searchTransactionAddTemplatePopUpView',
	requires : ['GCP.view.SearchTransactionNewTemplateTabView',
			'GCP.view.SearchTransactionTemplateListTabView',
			'GCP.view.SearchTransactionNewTemplateTabView', 'Ext.tab.Panel',
			'Ext.button.Button'],
	modal : true,
	title : 'Templates',
	closeAction : 'hide',
	height : 480,
	templListStoreData : null,
	overflow : 'auto',
	width : 550,
	layout : 'fit',
	listeners : {
		'close' : function(window) {
			this.fireEvent('searchTxnAddTemplPopupCloseEvent');
		}
	},
	initComponent : function() {
		var me = this;
		var searchTxnTabView = null;

		searchTxnTabView = Ext.create('Ext.tab.Panel', {
			height : 400,
			parent : this,
			tabStatus : "",
			itemId : 'searchTransactionTabPanel',
			items : [{
						title : getLabel('templates', 'Templates'),
						items : [{
									xtype : 'searchTransactionTemplateListTabView',
									parent : this
								}]
					}, {
						title : getLabel('createNewTempl',
								'Create New Template'),
						items : [{
									xtype : 'searchTransactionNewTemplateTabView'
								}]
					}],
			bbar : ['->', {
						xtype : 'button',
						text : getLabel('save', 'Save'),
						cls : 'xn-button',
						itemId : 'savebtn',
						margin : '6 2 0 0',
						parent : this

					}, {
						xtype : 'button',
						text : getLabel('savensearch', 'Save and Search'),
						cls : 'xn-button',
						itemId : 'savensearchbtn',
						margin : '6 2 0 0',
						parent : this

					}, {
						xtype : 'button',
						text : getLabel('cancel', 'Cancel'),
						cls : 'xn-button',
						itemId : 'cancelbtn',
						handler : function() {
							me.close();
						}
					}],
			listeners : {
				'tabchange' : function(tabPanel, tab) {

				}
			}
		});
		this.items = [searchTxnTabView];
		this.callParent(arguments);
	}

});
