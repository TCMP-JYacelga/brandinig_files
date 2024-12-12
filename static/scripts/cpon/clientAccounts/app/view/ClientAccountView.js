Ext.define('GCP.view.ClientAccountView', {
	extend : 'Ext.container.Container',
	xtype : 'clientAccountView',
	requires : ['Ext.container.Container', 'GCP.view.ClientAccountFilterView',
			'GCP.view.ClientAccountGridView'],
	width : '100%',
	autoHeight : true,
	// minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'toolbar',
			itemId : 'btnActionToolBar',
			margin : '0 0 12 0',
			cls : ' ux_panel-background',
			items : [{
				xtype : 'button',
				itemId : 'btnNewAccount',
				border : 0,
				text : getLabel('account', 'Create New Account'),
				cls : 'cursor_pointer ux_button-padding ux_largemargin-right ux_button-background-color',			
				glyph : 'xf055@fontawesome',
				parent : this,
				padding : '4 0 2 0',
				margin : '0 10 0 0',
				handler : function(btn, opts) {
					me.fireEvent('addAccountEntry', btn, opts);
				}
			}, {
				xtype : 'button',
				itemId : 'btnCancel',
				border : 0,
				text : getLabel('cancel', 'Cancel'),
				parent : this,
				padding : '4 0 2 0',
				cls : 'cursor_pointer ux_button-padding ux_largemargin-right ux_button-background-color',
				glyph : 'xf056@fontawesome',
				handler : function(btn, opts) {
					me.fireEvent('handleCancelButtonAction', btn, opts);
				}
			}, {
				xtype : 'button',
				itemId : 'btnViewChanges',
				border : 0,
				text : !Ext.isEmpty(viewmode) && viewmode == 'VIEW' ? getLabel(
						'viewchanges', 'View Changes') : getLabel(
						'viewstandard', 'View Standard'),
				cls : 'cursor_pointer ux_button-padding ux_button-background-color',
				glyph : !Ext.isEmpty(viewmode) && viewmode == 'VIEW'
						? 'xf07c@fontawesome'
						: 'xf07b@fontawesome',
				parent : this,
				hidden : true,
				padding : '4 0 2 0',
				margin : '0 10 0 0',
				handler : function(btn, opts) {
					this.fireEvent('viewChanges', btn, opts);
				}

			}, '->', {
				xtype : 'button',
				itemId : 'btnNext',
				border : 0,
				text : getLabel('next', 'Next'),
				parent : this,
				padding : '4 0 2 0',
				margin : '0 0 0 6',
				cls : 'cursor_pointer ux_button-padding ux_button-background-color',
				glyph : 'xf0a9@fontawesome',
				handler : function(btn, opts) {
					me.fireEvent('handleNextButtonAction', btn, opts);
				}
			}]
		}, {
			xtype : 'clientAccountFilterView',
			width : '100%',
			margin : '0 0 12 0',
			title : getLabel('filterBy', 'Filter By: ')
					+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
		}, {
			xtype : 'clientAccountGridView',
			width : '100%'
		}, {
			xtype : 'toolbar',
			itemId : 'btnActionToolBar1',
			margin : '0 0 12 0',
			cls : ' ux_panel-background',
			items : [{
				xtype : 'button',
				itemId : 'btnCancel1',
				border : 0,
				text : getLabel('cancel', 'Cancel'),
				parent : this,
				padding : '4 0 2 0',
				cls : 'cursor_pointer ux_button-padding ux_largemargin-right ux_button-background-color',
				glyph : 'xf056@fontawesome',
				handler : function(btn, opts) {
					me.fireEvent('handleCancelButtonAction', btn, opts);
				}
			}, {
				xtype : 'button',
				itemId : 'btnViewChanges1',
				border : 0,
				text : !Ext.isEmpty(viewmode) && viewmode == 'VIEW' ? getLabel(
						'viewchanges', 'View Changes') : getLabel(
						'viewstandard', 'View Standard'),
				cls : 'cursor_pointer ux_button-padding ux_button-background-color',
				glyph : !Ext.isEmpty(viewmode) && viewmode == 'VIEW'
						? 'xf07c@fontawesome'
						: 'xf07b@fontawesome',
				parent : this,
				hidden : true,
				padding : '4 0 2 0',
				margin : '0 10 0 0',
				handler : function(btn, opts) {
					this.fireEvent('viewChanges', btn, opts);
				}

			}, '->', {
				xtype : 'button',
				itemId : 'btnNext1',
				border : 0,
				text : getLabel('next', 'Next'),
				parent : this,
				padding : '4 0 2 0',
				margin : '0 0 0 6',
				cls : 'cursor_pointer ux_button-padding ux_button-background-color',
				glyph : 'xf0a9@fontawesome',
				handler : function(btn, opts) {
					me.fireEvent('handleNextButtonAction', btn, opts);
				}
			}]
		}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});