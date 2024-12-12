/**
 * @class GCP.view.StationeryProdMstFilterView
 * @extends Ext.panel.Panel
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryProdMstFilterView',{
    extend : 'Ext.panel.Panel',
    xtype : 'stationeryProdMstFilterView',
    requires : ['Ext.ux.gcp.AutoCompleter','Ext.form.field.ComboBox','Ext.data.Store'],
    width : '100%',
    componentCls : 'gradiant_back',
    collapsible : true,
    collapsed :true,
    cls : 'xn-ribbon ux_border-bottom',
    layout : {
        type : 'vbox',
        align : 'stretch'
    },
    initComponent : function() {
        this.items = [{
            xtype : 'panel',
            layout : 'hbox',
            width : '100%',
            cls: 'ux_border-top ux_largepadding ',
            items : [{
                    xtype : 'container',
                    width : '100%',
                    layout : 'column',
                    itemId : 'specificFilter',
                    items :[]
                } ]
        }];
        this.callParent(arguments);
    }
});
