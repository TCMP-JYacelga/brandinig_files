Ext.define('GCP.view.SubsidiarySelectPopup', {
	extend: 'Ext.window.Window',
	requires: ['Ext.ux.gcp.SmartGrid'],
	xtype: 'subsidiarySelectPopup',
	width : 400,
	autoScroll : true,
	title: '',
	itemId: 'popup_view',
	mode: null,
	modal:true,
	config: {
		searchFlag: false,
		closeAction : 'hide',
		layout: 'fit',
		isAllAssigned : 'N',
		isPrevAllAssigned : 'N'	
	},
	
	initComponent: function() {
		var me = this;
		var searchContainer = null;
		if(me.getSearchFlag() == true) {
			searchContainer = Ext.create('Ext.container.Container', {
				docked: 'top',
				padding: '10 0 5 0',
				layout: {
					type: 'hbox',
					pack: 'end'
				},
				items: [{
					xtype: 'textfield',
					placeHolder: locMessages.SEARCH,
					itemId: 'text_'+me.itemId
				}, {
					xtype: 'button',
					text: locMessages.SEARCH,
					itemId: 'btn_'+me.itemId,
					height: 25
				}]
			});
		}
		
		var pgSize = null;
		pgSize = _GridSizeMaster;
		
		me.items = [searchContainer, {
			xtype: 'smartgrid',
			pageSize: pgSize,
			padding : '5 0 0 0',
			itemId: 'grid_'+me.itemId,
			rowList : _AvailableGridSize,
			minHeight: 170,
			width: 'auto',
			stateful : false,
			showPager : true,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			showHeaderCheckbox: false,
			columnModel: me.colModel,
			storeModel : me.storeModel,
			mode: me.mode,
			listeners: {
				gridPageChange : function(objGrid, strDataUrl,
									intPgSize, intNewPgNo, intOldPgNo,
									jsonSorter) {
								me.fireEvent('gridPageChange', objGrid,
										strDataUrl, intPgSize, intNewPgNo,
										intOldPgNo, jsonSorter);
							},
				gridSortChange : function(objGrid, strDataUrl,
									intPgSize, intNewPgNo, intOldPgNo,
									jsonSorter) {
								me.fireEvent('gridSortChange', objGrid,
										strDataUrl, intPgSize, intNewPgNo,
										intOldPgNo, jsonSorter);
							}
							
			}
		}];
		
		me.buttons = [{
			text: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+locMessages.OK,
			itemId: 'gridOkBtn',
			cls:'ux_button-background-color ux_width-auto ux_no-border',
			glyph: 'xf058@fontawesome'
		}];
		me.callParent(arguments);
	}
});