// 장바구니 자료구조
let bucket = {
	"date":"",
	"author":"",
	"person":"",
	"email":"",
	"project":"",
	"comment":"",
	"startdate":"",
	"enddate":"",
	"items":[],
	"total":0,
	"unit":"",
	"totalframe":0,
};

// 장바구니에 들어가는 아이템 자료구조
const item = {
	"id":"", // date로 설정할것. 나중에 삭제할 키로 사용하기
	"basicCost" : 200.0, // USD model, 기본가격
	"totalShotNum" : 0, // 총 샷수
	"objectTrackingRigidCost" : 150.0, // USD model
	"objectTrackingRigid" : 0,
	"objectTrackingNoneRigidCost" : 300.0, // USD model
	"objectTrackingNoneRigid" : 0,
	"rotoanimationBasicCost" : 300.0, // USD model
	"rotoanimationBasic" : 0,
	"rotoanimationSoftDeformCost" : 400.0, // USD model
	"rotoanimationSoftDeform" : 0,
	"layoutCost" : 150.0, // USD model
	"layout" : 0,
	"frames":[],// 500, 300, 200 형태의 int 숫자가 들어가야 한다.
	"totalframe":0, // frames의 모든 수를 합친 값이다.
	"attributes" : [],
	"total": 0,
	"unit":"",
};

// 아이템에 종속되는 어트리뷰트 자료구조
const attributeStruct = {
	"id":"",
	"value":1.0,
};

//init Write infomation
document.getElementById("date").innerHTML = today();
document.getElementById("startdate").value = todayRFC3339();
document.getElementById("enddate").value = todayRFC3339();


	
	
// Callback
document.getElementById('addBucket').addEventListener('click', addBucket);

