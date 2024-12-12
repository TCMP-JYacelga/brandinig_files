/**
 * @class GCP.view.CourierDlyMaintGridView
 * @extends Ext.panel.Panel
 * @author Sumith Khandagle
 */
Ext.define('GCP.view.CourierDlyMaintGridView', {
    extend : 'Ext.panel.Panel',
    requires : ['Ext.ux.gcp.SmartGrid','GCP.view.CourierDlyMaintActionBarView','Ext.panel.Panel'],
    xtype : 'courierDlyMaintGridView',
    width : '100%',
    cls: 'ux_extralargemargin-top',
    initComponent : function() {
        var me = this;
        var actionBar = Ext.create('GCP.view.CourierDlyMaintActionBarView', {
                    itemId : 'courierDlyMaintActionBarView',
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
                }]
        }, {
            xtype : 'panel',
            width : '100%',
            collapsible : true, 
            title : getLabel('cDlyMaintList', 'Courier Delivery Maintenance List'),
            autoHeight : true,
            cls : 'xn-ribbon ux_panel-transparent-background',
            itemId : 'clientSetupDtlView',
            items : [{
                xtype : 'container',
                layout : 'hbox',
                cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
                items : [{
                    xtype : 'label',
                    text : getLabel('cDlyMaintActions', 'Actions') + ' :',
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
