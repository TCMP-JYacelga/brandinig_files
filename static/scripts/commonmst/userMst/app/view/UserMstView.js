Ext.define('GCP.view.UserMstView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userMstView',
	requires : ['GCP.view.UserMstTitleView', 'GCP.view.UserMstFilterView',
			'GCP.view.UserMstGridView', 'Ext.form.field.ComboBox',
			'Ext.menu.Menu', 'Ext.form.RadioGroup', 'Ext.button.Button',
			'Ext.form.field.Text'],
	autoHeight : true,
	width : '100%',
	initComponent : function() {
		var me = this;
		this.items = [{
					xtype : 'userMstTitleView',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'userMstFilterView',
					width : '100%',
					//margin : '0 0 12 0',
					title : getLabel( 'filterBy', 'Filter By: ' ) + '<img id="imgFilterInfo" class="icon-company">'					
				}, {
					xtype : 'container',
					layout : 'hbox',
					width : '100%',
					cls:'ux_extralargepaddingtb',
					items : [{
						xtype : 'container',
						layout : {
							type : 'hbox'
						},
					//	margin : '6 0 3 0',
						flex : 1,
						items : [{
							xtype : 'container',
							layout : {
								type : 'hbox'
							},
							items : [ {
										xtype : 'button',
										itemId : 'addNewUserId',								
										text :  getLabel('createnewuser', 'Create New User'),										
										glyph : 'xf055@fontawesome',
										cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
										disabled : !canEdit
									}]
						}, {
							xtype : 'label',
							text : '',
							flex : 1
						}, {
							xtype : 'container',
							layout : {
								type : 'hbox'
							},
							hidden:true,
							items : [{
								xtype : 'button',
								border : 0,
								itemId : 'btnSearchOnPage',
								text : getLabel('searchOnPage',
										'Search on Page'),
								cls : 'xn-custom-button cursor_pointer',
								padding : '4 0 0 3',
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
								padding : '0 0 0 5'
							}]
						}]
					}]
				}, {
					xtype : 'userMstGridView'
				}];
		this.callParent(arguments);
	}

});