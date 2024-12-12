Ext.define('GCP.view.ClientSetupFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'clientSetupFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back ux_border-bottom',
			collapsible : true,
			collapsed :true,
			cls : 'xn-ribbon ux_extralargemargin-top',
			layout : {
				type : 'vbox'				
			},
			initComponent : function() {
				var me = this;

				
				this.items = [{
					xtype : 'panel',
					layout : 'hbox',
					width : '100%',
					cls: 'ux_border-top ux_largepadding',
					items : [{
							xtype : 'container',
							width : '100%',
							layout : 'column',
							itemId : 'specificFilter',
							items :[]
						} ]
				}];
				this.callParent(arguments);
			},
			handleSellerChange : function(selectedSeller) {
				var me = this;
				var form;
				var strUrl = 'clientServiceChangeSeller.form';
				var errorMsg = null;
				if (!Ext.isEmpty(strUrl)) {
					form = document.createElement('FORM');
					form.name = 'frmMain';
					form.id = 'frmMain';
					form.method = 'POST';
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							csrfTokenName, tokenValue));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'selectedSellerCode', selectedSeller));

					form.action = strUrl;
					document.body.appendChild(form);
					form.submit();
					document.body.removeChild(form);
				}
			},		
			createFormField : function(element, type, name, value) {
				var inputField;
				inputField = document.createElement(element);
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			}			
		});