Ext.define('GCP.view.PayCompanyIDPopup', {
	extend : 'Ext.window.Window',
	xtype : 'payCompanyIdPopup',
	requires : ['GCP.view.CreateCompanyIDTab',
			'GCP.view.ViewCompanyIDTabGrid', 'Ext.tab.Panel','Ext.button.Button'],
	modal : true,
	config : {
				fnCallback : null
			},
	title : 'Company ID',
	closeAction:'destroy',
	height : 400,
	accountSetStoreData:null,
	caller : null,
	flagSetFrom : null,
	width : 450,
	layout : 'fit',
	initComponent : function() {
		var me = this;
		var accountSetTabView = null;
		accountSetTabView = Ext.create('Ext.tab.Panel', {
			height : 350,
			width : 450,
			parent:this,
			itemId : 'companyIDTabPanel',
			items : [{
						title : getLabel('viewcompanyid', 'View Company ID'),
						itemId : 'gridTab',
						items : [{
									xtype : 'viewCompanyIDTabGrid',
									height : 240
								},{
									xtype : 'button',
									text : '<span class="button_underline thePoniter ux_font-size14-normal">'
											+ getLabel('addCompanyID', 'Add Company ID')
											+ '</span>',
									cls : 'xn-account-filter-btnmenu',
									itemId : 'addFieldBtn',
									border : 0,
									margin : '0 0 0 300',
									handler : function() {
										me.down('tabpanel').setActiveTab(1);
									}
								}]
					}, {
						title : getLabel('createcompanyid', 'Create company ID'),
						itemId : 'createTab',	
						items : {
									xtype : 'createCompanyIDTab'
								}
					}]
				});
		this.items = [accountSetTabView];
		this.buttons = [{
							text : getLabel('save', 'Save'),
							clickedFrom : null,
							cls : 'xn-button',
							itemId : 'savebtn',
							disabled : true
						},{
						text : getLabel('close', 'Close'),
						cls : 'xn-button',
						itemId:'closebtn',
						margin : '6 0 0 0',
						handler : function()
						{
							me.close();
						}
					}];
		this.callParent(arguments);
	}
});
