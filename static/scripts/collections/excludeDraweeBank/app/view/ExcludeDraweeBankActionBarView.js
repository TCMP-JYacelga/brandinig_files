/**
 * @class GCP.view.ExcludeDraweeBankActionBarView
 * @extends Ext.toolbar.Toolbar
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.ExcludeDraweeBankActionBarView',{
    extend : 'Ext.toolbar.Toolbar',
    xtype : 'excludeDraweeBankActionBarView',
    enableOverflow : true,
    border : false,
    componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
    initComponent : function() {
        var me = this;
        me.items = [{
            text : getLabel('excludeActionSubmit', 'Submit'),
            disabled : true,
            actionName : 'submit',
            maskPosition : 3,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('excludeActionApprove', 'Approve'),
            disabled : true,
            actionName : 'accept',
            maskPosition : 4,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('excludeActionReject', 'Reject'),
            disabled : true,
            actionName : 'reject',
            maskPosition : 5,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('excludeActionDiscard', 'Discard'),
            disabled : true,
            actionName : 'discard',
            maskPosition : 6,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('excludeActionDelete', 'Delete'),
            disabled : true,
            actionName : 'delete',
            maskPosition : 7,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }];
        me.callParent();
    },
    listeners : {
        resize : function(toolbar, width, height, oldWidth, oldHeight, eOpts){
            var tbarId = toolbar.id;
            var button = Ext.select('a[id="' + tbarId + '-menu-trigger-btnEl"]');
            var imgSpan = Ext.select('span[id="' + tbarId + '-menu-trigger-btnIconEl"]');
            var txtSpan = Ext.select('span[id="' + tbarId + '-menu-trigger-btnInnerEl"]');
            if (button) {
                if (imgSpan)
                    imgSpan.remove();
                if (txtSpan)
                    txtSpan.remove();
                button.setHTML(getLabel('moreMenuTitle', 'more'));
                button.addCls('xn-trigger-cls');
            }
        }
    }
});