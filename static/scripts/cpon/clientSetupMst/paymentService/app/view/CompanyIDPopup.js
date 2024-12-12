Ext.define('CPON.view.CompanyIDPopup', {
	extend : 'Ext.window.Window',
	xtype : 'companyIdPopup',
	requires : ['CPON.view.CreateCompanyIDTab',
			'CPON.view.CompanyIDTabGrid', 'Ext.tab.Panel','Ext.button.Button'],
	modal : true,
	config : {
				id : null
			},
	title : getLabel('companyid','Company ID'),
	closeAction:'destroy',
	height : 400,
	accountSetStoreData:null,
	caller : null,
	flagSetFrom : null,
	overflow : 'auto',
	width : 430,
	layout : 'fit',
	initComponent : function() {
		var me = this;
		var accountSetTabView = null;
		accountSetTabView = Ext.create('Ext.tab.Panel', {
			height : 400,
			width : 450,
			parent:this,
			itemId : 'vcompanyIDTabPanel',
			items : [{
						title : getLabel('viewcompanyid', 'View Company ID'),
						itemId : 'firsttab',
						items : [{
									xtype : 'companyIDTabGrid'
								},{
									xtype : 'button',
									text : '<span class="button_underline thePoniter ux_font-size14-normal">'
											+ getLabel('addCompanyID', 'Add Company ID')
											+ '</span>',
									cls : 'xn-account-filter-btnmenu',
									itemId : 'addFieldBtn',
									border : 0,
									margin : '0 0 0 300'
								}]
					}, {
						title : getLabel('createcompanyid', 'Create company ID'),
						itemId : 'secondtab',
						items : {
									xtype : 'createCompanyIDTab'
								}
					}]
				});
		this.items = [accountSetTabView];
		this.buttons = [{
							text : getLabel('submit', 'Submit'),
							clickedFrom : null,
							cls : 'xn-button',
							itemId : 'savebtn',
							handler : function() {
								
								this.fireEvent("assignCompany",adminListView.getSelectedRecords(),me.id);
							}
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