function numberWithCommas(n) {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 오늘 날짜를 문자열로 출력한다.
function today() {
	let date = new Date();
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();
	return `Pre-Estimate System, Date: ${y}. ${m}. ${d}`;
}

// pad 함수는 숫자를 받아서 필요한 자리수만큼 "0"을 붙힌다.
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

// 오늘 날짜를 문자열로 출력한다.
function todayRFC3339() {
	let date = new Date();
	let y = date.getFullYear();
	let m = pad(date.getMonth() + 1,2);
	let d = pad(date.getDate(),2);
	return `${y}-${m}-${d}`;
}

function removeItem(e) {
	id = e.target.parentElement.getAttribute("id");
	for (i = 0; i < bucket.items.length; i++) {
		if ( bucket.items[i].id == id ) {
			// console.log(id);
			bucket.items.splice(i,1);
		}
	}
	bucketRender()
}

// 장바구니를 렌더링한다.
function bucketRender() {
	bucket.total = 0;
	bucket.unit = "$";
	document.getElementById("bucket").innerHTML = "";
	//attribute 가격
	for (let i = 0; i < bucket.items.length; i++) {
		let div = document.createElement("div");
		div.setAttribute("id", bucket.items[i].id);
		div.innerHTML += `${bucket.items[i].totalShotNum} Shot,`;
		div.innerHTML += ` ${bucket.items[i].attributes.length} Attrs = `;
		titles = [];
		for (let j = 0; j < bucket.items[i].attributes.length; j++) {
			titles.push(bucket.items[i].attributes[j].id);
		}
		div.setAttribute("title", titles.join(","));
		div.innerHTML += bucket.unit + numberWithCommas(Math.round(bucket.items[i].total)) + "<br>";



		//frame 가격
		let framenum = 0;
		let frametotal = 0;
		for(let j in bucket.items[i].frames){
			framenum += bucket.items[i].frames[j]
			frametotal += frameNum2Cost(bucket.items[i].frames[j])
		}
		div.innerHTML += framenum + ` frame = `;
		div.innerHTML += bucket.unit + numberWithCommas(frametotal) + "<br>";
		//아이템 전체 가격
		itemtotal = bucket.items[i].total + frametotal;


		div.innerHTML += `Total: ` + bucket.unit + numberWithCommas(itemtotal);
		div.innerHTML += ` <i class="far fa-times-circle btn-outline-danger"></i>`;
		div.innerHTML += ` <hr>`;
		div.onclick = removeItem;
		document.getElementById("bucket").appendChild(div);
		bucket.total += bucket.items[i].total;
		bucket.total += frametotal;
	}
	// 장바구니 아이템 개수와 장바구니 전체 가격
	document.getElementById("numOfItem").innerHTML = "Bucket: " + bucket.items.length;
	document.getElementById("total").innerHTML = "Total: " + bucket.unit + numberWithCommas(round(bucket.total));
}

// round 함수는 1달러 단위에서 반올림한다. ex) 543 -> 540, 548 -> 550
function round(price){
	return Math.round(price*0.1) * 10
}

// 매치무브 샷 조건을 장바구니에 넣는다.
function addBucket() {
	if (document.getElementById("author").value == "") {
		alert("Please enter your company name or author name.");
		return
	}
	if (document.getElementById("person").value == "") {
		alert("Please enter name of the person in charge.");
		return
	}
	if (document.getElementById("email").value == "") {
		alert("Please enter your e-mail address.");
		return
	}
	if (document.getElementById("project").value == "") {
		alert("Please provide a brief description of the project.");
		return
	}

	if (!document.getElementById("privacy").checked) {
		alert("Please agree to collect personal information.");
		return
	}
	if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(document.getElementById("email").value)) {
		alert("Your E-mail is not an email format.");
		return
	}
	// if (parseInt(document.getElementById("frame").value,10) > 2000) {
	// 	alert("Please contact us directly in the case of frame over 2000.");
	// 	return
	// }
	
	let shot = Object.create(item);
	let attrs = document.getElementsByTagName("input");
	let currentDate = new Date();
	shot.id = currentDate.getTime();
	shot.unit = "$";
	shot.attributes = []; // 기존의 Attrbute를 초기화 한다.
	shot.frames = []; // 기존의 frame을 초기화 한다.

	for (let i = 0; i < attrs.length; i++) {
		type = attrs[i].getAttribute("type")
		if (!(type == "radio" || type=="checkbox")){
			continue;
		};
		if (attrs[i].checked) {
			if (attrs[i].id === "privacy") {
				continue
			}
			attr = Object.create(attributeStruct);
			attr.id = attrs[i].id;
			attr.value = attrs[i].value;
			shot.attributes.push(attr)
		};
	}
	shot.totalShotNum = document.getElementById("totalShotNum").value;
	shot.objectTrackingRigid = document.getElementById("objectTrackingRigid").value;
	shot.objectTrackingNoneRigid = document.getElementById("objectTrackingNoneRigid").value;
	shot.rotoanimationBasic = document.getElementById("rotoanimationBasic").value;
	shot.rotoanimationSoftDeform = document.getElementById("rotoanimationSoftDeform").value;
	shot.layout = document.getElementById("layout").value;
	// 비용산출
	shot.total += shot.basicCost * shot.totalShotNum;
	shot.total += shot.objectTrackingRigidCost * shot.objectTrackingRigid;
	shot.total += shot.objectTrackingNoneRigidCost * shot.objectTrackingNoneRigid;
	shot.total += shot.rotoanimationBasicCost * shot.rotoanimationBasic;
	shot.total += shot.rotoanimationSoftDeformCost * shot.rotoanimationSoftDeform;
	shot.total += shot.layoutCost * shot.layout;
	// 전체 가격에 적용된 속성을 곱한다.
	for (let n = 0; n < shot.attributes.length; n++) {
		shot.total *= shot.attributes[n].value;
	}
	// 계산기에 입력된 숫자를 + 로 분리하고 shot.frames 리스트에 각 프레임을 담는다.
	let frames = document.getElementById("calHistory").innerText
	let splitedFrames = frames.split('+')
	for (let i in splitedFrames){
		shot.frames[i] = parseInt(splitedFrames[i].trim());
	}
	// shot.frames를 이용해서 shot.totalframe을 구한다.
	for (i = 0; i < shot.frames.length; i++) {
		shot.totalframe += shot.frames[i]
	}

	// 바구니에 샷을 담는다.
	bucket.items.push(shot);

	// 데이터전송
	if (document.getElementById("privacy").checked) {
		shot.date = today();
		shot.author = document.getElementById("author").value;
		shot.person = document.getElementById("person").value;
		shot.email = document.getElementById("email").value;
		shot.project = document.getElementById("project").value;
		shot.startdate = document.getElementById("startdate").value;
		shot.enddate = document.getElementById("enddate").value;
		shot.comment = document.getElementById("comment").value;
		shot.unit = "$";
		$.ajax({
			url: "https://5c9y2kwd9k.execute-api.ap-northeast-2.amazonaws.com/estimate_bucket",
			type: 'POST',
			data: JSON.stringify(shot),
			dataType: 'json',
			crossDomain: true,
			contentType: 'application/json',
			success: function(data) {
				console.log(JSON.stringify(data));
			},
			error: function(e) {
				console.log("failed:" + JSON.stringify(e));
			}
		});
	}
	bucketRender()
}

