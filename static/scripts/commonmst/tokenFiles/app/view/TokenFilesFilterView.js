Ext.define('GCP.view.TokenFilesFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'tokenFilesFilterView',
	requires : [ 'Ext.ux.gcp.AutoCompleter' ],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		var objFileStatusStore = Ext.create('Ext.data.Store', {
			fields : [ 'fileStatus', 'fileStatusDesc' ],
			data : [ {
				fileStatus : null,
				fileStatusDesc : getLabel('all', 'All')
			}, {
				fileStatus : '0',
				fileStatusDesc : getLabel('lbl.filestatus.0', 'New')
			}, {
				fileStatus : '1',
				fileStatusDesc : getLabel('lbl.filestatus.1', 'Completed')
			}, {
				fileStatus : '2',
				fileStatusDesc : getLabel('lbl.filestatus.2', 'Rejected')
			} ]//, {
				//fileStatus : '3',
				//fileStatusDesc : getLabel('lbl.filestatus.3', 'Reload')
			//} ]
		});

		this.items = [ {
			xtype : 'panel',
			cls : 'ux_largepadding',
			itemId : 'specificFilter',
			layout : 'hbox',
			width : '100%',
			items : [ {
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.5,
				items : [ {
					xtype : 'label',
					text : getLabel('lblFileName', 'File Name'),
					cls : 'frmLabel',
					padding : '4 0 0 5'
				}, {
					padding : '1 0 0 0',
					xtype : 'AutoCompleter',
					fieldCls : 'xn-form-text w165 xn-suggestion-box',
					name : 'fileName',
					itemId : 'fileName',
					cfgUrl : 'cpon/{0}.json',
					cfgQueryParamName : 'fileNameFilter',
					cfgRecordCount : -1,
					cfgSeekId : 'fileNameSeek',
					cfgDataNode1 : 'CODE',
					cfgKeyNode : 'CODE',
					enableQueryParam:false,
					cfgProxyMethodType:'POST'
				} ]
			}, {
				xtype : 'panel',
				cls : 'xn-filter-toolbar ',
				layout : 'vbox',
				flex : 0.5,
				items : [ {
					xtype : 'label',
					text : getLabel('lblUserID', 'User ID'),
					cls : 'frmLabel',
					padding : '4 0 0 5'
				}, {
					padding : '1 0 0 0',
					xtype : 'AutoCompleter',
					fieldCls : 'xn-form-text w165 xn-suggestion-box',
					name : 'userDesc',
					itemId : 'userId',
					cfgUrl : 'cpon/{0}.json',
					cfgQueryParamName : 'userIdFilter',
					cfgRecordCount : -1,
					cfgSeekId : 'userIdSeek',
					cfgDataNode1 : 'CODE',
					cfgKeyNode : 'CODE',
					enableQueryParam:false,
					cfgProxyMethodType:'POST',
					generateUrl : function(strQuery) {
						var me = this;
						var strurl=Ext.String.format(me.cfgUrl, me.cfgSeekId);
						return strurl+'?&tokenFileScreenFlag=Y&'+me.cfgQueryParamName+'='+strQuery;
					}
				} ]
			}, {
				xtype : 'panel',
				cls : 'xn-filter-toolbar ',
				layout : 'vbox',
				flex : 0.5,
				items : [ {
					xtype : 'label',
					text : getLabel('tokenstatus', 'Status'),
					cls : 'frmLabel',
					padding : '4 0 0 5'
				}, {
					xtype : 'combo',
					width : 130,
					padding : '1 0 0 0',
					displayField : 'fileStatusDesc',
					fieldCls : 'xn-form-field inline_block x-trigger-noedit',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'fileStatus',
					itemId : 'fileStatus',
					valueField : 'fileStatus',
					name : 'fileStatus',
					editable : false,
					value : 'ALL',
					store : objFileStatusStore
				} ]
			}, {
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.3,
				items : [ {
					xtype : 'panel',
					layout : 'vbox',
					margin : '25 0 1 20',
					items : [ {
						xtype : 'button',
						itemId : 'btnFilter',
						text : getLabel('search', 'Search'),
						cls : 'ux_button-background-color ux_button-padding',
						height : 22
					} ]
				} ]
			} ]
		} ];
		this.callParent(arguments);
	},
	tools : [
				  { xtype : 'container', 
					padding : '0 9 0 0',
					layout : 'hbox',
					items : [{
							 xtype : 'label',
							 text : getLabel('preferences', 'Preferences : '),
							 padding : '2 0 0 0' 
					  }, 
					  {
						  xtype : 'button',
						  itemId : 'btnClearPreferences',
						  disabled : true,
						  text : getLabel('clearFilter', 'Clear'),
						  cls :'xn-account-filter-btnmenu', 
						  textAlign : 'right',
						  width : 40 
					 },
					 {
						  xtype : 'image',
						  src : 'static/images/icons/icon_spacer.gif',
						  height : 18
					}, 
					{ 
						xtype : 'button',
						itemId : 'btnSavePreferences',
						disabled : true,
						text : getLabel('saveFilter', 'Save'),
						cls : 'xn-account-filter-btnmenu',
						textAlign : 'right',
						width : 30
					}]
				  }
			]
});
