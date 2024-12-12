Ext.define('GCP.view.SpecifyLocationEntryView', {
    extend : 'Ext.panel.Panel',
    border : false,
    xtype : 'specifyLocationEntryView',
    requires : ['Ext.ux.gcp.SmartGrid'],
    cls: 'ux_panel-background ux_no-padding',
    initComponent : function() {
        var me = this, grid = null;
        actionBar = Ext.create('Ext.toolbar.Toolbar', {
                    itemId : 'dtlsActionBar',
                    componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
                    height : 21,
                    width : '100%',
                    items : [{
                            text : getLabel('actionUnassign', 'Unassign'),
                            disabled : true,
                            itemId:'unassignBtn',
                            actionName : 'unassign',
                            maskPosition : 9
                        }]
                });
        me.items = [{
            xtype : 'container',
            layout : 'hbox',
            componantCls : 'ux_panel-background',
            margin : '6 0 6 0',
            width : '100%',
            items : [{
                    xtype:'container',
                    cls : 'ux_panel-background',
                    itemId : 'locSelectionContainer',
                    items:[{
                        xtype : 'button',
                        border : 0,
                        itemId : 'selectLocBtn',
                        padding : '4 0 4 0',
                        text : '<span class="button_underline">'
                                + getLabel('selectLoc','Select Locations')
                                + '</span>',
                        cls : 'cursor_pointer ux_panel-background'
                    }]}
            ]
        }, {
            xtype : 'panel',
            collapsible : true,
            width : '100%',
            cls : 'xn-ribbon ux_border-bottom ux_extralargemargin-top ux_panel-transparent-background',
            bodyCls : 'x-portlet',
            title : getLabel('locations', 'Locations'),
            itemId : 'prfMstDtlView',
            items : [{
                        xtype : 'container',
                        layout : 'hbox',
                        cls: 'ux_panel-transparent-background',
                        itemId : 'prfMstActionsView',
                        items : [{
                                    xtype : 'label',
                                    text : getLabel('actions', 'Actions') + ':',
                                    cls : 'font_bold ux_font-size14',
                                    padding : '5 0 0 10'
                                }, actionBar, {
                                    xtype : 'label',
                                    text : '',
                                    flex : 1
                                }]

                    }]
        }];
        me.on('resize', function() {
                    me.doLayout();
                });
        me.callParent(arguments);
    }
});