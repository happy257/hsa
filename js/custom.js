//Put custom code here

// GLOBAL VARIABLES
var GLOBAL={};
GLOBAL.empContLimit = 0;

GLOBAL.contLimitInd = 3400;
GLOBAL.contLimitNotInd = 6750;
GLOBAL.contLimitIndOver55 = 4400;
GLOBAL.contLimitNotIndOver55 = 7750;

GLOBAL.getCovTier = function(){
	return $("#covTier").val();
}
GLOBAL.getAge = function(){	
	if(!$("#inpage").val()){$("#inpage").val('25')};	
	return parseInt($("#inpage").val());
}



//Returns only integer of the field passed as param or zero
GLOBAL.getVal = function(field){
	if(!(field))
		console.error('"Field" not passed to getVal');
	
	var fieldValue=$("#"+field).val()
	if(isNaN(fieldValue)||fieldValue=="")
		$("#"+field).val('0');	
		return parseInt(fieldValue);
}
var setMTRate = function(selectedRateElem){
	var selRate=selectedRateElem.getAttribute("value");
	console.log(selRate);
	$($("#taxRate option").get(selRate)).attr('selected', 'selected')
	$("#taxRate").selectmenu();
        $("#taxRate").selectmenu('refresh', true);
	//$("#taxRate option[value='test1']").attr("selected", "selected");
	closePop('#taxCalcPopup')
	}
var goBack = function() {
    window.history.back()
}
var closePop = function(popupDiv){$(popupDiv).popup( "close" );}	

var updateContLimit = function(){
  //Needed to initialize slider before refresh
  $( "#annualCont" ).slider();
  
  var age = GLOBAL.getAge();
  var covTier = GLOBAL.getCovTier();
  
	if(age<=55){
		if(covTier==1){
			GLOBAL.empContLimit = GLOBAL.contLimitInd;
		}else{
			GLOBAL.empContLimit = GLOBAL.contLimitNotInd;	
		}
	}else{
		if(covTier==1){
			GLOBAL.empContLimit = GLOBAL.contLimitIndOver55;
		}else{
			GLOBAL.empContLimit = GLOBAL.contLimitNotIndOver55;
		}
	}	
  //Reset slider limits  
	$("#annualCont").prop({
	  min:0,
	  max:GLOBAL.empContLimit
	}).slider("refresh");
	$.mobile.navigate( "#flow2" );
}
var updateWithdrawlLimit = function(){
  //Needed to initialize slider before refresh
  $( "#annualWithdrawl" ).slider();
  
  var maxWithdrawl = GLOBAL.getVal('currHSABal')+GLOBAL.getVal('annualCont');
  
  //Reset slider limits  
	
	if(maxWithdrawl==0){
		console.log("0000000");
		updateAccountGrowthYears()
		}else{
				$("#annualWithdrawl").prop({
	  			min:0,
	  			max:maxWithdrawl
				}).slider("refresh");
				$.mobile.navigate( "#flow3" );
			}
}
var updateAccountGrowthYears = function(){
  //Needed to initialize slider before refresh
 $.mobile.navigate( "#flow4" );
  //$( "#years" ).slider();
 
  //Reset slider limits  
$( '#flow4' ).on( 'pageinit',function(event){
	var maxYears = 100-GLOBAL.getAge();
  $("#years").prop({
	  min:0,
	  max:maxYears
	}).slider("refresh");
});  
		
}

/*$('#covTier').on("change",function () {
	updateContLimit();
});
$('#inpage').on("change",function () {
	console.log('Age altered');
	updateContLimit();
});*/

var buildTaxPopup = function(){
	var taxSet=[];
	taxSet[1] ={filingStat:"Single",taxableIncome:['1A','2','3','4','5','6','7']};
	taxSet[2] ={filingStat:"Married filing jointly",taxableIncome:['1B','2','3','4','5','6','7']};
	taxSet[3] ={filingStat:"Married filing seperate",taxableIncome:['1C','2','3','4','5','6','7']};
	taxSet[4] ={filingStat:"Head of household",taxableIncome:['1D','2','3','4','5','6','7']};
	
	//Prepare DOM for the popup
	var container='';
	for(var i=1;i<taxSet.length;i++){
		container += '<div data-role="collapsible"><h3>'+taxSet[i].filingStat+'</h3>';
		var lists='<ul data-role="listview">'
		for(j=0;j<taxSet[i].taxableIncome.length;j++){
			lists+='<li><a href="#" value='+(j+1)+' onClick="setMTRate(this)">'+taxSet[i].taxableIncome[j]+'</a></li>'
		}
		lists+='</ul>'
		container+= lists+'</div>'
	}
	$("#taxSet").html(container);	
}
buildTaxPopup();


setTimeout(function(){new Chartist.Line('#chart1', { labels: [1, 2, 3, 4], series: [[100, 120, 180, 200]] })},1000); 
