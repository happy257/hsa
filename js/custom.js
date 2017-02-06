//Put custom code here

// GLOBAL VARIABLES
var GLOBAL={}
GLOBAL.empContLimit = 0;

GLOBAL.contLimitInd = 3400;
GLOBAL.contLimitNotInd = 6750;
GLOBAL.contLimitIndOver55 = 4400;
GLOBAL.contLimitNotIndOver55 = 7750;

GLOBAL.getCovTier = function(){
	return $("#covTier").val();
}
GLOBAL.getAge = function(){
	return $("#inpage").val();
}

//Returns only integer of the field passed as param or zero
GLOBAL.getVal = function(field){
	if(!(field))
		console.error('"Field" not passed to getVal');
	
	var fieldValue=$("#"+field).val()
	if(isNaN(fieldValue)||fieldValue=="")
		return 0;
	else
		return parseInt(fieldValue);
}

var goBack = function() {
    window.history.back()
}

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
}
$('#covTier').on("change",function () {
	updateContLimit();
});
$('#inpage').on("change",function () {
	console.log('Age altered');
	updateContLimit();
});

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
			lists+='<li><a href="#" onClick="">'+taxSet[i].taxableIncome[j]+'</a></li>'
		}
		lists+='</ul>'
		container+= lists+'</div>'
	}
	$("#taxSet").html(container);
}
buildTaxPopup();