function printMode() {
	// 계산기를 숨긴다.
	let cal = document.getElementById("calculator");
	cal.style.display = "none";
	// 출력한다.
	window.print();
}

function resetForm() {
	// 계산기를 다시 띄운다.
	let cal = document.getElementById("calculator");
	cal.style.display = "block";
	// 폼을 리셋한다.
	document.getElementById("comment").value = "";
	document.getElementById("mono").checked = true;
	document.getElementById("anamorphicLens").checked = false;
	document.getElementById("stereo").checked = false;
	document.getElementById("vr").checked = false;
	document.getElementById("is4kOver").checked = false;
	document.getElementById("noneSurvey").checked = false;
	document.getElementById("noneOnsetInfo").checked = false;
	document.getElementById("totalShotNum").value = 1;
	document.getElementById("objectTrackingRigid").value = 0;
	document.getElementById("objectTrackingNoneRigid").value = 0;
	document.getElementById("rotoanimationBasic").value = 0;
	document.getElementById("rotoanimationSoftDeform").value = 0;
	document.getElementById("layout").value = 0;
	document.getElementById("totalFrame").innerHTML = 0;
	document.getElementById("calHistory").innerText = "";
	document.getElementById("calResult").innerText = "0";
	bucket.project = ""; 
	bucket.comment = "";
	bucket.items = [];
	bucket.unit = "$";
	bucketRender();
}

function sendToEmail() {
	if ( bucket.items.length === 0 ) {
		alert("Your shopping cart is empty.\nData can not be transferred.");
		return
	}
	bucket.date = today();
	bucket.author = document.getElementById("author").value;
	bucket.person = document.getElementById("person").value;
	bucket.email = document.getElementById("email").value;
	bucket.project = document.getElementById("project").value;
	bucket.startdate = document.getElementById("startdate").value;
	bucket.enddate = document.getElementById("enddate").value;
	bucket.comment = document.getElementById("comment").value;
	bucket.unit = "$"
	for (i = 0; i < bucket.items.length; i++) {
		bucket.totalframe += bucket.items[i].totalframe
	}
	$.ajax({
		url: "https://b9mx1b8r59.execute-api.ap-northeast-2.amazonaws.com/estimate_send",
		type: 'POST',
		data: JSON.stringify(bucket),
		dataType: 'json',
		crossDomain: true,
		contentType: 'application/json',
		success: function(data) {
			console.log(JSON.stringify(data));
		},
		error: function(e) {
			console.log("failed:" + JSON.stringify(e));
		}
	});
	alert("E-mail has been sent successfully.\nWe will contact you within 24 business hours.");
}

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
	  textbox.addEventListener(event, function() {
		if (inputFilter(this.value)) {
		  this.oldValue = this.value;
		  this.oldSelectionStart = this.selectionStart;
		  this.oldSelectionEnd = this.selectionEnd;
		} else if (this.hasOwnProperty("oldValue")) {
		  this.value = this.oldValue;
		  this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
		}
	  });
	});
}

//프레임 개수에 따라 가중치를 고려해 가격을 반환하는 함수.
function frameNum2Cost(num){
	if(num < 300){ // 300미만
		return 1.0*num
	}else if(num < 600){ // 600미만
		return 1.1*num
	}else if(num < 700){
		return 1.2*num
	}else if(num < 800){
		return 1.4*num
	}else if(num < 900){
		return 1.6*num
	}else if(num < 1000){
		return 1.8*num
	}else if(num < 1200){
		return 2.0*num
	}else if(num < 1400){
		return 2.2*num
	}else if(num < 1600){
		return 2.4*num
	}else if(num < 1800){
		return 2.6*num
	}else if(num < 2000){
		return 2.8*num
	}else{
		return 3.0*num
	}
}

// Install input filters.
setInputFilter(document.getElementById("totalShotNum"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("objectTrackingRigid"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("objectTrackingNoneRigid"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("rotoanimationBasic"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("rotoanimationSoftDeform"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("layout"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
// setInputFilter(document.getElementById("frame"), function(value) {
// 	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 1800000);
// });

function inputTestdata(){
	document.getElementById("author").value="75mm test"
	document.getElementById("person").value="test"
	document.getElementById("email").value="75mm@test"
	document.getElementById("project").value="test project"
	document.getElementById("privacy").outerHTML = `<input class="form-check-input" type="checkbox" id="privacy" checked>`
}