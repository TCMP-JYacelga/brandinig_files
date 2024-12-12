Ext.define('Cashweb.view.settings.Accounts',{
	extend: 'Ext.panel.Panel',
	alias: 'widget.accountsettings',
	layout : {
		type : 'fit'
	},
	frame: true,
	bodyBorder: true,
	border: 2,
	bbar : {
					layout : {
						type:'hbox',
						align : 'middle',
						pack : 'center'
					},
					items: [{
						text : 'Add',
						itemId : 'addAccount'
					},{
						text : 'Remove',
						itemId : 'removeAccount'
					}] 
	}
});