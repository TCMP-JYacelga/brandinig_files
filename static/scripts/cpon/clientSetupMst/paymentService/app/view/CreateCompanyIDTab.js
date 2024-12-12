Ext.define('CPON.view.CreateCompanyIDTab', {
	extend : 'Ext.form.Panel',
	cls : 'ux_extralargemargin-top',
	layout: {
		type: 'vbox',
		align: 'left'
	},
	xtype : 'createCompanyIDTab',
	requires : [ 'Ext.form.ComboBox', 'Ext.form.field.Text',
	             'Ext.container.Container', 'Ext.form.Label' ],
	             itemId : "createCompanyIDTab",
	             //padding : '15 0 0 0',
	             //height : 300,
	             initComponent : function() {
	            	 var me = this;
	            /*	 var accountStore = Ext.create('Ext.data.Store', {
	            		 fields : ['key','value'],
	            		 data :
	            		 [
							
							{
								"key" : "Y",
								"value" : getLabel( 'yes', 'Yes' )
							},
							{
								"key" : "N",
								"value" : getLabel( 'no', 'No' )
							}
						 ]	
					});*/
	            /*	 var defaultAccountComboBoxView = Ext.create(
	            			 'Ext.form.ComboBox', {
	            				 store : accountStore,
								 fieldLabel : getLabel('defaultaccount', 'Default Account'),
								 labelAlign : 'top',
								 readOnly : true,
	            				 itemId : 'defaultAccountCombo',
	            				 fieldCls : 'xn-form-field',
	            				 labelCls : 'ux_font-size14',
	            				 triggerBaseCls : 'xn-form-trigger',
	            				 queryMode : 'local',
	            				 value : "N",
								 emptyText : getLabel('no', 'No'),
	            				 valueField : 'key',
	            				 displayField : 'value',
	            				 padding : '0 5 0 0',
	            				 width : 220,
								 editable : false
	            			 });*/
	            	 this.items = [{
	            		        		  xtype : 'textfield',
										  fieldLabel : getLabel('companyid', 'Company ID'),
										  labelCls : 'ux_font-size14 required',
	            		        		  labelAlign : 'top',
										  width : 220,
										  cls : 'ux_extralargemargin-bottom',
										  enforceMaxLength : true,
										  maxLength : 10,
	            		        		  itemId : 'companyIdField',
	            		        		  listeners : {
	  	            		        		  	'afterrender' : function(field, eOpts) {
	  												var strId = field.getEl() && field.getEl().id ? field
	  														.getEl().id : null;
	  												var inputField = strId ? $('#' + strId + '-inputEl') : null;
	  												if (inputField) {
	  													var fieldJson = JSON.stringify(fieldInputConfig);
	  													fieldJson = JSON.parse(fieldJson);
	  													if (typeof getMetaDataKey == 'function')
	  														var RmWeight = getMetaDataKey();
	  													else{
	  														RmWeight = intWeight;
	  													}
	  													if (fieldJson && typeof RmWeight != 'undefined') {
	  														var nodeForThisPage = fieldJson[RmWeight];
	  														if (nodeForThisPage && nodeForThisPage.length > 0) {
	  															for (var i = 0; i < nodeForThisPage.length; i++) {
	  																if (nodeForThisPage[i].fieldName === "companyId") {
	  																	inputField.ValidateText(
	  																		nodeForThisPage[i].pattern,
	  																		nodeForThisPage[i].allowSeek);
	  																}
	  															}
	  														}
	  													}
	  												}
	  											}
	  	            		        		  }
	            		         }, {
	            		        		  xtype : 'textfield',
										  fieldLabel : getLabel('companyname', 'Company Name'),
										  labelCls : 'leftAlign ux_font-size14 required',
	            		        		  labelAlign : 'top',
										  width : 220,
										  cls : 'ux_extralargemargin-bottom',
										  enforceMaxLength : true,
										  maxLength : 16,
	            		        		  itemId : 'companyNameField',
	            		        		  listeners : {
		            		        		  	'afterrender' : function(field, eOpts) {
													var strId = field.getEl() && field.getEl().id ? field
															.getEl().id : null;
													var inputField = strId ? $('#' + strId + '-inputEl') : null;
													if (inputField) {
														var fieldJson = JSON.stringify(fieldInputConfig);
														fieldJson = JSON.parse(fieldJson);
														if (typeof getMetaDataKey == 'function')
															var RmWeight = getMetaDataKey();
														else{
															RmWeight = intWeight;
														}
														if (fieldJson && typeof RmWeight != 'undefined') {
															var nodeForThisPage = fieldJson[RmWeight];
															if (nodeForThisPage && nodeForThisPage.length > 0) {
																for (var i = 0; i < nodeForThisPage.length; i++) {
																	if (nodeForThisPage[i].fieldName === "companyName") {
																		inputField.ValidateText(
																			nodeForThisPage[i].pattern,
																			nodeForThisPage[i].allowSeek);
																	}
																}
															}
														}
													}
												}
		            		        		  }
	            		         } ];
					this.callParent(arguments);
	            } 
});