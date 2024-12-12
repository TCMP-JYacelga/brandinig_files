/**
 * @class GCP.view.activity.TransactionInitiationView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.activity.TransactionInitiationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'transactionInitiationView',
	requires : ['Ext.Ajax',
			'Ext.ux.gcp.SmartGrid', 'Ext.panel.Panel',
			'Ext.container.Container', 'Ext.button.Button', 'Ext.menu.Menu',
			'Ext.form.field.Text'],
	autoHeight : true,
	width : '100%',
	layout : 'hbox',
	itemId : 'transferFunds',
	cls : 'ux_panel-background',
	initComponent : function() {
		var me = this;
		me.items = [{
						xtype : 'panel',					
						layout : 'hbox',
						flex : 1,
						cls : 'leftfloating',
						items : [{
									xtype : 'label',
									itemId : 'transferFundLabel',
									hidden : true,
									cls : 'ux_font-size14',
									text : getLabel('transferFunds',
											'Transfer Funds:')
								}, {
									xtype : 'button',
									itemId : 'fromThisAccountButton',
									parent : this,
									hidden : true,
									text : '<span class="favlink">'
											+ getLabel('fromThisAccount',
													'From this Account')
											+ '</span>',
									cls : 'xn-account-filter-btnmenu',
									handler : function(btn) {
										this.parent.fireEvent(
												'fromThisAccount', btn);
									}
								}, {
									xtype : 'image',
									itemId : 'fromThisAccountButtonSeperator',
									hidden : true,
									src : 'static/images/icons/icon_spacer.gif',
									height : 16,
									padding : '0 2 0 4'
								}, {
									xtype : 'button',
									itemId : 'toThisAccountButton',
									hidden : true,
									parent : this,
									text : '<span class="favlink">'
											+ getLabel('toThisAccount',
													'To this Account')
											+ '</span>',
									cls : 'xn-account-filter-btnmenu',
									handler : function(btn) {
										this.parent.fireEvent('toThisAccount',
												btn);
									}
								}, {
									xtype : 'image',
									itemId : 'toThisAccountButtonSeperator',
									hidden : true,
									src : 'static/images/icons/icon_spacer.gif',
									height : 16,
									padding : '0 2 0 4'
								}, {
									xtype : 'button',
									itemId : 'loanAccountButton',
									parent : this,
									hidden : true,
									text : '<span class="favlink">'
											+ getLabel("draw", "Draw")
											+ '</span>',
									cls : 'xn-account-filter-btnmenu',
									handler : function(btn) {
										this.parent.fireEvent(
												'loanfromThisAccount', btn);
									}
								}, {
									xtype : 'image',
									itemId : 'loanAccountButtonSeperator',
									hidden : true,
									src : 'static/images/icons/icon_spacer.gif',
									height : 16,
									padding : '0 2 0 4'
								}, {
									xtype : 'button',
									itemId : 'repayAccountButton',
									parent : this,
									hidden : true,
									text : '<span class="favlink">'
											+ getLabel('repay', 'Repay')
											+ '</span>',
									cls : 'xn-account-filter-btnmenu',
									handler : function(btn) {
										this.parent.fireEvent(
												'repayFromThisAccount', btn);
									}
								}, {
									xtype : 'image',
									itemId : 'repayAccountButtonSeperator',
									hidden : true,
									src : 'static/images/icons/icon_spacer.gif',
									height : 16,
									padding : '0 2 0 4'
								}, {
									xtype : 'button',
									itemId : 'purchaseAccountButton',
									parent : this,
									hidden : true,
									text : '<span class="favlink">'
											+ getLabel('purchase', 'Purchase')
											+ '</span>',
									cls : 'xn-account-filter-btnmenu',
									handler : function(btn) {
										this.parent.fireEvent(
												'purchaseFromThisAccount', btn);
									}
								}, {
									xtype : 'image',
									itemId : 'purchaseAccountButtonSeperator',
									hidden : true,
									src : 'static/images/icons/icon_spacer.gif',
									height : 16,
									padding : '0 2 0 4'
								}, {
									xtype : 'button',
									itemId : 'redeemAccountButton',
									parent : this,
									hidden : true,
									text : '<span class="favlink">'
											+ getLabel("redemption",
													"Redemption") + '</span>',
									cls : 'xn-account-filter-btnmenu',
									handler : function(btn) {
										this.parent.fireEvent(
												'redeemFromThisAccount', btn);
									}
								}]
		}];
		me.callParent(arguments);
	},
	doTransactionInitiationVisibility : function(paymentAccount, loanAccount,fundAccount, investmentAccount){
		var me = this;
		var transferFundLabelRef = me.down('label[itemId="transferFundLabel"]');
		var fromThisAccountButtonRef = me.down('button[itemId="fromThisAccountButton"]');
		var fromThisAccountButtonSeperatorRef = me.down('image[itemId="fromThisAccountButtonSeperator"]');
		var toThisAccountButtonRef = me.down('button[itemId="toThisAccountButton"]');
		var toThisAccountButtonSeperatorRef = me.down('image[itemId="toThisAccountButtonSeperator"]');
		var loanAccountButtonRef = me.down('button[itemId="loanAccountButton"]');
		var loanAccountButtonSeperatorRef = me.down('image[itemId="loanAccountButtonSeperator"]');
		var repayAccountButtonRef = me.down('button[itemId="repayAccountButton"]');
		var repayAccountButtonSeperatorRef = me.down('image[itemId="repayAccountButtonSeperator"]');
		var purchaseAccountButtonRef = me.down('button[itemId="purchaseAccountButton"]');
		var purchaseAccountButtonSeperatorRef = me.down('image[itemId="purchaseAccountButtonSeperator"]');
		var redeemAccountButtonRef = me.down('button[itemId="redeemAccountButton"]');

		if (CAN_EDIT === 'true') {
			transferFundLabelRef.show();

			fromThisAccountButtonRef.hide();
			fromThisAccountButtonSeperatorRef.hide();
			toThisAccountButtonRef.hide();
			toThisAccountButtonSeperatorRef.hide();
			purchaseAccountButtonRef.hide();
			purchaseAccountButtonSeperatorRef.hide();
			redeemAccountButtonRef.hide();
			loanAccountButtonRef.hide();
			loanAccountButtonSeperatorRef.hide();
			repayAccountButtonRef.hide();
			
			if (investmentAccount) {
				if (invFeature === 'true') {
					purchaseAccountButtonRef.show();
				} else if (fullRedemFeature === 'true'
						|| partRedemFeature === 'true') {
					purchaseAccountButtonSeperatorRef.show();
					redeemAccountButtonRef.show();
				}
			} else {
				if (paymentAccount && (payFeature === 'true')) {
					fromThisAccountButtonRef.show();
				}
				if (fundAccount && (fundFeature === 'true')) {
					if (paymentAccount && (payFeature === 'true'))
						fromThisAccountButtonSeperatorRef.show();
					toThisAccountButtonRef.show();
				}
				if (loanAccount) {
					if ((paymentAccount && (payFeature === 'true'))
							|| (fundAccount && (fundFeature === 'true')))
						toThisAccountButtonSeperatorRef.show();
					if (loanDrawFeature === 'true')
						loanAccountButtonRef.show();
					if (repayFeature === 'true') {
						loanAccountButtonSeperatorRef.show();
						repayAccountButtonRef.show();
					}
				}
			}
		}
	}
});