Ext.define('GCP.view.SignatureSetupGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.SignatureGroupActionBarView','Ext.panel.Panel'],
	xtype : 'signatureSetupGridView',
	width : '100%',
	cls:'xn-ribbon',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.SignatureGroupActionBarView', {
					itemId : 'SignatureGroupActionBarView_Dtl',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
					parent : me
				});
		this.items = [{
				xtype : 'container',
				layout : 'hbox',
				cls: 'ux_panel-background ux_extralargepadding-bottom',
				flex : 1,
				items : [{
							xtype : 'toolbar',
							itemId : 'btnCreateNewToolBar',
							cls : ' ux_panel-background',
							flex : 1,
							items : []
						}, {
							xtype : 'container',
							layout : 'hbox',
							hidden:true,
							cls : 'rightfloating',
							items : [{
								xtype : 'button',
								border : 0,
								itemId : 'btnSearchOnPage',
								text : getLabel('searchOnPage',
										'Search on Page'),
								cls : 'xn-custom-button cursor_pointer',
								padding : '5 0 0 3',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'menu',
											items : [{
												xtype : 'radiogroup',
												itemId : 'matchCriteria',
												vertical : true,
												columns : 1,
												items : [{
													boxLabel : getLabel(
															'exactMatch',
															'Exact Match'),
													name : 'searchOnPage',
													inputValue : 'exactMatch'
												}, {
													boxLabel : getLabel(
															'anyMatch',
															'Any Match'),
													name : 'searchOnPage',
													inputValue : 'anyMatch',
													checked : true
												}]

											}]
										})
							}, {
								xtype : 'textfield',
								itemId : 'searchTextField',
								cls : 'w10',
								padding : '0 0 0 5',
								margin : '0 10 0 0'
							}]
						
			}]
		}, {
			xtype : 'panel',
			collapsible : true,
			width : '100%',
			cls : 'xn-ribbon ux_border-bottom ux_panel-transparent-background',
			bodyCls : 'x-portlet ux_no-padding',
			title : getLabel('signatoryLst', 'Signature List'),
			autoHeight : true,
		//	margin : '5 0 0 0',
			itemId : 'signatureSetupDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_largepaddinglr ux_border-top ux_panel-transparent-background',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ' :',
									cls : 'font_bold ux-ActionLabel',
									padding : '5 0 0 3'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}];
		this.callParent(arguments);
	}

});