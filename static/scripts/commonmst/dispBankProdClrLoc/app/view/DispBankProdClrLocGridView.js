/**
 * @class GCP.view.DispBankProdClrLocGridView
 * @extends Ext.panel.Panel
 * @author Vivek Bhurke
 */
Ext.define('GCP.view.DispBankProdClrLocGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.DispBankProdClrLocActionBarView','Ext.panel.Panel'],
	xtype : 'dispBankProdClrLocGridView',
	width : '100%',
    cls: 'ux_extralargemargin-top',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.DispBankProdClrLocActionBarView', {
					itemId : 'dispBankProdClrLocActionBarView',
					height : 21,
					width : '100%',
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
					cls : 'rightfloating ux_hide-image',
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
			width : '100%',
			collapsible : true,	
			title : getLabel('dbpclList', 'Bank Product Location List'),
			autoHeight : true,
			cls : 'xn-ribbon ux_panel-transparent-background',
			itemId : 'clientSetupDtlView',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
				items : [{
					xtype : 'label',
					text : getLabel('dbpclActions', 'Actions') + ' :',
					cls : 'font_bold ux-ActionLabel ux_font-size14',
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
