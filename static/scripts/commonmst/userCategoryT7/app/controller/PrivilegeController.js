Ext.define('GCP.controller.PrivilegeController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.AdminPriviligesPopup','GCP.view.BRPriviligesPopup','GCP.view.PayPriviligesPopup','GCP.view.ColPriviligesPopup','GCP.view.FSCPriviligesPopup','GCP.view.LiquidityPriviligesPopup','GCP.view.PortalPriviligesPopup', 
	'GCP.view.TradePriviligesPopup','GCP.view.ForecastPriviligesPopup'],
	refs : [
			{
				ref : 'adminViewIcon',
				selector : 'adminPriviligesPopup container panel panel[id="adminHeader"] button[itemId="adminHeader_viewIcon"]'
			},{
				ref : 'adminEditIcon',
				selector : 'adminPriviligesPopup container panel panel[id="adminHeader"] button[itemId="adminHeader_editIcon"]'
			},{
				ref : 'adminAuthIcon',
				selector : 'adminPriviligesPopup container panel panel[id="adminHeader"] button[itemId="adminHeader_authIcon"]'
			},{
				ref : 'adminPanel',
				selector : 'adminPriviligesPopup container panel panel[id="userAdminParametersSection"]'
			},
			
			{
				ref : 'othersViewIcon',
				selector : 'adminPriviligesPopup container panel panel[id="othersHeader"] button[itemId="othersHeader_viewIcon"]'
			},{
				ref : 'othersEditIcon',
				selector : 'adminPriviligesPopup container panel panel[id="othersHeader"] button[itemId="othersHeader_editIcon"]'
			},{
				ref : 'othersAuthIcon',
				selector : 'adminPriviligesPopup container panel panel[id="othersHeader"] button[itemId="othersHeader_authIcon"]'
			},{
				ref : 'othersPanel',
				selector : 'adminPriviligesPopup container panel panel[id="othersSection"]'
			},
			
			// BR Popup
			{
				ref : 'brViewIcon',
				selector : 'bRPriviligesPopup container panel panel[id="brHeader"] button[itemId="brHeader_viewIcon"]'
			},{
				ref : 'brEditIcon',
				selector : 'bRPriviligesPopup container panel panel[id="brHeader"] button[itemId="brHeader_editIcon"]'
			},{
				ref : 'brAuthIcon',
				selector : 'bRPriviligesPopup container panel panel[id="brHeader"] button[itemId="brHeader_authIcon"]'
			},{
				ref : 'brPanel',
				selector : 'bRPriviligesPopup container panel panel[id="brSection"]'
			},
						
			{
				ref : 'loanHeaderViewIcon',
				selector : 'bRPriviligesPopup container panel panel[id="loanHeader"] button[itemId="loanHeader_viewIcon"]'
			},{
				ref : 'loanHeaderEditIcon',
				selector : 'bRPriviligesPopup container panel panel[id="loanHeader"] button[itemId="loanHeader_editIcon"]'
			},{
				ref : 'loanHeaderAuthIcon',
				selector : 'bRPriviligesPopup container panel panel[id="loanHeader"] button[itemId="loanHeader_authIcon"]'
			},{
				ref : 'loanHeaderPanel',
				selector : 'bRPriviligesPopup container panel panel[id="loanSection"]'
			},
			
			{
				ref : 'investHeaderViewIcon',
				selector : 'bRPriviligesPopup container panel panel[id="investHeader"] button[itemId="investHeader_viewIcon"]'
			},{
				ref : 'investHeaderViewIcon',
				selector : 'bRPriviligesPopup container panel panel[id="investHeader"] button[itemId="investHeader_editIcon"]'
			},{
				ref : 'investHeaderViewIcon',
				selector : 'bRPriviligesPopup container panel panel[id="investHeader"] button[itemId="investHeader_authIcon"]'
			},{
				ref : 'investHeaderPanel',
				selector : 'bRPriviligesPopup container panel panel[id="investHeader"]'
			},
			
			{
				ref : 'depviewHeaderViewIcon',
				selector : 'bRPriviligesPopup container panel panel[id="depviewHeader"] button[itemId="depviewHeader_viewIcon"]'
			},{
				ref : 'depviewHeaderViewIcon',
				selector : 'bRPriviligesPopup container panel panel[id="depviewHeader"] button[itemId="depviewHeader_editIcon"]'
			},{
				ref : 'depviewHeaderViewIcon',
				selector : 'bRPriviligesPopup container panel panel[id="depviewHeader"] button[itemId="depviewHeader_authIcon"]'
			},{
				ref : 'depviewHeaderPanel',
				selector : 'bRPriviligesPopup container panel panel[id="depviewHeader"]'
			},
			
			
			{
				ref : 'incomingWireHeaderViewIcon',
				selector : 'bRPriviligesPopup container panel panel[id="incomingWireHeader"] button[itemId="dincomingWireHeader_viewIcon"]'
			},{
				ref : 'incomingWireHeaderEditIcon',
				selector : 'bRPriviligesPopup container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_editIcon"]'
			},{
				ref : 'incomingWireHeaderAuthIcon',
				selector : 'bRPriviligesPopup container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_authIcon"]'
			},{
				ref : 'incomingWireHeaderPanel',
				selector : 'bRPriviligesPopup container panel panel[id="incomingWireHeader"]'
			},
			
			// Portal Popup
			
			{
				ref : 'portalSetupHeaderViewIcon',
				selector : 'portalPriviligesPopup container panel panel[id="portalSetupHeader"] button[itemId="portalSetupHeader_viewIcon"]'
			},{
				ref : 'portalSetupHeaderEditIcon',
				selector : 'portalPriviligesPopup container panel panel[id="portalSetupHeader"] button[itemId="portalSetupHeader_editIcon"]'
			},{
				ref : 'portalSetupHeaderAuthIcon',
				selector : 'portalPriviligesPopup container panel panel[id="portalSetupHeader"] button[itemId="portalSetupHeader_authIcon"]'
			},{
				ref : 'portalSetupHeaderPanel',
				selector : 'portalPriviligesPopup container panel panel[id="portalSetupSection"]'
			},
			
			// Collection Popup
			
			{
				ref : 'colSetupHeaderViewIcon',
				selector : 'colPriviligesPopup container panel panel[id="colSetupHeader"] button[itemId="colSetupHeader_viewIcon"]'
			},{
				ref : 'colSetupHeaderEditIcon',
				selector : 'colPriviligesPopup container panel panel[id="colSetupHeader"] button[itemId="colSetupHeader_editIcon"]'
			},{
				ref : 'colSetupHeaderAuthIcon',
				selector : 'colPriviligesPopup container panel panel[id="colSetupHeader"] button[itemId="colSetupHeader_authIcon"]'
			},{
				ref : 'colSetupHeaderPanel',
				selector : 'colPriviligesPopup container panel panel[id="colSetupSection"]'
			},
						
			{
				ref : 'txncolHeaderViewIcon',
				selector : 'colPriviligesPopup container panel panel[id="txncolHeader"] button[itemId="txncolHeader_viewIcon"]'
			},{
				ref : 'txncolHeaderEditIcon',
				selector : 'colPriviligesPopup container panel panel[id="txncolHeader"] button[itemId="txncolHeader_editIcon"]'
			},{
				ref : 'txncolHeaderAuthIcon',
				selector : 'colPriviligesPopup container panel panel[id="txncolHeader"] button[itemId="txncolHeader_authIcon"]'
			},{
				ref : 'txncolHeaderHeaderPanel',
				selector : 'colPriviligesPopup container panel panel[id="txncolSection"]'
			},
			
			{
				ref : 'colfileoptHeaderViewIcon',
				selector : 'colPriviligesPopup container panel panel[id="colfileoptHeader"] button[itemId="colfileoptHeader_viewIcon"]'
			},{
				ref : 'colfileoptHeaderEditIcon',
				selector : 'colPriviligesPopup container panel panel[id="colfileoptHeader"] button[itemId="colfileoptHeader_editIcon"]'
			},{
				ref : 'colfileoptHeaderAuthIcon',
				selector : 'colPriviligesPopup container panel panel[id="colfileoptHeader"] button[itemId="colfileoptHeader_authIcon"]'
			},{
				ref : 'colfileoptHeaderHeaderPanel',
				selector : 'colPriviligesPopup container panel panel[id="colfileoptSection"]'
			},
			
		
			
			// Payment Popup
			
			{
				ref : 'paySetupHeaderViewIcon',
				selector : 'payPriviligesPopup container panel panel[id="paySetupHeader"] button[itemId="paySetupHeader_viewIcon"]'
			},{
				ref : 'paySetupHeaderEditIcon',
				selector : 'payPriviligesPopup container panel panel[id="paySetupHeader"] button[itemId="paySetupHeader_editIcon"]'
			},{
				ref : 'paySetupHeaderAuthIcon',
				selector : 'payPriviligesPopup container panel panel[id="paySetupHeader"] button[itemId="paySetupHeader_authIcon"]'
			},{
				ref : 'paySetupHeaderPanel',
				selector : 'payPriviligesPopup container panel panel[id="paySetupSection"]'
			},
						
			{
				ref : 'txnHeaderViewIcon',
				selector : 'payPriviligesPopup container panel panel[id="txnHeader"] button[itemId="txnHeader_viewIcon"]'
			},{
				ref : 'txnHeaderEditIcon',
				selector : 'payPriviligesPopup container panel panel[id="txnHeader"] button[itemId="txnHeader_editIcon"]'
			},{
				ref : 'txnHeaderAuthIcon',
				selector : 'payPriviligesPopup container panel panel[id="txnHeader"] button[itemId="txnHeader_authIcon"]'
			},{
				ref : 'txnHeaderHeaderPanel',
				selector : 'payPriviligesPopup container panel panel[id="txnSection"]'
			},
			
			{
				ref : 'fileoptHeaderViewIcon',
				selector : 'payPriviligesPopup container panel panel[id="fileoptHeader"] button[itemId="fileoptHeader_viewIcon"]'
			},{
				ref : 'fileoptHeaderEditIcon',
				selector : 'payPriviligesPopup container panel panel[id="fileoptHeader"] button[itemId="fileoptHeader_editIcon"]'
			},{
				ref : 'fileoptHeaderAuthIcon',
				selector : 'payPriviligesPopup container panel panel[id="fileoptHeader"] button[itemId="fileoptHeader_authIcon"]'
			},{
				ref : 'fileoptHeaderHeaderPanel',
				selector : 'payPriviligesPopup container panel panel[id="fileoptSection"]'
			},
			
			{
				ref : 'tmpSummaryHeaderViewIcon',
				selector : 'payPriviligesPopup container panel panel[id="tmpSummaryHeader"] button[itemId="tmpSummaryHeader_viewIcon"]'
			},{
				ref : 'tmpSummaryHeaderEditIcon',
				selector : 'payPriviligesPopup container panel panel[id="tmpSummaryHeader"] button[itemId="tmpSummaryHeader_editIcon"]'
			},{
				ref : 'tmpSummaryHeaderAuthIcon',
				selector : 'payPriviligesPopup container panel panel[id="tmpSummaryHeader"] button[itemId="tmpSummaryHeader_authIcon"]'
			},
			
			{
				ref : 'standingInstructionHeaderViewIcon',
				selector : 'payPriviligesPopup container panel panel[id="standingInstructionHeader"] button[itemId="standingInstructionHeader_viewIcon"]'
			},{
				ref : 'standingInstructionHeaderEditIcon',
				selector : 'payPriviligesPopup container panel panel[id="standingInstructionHeader"] button[itemId="standingInstructionHeader_editIcon"]'
			},{
				ref : 'standingInstructionHeaderAuthIcon',
				selector : 'payPriviligesPopup container panel panel[id="standingInstructionHeader"] button[itemId="standingInstructionHeader_authIcon"]'
			}
			// FSC Popup
			,
			{
				ref : 'fscHeaderViewIcon',
				selector : 'fscPriviligesPopup container panel panel[id="fscHeader"] button[itemId="fscHeader_viewIcon"]'
			},{
				ref : 'fscHeaderEditIcon',
				selector : 'fscPriviligesPopup container panel panel[id="fscHeader"] button[itemId="fscHeader_editIcon"]'
			},{
				ref : 'fscHeaderAuthIcon',
				selector : 'fscPriviligesPopup container panel panel[id="fscHeader"] button[itemId="fscHeader_authIcon"]'
			},
			{
				ref : 'fscHeaderPanel',
				selector : 'fscPriviligesPopup container panel panel[id="fscSection"]'
			},
			
			{
				ref : 'ftxnsHeaderViewIcon',
				selector : 'fscPriviligesPopup container panel panel[id="ftxnsHeader"] button[itemId="ftxnsHeader_viewIcon"]'
			},{
				ref : 'ftxnsHeaderEditIcon',
				selector : 'fscPriviligesPopup container panel panel[id="ftxnsHeader"] button[itemId="ftxnsHeader_editIcon"]'
			},{
				ref : 'ftxnsHeaderAuthIcon',
				selector : 'fscPriviligesPopup container panel panel[id="ftxnsHeader"] button[itemId="ftxnsHeader_authIcon"]'
			},
			{
				ref : 'ftxnsHeaderPanel',
				selector : 'fscPriviligesPopup container panel panel[id="ftxnsSection"]'
			},
			
			{
				ref : 'flupHeaderViewIcon',
				selector : 'fscPriviligesPopup container panel panel[id="flupHeader"] button[itemId="flupHeader_viewIcon"]'
			},{
				ref : 'flupHeaderEditIcon',
				selector : 'fscPriviligesPopup container panel panel[id="flupHeader"] button[itemId="flupHeader_editIcon"]'
			},{
				ref : 'flupHeaderAuthIcon',
				selector : 'fscPriviligesPopup container panel panel[id="flupHeader"] button[itemId="flupHeader_authIcon"]'
			},
			{
				ref : 'flupHeaderPanel',
				selector : 'fscPriviligesPopup container panel panel[id="flupSection"]'
			},
			
			{
				ref : 'lmsHeaderViewIcon',
				selector : 'liquidityPriviligesPopup container panel panel[id="lmsHeader"] button[itemId="lmsHeader_viewIcon"]'
			},{
				ref : 'lmsHeaderEditIcon',
				selector : 'liquidityPriviligesPopup container panel panel[id="lmsHeader"] button[itemId="lmsHeader_editIcon"]'
			},{
				ref : 'lmsHeaderAuthIcon',
				selector : 'liquidityPriviligesPopup container panel panel[id="lmsHeader"] button[itemId="lmsHeader_authIcon"]'
			},
			{
				ref : 'lmsHeaderPanel',
				selector : 'liquidityPriviligesPopup container panel panel[id="lmsSection"]'
			},
			
			{
				ref : 'txnsHeaderViewIcon',
				selector : 'liquidityPriviligesPopup container panel panel[id="txnsHeader"] button[itemId="txnsHeader_viewIcon"]'
			},{
				ref : 'txnsHeaderEditIcon',
				selector : 'liquidityPriviligesPopup container panel panel[id="txnsHeader"] button[itemId="txnsHeader_editIcon"]'
			},{
				ref : 'txnsHeaderAuthIcon',
				selector : 'liquidityPriviligesPopup container panel panel[id="txnsHeader"] button[itemId="txnsHeader_authIcon"]'
			},
			{
				ref : 'txnsHeaderPanel',
				selector : 'liquidityPriviligesPopup container panel panel[id="txnsSection"]'
			},
			
			{
				ref : 'queryHeaderViewIcon',
				selector : 'liquidityPriviligesPopup container panel panel[id="queryHeader"] button[itemId="queryHeader_viewIcon"]'
			},{
				ref : 'queryHeaderEditIcon',
				selector : 'liquidityPriviligesPopup container panel panel[id="queryHeader"] button[itemId="queryHeader_editIcon"]'
			},{
				ref : 'queryHeaderAuthIcon',
				selector : 'liquidityPriviligesPopup container panel panel[id="queryHeader"] button[itemId="queryHeader_authIcon"]'
			},
			{
				ref : 'queryHeaderPanel',
				selector : 'liquidityPriviligesPopup container panel panel[id="querySection"]'
			},
			
			// E Trade Priviliges Popup
			{
				ref : 'eTradeSetupViewIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeSetupHeader"] button[itemId="eTradeSetupHeader_viewIcon"]'
			},{
				ref : 'eTradeSetupEditIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeSetupHeader"] button[itemId="eTradeSetupHeader_editIcon"]'
			},{
				ref : 'eTradeSetupAuthIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeSetupHeader"] button[itemId="eTradeSetupHeader_authIcon"]'
			},{
				ref : 'eTradeSetupPanel',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeSetupSection"]'
			},
			
			{
				ref : 'eTradeImpSetupViewIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeImpSetupHeader"] button[itemId="eTradeImpSetupHeader_viewIcon"]'
			},{
				ref : 'eTradeImpSetupEditIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeImpSetupHeader"] button[itemId="eTradeImpSetupHeader_editIcon"]'
			},{
				ref : 'eTradeImpSetupAuthIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeImpSetupHeader"] button[itemId="eTradeImpSetupHeader_authIcon"]'
			},{
				ref : 'eTradeImpSetupPanel',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeImpSetupSection"]'
			},
			
			{
				ref : 'eTradeExpSetupViewIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeExpSetupHeader"] button[itemId="eTradeExpSetupHeader_viewIcon"]'
			},{
				ref : 'eTradeExpSetupEditIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeExpSetupHeader"] button[itemId="eTradeExpSetupHeader_editIcon"]'
			},{
				ref : 'eTradeExpSetupAuthIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeExpSetupHeader"] button[itemId="eTradeExpSetupHeader_authIcon"]'
			},{
				ref : 'eTradeExpSetupPanel',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeExpSetupSection"]'
			},
			
			{
				ref : 'eTradeLoansViewIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeLoansHeader"] button[itemId="eTradeLoansHeader_viewIcon"]'
			},{
				ref : 'eTradeLoansEditIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeLoansHeader"] button[itemId="eTradeLoansHeader_editIcon"]'
			},{
				ref : 'eTradeLoansAuthIcon',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeLoansHeader"] button[itemId="eTradeLoansHeader_authIcon"]'
			},{
				ref : 'eTradeLoansPanel',
				selector : 'tradePriviligesPopup container panel panel[id="eTradeLoansSection"]'
			},
			
			// Forecast Priviliges Popup
			{
				ref : 'forecastSetupViewIcon',
				selector : 'forecastPriviligesPopup container panel panel[id="forecastSetupHeader"] button[itemId="forecastSetupHeader_viewIcon"]'
			},{
				ref : 'forecastSetupEditIcon',
				selector : 'forecastPriviligesPopup container panel panel[id="forecastSetupHeader"] button[itemId="forecastSetupHeader_editIcon"]'
			},{
				ref : 'forecastSetupAuthIcon',
				selector : 'forecastPriviligesPopup container panel panel[id="forecastSetupHeader"] button[itemId="forecastSetupHeader_authIcon"]'
			},{
				ref : 'forecastSetupPanel',
				selector : 'forecastPriviligesPopup container panel panel[id="forecastSetupSection"]'
			},
			
			{
				ref : 'forecastTransactionViewIcon',
				selector : 'forecastPriviligesPopup container panel panel[id="forecastTransactionHeader"] button[itemId="forecastTransactionHeader_viewIcon"]'
			},{
				ref : 'forecastTransactionEditIcon',
				selector : 'forecastPriviligesPopup container panel panel[id="forecastTransactionHeader"] button[itemId="forecastTransactionHeader_editIcon"]'
			},{
				ref : 'forecastTransactionAuthIcon',
				selector : 'forecastPriviligesPopup container panel panel[id="forecastTransactionHeader"] button[itemId="forecastTransactionHeader_authIcon"]'
			},{
				ref : 'forecastTransactionPanel',
				selector : 'forecastPriviligesPopup container panel panel[id="forecastTransactionSection"]'
			},
			
			// Mobile Privileges Popup
			{
				ref : 'mobileAdminViewIcon',
				selector : 'mobilePrivilegesPopup container panel panel[id="mobileAdminHeader"] button[itemId="mobileAdminHeader_viewIcon"]'
			},{
				ref : 'mobileAdminEditIcon',
				selector : 'mobilePrivilegesPopup container panel panel[id="mobileAdminHeader"] button[itemId="mobileAdminHeader_editIcon"]'
			},{
				ref : 'mobileAdminAuthIcon',
				selector : 'mobilePrivilegesPopup container panel panel[id="mobileAdminHeader"] button[itemId="mobileAdminHeader_authIcon"]'
			},{
				ref : 'mobileAdminPanel',
				selector : 'mobilePrivilegesPopup container panel panel[id="mobileAdminSection"]'
			}
			
			],
	init : function() {
		var me = this;
		me.control({
					'adminPriviligesPopup container panel panel[id="adminHeader"] checkbox[itemId="adminHeader_viewIcon"]' : {
						change : me.toggleCheckUncheck //button click
						},
					'adminPriviligesPopup container panel panel[id="adminHeader"] checkbox[itemId="adminHeader_editIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'adminPriviligesPopup container panel panel[id="adminHeader"] checkbox[itemId="adminHeader_authIcon"]' : {
						change : me.toggleCheckUncheck
						},
						
					'adminPriviligesPopup container panel panel[id="othersHeader"] button[itemId="othersHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'adminPriviligesPopup container panel panel[id="othersHeader"] button[itemId="othersHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'adminPriviligesPopup container panel panel[id="othersHeader"] button[itemId="othersHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},
					// BR POPUP
					'bRPriviligesPopup container panel panel[id="brHeader"] checkbox[itemId="brHeader_viewIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="brHeader"] checkbox[itemId="brHeader_editIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="brHeader"] checkbox[itemId="brHeader_authIcon"]' : {
						change : me.toggleCheckUncheck
						},
						
						
					'bRPriviligesPopup container panel panel[id="loanHeader"] button[itemId="loanHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="loanHeader"] button[itemId="loanHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="loanHeader"] button[itemId="loanHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},
						
					'bRPriviligesPopup container panel panel[id="investHeader"] button[itemId="investHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="investHeader"] button[itemId="investHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="investHeader"] button[itemId="investHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},
						
						
					'bRPriviligesPopup container panel panel[id="depviewHeader"] button[itemId="depviewHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="depviewHeader"] button[itemId="depviewHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="depviewHeader"] button[itemId="depviewHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},
						
					'bRPriviligesPopup container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'bRPriviligesPopup container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},
					
						// Portal POPUP
						'portalPriviligesPopup container panel panel[id="portalSetupHeader"] checkbox[itemId="portalSetupHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'portalPriviligesPopup container panel panel[id="portalSetupHeader"] checkbox[itemId="portalSetupHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'portalPriviligesPopup container panel panel[id="portalSetupHeader"] checkbox[itemId="portalSetupHeader_authIcon"]' : {
							change : me.toggleCheckUncheck
							},
							
						// COLLECTION POPUP
						'colPriviligesPopup container panel panel[id="colSetupHeader"] button[itemId="colSetupHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'colPriviligesPopup container panel panel[id="colSetupHeader"] button[itemId="colSetupHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'colPriviligesPopup container panel panel[id="colSetupHeader"] button[itemId="colSetupHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
							
						'colPriviligesPopup container panel panel[id="txncolHeader"] button[itemId="txncolHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'colPriviligesPopup container panel panel[id="txncolHeader"] button[itemId="txncolHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'colPriviligesPopup container panel panel[id="txncolHeader"] button[itemId="txncolHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
						
						'colPriviligesPopup container panel panel[id="colfileoptHeader"] button[itemId="colfileoptHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'colPriviligesPopup container panel panel[id="colfileoptHeader"] button[itemId="colfileoptHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'colPriviligesPopup container panel panel[id="colfileoptHeader"] button[itemId="colfileoptHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
						
						
						
						
					// PAYMENT POPUP
					'payPriviligesPopup container panel panel[id="paySetupHeader"] checkbox[itemId="paySetupHeader_viewIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="paySetupHeader"] checkbox[itemId="paySetupHeader_editIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="paySetupHeader"] checkbox[itemId="paySetupHeader_authIcon"]' : {
						change : me.toggleCheckUncheck
						},
						
					'payPriviligesPopup container panel panel[id="txnHeader"] checkbox[itemId="txnHeader_viewIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="txnHeader"] checkbox[itemId="txnHeader_editIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="txnHeader"] checkbox[itemId="txnHeader_authIcon"]' : {
						change : me.toggleCheckUncheck
						},
					
					'payPriviligesPopup container panel panel[id="fileoptHeader"] checkbox[itemId="fileoptHeader_viewIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="fileoptHeader"] checkbox[itemId="fileoptHeader_editIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="fileoptHeader"] checkbox[itemId="fileoptHeader_authIcon"]' : {
						change : me.toggleCheckUncheck
						},
					
					'payPriviligesPopup container panel panel[id="tmpSummaryHeader"] button[itemId="tmpSummaryHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="tmpSummaryHeader"] button[itemId="tmpSummaryHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="tmpSummaryHeader"] button[itemId="tmpSummaryHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},
					
					
					'payPriviligesPopup container panel panel[id="standingInstructionHeader"] button[itemId="standingInstructionHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="standingInstructionHeader"] button[itemId="standingInstructionHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'payPriviligesPopup container panel panel[id="standingInstructionHeader"] button[itemId="standingInstructionHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},					
					

					'fscPriviligesPopup container panel panel[id="fscHeader"] checkbox[itemId="fscHeader_viewIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'fscPriviligesPopup container panel panel[id="fscHeader"] checkbox[itemId="fscHeader_editIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'fscPriviligesPopup container panel panel[id="fscHeader"] checkbox[itemId="fscHeader_authIcon"]' : {
						change : me.toggleCheckUncheck
						},
						
						'fscPriviligesPopup container panel panel[id="ftxnsHeader"] checkbox[itemId="ftxnsHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'fscPriviligesPopup container panel panel[id="ftxnsHeader"] checkbox[itemId="ftxnsHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'fscPriviligesPopup container panel panel[id="ftxnsHeader"] checkbox[itemId="ftxnsHeader_authIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'fscPriviligesPopup container panel panel[id="flupHeader"] checkbox[itemId="flupHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'fscPriviligesPopup container panel panel[id="flupHeader"] checkbox[itemId="flupHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'fscPriviligesPopup container panel panel[id="flupHeader"] checkbox[itemId="flupHeader_authIcon"]' : {
							change : me.toggleCheckUncheck
							},
					'liquidityPriviligesPopup container panel panel[id="lmsHeader"] checkbox[itemId="lmsHeader_viewIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'liquidityPriviligesPopup container panel panel[id="lmsHeader"] checkbox[itemId="lmsHeader_editIcon"]' : {
						change : me.toggleCheckUncheck
						},
					'liquidityPriviligesPopup container panel panel[id="lmsHeader"] checkbox[itemId="lmsHeader_authIcon"]' : {
						change : me.toggleCheckUncheck
						},
				'liquidityPriviligesPopup container panel panel[id="txnsHeader"] checkbox[itemId="txnsHeader_viewIcon"]' : {
					change : me.toggleCheckUncheck
					},
				'liquidityPriviligesPopup container panel panel[id="txnsHeader"] checkbox[itemId="txnsHeader_editIcon"]' : {
					change : me.toggleCheckUncheck
					},
				'liquidityPriviligesPopup container panel panel[id="txnsHeader"] checkbox[itemId="txnsHeader_authIcon"]' : {
					change : me.toggleCheckUncheck
					},
				'liquidityPriviligesPopup container panel panel[id="queryHeader"] checkbox[itemId="queryHeader_viewIcon"]' : {
					change : me.toggleCheckUncheck
					},
				'liquidityPriviligesPopup container panel panel[id="queryHeader"] checkbox[itemId="queryHeader_editIcon"]' : {
					change : me.toggleCheckUncheck
					},
				'liquidityPriviligesPopup container panel panel[id="queryHeader"] checkbox[itemId="queryHeader_authIcon"]' : {
					change : me.toggleCheckUncheck
					},
					
					// Trade Privliges Popup
					'tradePriviligesPopup container panel panel[id="eTradeSetupHeader"] button[itemId="eTradeSetupHeader_viewIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeImpSetupHeader"] button[itemId="eTradeImpSetupHeader_viewIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeExpSetupHeader"] button[itemId="eTradeExpSetupHeader_viewIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeLoansHeader"] button[itemId="eTradeLoansHeader_viewIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeSetupHeader"] button[itemId="eTradeSetupHeader_editIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeImpSetupHeader"] button[itemId="eTradeImpSetupHeader_editIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeExpSetupHeader"] button[itemId="eTradeExpSetupHeader_editIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeLoansHeader"] button[itemId="eTradeLoansHeader_editIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeSetupHeader"] button[itemId="eTradeSetupHeader_authIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeImpSetupHeader"] button[itemId="eTradeImpSetupHeader_authIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeExpSetupHeader"] button[itemId="eTradeExpSetupHeader_authIcon"]':{
						click : me.toggleCheckUncheck
					},
					'tradePriviligesPopup container panel panel[id="eTradeLoansHeader"] button[itemId="eTradeLoansHeader_authIcon"]':{
						click : me.toggleCheckUncheck
					},
					
					// Forecast Privliges Popup
					'forecastPriviligesPopup container panel panel[id="forecastSetupHeader"] button[itemId="forecastSetupHeader_viewIcon"]':{
						click : me.toggleCheckUncheck
					},
					'forecastPriviligesPopup container panel panel[id="forecastTransactionHeader"] button[itemId="forecastTransactionHeader_viewIcon"]':{
						click : me.toggleCheckUncheck
					},
					
					'forecastPriviligesPopup container panel panel[id="forecastSetupHeader"] button[itemId="forecastSetupHeader_editIcon"]':{
						click : me.toggleCheckUncheck
					},
					'forecastPriviligesPopup container panel panel[id="forecastTransactionHeader"] button[itemId="forecastTransactionHeader_editIcon"]':{
						click : me.toggleCheckUncheck
					},
					
					'forecastPriviligesPopup container panel panel[id="forecastSetupHeader"] button[itemId="forecastSetupHeader_authIcon"]':{
						click : me.toggleCheckUncheck
					},
					'forecastPriviligesPopup container panel panel[id="forecastTransactionHeader"] button[itemId="forecastTransactionHeader_authIcon"]':{
						click : me.toggleCheckUncheck
					},
					
					//Mobile privilege popup
					'mobilePrivilegesPopup container panel panel[id="mobileAdminHeader"] checkbox[itemId="mobileAdminHeader_viewIcon"]':{
						
						change : me.toggleCheckUncheck
					},
					
					'mobilePrivilegesPopup container panel panel[id="mobileAdminHeader"] checkbox[itemId="mobileAdminHeader_editIcon"]':{
						change : me.toggleCheckUncheck
					},
					'mobilePrivilegesPopup container panel panel[id="mobileAdminHeader"] checkbox[itemId="mobileAdminHeader_authIcon"]':{
						change : me.toggleCheckUncheck
					}
					
				});
		
	},
	changeIcon : function(btn){
		if(pagemode != 'VIEW')
		{		
			if(btn.checked == true){
				return true;
			}
			if(btn.checked == false){
				return false;
			}
			if(btn.icon.match('icon_uncheckmulti.gif')){
					btn.setIcon("./static/images/icons/icon_checkmulti.gif");
					return true;
			}
			else{
					btn.setIcon("./static/images/icons/icon_uncheckmulti.gif");
					return false;
			}
		}
	},
	setcheckboxValues : function(selectValue, items, mode){
		if(pagemode != 'VIEW'){
			for(var i=0; i<items.length;i++){
				var checkbox = items[i];
				if(checkbox.itemId != '601_VIEW'){
					if(checkbox.mode === mode)	
						checkbox.setValue(selectValue);
				}
			}
		}
	},
	toggleCheckUncheck : function( btn, e, eOpts ){
		var me = this;
		var btnId = btn.itemId;
		switch(btnId){
		case 'adminHeader_viewIcon':
		
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getAdminPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'adminHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getAdminPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'adminHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getAdminPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'othersHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getOthersPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'othersHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getOthersPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'othersHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getOthersPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'brHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getBrPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'brHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getBrPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'brHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getBrPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		
		case 'loanHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getLoanHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getLoanHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'loanHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getLoanHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'investHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getInvestHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'investHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getInvestHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'investHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getInvestHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'depviewHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getDepviewHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'depviewHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getDepviewHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'depviewHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getDepviewHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		
		case 'incomingWireHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getIncomingWireHeader().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'incomingWireHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getIncomingWireHeader().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'incomingWireHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getIncomingWireHeader().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'portalSetupHeader_viewIcon':
			if(pagemode !='VIEW')
				{
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getPortalSetupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
				}
			break;
			
		case 'portalSetupHeader_editIcon':
			if(pagemode !='VIEW')
			{
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getPortalSetupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			}
			break;
			
		case 'portalSetupHeader_authIcon':
			if(pagemode !='VIEW')
			{
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getPortalSetupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			}
			break;
			
		case 'colSetupHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getColSetupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'colSetupHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getColSetupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'colSetupHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getColSetupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'txncolHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getTxncolHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'txncolHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getTxncolHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'txncolHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getTxncolHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'colfileoptHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getColfileoptHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'colfileoptHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getColfileoptHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'colfileoptHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getColfileoptHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'paySetupHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getPaySetupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'paySetupHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getPaySetupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'paySetupHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getPaySetupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'txnHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getTxnHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'txnHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getTxnHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'txnHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getTxnHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'fileoptHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getFileoptHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'fileoptHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getFileoptHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'fileoptHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getFileoptHeaderHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'tmpSummaryHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			//var items = me.getFileoptHeaderHeaderPanel().query('checkbox');		
			//me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'tmpSummaryHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			//var items = me.getFileoptHeaderHeaderPanel().query('checkbox');		
			//me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'tmpSummaryHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			//var items = me.getFileoptHeaderHeaderPanel().query('checkbox');		
			//me.setcheckboxValues(selectValue, items, mode);
			break;
			
		case 'standingInstructionHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			//var items = me.getFileoptHeaderHeaderPanel().query('checkbox');		
			//me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'standingInstructionHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			//var items = me.getFileoptHeaderHeaderPanel().query('checkbox');		
			//me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'standingInstructionHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			//var items = me.getStandingInstructionHeaderHeaderPanel().query('checkbox');		
			//me.setcheckboxValues(selectValue, items, mode);
			break;
			
		case 'fscHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getFscHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'fscHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getFscHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'fscHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getFscHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
			
		case 'ftxnsHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getFtxnsHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'ftxnsHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getFtxnsHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'ftxnsHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getFtxnsHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
			
		case 'flupHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getFlupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'flupHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getFlupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'flupHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getFlupHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
			
		case 'lmsHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getLmsHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'lmsHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getLmsHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'lmsHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getLmsHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'queryHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getQueryHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'queryHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getQueryHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'queryHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getQueryHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'txnsHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getTxnsHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'txnsHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getTxnsHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'txnsHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getTxnsHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
			
			
			
		case 'eTradeSetupHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getETradeSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'eTradeSetupHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getETradeSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'eTradeSetupHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getETradeSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;	
		
		case 'eTradeImpSetupHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getETradeImpSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'eTradeImpSetupHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getETradeImpSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'eTradeImpSetupHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getETradeImpSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
			
		case 'eTradeExpSetupHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getETradeExpSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'eTradeExpSetupHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getETradeExpSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'eTradeExpSetupHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getETradeExpSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'eTradeLoansHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getETradeLoansPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'eTradeLoansHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getETradeLoansPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'eTradeLoansHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getETradeLoansPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
			
		case 'forecastSetupHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getForecastSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'forecastSetupHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getForecastSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'forecastSetupHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getForecastSetupPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;	
		
		case 'forecastTransactionHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getForecastTransactionPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'forecastTransactionHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getForecastTransactionPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'forecastTransactionHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getForecastTransactionPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
			
		case 'mobileAdminHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getMobileAdminPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'mobileAdminHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getMobileAdminPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'mobileAdminHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getMobileAdminPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		}	
	}
});