Ext.define('GCP.view.ProcessingWindowFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'processingWindowFilterView',
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
			}		
		});