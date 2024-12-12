Ext.define('CPON.view.PayCompanyIDPopup', {
	extend : 'Ext.window.Window',
	xtype : 'payCompanyIdPopup',
	requires : ['CPON.view.CreateCompanyIDTab','CPON.view.ClientCompanyAssignmentView',
			'CPON.view.ViewCompanyIDTabGrid', 'Ext.tab.Panel','Ext.button.Button'],
	modal : true,
	config : {
				recordKey : ''
			},
	title : getLabel('companyid', 'Company ID'),
	closeAction:'destroy',
	minHeight : 156,
	maxHeight : 550,
	cls : 'non-xn-popup',
	draggable : false,
	resizable : false,
	accountSetStoreData:null,
	caller : null,
	flagSetFrom : null,
	width : 500,
	layout : 'fit',
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		var accountSetTabView = null;
		accountSetTabView = Ext.create('Ext.tab.Panel', {
			//height : 350,
			width : 250,
			parent:this,
			itemId : 'companyIDTabPanel',
			items : [
					 {
						 title : getLabel('assigncompanyid', 'Assign company ID'),
						 itemId : 'assigntab',
						 items : {
									xtype : 'clientCompanyAssignmentView',
									minHeight : 50,
									maxHeight : 360,
									scroll : 'vertical'
								}
					 },
			         {
						title : getLabel('viewcompanyid', 'View Company ID'),
						itemId : 'gridTab',
						items : [{
									xtype : 'viewCompanyIDTabGrid',
									//height : 240
									minHeight : 50,
									maxHeight : 360,
									scroll : 'vertical'
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
		this.bbar = [{
						text : getLabel('close', 'Close'),
						//cls : 'ux_button-padding ux_button-background-color',
  	   	  			    //cls : 'ux_button-padding ux_cancel-button footer-btns',
						//glyph: 'xf056@fontawesome',
						itemId:'closebtn',
						margin : '0 0 0 0',
						handler : function()
						{
							me.close();
						}
					},'->',{
							text : getLabel('save', 'Save'),
							clickedFrom : null,
							//cls : 'ux_button-padding ux_button-background-color footer-btns company-id-xbtn-left',
							//glyph: 'xf0c7@fontawesome',
							itemId : 'savebtn',
							hidden : true,
							handler : function(btn, opts) {
									me.fireEvent('handleSaveCompanyID', btn, opts);
								}
						},
						{
							text : getLabel('submit', 'Submit'),
							clickedFrom : null,
							cls : 'xn-button',
							itemId : 'submitbtn',
							handler : function(btn, opts) {
								me.fireEvent('assignCompany', btn, opts);
							}
						}];
		this.callParent(arguments);
	}
});
