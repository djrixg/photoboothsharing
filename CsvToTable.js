(function(){
	this.CsvToTable = function(){
		this.csvFile = null;
    	if (arguments[0] && typeof arguments[0] === "object") {
      		this.options = arguments[0];
    	}

	}
	CsvToTable.prototype.run = function() {
		return buildTable.call(this);
	}
	function getCSV() {
		try{
			var csvfile = this.options.csvFile;
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open("GET", csvfile, true);
				request.onload = function() {
				    if (request.status == 200) {
				        resolve(request.response);
				    } else {
				        reject(Error(request.statusText));
				    }
				};

				request.onerror = function() {
				 	reject(Error('Error fetching data.'));
				};
				request.send();
			});
		}catch(err){
			console.error(err);
		}
	}

    function isNotEmpty(row) {
        return row !== "";
    }

    // polyfill `.filter()` for ECMAScript <5.1
    // `f` must be pure (not modify original array).
    if (!Array.prototype.filter) {
      Array.prototype.filter = function(f) {
        "use strict";
        var p = arguments[1];
        var o = Object(this);
        var len = o.length;
        for (var i = 0; i < len; i++) {
          if (i in o) {
              var v = o[i];
              f.call(p, v, i, o);
          }
        }

        return this;
      };
    }

	function buildTable() {
		getCSV.call(this).then(function(response){
			var allRows = response.split(/\r?\n|\r/).filter(isNotEmpty);
			var gallery = '';
			for(var singleRow = 1;singleRow<allRows.length;singleRow++){
				var photo = allRows[singleRow].split(',');
				// gallery+='<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal'+photo[0].replace('"','').replace('"','')+'">'+photo[1].replace('"','').replace('"','')+'</button>';
				var file_id = photo[2].replace('"','').replace('"','').split("/")[5].replace(' ','');
				gallery+='<img class="btn" onclick="openPhoto('/'+file_id+'/')" src="'+photo[3].replace('"','').replace('"','')+'"/>';
			}
			$(".table_links").html(gallery);
			// var allRows = response.split(/\r?\n|\r/).filter(isNotEmpty);
			// console.log(allRows);
	  //       var table = '';
	  //       for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
	  //           if (singleRow === 0) {
	  //               table += '<thead>';
	  //               table += '<tr>';
	  //           } else {
	  //               table += '<tr>';
	  //           }
	  //           var rowCells = allRows[singleRow].split(',');
	  //           for(var rowCell = 0; rowCell < rowCells.length; rowCell++){
	  //           	if(rowCells[rowCell]!=""){
	  //               if(singleRow === 0){
	  //                   table += '<th>';
	  //                   table += rowCells[rowCell].substring(1, rowCells[rowCell].length-1);
	  //                   table += '</th>';
	  //               } else {
	  //                   table += '<td>';
	  //                   if(rowCell==3){
	  //                   	table += '<img src="'+rowCells[rowCell].substring(1, rowCells[rowCell].length-1)+'" alt="" width="250">';
  	//                   }
	  //                   else if(rowCell==2){
	  //                   	table += rowCells[rowCell].substring(1, rowCells[rowCell].length-1)+'<br><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='+rowCells[rowCell].substring(1, rowCells[rowCell].length-1)+'" alt="" width="250">';
  	//                   }else{
  	//                     table += rowCells[rowCell].substring(1, rowCells[rowCell].length-1);
  	//                   }
	  //                   table += '</td>';
	  //               }
	  //             }
	  //           }
	  //           if (singleRow === 0) {
	  //               table += '</tr>';
	  //               table += '</thead>';
	  //               table += '<tbody>';
	  //           } else {
	  //               table += '</tr>';
	  //           }
	  //       }
	  //       table += '</tbody>';
	  //       $(".table_links").html(table);
	  //       // document.body.innerHTML += table;
		}, function(error){
			console.error(error);
		});
	}
}());