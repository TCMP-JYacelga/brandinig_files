/**
 * @class GCP.view.CreditCardBinMstView
 * @extends Ext.container.Container
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.CreditCardBinMstView',
{
    extend : 'Ext.container.Container',
    xtype : 'creditCardBinMstView',
    requires : [ 'Ext.container.Container',
            'GCP.view.CreditCardBinMstTitleView',
            'GCP.view.CreditCardBinMstFilterView',
            'GCP.view.CreditCardBinMstGridView' ],
    width : '100%',
    autoHeight : true,
    minHeight : 600,
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'creditCardBinMstTitleView',
            width : '100%',
            cls : 'ux_no-border ux_largepaddingtb'
        },{
            xtype : 'creditCardBinMstFilterView',
            width : '100%',
            title : getLabel('filterBy', 'Filter By: ') + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
        },{
            xtype : 'creditCardBinMstGridView',
            width : '100%'
        }];
        me.on('resize', function() {
            me.doLayout();
        });
        me.callParent(arguments);
    }
});
