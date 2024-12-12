/*-----------------------------------------------------------------------------------------------------------------
 * FILE     : pagination.js
 * AUTHOR   : Prasad P. Khandekar
 * CREATED  : October 16, 2009 6:45 PM
 * COPYRIGHT: Copyright (c) 2009, Fundtech INDIA Ltd.
 * ----------------------------------------------------------------------------------------------------------------
 * ASSUMPTIONS:
 * 
 * 	1. Following global variables must be set in the referencing html page
 * 		a. _intCurPage - The current page number.
 * 		b. _intTotPages - The total number of pages.
 * 		c. _strErrFirst - The string containing localized error message to be displayed if user can not navigate to 
 * 						  the previous page.
 * 		d. _strErrLast - The string containing localized error message to be displayed if user can not navigate to
 * 						 the next page.
 *      e. _strErrNoFrm - The error message to be displayed if there is no suitable form available for posting
 * 	2. The name & id of the field used to post the current page number must be "txtCurrent"
 *---------------------------------------------------------------------------------------------------------------*/
var _pager = new function() {
	var mblnAppend = false;

	this.appendNavIndicator = function(blnAppend) {
		this.mblnAppend = blnAppend;
	};

 	/**
 	 * The function firstPage navigates to the very first page of the list.
 	 * @author Prasad P. Khandekar
 	 * @param strUrl The URL to navigate, can be null.
	 * @param frmId the name of the input form to be posted.
	 */
	 this.firstPage = function(strUrl, frmId) {
		var frm = null;

		// If form id is not passed then we default to frmMain
		if (arguments.length >= 2)
			frm = document.getElementById(arguments[1]);
		else
			frm = document.getElementById('frmMain');

		if (null == frm)
		{
			alert(_strErrNoFrm);
			return;
		}

		if (_intCurPage > 1)
		{
			if (this.mblnAppend)
				frm.action = stripExtension(strUrl) + "_first.form";
			else
                frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		}
		else
			alert(_strErrFirst);
	};

	/**
	 * The function prevPage navigates to the previous page of the list.
	 * @author Prasad P. Khandekar
	 * @param strUrl The URL to navigate, can be null.
	 * @param frmId the name of the input form to be posted.
	 */
	this.prevPage = function(strUrl, frmId) {
		var frm = null;

		// If form id is not passed then we default to frmMain
		if (arguments.length >= 2)
			frm = document.getElementById(arguments[1]);
		else
			frm = document.getElementById('frmMain');
		if (null == frm)
		{
			alert(_strErrNoFrm);
			return;
		}

		if (_intCurPage > 1)
		{
			if (this.mblnAppend)
				frm.action = stripExtension(strUrl) + "_previous.form";
			else
				frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		}
		else
			alert(_strErrFirst);
	};

	/**
	 * The function nextPage navigates to the next page of the list.
	 * @author Prasad P. Khandekar
	 * @param strUrl The URL to navigate, can be null.
	 * @param frmId the name of the input form to be posted.
	 */
	this.nextPage = function(strUrl, frmId) {
		var frm = null;

		// If form id is not passed then we default to frmMain
		if (arguments.length >= 2)
			frm = document.getElementById(arguments[1]);
		else
			frm = document.getElementById('frmMain');
		if (null == frm)
		{
			alert(_strErrNoFrm);
			return;
		}

		if (_intCurPage < _intTotPages)
		{
			if (this.mblnAppend)
				frm.action = stripExtension(strUrl) + "_next.form";
			else
				frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		}
		else
			alert(_strErrLast);
	};

	/**
	 * The function lastPage navigates to the last page of the list.
	 * @author Prasad P. Khandekar
	 * @param strUrl The URL to navigate, can be null.
	 * @param frmId the name of the input form to be posted.
	 */
	this.lastPage = function(strUrl, frmId) {
		var frm = null;

		// If form id is not passed then we default to frmMain
		if (arguments.length >= 2)
			frm = document.getElementById(arguments[1]);
		else
			frm = document.getElementById('frmMain');
		if (null == frm)
		{
			alert(_strErrNoFrm);
			return;
		}

		if (_intCurPage < _intTotPages)
		{
			if (this.mblnAppend)
				frm.action = stripExtension(strUrl) + "_last.form";
			else
				frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		}
		else
			alert(_strErrLast);
	};

	/**
	 * The function lastPage navigates to the last page of the list.
	 * @author Prasad P. Khandekar
	 * @param ctrl The input box
	 * @param strUrl The URL to navigate, can be null.
	 * @param frmId the name of the input form to be posted.
	 */
	this.goToPage = function(ctrlId, strUrl, frmId) {
		var frm = null;
	//	var ctrl = document.getElementById(ctrlId);
		var pgNmbr = ctrlId.value;
		if (isNaN(pgNmbr) || (pgNmbr > _intTotPages) || pgNmbr <= 0)
		{
			alert(_strInvalidPage);
			return;
		}
		// If form id is not passed then we default to frmMain
		if (arguments.length >= 3)
			frm = document.getElementById(arguments[2]);
		else
			frm = document.getElementById('frmMain');
		if (null == frm)
		{
			alert(_strErrNoFrm);
			return;
		}

		if (this.mblnAppend)
			frm.action = stripExtension(strUrl) + "_goto.form";
		else
			frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	};
};