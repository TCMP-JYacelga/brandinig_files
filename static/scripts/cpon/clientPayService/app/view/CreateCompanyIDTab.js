Ext.define('GCP.view.CreateCompanyIDTab', {
	extend : 'Ext.form.Panel',
	cls : 'form-pnl-cls',
	layout: {
		type: 'vbox',
		align: 'center'
	},
	xtype : 'createCompanyIDTab',
	requires : [ 'Ext.form.ComboBox', 'Ext.form.field.Text',
	             'Ext.container.Container', 'Ext.form.Label' ],
	             itemId : "createCompanyIDTab",
	             padding : '15 0 0 0',
	             height : 300,
	             initComponent : function() {
	            	 var me = this;
	            	 var accountStore = Ext.create('Ext.data.Store', {
	            		 fields : ['acctNmbr','accountId','ccyCode','bankCode'],
	            		 proxy : {
	            			 type : 'ajax',
	            			 url : 'cpon/clientServiceSetup/accountList.json?id='+encodeURIComponent(parentkey),
							 actionMethods:  {
								create: "POST", 
								read: "POST", 
								update: "POST", 
								destroy: "POST"
							},
	            			 reader : {
	            				 type : 'json',
	            				 root : 'd.accounts'
	            			 }
							 },
						 autoLoad : true
					});
	            	 var defaultAccountComboBoxView = Ext.create(
	            			 'Ext.form.ComboBox', {
	            				 store : accountStore,
								 fieldLabel : getLabel('defaultaccount', 'Default Account'),
								 labelAlign : 'top',
	            				 itemId : 'defaultAccountCombo',
	            				 readOnly : true,
	            				 fieldCls : 'xn-form-field',
	            				 triggerBaseCls : 'xn-form-trigger',
	            				 queryMode : 'local',
	            				 displayField : 'acctNmbr',
								 valueField : 'accountId',
	            				 padding : '0 5 0 0',
								 editable : false
	            			 });
	            	 this.items = [{
	            		        		  xtype : 'textfield',
										  fieldLabel : getLabel('companyid', 'Company ID'),
	            		        		  labelAlign : 'top',
										  width : 150,
										  enforceMaxLength : true,
										  maxLength : 10,
	            		        		  itemId : 'companyIdField'
	            		         }, {
	            		        		  xtype : 'textfield',
										  fieldLabel : getLabel('companyname', 'Company Name'),
	            		        		  labelAlign : 'top',
										  width : 150,
										  enforceMaxLength : true,
										  maxLength : 16,
	            		        		  itemId : 'companyNameField'
	            		         }, defaultAccountComboBoxView ];
					this.callParent(arguments);
	            } 
});