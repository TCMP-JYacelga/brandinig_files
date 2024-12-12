Ext.define('GCP.view.FileUploadCenterGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid'],
	xtype : 'fileUploadCenterGridView',
	//cls : 'xn-panel',
	//bodyPadding : '2 4 2 2',
	bodyPadding : '0 0 0 0',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function() {
		var me = this;
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						width : '100%',
						//margin : '6 0 3 0',
						margin : '0 0 0 0',
						flex : 1,
						items : [{
									xtype : 'label',
									text : '',
									flex : 1
								}, {
									xtype : 'container',
									layout : 'hbox',
									cls : 'rightfloating ux_hide-image',
									items : [{
										xtype : 'button',
										border : 0,
										itemId : 'btnSearchOnPage',
										text : getLabel('searchOnPage',
												'Search on Page'),
										cls : 'xn-custom-button cursor_pointer',
										padding : '0 0 0 3',
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
										itemId : 'searchTxnTextField',
										cls : 'w10',
										padding : '0 0 0 5'
									}]
								}]
					}]
		}, {
			xtype : 'panel',
			collapsible : true,
			//cls : 'xn-panel',
			cls : 'x-portlet xn-panel ux_file-details-panel ux_panel-transparent-background',
			title : getLabel('fileDetails', 'File Details'),
			itemId : 'fileUploadCenterDtlViewId',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						//margin : '6 0 3 10',
						margin : '6 0 0 0',
						cls : 'ux_panel-transparent-background',
						flex : 1,
						items : [{
									xtype : 'label',
									text : ''
									//flex : 1
								}, {
									xtype : 'container',
									layout : 'hbox',
									//cls : 'leftfloating',
									items : [{
											xtype : 'button',
											itemId : 'uploadFileId',
											name : 'upload',
											//padding : '6 0 3 850',
											text : '<span class="button_underline thePoniter ux_font-size14-normal underlined ux_blue">'	+ getLabel('uploadFile', 'Import File')+ '</span>',
											cls : 'xn-account-filter-btnmenu',
											handler : function() {
											me.parent.fireEvent('uploadFileEvent', this);
											}
										}]

								}]
					}]
					}];
		this.callParent(arguments);
	}

});