function _1(md){return(
md`# HW2 Strong baseline (2pt)`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _yCounts(){return(
[]
)}

function _constellation(data){return(
data.map(item => item.Constellation)
)}

function _5(yCounts,constellation,data)
{
  yCounts.length = 0; //將yCounts清空
  var minCons = Math.min(...constellation); //最小數字星座
  var maxCons = Math.max(...constellation); //最大數字星座
  for (var y=minCons; y<=maxCons; y++) { 
    //所有星座都建立兩個Object，一個存放男性資料，一個存放女性資料
    yCounts.push({constellation:y, gender:"male", count:0}); 
    //Object包含：1. 星座，2.男性，3.人數(設為0)
    yCounts.push({constellation:y, gender:"female", count:0}); 
    //Object包含：1. 星座，2.女性，3.人數(設為0)
  }
  data.forEach (x=> {
    var i = (x.Constellation-minCons)*2 + (x.Gender== "男" ? 0 : 1); 
    yCounts[i].count++;
    //讀取data array，加總每個年份出生的人
  })
  return yCounts
}


function _zodiacSigns(){return(
[
  "牡羊座", "金牛座", "雙子座", "巨蟹座", 
  "獅子座", "處女座", "天秤座", "天蠍座", 
  "射手座", "摩羯座", "水瓶座", "雙魚座"
]
)}

function _7(Plot,yCounts,zodiacSigns){return(
Plot.plot({
  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {x: "constellation", y: "count", tip: true , title: (d) =>
        `count: ${d.count} \nConstellation: ${zodiacSigns[d.constellation]}\ngender: ${d.gender}`
        , fill:"gender"}),
    Plot.axisX({
      tickFormat: (value) => zodiacSigns[value] 
    })
  ]
})
)}

function _8(Plot,zodiacSigns,data){return(
Plot.plot({
  width: 1000,
  grid: true,
  x: { domain: [0, 12]},
	y: { label: "count"},  
	marks: [    
    Plot.axisX({
      tickFormat: d => zodiacSigns[d],
    }),
    Plot.ruleY([0]),
		Plot.rectY(data, Plot.binX(
      {y:"count"}, 
      {x:"Constellation", interval:1, 
       fill:"Gender", 
       tip: true,
       title: (d) =>
        `Constellation: ${zodiacSigns[d.Constellation]}
        \ngender: ${d.Gender}
        \n`},))
	 ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("yCounts")).define("yCounts", _yCounts);
  main.variable(observer("constellation")).define("constellation", ["data"], _constellation);
  main.variable(observer()).define(["yCounts","constellation","data"], _5);
  main.variable(observer("zodiacSigns")).define("zodiacSigns", _zodiacSigns);
  main.variable(observer()).define(["Plot","yCounts","zodiacSigns"], _7);
  main.variable(observer()).define(["Plot","zodiacSigns","data"], _8);
  return main;
}
