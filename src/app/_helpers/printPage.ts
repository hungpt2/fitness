export function printPage() {
  const mywindow = window.open('', 'PRINT', 'height=400,width=600');
  mywindow.document.write('<html><head><title>' + document.title + '</title>');
  mywindow.document.write(`<style>
        .simple-container .gn-title {
            font-size: 22px;
            font-family: "Sweet";
        }
        .td-box-title {
            font-size: 18px;
            color: #ee212e;
            text-transform: uppercase;
            margin: 0;
            line-height: 1.4;
            display: inline-block;
        }
        .meal-wrapper {
            box-shadow: 0 1px 0 0 #e6e6e8;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .td-box-components {
            font-size: 13px;
            font-family: "Sweet";
            color: #929292;
            margin-top: 1px;
        }
        .td-box-components .spacer {
            display: inline-block;
            width: 2px;
            height: 2px;
            border-radius: 100%;
            background-color: #ab131c;
            margin: 0px 6px 3px;
        }
        .td-box-subtitle {
            font-size: 14px;
            font-family: "Sweet";
            text-transform: uppercase;
            margin: 10px 0 0;
        }
        .check {
            position: absolute;
            top: 10px;
            left: 0px;
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid #c5c5c5;
            border-radius: 3px;
            background-color: #fff;
        }
        .check img {
            width: 14.5px;
            height: 12px;
            vertical-align: top;
            margin-top: 4px;
        }
        .check-selected {
            border-color: #ee212e;
            -webkit-print-color-adjust: exact;
            background-color: #ee212e;
        }
        .shopping-item-title {
            margin-bottom: 15px;
            font-size: 20px;
            color: #ee212e;
        }
        .shopping-item-container ul {
            margin: 0;
            padding: 0;
            list-style-type: none;
        }
        .shopping-item-container li {
            list-style-type: none;
        }
        .shopping-item-container a {
            font-size: 17px;
            font-family: "Sweet";
			display: block;
			margin: 20px 0;
			padding: 5px 0;
			position: relative;
			padding-left: 40px;
        }
            </style>`);
  mywindow.document.write('</head><body >');
  mywindow.document.write('<h1>' + document.title + '</h1>');
  mywindow.document.write(document.getElementById('main-container').innerHTML);
  mywindow.document.write('</body></html>');

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.close();

  return true;
}
