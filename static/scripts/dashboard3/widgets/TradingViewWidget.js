widgetMetaData.tradingViewWidget = function(widgetId, widgetType)
{
	let metadata = {
			  'title': getDashLabel('tradingView.title','Stock View'),
			  'desc': getDashLabel('tradingView.desc','Trading View'),
			  'type': 'card',
			  "widgetType" : widgetType,
			  "cloneMaxCount": 4,
			  'subType': '',  
			  'icon':'',
			  'fields': {
				'columns': [],
				'rows':{}	
			  },
			  'refresh' : function (metatata) {
			  },
			  'actions' : {
				  'custom' : {
					  'title' : getDashLabel('setting','Settings'),
					  'callbacks' : {
						  'click' : function(metaData){
						  }
					  }
				  },
				  'refresh' : {
					  'callbacks' : {
						  'init' : function(addData, metaData){
				              $('#widget-body-'+widgetId).empty();
  							  $('#widget-body-'+widgetId).prepend($(
								 '<style>'
								+ '.tradingview-widget-container {'
								+ '    width: 360px; '
								+ '    height: 330px !important;'
								+ '    overflow:hidden;'
								+ '}'
								+ ''
								+ '.tradingview-widget-container iframe {'
								+ '    box-sizing: border-box !important;'
								+ '    overflow: hidden !important;'
								+ '    width:100% !important;'
								+ '    height:520px !important;'
								+ '}'
								+ '</style>'
								+'<div class="tradingview-widget-container"> '
								+ '  <div class="tradingview-widget-container__widget"></div> '
								+ '  <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/technicals/" rel="noopener" target="_blank"><span class="blue-text">Technical Analysis for AAPL</span></a> by TradingView</div> '
								+ '  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js" async> '
								+ '  { '
								+ '  "interval": "1m", '
								+ '  "width": "100%", '
								+ '  "isTransparent": true, '
								+ '  "height": "100%", '
								+ '  "symbol": "NASDAQ:AAPL", '
								+ '  "showIntervalTabs": true, '
								+ '  "locale": "en", '
								+ '  "colorTheme": "light" '
								+ '} '
								+ '  </script> '
								+ '</div> '
								
								  ));
						  }
					  }
				  }
			  }
	}
	return metadata;
}

