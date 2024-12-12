/**
 * @class GCP.view.StationeryProdMstGridView
 * @extends Ext.panel.Panel
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryProdMstGridView',{
    extend : 'Ext.panel.Panel',
    requires : ['Ext.ux.gcp.SmartGrid','GCP.view.StationeryProdMstActionBarView','Ext.panel.Panel'],
    xtype : 'stationeryProdMstGridView',
    width : '100%',
    cls: 'ux_extralargemargin-top',
    initComponent : function(){
        var me = this;
        var actionBar = Ext.create('GCP.view.StationeryProdMstActionBarView',{
                    itemId : 'stationeryProdMstActionBarView',
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
        },{
            xtype : 'panel',
            width : '100%',
            collapsible : true, 
            title : getLabel('stnProdMstList', 'Stationery Product Master List'),
            autoHeight : true,
            cls : 'xn-ribbon ux_panel-transparent-background',
            itemId : 'stationeryProdMstDtlView',
            items : [{
                xtype : 'container',
                layout : 'hbox',
                cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
                items : [{
                    xtype : 'label',
                    text : getLabel('stnProdMstActions', 'Actions') + ' :',
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
